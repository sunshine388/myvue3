// 实现 new Proxy(target, handler)

import { extend, isObject } from "@vue/shared";
import { track } from "./effect";
import { TrackOpTypes } from "./operators";
import { reactive, readonly } from "./reactive";

function createGetter(isReadonly = false, shallow = false) {
  // 拦截获取功能
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 收集依赖，等数据变化更新视图
      console.log("执行effet时会取值", "收集effect");

      track(target, TrackOpTypes.GET, key);
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) { // vue2是一上来就递归， vue3是当取值时会代理， vue3的代理模式是懒代理
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
} // 拦截获取功能
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    // 当数据更新时，通知对应属性的effect重新执行
    return res;
  };
} // 拦截设置功能

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shallowSet = createSetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const shadowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};

let readonlyObj = {
  set: (target, key) => {
    console.warn(`set on key ${key} is failed`);
  },
};

export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj
);

export const shadowreadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
    set: (target, key) => {
      console.warn(`set on key ${key} is failed`);
    },
  },
  readonlyObj
);
