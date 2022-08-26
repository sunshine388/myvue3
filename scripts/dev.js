// 只针对具体某个模块进行打包

const execa = require("execa"); // 开启子进程进行打包，最终还是用roiiup

// 对目标进行依次打包， 并行打包

const target = "reactivity";

build(target);

async function build(target) {
  // rollup -c --environment TARGET:shared
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 当子进程打包的信息共享到父进程
  });
}
