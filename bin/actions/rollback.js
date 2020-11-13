/* eslint-disable func-names */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const chalk = require('chalk');
const shell = require('shelljs');
const tools = require('../tools');

module.exports = async function (cmd) {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist();

  // 检查配置文件中的部署环境
  const deployEnv = tools.deployConfig.checkEnv(cmd, 'deploy');

  // 连接服务器
  const sshGroup = new tools.SSHGroup(deployEnv.servers);
  await sshGroup.connect();

  for (const ssh of sshGroup.connects) {
    const res = await ssh.execCommand(`cd ${deployEnv.webDir}/${deployEnv.archiveDir}-releases; ls`);
    const list = res.stdout.split('\n');
    if (list.length >= 2) { // 有两次及以上的部署历史才有版本回退的意义
      const previous = list[list.length - 2];
      await ssh.execCommand(`cd ${deployEnv.webDir}/${deployEnv.archiveDir}-releases; cp ${previous} ${deployEnv.webDir};cd ..; tar xvf ${previous}; rm -rf ${previous}`);
      console.log(chalk.green(`\n回退成功，已回退至${previous}`));
      shell.exit(0);
    } else if (list.length === 1 && list[0].indexOf('.tar') > -1) { // 仅有一次，没有回退的意义
      console.log(chalk.yellow('\n只存在一个旧版本，无法回退'));
      shell.exit(1); // 退出程序
      break;
    } else {
      console.log(chalk.yellow('\n未找到版本文件，请先部署'));
      shell.exit(1); // 退出程序
      break;
    }
  }
};
