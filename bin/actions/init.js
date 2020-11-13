/* eslint-disable func-names */
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const deployConfig = require('../tools/deployConfig');

module.exports = async function () {
  // 先判断是否已有配置文件
  if (!deployConfig.checkDeployConfigExist()) {
    // 初始化项目的部署配置文件
    fs.copyFileSync(`${path.resolve(__dirname, '../..')}/init/gkjx.deploy.js`, `${process.cwd()}/gkjx.deploy.js`);
    console.log(chalk.bgGreen('完成'), chalk.green('初始化成功'));
  } else {
    console.log(chalk.yellow('失败: gkjx.deploy.js 已存在'));
  }
};
