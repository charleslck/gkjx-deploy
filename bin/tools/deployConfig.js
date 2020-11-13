const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const shell = require('shelljs');


const exist = fs.existsSync(`${path.join(process.cwd())}/gkjx.deploy.js`);
// eslint-disable-next-line import/no-dynamic-require
const deployConfig = require(exist ? `${process.cwd()}/gkjx.deploy.js` : `${path.resolve(__dirname, '../..')}/init/gkjx.deploy.js`);

module.exports = {
  // 项目中是否存在gkjx.deploy.js
  checkDeployConfigExist() {
    return !!exist;
  },
  // 检查配置文件中的部署环境 - 默认default环境
  checkEnv(cmd) {
    const env = cmd.env || 'default';
    const deployEnv = deployConfig[env];
    if (!deployEnv) {
      console.log(chalk.red('你的配置文件是无效的'));
      shell.exit(1); // 退出程序
    }
    return deployEnv;
  },
};
