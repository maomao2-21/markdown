
### 一、! 非空断言操作符
**x! 将从 x 值域中排除 null 和 undefined 。**
#### 1.1 忽略 undefined 和 null 类型

```typescript
//pagination的current和pagesize属性不为undefined 和 null
const getList = () =>
  net(pagination.current!, pagination.pageSize!).then(re => {
  console.log(re)
  })

```

#### 1.2 调用函数时 函数的返回忽略 undefined 类型

```typescript
type Num = () => number;
function myFunc(numGenerator: Num | undefined) { 
  const num1 =Num(); // Error 
  const num2 =Num!(); //OK
}
```
`!` 非空断言操作符并不会干扰js代码编译，只会在类型检查时起作用，所以最后的值还是有可能undefined
如
```typescript
const a:string| undefined = undefined;
const b:string= a!;
console.log(b); // undefined
```

### 二、?. 运算符

TypeScript 3.7 ：可选链（Optional Chaining）。有了可选链后，我们编写代码时如果遇到 `null` 或 `undefined` 就可以立即停止某些表达式的运行。可选链的核心是新的 `?.` 运算符，它支持以下语法：

> ```
> obj?.prop
> obj?.[expr]
> arr?.[index]
> func?.(args)
> ```

这里我们来举一个可选的属性访问的例子：

```typescript
if(a && a.b) { } 
 
if(a?.b){ }

 
```
 

上述的代码会自动检查对象 a 是否为 `null` 或 `undefined`，如果是的话就立即返回 `undefined`，这样就可以立即停止某些表达式的运行。你可能已经想到可以使用 `?.` 来替代很多使用 `&&` 执行空检查的代码：

 

但需要注意的是，`?.` 与 `&&` 运算符行为略有不同，比如空字符串、0、NaN、null 和 false 等。而 `?.` 只会验证对象是否为 `null` 或 `undefined`，对于 0 或空字符串来说，并不会出现 “短路”。

所以对于因为undefined.x 导致的页面空白 使用?.可以避免 如（a?.b?.c) 替代（a&&a.b&&a.b.c)而不是(a.b.c)
#### 2.1 可选元素访问

可选链除了支持可选属性的访问之外，它还支持可选元素的访问，它的行为类似于可选属性的访问，只是可选元素的访问允许我们访问非标识符的属性，比如任意字符串、数字索引和 Symbol：
```typescript
function Array(arr?: any[], index: number = 0) {
  return arr?.[index];
}
```

#### 2.2 可选链与函数调用

当尝试调用一个可能不存在的方法时也可以使用可选链。在实际开发过程中，这是很有用的。系统中某个方法不可用，有可能是由于版本不一致或者用户设备兼容性问题导致的。函数调用时如果被调用的方法不存在，使用可选链可以使表达式自动返回 `undefined` 而不是抛出一个异常。


```typescript
type BeforeNet = (_params: any) => void;
const beforeNet: BeforeNet = (params) => {
  console.log(params);
};
const p = beforeNet?.(1);
//
let result = obj?.BeforeNet?.();

```

另外在使用可选调用的时候，我们要注意以下两个注意事项：

*   可选链的运算行为被局限在属性的访问、调用以及元素的访问 不会影响除法加法
     
*   赋值表达式的左侧不能是可选属性访问
### 三、?? 空值合并运算符

在 TypeScript 3.7 版本中除了引入了前面介绍的可选链 `?.` 之外，也引入了一个新的逻辑运算符 —— 空值合并运算符 `??`。**当左侧操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数**。

与逻辑或 `||` 运算符不同，逻辑或会在左操作数为 falsy 值时返回右侧操作数。也就是说，如果你使用 || 来为某些变量设置默认的值时，你可能会遇到意料之外的行为。比如为 falsy 值（''、NaN 或 0）时。

这里来看一个具体的例子：

```typescript
const foo = null ?? 'default string';
console.log(foo); // 输出："default string"
const baz = 0 ?? 42; //0
const baz = 0 || 42; // 42 
c=0
if(c??1) //if(0)
if(c||1) //if(1)
``` 

通过观察以上代码，我们更加直观的了解到，空值合并运算符是如何解决前面 `||` 运算符存在的潜在问题。下面我们来介绍空值合并运算符的特性和使用时的一些注意事项。

* 很适合一种情况的判断就是 判断值是否存在 同时这个值可能是'',0,false情况

#### 3.1 短路

当空值合并运算符的左表达式不为 `null` 或 `undefined` 时，不会对右表达式进行求值。

```typescript
function A() { console.log('A was called'); return undefined;}
function B() { console.log('B was called'); return false;}
function C() { console.log('C was called'); return "foo";}
 
console.log(A() ?? C());
console.log(B() ?? C());

A was called 
C was called 
foo 
B was called 
false  
```
#### 3.2 不能与 && 或 || 操作符共用

若空值合并运算符 `??` 直接与 &&和 ||操作符组合使用 ?? 是不行的。这种情况下会抛出 SyntaxError。

 
const baz = 0 ?? 42 || c; //SyntaxError
const baz = 0 ?? (c || 42); //0 
  

前面我们已经介绍了空值合并运算符的应用场景和使用时的一些注意事项，该运算符不仅可以在 TypeScript 3.7 以上版本中使用。也可以使用Babel 添加支持

* vue3 里面使用typescript时template模板语法进行了支持，但是vue2中不支持,只能在js中使用

###  四、 数字分隔符 _
这个的解释很简单 大概就是为了开发人员分清楚数字从而加入的一个数字分界符
```typescript
 
const inhabitantsOfMunich = 1_4640_0000;  //146400000
 
```

这里是主要的几个常用的 后续as | & _ <> @ 因为这些与类型有关