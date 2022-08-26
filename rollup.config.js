import path from "path";
// 根据环境变量中的target属性 获取对应模块中的package.json

const packagesDir = path.resolve(__dirname, "packages");

const packageDir = path.resolve(packagesDir, process.env.TARGET);

// 永远针对的是某个模块
const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve("package.json"));

const name = path.basename(packageDir);

// 对打包类型 先做一个映射表，根据你提供的 format 来格式化需要打包的内容
const outputConfig = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`, // 立即执行函数
  },
};

const options = pkg.buildOptions;

function createConfig(format, output) {
  output.name = options.name;
  output.sourcemap = true;
  // 生成rollup配置
}

export default options.formats.map((format) =>
  createConfig(format, outputConfig)
);
