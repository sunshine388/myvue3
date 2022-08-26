// 把packages下的所有包都进行打包
const fs = require("fs");

const execa = require("execa"); // 开启子进程进行打包，最终还是用roiiup

const targets = fs.readdirSync("packages").filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});
// 对目标进行依次打包， 并行打包

async function build(target) {
  // rollup -c --environment TARGET:shared
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 当子进程打包的信息共享到父进程
  });
}

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

runParallel(targets, build);
