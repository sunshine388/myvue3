import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shadowReactiveHandlers,
  shadowreadonlyHandlers,
} from "./baseHandlers";

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shadowReactiveHandlers);
}
export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}
export function shallowReadonly(target) {
  return createReactiveObject(target, true, shadowreadonlyHandlers);
}

const reactiveMap = new WeakMap(); // 会自动垃圾回收，不会造成内存泄漏，存储的key只能是对象
const readonlyMap = new WeakMap();

export function createReactiveObject(target, isReadonly, baseHandlers) {
  // 如果目标不是对象，没法拦截，reactive 这个api只能拦截对象类型
  if (!isObject(target)) {
    return target;
  }

  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  // 如果某个对象已经被代理过了，就不要再次代理了，可能一个对象 被代理是深度，又被仅读代理了
  const proxy = new Proxy(target, baseHandlers);

  const exisitProxy = proxyMap.get(target);
  if (exisitProxy) {
    return exisitProxy;
  }
  proxyMap.set(target, proxy); // 将要代理的对象和对应代理结果缓存起来

  return proxy;
}
