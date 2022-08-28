import { isArray } from "@vue/shared";

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options);

  if (!options.lazy) {
    effect(); // 响应式的effect会默认先执行一次
  }

  return effect;
}

let uid = 0;
let activeEffect; // 存储当前的effect
const effectStack = [];
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn(); // 函数执行会取值 会执行get方法
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid++; // 制作有个effect标识，用于区分effect
  effect._isEffect = true; // 用于标识这是一个响应式effect
  effect.raw = fn; // 保留effect对应的原函数
  effect.options = options;
  return effect;
}

const targetMap = new WeakMap();
export function track(target, type, key) {
  // activeEffect; // 当前正在运行的effect
  if (activeEffect === undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
  console.log(targetMap);
}

export function trigger(target, type, key?, newValue?, oldValue?) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const effects = new Set();
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => effects.add(effect));
    }
  };
  // 1. 看修改的是不是数组的长度
  if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key) => {
      if (key === "length" || key > newValue) {
        add(dep);
      }
    });
  } else {
    // 可能是对象
    if (key !== undefined) {
      add(depsMap.get(key));
    }
    // 如果修改数组的某一个索引
  }

  effects.forEach((effect: any) => effect());
}
