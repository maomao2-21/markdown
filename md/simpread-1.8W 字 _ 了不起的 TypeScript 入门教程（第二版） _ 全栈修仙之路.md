 
### 一、TypeScript 类
一个类可以包含以下几个模块：
* 1.属性
   * 1.1 类属性  
   * 1.2 实例属性
* 2.构造函数（在python中叫初始化函数)
该函数在类实例化时会被立即调用
* 3.方法（也是函数，不过不用写 关键字function的函数） 

#### 1.1 类的属性与方法
官网:
传统的JavaScript程序使用函数和基于原型的继承来创建可重用的组件，但对于熟悉使用面向对象方式的程序员来讲就有些棘手，因为他们用的是基于类的继承并且对象是由类构建出来的。 ES6 开始JavaScript程序员将能够使用基于类的面向对象的方式。 使用TypeScript，我们允许开发者现在就使用这些特性，并且编译后的JavaScript可以在所有主流浏览器和平台上运行，而不需要等到下个JavaScript版本。


在 TypeScript 中，我们可以通过 `Class` 关键字来定义一个类：

```typescript
class Greeter {
  static cname: string = "Greeter";
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  static getClassName() {
    return "Class name is Greeter";
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
let greeter = new Greeter("world");
```

那么成员属性与静态属性，成员方法与静态方法有什么区别呢？这里无需过多解释，我们直接看一下编译生成的 ES5 代码：

```typescript
"use strict";
var Greeter =  (function () {
    function Greeter(message) {
      this.greeting = message;
    }
    
    Greeter.getClassName = function () {
      return "Class name is Greeter";
    };
    
    Greeter.prototype.greet = function () {
      return "Hello, " + this.greeting;
    };
    
    Greeter.cname = "Greeter";
    return Greeter;
}());
var greeter = new Greeter("world");
```

####  1.2  私有字段

在 TypeScript 3.8 版本就开始支持 **ECMAScript 私有字段**，使用方式如下：

```typescript
class Person {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}

let semlinker = new Person("Semlinker");

semlinker.#name;
```

与常规属性（甚至使用 `private` 修饰符声明的属性）不同，私有字段要牢记以下规则：

*   私有字段以 `#` 字符开头，有时我们称之为私有名称；
*   每个私有字段名称都唯一地限定于其包含的类；
*   不能在私有字段上使用 TypeScript 可访问性修饰符（如 public 或 private）；
*   私有字段不能在包含的类之外访问，甚至不能被检测到。

#### 1.3 get 和 set 关键字
面向对象的封装性要求中，常需要我们对类的一些属性进行封装，避免外部直接操作属性，经常使用两个方法进行处理，Getter 方法用于获取属性的值，Setter 方法用户设置属性的值。在 Ts 中可以使用 get 和 set 关键字来定义这两个方法
```typescript
class Student{
	private _name;
	constructor(name: string){
		this._name = name;
	}
	get name(){
		return this._name;
	}
	set name(name: string){
		this._name = name;
	}
}

// 此时实例对象我们可以这样对name属性进行处理
let obj = new Student("chen")
obj.name = "zhang"
```

####  1.4 类的继承

继承（Inheritance）是一种联结类与类的层次模型。指的是一个类（称为子类、子接口）继承另外的一个类（称为父类、父接口）的功能，并可以增加它自己的新功能的能力，继承是类与类或者接口与接口之间最常见的关系。
 

在 TypeScript 中，我们可以通过 `extends` 关键字来实现继承：

```typescript
class Animal {
  name: string;
  
  constructor(theName: string) {
    this.name = theName;
  }
  
  move(Meters: number = 0) {
    console.log(`${this.name} moved ${Meters}m.`);
  }
}
class dog extends Animal {
  constructor(name: string) {
    super(name); 
  }
  
  move(Meters = 5) { 
    super.move(Meters);
  }
}

let sam = new dog("dog");
sam.move();
```

####  1.5 抽象类

使用 `abstract` 关键字声明的类，我们称之为抽象类。抽象类不能被实例化，因为它里面包含一个或多个抽象方法。所谓的抽象方法，是指不包含具体实现的方法：

```typescript
abstract class Person {
  constructor(public name: string){}

  abstract say(words: string) :void;
}


const lolo = new Person(); //无法创建抽象类的实例
```

抽象类不能被直接实例化，我们只能实例化实现了所有抽象方法的子类。简单理解可以将它理解为一个模板类，其中可以定义一些未实现的方法，然后通过继承让其子类来实现这个 方法。具体如下所示：

```typescript
abstract class Person {
  constructor(public name: string) {}

  abstract say(words: string): void;
}

class Developer extends Person {
  constructor(name: string) {
    super(name);
  }

  say(words: string): void {
    console.log(`${this.name} says ${words}`);
  }
}
```

#### 1.6 类方法重载

在前面的章节，我们已经介绍了函数重载。对于类的方法来说，它也支持重载。比如，在以下示例中我们重载了 `ProductService` 类的 `getProducts` 成员方法：

```typescript
class ProductService {
    getProducts(): void;
    getProducts(id: number): void;
    getProducts(id?: number) {
      if(typeof id === 'number') {
          console.log(`获取id为 ${id} 的产品信息`);
      } else {
          console.log(`获取所有的产品信息`);
      }  
    }
}

const productService = new ProductService();
productService.getProducts(666); 
productService.getProducts();
```
#### 1.7 static
当类 中 的 方法 被 声明 为 static 时，其实例化 对象 不可 调用 该方法，只有 类 本身 ，以及 其子类 可以 调用。
```typescript
class A {
	name:string;
	age:number;
	constructor(name:string,age:number){
		this.name = name;
		this.age = age;
	}
	eat(){
		console.log('测试');
	}
	static eat2(){
		console.log('测试2');
	}
}
let a = new A('zhangsan',8);
a.eat();//   '测试'
a.eat2();// error 

class B extends A {
	constructor(name:string,age:number){
		super(name,age);
	}
}
let  b = new B('lisi',9);
b.eat();// '测试'
b.eat2();// error
B.eat2();// '测试2' 
```
###  二、TypeScript 泛型

软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。  
泛型（Generics）是允许同一个函数接受不同类型参数的一种模板。相比于使用 any 类型，使用泛型来创建可复用的组件要更好，因为泛型会保留参数类型。

####  2.1 泛型语法

对于刚接触 TypeScript 泛型的读者来说，首次看到 `<T>` 语法会感到陌生。其实它没有什么特别，就像传递参数一样，我们传递了我们想要用于特定函数调用的类型。
 

参考上面的图片，当我们调用 `identity<Number>(1)` ，`Number` 类型就像参数 `1` 一样，它将在出现 `T` 的任何位置填充该类型。图中 `<T>` 内部的 `T` 被称为类型变量，它是我们希望传递给 identity 函数的类型占位符，同时它被分配给 `value` 参数用来代替它的类型：此时 `T` 充当的是类型，而不是特定的 Number 类型。

其中 `T` 代表 **Type**，在定义泛型时通常用作第一个类型变量名称。但实际上 `T` 可以用任何有效名称代替。除了 `T` 之外，以下是常见泛型变量代表的意思：

*   K（Key）：表示对象中的键类型；
*   V（Value）：表示对象中的值类型；
*   E（Element）：表示元素类型。

其实并不是只能定义一个类型变量，我们可以引入希望定义的任何数量的类型变量。比如我们引入一个新的类型变量 `U`，用于扩展我们定义的 `identity` 函数：

```typescript
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

console.log(identity<Number, string>(68, "Semlinker"));
``` 

除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号，比如：

```typescript
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

console.log(identity(68, "Semlinker"));
```
 在使用泛型的时候 类型推论显得尤为重要

####  2.2 泛型接口

```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}
```

####  2.3 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

#### 2.4 泛型工具类型(很重要) 

#####  1.typeof

在 TypeScript 中，`typeof` 操作符可以用来获取一个变量声明或对象的类型。

```typescript
interface Person {
  name: string;
  age: number;
}

const sem: Person = { name: 'semlinker', age: 33 };
type Sem= typeof sem; 

function toArray(x: number): Array<number> {
  return [x];
}

type Func = typeof toArray;
```

#####  2.keyof

`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```typescript 
type Point = { x: number; y: number };
type P = keyof Point;
// type P = "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number 
//注意 JavaScript 对象的属性名会被强制转为一个字符串
```
 
#####  3.in

`in` 用来遍历枚举类型： 注意不能用于interface

```
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
}
```
![](2022-11-02-18-00-39.png)

#####  4.infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

```typescript
type ListType<V> = V extends { list?: infer K } ? K : V

```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。 上述简单来说K 接收 list的返回类型  如果V中有可选list  那么V的类型就是K 也就是list 否则V的类型是它本身

#####  5.extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```
loggingIdentity(3);
```

这时我们需要传入符合约束类型的值，必须包含必须的属性：

```
loggingIdentity({length: 10, value: 3});
```

##### 6 Partial

`Partial<T>` 的作用就是将某个类型里的属性全部变为可选项 `?`。

**定义：**

```
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

在以上代码中，首先通过 `keyof T` 拿到 `T` 的所有属性名，然后使用 `in` 进行遍历，将值赋给 `P`，最后通过 `T[P]` 取得相应的属性值。中间的 `?` 号，用于将所有属性变为可选。

**示例：**

```typescript
interface Todo {
  key: string;
  value: string;
}
//使用Partial的情况就变成了
Partial<Todo> 
//相当于 
interface Todo {
  key?: string;
  value?: string;
}
 
```
 

##### 7 Readonly
用来构造一个类型，将Type的所有属性都设置为readonly（只读） 无法修改
```TYPESCRIPT
interface Props {
    id: string 
} 
type Type= Readonly<Props>
let a={
  id:1
}
a.id=3  //ERROR 
```

##### 8 Pick<Type, Keys>
 从Type中选择一组属性来构造新类型
 ```TYPESCRIPT
 interface Props {
    id: string
    title: string
    children: number[]
}

type PickProps = Pick<Props, 'id'|'title'>
 ```
> 1 Pick工具类型有两个类型变量：1、表示选择谁的属性 2、表示选择哪几个属性。
> 2 其中第二个类型变量，如果只选择一个则只传入该属性名即可。
> 3 第二个类型变量传入的属性只能是第一个类型变量中存在的属性。
> 4 构造出来的新类型PickProps，只有id和title两个属性类型。

##### 9  Record<Keys,Type>
构造一个对象类型，属性键为Keys，属性类型为Type。
```typescript
export default interface CurrentUser {
  /** 权限对象 */
  roles: Record<string, boolean>
}
// .roles 对象可以字符串为keys  但是值必须是boolean类型

```

### [](#十三、TypeScript-装饰器 "十三、TypeScript 装饰器")十三、TypeScript 装饰器

#### [](#13-1-装饰器是什么 "13.1 装饰器是什么")13.1 装饰器是什么

*   它是一个表达式
*   该表达式被执行后，返回一个函数
*   函数的入参分别为 target、name 和 descriptor
*   执行该函数后，可能返回 descriptor 对象，用于配置 target 对象

#### [](#13-2-装饰器的分类 "13.2 装饰器的分类")13.2 装饰器的分类

*   类装饰器（Class decorators）
*   属性装饰器（Property decorators）
*   方法装饰器（Method decorators）
*   参数装饰器（Parameter decorators）

需要注意的是，若要启用实验性的装饰器特性，你必须在命令行或 `tsconfig.json` 里启用 `experimentalDecorators` 编译器选项：

**命令行**：

```
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**：

```
{
  "compilerOptions": {
     "target": "ES5",
     "experimentalDecorators": true
   }
}
```

#### [](#13-3-类装饰器 "13.3 类装饰器")13.3 类装饰器

类装饰器声明：

```
declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void;
```

类装饰器顾名思义，就是用来装饰类的。它接收一个参数：

*   target: TFunction - 被装饰的类

看完第一眼后，是不是感觉都不好了。没事，我们马上来个例子：

```
function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log("Hello Semlinker!");
  };
}

@Greeter
class Greeting {
  constructor() {
    
  }
}

let myGreeting = new Greeting();
myGreeting.greet();
```

上面的例子中，我们定义了 `Greeter` 类装饰器，同时我们使用了 `@Greeter` 语法糖，来使用装饰器。

> 友情提示：读者可以直接复制上面的代码，在 [TypeScript Playground](https://www.typescriptlang.org/play/index.html) 中运行查看结果。

有的读者可能想问，例子中总是输出 `Hello Semlinker!` ，能自定义输出的问候语么 ？这个问题很好，答案是可以的。

具体实现如下：

```
function Greeter(greeting: string) {
  return function (target: Function) {
    target.prototype.greet = function (): void {
      console.log(greeting);
    };
  };
}

@Greeter("Hello TS!")
class Greeting {
  constructor() {
    
  }
}

let myGreeting = new Greeting();
myGreeting.greet();
```

#### [](#13-4-属性装饰器 "13.4 属性装饰器")13.4 属性装饰器

属性装饰器声明：

```
declare type PropertyDecorator = (target:Object, 
  propertyKey: string | symbol ) => void;
```

属性装饰器顾名思义，用来装饰类的属性。它接收两个参数：

*   target: Object - 被装饰的类
*   propertyKey: string | symbol - 被装饰类的属性名

趁热打铁，马上来个例子热热身：

```
function logProperty(target: any, key: string) {
  delete target[key];

  const backingField = "_" + key;

  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true
  });

  
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };

  
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };

  
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class Person { 
  @logProperty
  public name: string;

  constructor(name : string) { 
    this.name = name;
  }
}

const p1 = new Person("semlinker");
p1.name = "kakuqo";
```

以上代码我们定义了一个 `logProperty` 函数，来跟踪用户对属性的操作，当代码成功运行后，在控制台会输出以下结果：

```
Set: name => semlinker
Set: name => kakuqo
```

#### [](#13-5-方法装饰器 "13.5 方法装饰器")13.5 方法装饰器

方法装饰器声明：

```
declare type MethodDecorator = <T>(target:Object, propertyKey: string | symbol, 	 	
  descriptor: TypePropertyDescript<T>) => TypedPropertyDescriptor<T> | void;
```

方法装饰器顾名思义，用来装饰类的方法。它接收三个参数：

*   target: Object - 被装饰的类
*   propertyKey: string | symbol - 方法名
*   descriptor: TypePropertyDescript - 属性描述符

废话不多说，直接上例子：

```
function LogOutput(tarage: Function, key: string, descriptor: any) {
  let originalMethod = descriptor.value;
  let newMethod = function(...args: any[]): any {
    let result: any = originalMethod.apply(this, args);
    if(!this.loggedOutput) {
      this.loggedOutput = new Array<any>();
    }
    this.loggedOutput.push({
      method: key,
      parameters: args,
      output: result,
      timestamp: new Date()
    });
    return result;
  };
  descriptor.value = newMethod;
}

class Calculator {
  @LogOutput
  double (num: number): number {
    return num * 2;
  }
}

let calc = new Calculator();
calc.double(11);

console.log(calc.loggedOutput);
```

下面我们来介绍一下参数装饰器。

#### [](#13-6-参数装饰器 "13.6 参数装饰器")13.6 参数装饰器

参数装饰器声明：

```
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, 
  parameterIndex: number ) => void
```

参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：

*   target: Object - 被装饰的类
*   propertyKey: string | symbol - 方法名
*   parameterIndex: number - 方法中参数的索引值

```
function Log(target: Function, key: string, parameterIndex: number) {
  let functionLogged = key || target.prototype.constructor.name;
  console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has
	been decorated`);
}

class Greeter {
  greeting: string;
  constructor(@Log phrase: string) {
	this.greeting = phrase; 
  }
}
```

### [](#十四、TypeScript-4-0-新特性 "十四、TypeScript 4.0 新特性")十四、TypeScript 4.0 新特性

TypeScript 4.0 带来了很多新的特性，这里我们只简单介绍其中的两个新特性。

#### [](#14-1-构造函数的类属性推断 "14.1 构造函数的类属性推断")14.1 构造函数的类属性推断

当 `noImplicitAny` 配置属性被启用之后，TypeScript 4.0 就可以使用控制流分析来确认类中的属性类型：

```
class Person {
  fullName; 
  firstName; 
  lastName; 

  constructor(fullName: string) {
    this.fullName = fullName;
    this.firstName = fullName.split(" ")[0];
    this.lastName =   fullName.split(" ")[1];
  }  
}
```

然而对于以上的代码，如果在 TypeScript 4.0 以前的版本，比如在 3.9.2 版本下，编译器会提示以下错误信息：

```
class Person {
  
  fullName; 
  firstName; 
  lastName; 

  constructor(fullName: string) {
    this.fullName = fullName;
    this.firstName = fullName.split(" ")[0];
    this.lastName =   fullName.split(" ")[1];
  }  
}
```

从构造函数推断类属性的类型，该特性给我们带来了便利。但在使用过程中，如果我们没法保证对成员属性都进行赋值，那么该属性可能会被认为是 `undefined`。

```
class Person {
   fullName;  
   firstName; 
   lastName; 

   constructor(fullName: string) {
     this.fullName = fullName;
     if(Math.random()){
       this.firstName = fullName.split(" ")[0];
       this.lastName =   fullName.split(" ")[1];
     }
   }  
}
```

#### [](#14-2-标记的元组元素 "14.2 标记的元组元素")14.2 标记的元组元素

在以下的示例中，我们使用元组类型来声明剩余参数的类型：

```
function addPerson(...args: [string, number]): void {
  console.log(`Person info: name: ${args[0]}, age: ${args[1]}`)
}

addPerson("lolo", 5);
```

其实，对于上面的 `addPerson` 函数，我们也可以这样实现：

```
function addPerson(name: string, age: number) {
  console.log(`Person info: name: ${name}, age: ${age}`)
}
```

这两种方式看起来没有多大的区别，但对于第一种方式，我们没法设置第一个参数和第二个参数的名称。虽然这样对类型检查没有影响，但在元组位置上缺少标签，会使得它们难于使用。为了提高开发者使用元组的体验，TypeScript 4.0 支持为元组类型设置标签：

```
function addPerson(...args: [name: string, age: number]): void {
  console.log(`Person info: name: ${args[0]}, age: ${args[1]}`);
}
```

之后，当我们使用 `addPerson` 方法时，TypeScript 的智能提示就会变得更加友好。

```
function addPerson(...args: [string, number]): void {
  console.log(`Person info: name: ${args[0]}, age: ${args[1]}`)
} 



function addPerson(...args: [name: string, age: number]): void {
  console.log(`Person info: name: ${args[0]}, age: ${args[1]}`);
}
```

### [](#十五、编译上下文 "十五、编译上下文")十五、编译上下文

#### [](#15-1-tsconfig-json-的作用 "15.1 tsconfig.json 的作用")15.1 tsconfig.json 的作用

*   用于标识 TypeScript 项目的根路径；
*   用于配置 TypeScript 编译器；
*   用于指定编译的文件。

#### [](#15-2-tsconfig-json-重要字段 "15.2 tsconfig.json 重要字段")15.2 tsconfig.json 重要字段

*   files - 设置要编译的文件的名称；
*   include - 设置需要进行编译的文件，支持路径模式匹配；
*   exclude - 设置无需进行编译的文件，支持路径模式匹配；
*   compilerOptions - 设置与编译流程相关的选项。

#### [](#15-3-compilerOptions-选项 "15.3 compilerOptions 选项")15.3 compilerOptions 选项

compilerOptions 支持很多选项，常见的有 `baseUrl`、 `target`、`baseUrl`、 `moduleResolution` 和 `lib` 等。

compilerOptions 每个选项的详细说明如下：

```
{
  "compilerOptions": {

    
    "target": "es5",                       
    "module": "commonjs",                  
    "lib": [],                             
    "allowJs": true,                       
    "checkJs": true,                       
    "jsx": "preserve",                     
    "declaration": true,                   
    "sourceMap": true,                     
    "outFile": "./",                       
    "outDir": "./",                        
    "rootDir": "./",                       
    "removeComments": true,                
    "noEmit": true,                        
    "importHelpers": true,                 
    "isolatedModules": true,               

    
    "strict": true,                        
    "noImplicitAny": true,                 
    "strictNullChecks": true,              
    "noImplicitThis": true,                
    "alwaysStrict": true,                  

    
    "noUnusedLocals": true,                
    "noUnusedParameters": true,            
    "noImplicitReturns": true,             
    "noFallthroughCasesInSwitch": true,    

    
    "moduleResolution": "node",            
    "baseUrl": "./",                       
    "paths": {},                           
    "rootDirs": [],                        
    "typeRoots": [],                       
    "types": [],                           
    "allowSyntheticDefaultImports": true,  

    
    "sourceRoot": "./",                    
    "mapRoot": "./",                       
    "inlineSourceMap": true,               
    "inlineSources": true,                 

    
    "experimentalDecorators": true,        
    "emitDecoratorMetadata": true          
  }
}
```

### [](#十六、TypeScript-开发辅助工具 "十六、TypeScript 开发辅助工具")十六、TypeScript 开发辅助工具

#### [](#16-1-TypeScript-Playground "16.1 TypeScript Playground")16.1 [TypeScript Playground](https://www.typescriptlang.org/play/)

> 简介：TypeScript 官方提供的在线 TypeScript 运行环境，利用它你可以方便地学习 TypeScript 相关知识与不同版本的功能特性。
> 
> 在线地址：[https://www.typescriptlang.org/play/](https://www.typescriptlang.org/play/)

![](http://cdn.semlinker.com/ts-playground.jpg)

除了 TypeScript 官方的 Playground 之外，你还可以选择其他的 Playground，比如 [codepen.io](https://codepen.io/)、[stackblitz](https://stackblitz.com/) 或 [jsbin.com](https://jsbin.com/?js) 等。

#### [](#16-2-TypeScript-UML-Playground "16.2 TypeScript UML Playground")16.2 [TypeScript UML Playground](https://tsuml-demo.firebaseapp.com/)

> 简介：一款在线 TypeScript UML 工具，利用它你可以为指定的 TypeScript 代码生成 UML 类图。
> 
> 在线地址：[https://tsuml-demo.firebaseapp.com/](https://tsuml-demo.firebaseapp.com/)

![](http://cdn.semlinker.com/ts-uml-playground.jpg)

#### [](#16-3-JSON-TO-TS "16.3 JSON TO TS")16.3 [JSON TO TS](http://www.jsontots.com/)

> 简介：一款 TypeScript 在线工具，利用它你可以为指定的 JSON 数据生成对应的 TypeScript 接口定义。
> 
> 在线地址：[http://www.jsontots.com/](http://www.jsontots.com/)

![](http://cdn.semlinker.com/ts-json-to-ts.jpg)

除了使用 [jsontots](http://www.jsontots.com/) 在线工具之外，对于使用 VSCode IDE 的小伙们还可以安装 [](https://marketplace.visualstudio.com/items?item>JSON to TS</a> 扩展来快速完成 <strong>JSON to TS</strong> 的转换工作。</p><h4 id=)[](#16-4-Schemats "16.4 Schemats")16.4 [Schemats](https://github.com/SweetIQ/schemats)

> 简介：利用 Schemats，你可以基于（Postgres，MySQL）SQL 数据库中的 schema 自动生成 TypeScript 接口定义。
> 
> 在线地址：[https://github.com/SweetIQ/schemats](https://github.com/SweetIQ/schemats)

![](http://cdn.semlinker.com/ts-schemats.jpg)

#### [](#16-5-TypeScript-AST-Viewer "16.5 TypeScript AST Viewer")16.5 [TypeScript AST Viewer](https://ts-ast-viewer.com/)

> 简介：一款 TypeScript AST 在线工具，利用它你可以查看指定 TypeScript 代码对应的 AST（Abstract Syntax Tree）抽象语法树。
> 
> 在线地址：[https://ts-ast-viewer.com/](https://ts-ast-viewer.com/)

![](http://cdn.semlinker.com/ts-ast-viewer.jpg)

对于了解过 AST 的小伙伴来说，对 [astexplorer](https://astexplorer.net/) 这款在线工具应该不会陌生。该工具除了支持 JavaScript 之外，还支持 CSS、JSON、RegExp、GraphQL 和 Markdown 等格式的解析。

#### [](#16-6-TypeDoc "16.6 TypeDoc")16.6 [TypeDoc](https://typedoc.org/)

> 简介：TypeDoc 用于将 TypeScript 源代码中的注释转换为 HTML 文档或 JSON 模型。它可灵活扩展，并支持多种配置。
> 
> 在线地址：[https://typedoc.org/](https://typedoc.org/)

![](http://cdn.semlinker.com/ts-type-doc.jpg)

#### [](#16-7-TypeScript-ESLint "16.7 TypeScript ESLint")16.7 [TypeScript ESLint](https://typescript-eslint.io/)

> 简介：使用 [TypeScript ESLint](https://typescript-eslint.io/) 可以帮助我们规范代码质量，提高团队开发效率。
> 
> 在线地址：[https://typescript-eslint.io/](https://typescript-eslint.io/)

![](http://cdn.semlinker.com/ts-eslint-prettier.jpg)

对 [TypeScript ESLint](https://typescript-eslint.io/) 项目感兴趣且想在项目中应用的小伙伴，可以参考 [“在 Typescript 项目中，如何优雅的使用 ESLint 和 Prettier”](https://juejin.im/post/5d1d5fe96fb9a07eaf2bae29) 这篇文章。

能坚持看到这里的小伙伴都是 “真爱”，如果你还意犹未尽，那就来看看本人整理的 Github 上 1.8K+ 的开源项目：[awesome-typescript](https://github.com/semlinker/awesome-typescript)。

> [https://github.com/semlinker/awesome-typescript](https://github.com/semlinker/awesome-typescript)

### [](#十七、参考资源 "十七、参考资源")十七、参考资源

*   [mariusschulz - the-unknown-type-in-typescript](https://mariusschulz.com/blog/the-unknown-type-in-typescript)
*   [深入理解 TypeScript - 编译上下文](https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#tsconfig-json)
*   [TypeScript 4.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html)
*   TypeScript Quickly