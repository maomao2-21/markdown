type Keys = "a" | "b" | "c";

type Obj = {
  [p in Keys]: any;
};
