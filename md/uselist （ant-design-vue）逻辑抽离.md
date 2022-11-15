## 背景:
在不影响业务代码的同时，抽离列表页的公用逻辑，实现封装hooks 让使用者更方便，代码统一
### 第一版的方案
第一版的方案主要通过ueslist 通过调用传入的自定义函数getlist, 去控制表格的数据 返回table,search组件所需参数方法等。
```typescript 
// 列表350ms不返回就出loading
const aopFn = (loading: Ref<boolean>, getList: () => Promise<any>) => {
  const time = setTimeout(() => {
    loading.value = true
  }, 350)
  getList().finally(() => {
    clearTimeout(time)
    loading.value = false
  })
}
export const useList = (getList: () => Promise<any>) => {
  const params = reactive<CommonObject>({})
  const init = ref(true)
  const loading = ref(false)

  const onSearch = (_params: CommonObject) => {
    pagination.current = 1
    Object.assign(params, _params)
    aopFn(loading, getList)
  }
  const pagination = reactive<TablePaginationConfig>({
    total: 0,
    current: 1,
    pageSize: Number(localStorage.getItem(FeManagePageSize)) || 10,
    pageSizeOptions: ['10', '50', '100'],
    showSizeChanger: true,
    showTotal: (total, range) => `共 ${total} 条`,
  })

  const handleTableChange = (_pagination: TablePaginationConfig) => {
    if (pagination.pageSize != _pagination.pageSize) {
      localStorage.setItem(FeManagePageSize, _pagination.pageSize?.toString() || '10')
    }
    pagination.current = _pagination.current
    pagination.pageSize = _pagination.pageSize
    aopFn(loading, getList)
  }
  onActivated(() => {
    if (init.value) {
      init.value = false
      return
    }
    aopFn(loading, getList)
  })
  return {
    onSearch,
    handleTableChange,
    pagination,
    params,
    loading,
  }
}

```
 

```typescript
//调用demo
const getList = () => {
  const _params: CommonObject = {
    ...params,
    pageIndex: pagination.current,
    pageSize: pagination.pageSize,
    endSiteId: params?.endSiteId?.[1], 
  }
  return pageQNet(_params as DistOrderQuery, { loading })
    .then(re => {
      dataSource.value = re.list || []
      pagination.total = re.total
    })
    .catch(res => {
      console.log(res)
    })
}

const { onSearch, handleTableChange, pagination, params, loading } = useList(getList)

<SCustomFilter :loading="loading" :formOptions="formOptions" :onSearch="onSearch" />

<a-table
  :dataSource="dataSource"
  :columns="tableColumns"
  :pagination="pagination"
  :loading="loading"
  :scroll="{ x: 600 }"
  @change="handleTableChange"
/>
```

### 

### update后
这一次更新后支持功能多样 ，跨页多选，自定义调用list，可直接调用列表接口，分页配置等
具体功能详见demo 主要满足了


* 1配置拓展性,大部分配置方法都再拓展
* 2满足需求
* 3实现后端接口type类型校验(1请求参数,2响应返回,3table Row的类型)
* 4不需要任何Type类型参数，可配合apx直接返回的类型校验
```typescript

type NetType<T, K> = (_params: T, options: CommonObject) => Promise<K> // 默认请求
interface ListObjProps<T, K> {
  /** 直接调用列表接口 */
  net?: NetType<T, K>
  /** 自定义参数处理-调用列表接口前的参数并集 */
  beforeNet?: (_params: T) => T
  /** 自定义响应处理 */
  afterNet?: (re: K) => any
  /** 自定义请求 */
  getList?: () => Promise<any>
  /** 是否每次切换页面都重新请求 默认false */
  pageReload?: boolean
  /** 分页配置 */
  pagination?: TablePaginationConfig
  /** 表格选中配置 */
  rowSelection?: TableRowSelection
}

interface ListReturnObj<T, K> {
  /** SCustomFilter中的搜索至第一页 */
  onSearch: (_params: Partial<T>) => void
  /** 表格页码切换 */
  handleTableChange: (pagination: TablePaginationConfig) => void
  /** 分页配置 */
  pagination: TablePaginationConfig
  /**  SCustomFilter中的params数据 */
  params: UnwrapNestedRefs<Partial<T>>
  loading: Ref<boolean>
  /** 表格数据 */
  dataSource: Ref<ListType<K>>
  /** 当前数据选中的数据record项 */
  selectedRows: Ref<ListType<K>>
  /** 表格选中配置 */
  rowSelection: TableRowSelection & { selectedRowKeys: Key[] }
  /** 表格选中清空 */
  clearSelected: () => void
  /** 表格刷新 */
  reload: () => void
}
type Kconstraints = any[] | { list?: any[]; total?: number | undefined }
type ListType<V> = V extends { list?: infer K } ? K : V
// 列表350ms不返回就出loading
const aopFn = (loading: Ref<boolean>, getList: () => Promise<any>) => {
  const time = setTimeout(() => {
    loading.value = true
  }, 350)
  getList().finally(() => {
    clearTimeout(time)
    loading.value = false
  })
}
export const useList = <T, K extends Kconstraints>(
  listProps: ListObjProps<T, K> | NetType<T, K>
): ListReturnObj<T, K> => {
  if (typeof listProps === 'function') {
    listProps = {
      net: listProps,
    }
  }
  const params = reactive<Partial<T>>({})
  const init = ref(true)
  const loading = ref(false)
  //表格数据
  const dataSource = ref([]) as Ref<ListType<K>>
  // 当前数据选中的数据
  const selectedRows = ref([]) as Ref<ListType<K>>
  const { getList, net, beforeNet, afterNet, pageReload } = listProps
  //注意未使用SCustomFilter的情况首次请调用getList或者onSearch或者reload
  const onSearch = (_params: Partial<T>) => {
    pagination.current = 1
    Object.assign(params, _params)
    aopFn(loading, getList || getTabList)
  }
  // 默认表格分页请求
  const getTabList = () => {
    const _params = Object.assign({ pageIndex: pagination.current!, pageSize: pagination.pageSize! }, params) as T
    if (net) {
      const p = beforeNet?.(_params) || _params
      return net(p, { loading }).then((re: K) => {
        if (afterNet) {
          afterNet(re)
          return false
        }
        //前端分页和后端分页
        if (Array.isArray(re)) {
          dataSource.value = re as ListType<K>
          pagination.total = re.length
        } else {
          dataSource.value = (re.list as ListType<K>) || []
          pagination.total = re.total
        }
      })
    } else return Promise.reject('request is not defined')
  }
  const pagination = reactive<TablePaginationConfig>({
    total: 0,
    current: 1,
    pageSize: Number(localStorage.getItem(FeManagePageSize)) || 10,
    pageSizeOptions: ['10', '50', '100'],
    showSizeChanger: true,
    showTotal: (total, range) => `共 ${total} 条`,
    ...listProps?.pagination,
  })

  const handleTableChange = (_pagination: TablePaginationConfig) => {
    if (pagination.pageSize != _pagination.pageSize && (<ListObjProps<T, K>>listProps).pagination?.pageSize) {
      localStorage.setItem(FeManagePageSize, _pagination.pageSize?.toString() || '10')
    }
    pagination.current = _pagination.current
    pagination.pageSize = _pagination.pageSize
    aopFn(loading, getList || getTabList)
    //因默认支持选中跨页，不支持时需要清空选中
    if (!rowSelection.preserveSelectedRowKeys) {
      clearSelected()
    }
  }

  const onSelectChange = (Keys: Key[], Rows: any[]) => {
    rowSelection.selectedRowKeys = Keys
    selectedRows.value = Rows as ListType<K>
  }

  // 非跨页选中

  const rowSelection = reactive<TableRowSelection & { selectedRowKeys: Key[] }>({
    selectedRowKeys: [],
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    ...listProps?.rowSelection,
  })

  //表格刷新 主要用于getTabList
  const reload = () => {
    aopFn(loading, getList || getTabList)
  }
  //清空选中
  const clearSelected = () => {
    rowSelection.selectedRowKeys = []
    selectedRows.value = [] as ListType<K>
  }

  onActivated(() => {
    if (init.value) {
      init.value = false
      return
    }
    aopFn(loading, getList || getTabList)
  })
  //#region 页面切换刷新列表
  const visibilitychange = () => {
    if (document.hidden) {
      // 页面不可见
    } else {
      // 页面可见
      reload()
    }
  }
  onMounted(() => {
    if (pageReload) {
      document.addEventListener('visibilitychange', visibilitychange)
    }
  })
  onUnmounted(() => {
    if (pageReload) {
      document.removeEventListener('visibilitychange', visibilitychange)
    }
  })
  //#endregion
  return {
    onSearch,
    handleTableChange,
    pagination,
    params,
    loading,
    rowSelection,
    selectedRows,
    dataSource,
    clearSelected,
    reload,
  }
}
```

//demo
```typescript
// 最简单的demo
export function deliveryQuotationListQNet(
  data?: DeliveryQuotationListQNetData,
  config?: NetConfig
): Promise<DeliveryQuotationListQNetRes> {
  return net(
    {
      url: `/bms/query/delivery-quotation/list`,
      method: 'post',

      data,
    },
    { cancelRepeatLimit: true }
  )
}


const { dataSource, pagination, onSearch, handleTableChange, loading, reload } = useList(deliveryQuotationListQNet)

```

|  | 初版 | 目前 |
| ---- | ---- | ---- |
| 自定义请求 | yes | yes |
| 分页配置 |  yes | yes |
| 跨页多选 | no |  yes |
| loading | yes | yes |
| 自定义参数 | no | yes |
| 自定义响应处理 | no | yes |
| 默认请求 | no | yes |
| 分页拓展 | no | yes |
| 查询刷新 | yes | yes |
| 表格刷新 | no  | yes |
| Type类型校验 | 输入校验  | 自动校验或输入校验 |
| 页面切换刷新列表 | no  | yes |


