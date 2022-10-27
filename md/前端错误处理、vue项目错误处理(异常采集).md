因为公司的需求需要了解一下前端异常采集，做一个js报错的邮箱警告处理。我这里需要做一下捕获异常的处理。

# 异常数据
异常数据，是指前端在操作页面的过程中，触发的执行异常或加载异常，此时浏览器会抛出来报错信息。
比如说你的前端代码用了个未声明的变量，此时控制台会打印出红色错误，告诉你报错原因。或者是接口请求出错了，在网络面板内也能查到异常情况，是请求发送的异常，还是接口响应的异常。
![在这里插入图片描述](https://img-blog.csdnimg.cn/76712495bce14892a374053b69d0f014.png)

在我们实际的开发场景中，前端捕获的异常主要是分两个大类，接口异常 和 前端异常，我们分别看下这两大类异常怎么捕获。



## 接口异常
接口异常往往服务器状态码返回异常跟随有各种错误msg，我们前端可以再自己封装的request处对异常状态码进行一些特殊的处理。
比如fetch 如果你用 Promise 的写法，则用 .catch 捕获， async/await 的写法，则用 try..catch.. 捕获。当捕获到异常之后，统一交给handleError函数处理，这个函数会将接收到的异常进行处理，并调用 上报接口 将异常数据传到服务器，从而完成采集。
又比如axios 的响应拦截处 对相应的请求 进行错误上报。


## 前端js异常
前端代码捕获异常，最常用的方式就是用 try..catch.. 了，任意同步代码块都可以放到 try 块中，只要发生异常就会执行 catch：
但是这样不太现实，我们需要的是全局性的监听异常。这里我们可以用 window.onerror或者 window.addEventLinstener('error')  一般在vue项目中还会搭配 .config.errorHandler 

如  window.onerror = function (info, source, lineno, colno, error) {
    console.log(info, 'info')
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/8f5499ef6d86490995dacb740b40915d.png)




例子 通过vue.config+window.onerror+logger.js+路由记录

```javascript
//main.ts

app.config.globalProperties.$isTest = /\/\/devadmin|\/\/localhost|\/\/qaadmin|\/\/dev2admin|\/\/192/.test(
  window.location.origin
)
app.config.globalProperties.$isIos = /iP\w+ OS|iPad/.test(navigator.userAgent)
app.config.globalProperties.$isMobile = /mobile/gi.test(navigator.userAgent)
const ios = app.config.globalProperties.$isIos ? 'ios' : '其它'
const isProgram = app.config.globalProperties.$isMobile ? '手机端 ' + ios : 'PC端'

if (!app.config.globalProperties.$isTest) {
  const errorData: any = {}
  app.config.errorHandler = function (error: any, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    const params: errorinfo = {
      type: 'vue',
      info,
      isProgram,
    }
    if (error && (error.stack || error.message)) {
      params.stack = error.stack
      params.message = error.message
    }

    let userInfo = {}
    if (store) {
      const { userName, email, adminId, roleIdArr, rolesNameArr } = userStore
      userInfo = {
        userName,
        email,
        adminId,
        roleIdArr: roleIdArr.join(),
        rolesNameArr: rolesNameArr.join(),
      }
    }
    logger.errorReport(params, userInfo)
  }

  window.onerror = function (info, source, lineno, colno, error) {
    console.log(info, 'info')

    if (info === 'Script error.' && !source) {
      return true
    }
    const params: errorinfo = {
      type: 'window',
      info,
      source,
      lineno,
      colno,
      isProgram,
    }
    if (error && (error.stack || error.message)) {
      params.stack = error.stack
      params.message = error.message
    }
    const routes = logger.getRouter().split('|')
    const key = JSON.parse(routes[routes.length - 1]).name + JSON.parse(routes[routes.length - 1]).date
    if (!errorData[key]) {
      errorData[key] = true
      let userInfo = {}
      if (store) {
        const { userName, email, adminId, roleIdArr, rolesNameArr } = userStore
        userInfo = {
          userName,
          email,
          adminId,
          roleIdArr: roleIdArr.join(),
          rolesNameArr: rolesNameArr.join(),
        }
      }
      logger.errorReport(params, userInfo)
    }
  }
}
```
```javascript
//logger.ts
export default class Logger {
  maxRouterNum: number
  constructor() {
    this.maxRouterNum = 10
    this.dataStructChange = this.dataStructChange.bind(this)
    this.errorReport = this.errorReport.bind(this)
    this.error = this.error.bind(this)
    this.setRouter = this.setRouter.bind(this)
    this.getRouter = this.getRouter.bind(this)
    this.submitReport = this.submitReport.bind(this)
  }

  dataStructChange(
    data: {
      srcElement: any
      target: any
      reason: any
      error: any
      path: any[]
      message: any
      filename: any
      lineno: any
      colno: any
    },
    userInfo: {}
  ) {
    const element = data.srcElement || data.target || {}
    const error = data.reason || data.error || {}
    let domPath = ''
    const router = this.getRouter()

    data.path &&
      (domPath = data.path
        .map(function (item) {
          return item.nodeName || 'window'
        })
        .join(','))

    const logs = {
      message: data.message || error.message || '',
      url: window.location.href, // 网址
      filename: data.filename || '', // 若全局捕获,文件名
      lineno: data.lineno || 0, // 若全局捕获,行号
      colno: data.colno || 0, // 若全局捕获,列号
      domPath, // 若全局捕获页面dom问题,dom路径
      element: element.outerHTML.slice(1, element.outerHTML.length - 1) || '', // 若全局捕获页面dom问题,出错html代码
      error: {
        name: error.name || '',
        message: error.message || '',
        stack: error.stack || '',
      },
      router, // 用户访问路径
    }
    return { logs, userInfo }
  }

  errorReport(data: any, userInfo = {}) {
    if (data.target && data.target.nodeName === 'IMG') return
    if (
      data.type === 'window' ||
      data.type === 'vue' ||
      data.type === 'interface' ||
      data.type === 'unhandledrejection'
    ) {
      data.router = this.getRouter()
      this.submitReport({
        logs: data,
        userInfo,
      })
    } else {
      this.submitReport(this.dataStructChange(data, userInfo))
    }
  }

  error(error: any, tag: any, message: any) {
    this.errorReport({ tag: tag, error: error, message: message })
  }

  setRouter(data: { to: { path: any; name: any; meta: any; query: any; params: any }; date: any }) {
    const maxNum = this.maxRouterNum
    const router = sessionStorage.getItem('router')
    let routerArr: string[] = []

    if (router) {
      // 每个记录之间用|分割
      routerArr = router.split('|')
      routerArr.length >= maxNum && (routerArr = routerArr.slice(routerArr.length - maxNum + 1))
    }
    routerArr.push(
      JSON.stringify({
        path: data.to.path,
        name: data.to.name,
        meta: data.to.meta,
        query: data.to.query,
        params: data.to.params,
        date: data.date,
      })
    )

    sessionStorage.setItem('router', routerArr.join('|'))
  }

  getRouter() {
    const router = sessionStorage.getItem('router')
    return router || ''
  }

  submitReport(data: { logs: any; userInfo: {} }) {
    console.log(data, 'data') 
    //这里走上报接口
  }
}
// 报错上传服务器
export const logger = new Logger()

```



