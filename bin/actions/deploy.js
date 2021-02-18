/* eslint-disable func-names */
const fs = require('fs');
const chalk = require('chalk');
const dialog = require('../tools/dialog');
const shell = require('shelljs');
const dayjs = require('dayjs');
const tools = require('../tools');
const exec = require('./exec');

module.exports = async function (cmd) {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist();

  // 检查配置文件中的部署环境
  const deployEnv = tools.deployConfig.checkEnv(cmd, 'deploy');

  // 初始化确认部署动作
  if(!deployEnv.withOutConfirm === true){
    let confirmTip = deployEnv.confirmTip || ''
    await dialog.confirm(`请确认部署环境：${deployEnv.name}${confirmTip}，输入'yes'以继续`, 'yes').catch(e =>{
      console.log(chalk.red(`\n确认环境'${deployEnv.name}'时退出`));
      shell.exit(1); 
    })
  }
  
  // 如果填写了打包命令就先打包
  if (deployEnv.buildCommands) {
    await exec(deployEnv.buildCommands);
  }
  // 检查是否有打包后的文件夹
  const exist = fs.existsSync(`${deployEnv.archiveDir}`);
  if (!exist) {
    console.log(chalk.red(`${deployEnv.archiveDir} 文件夹未找到，请确保它已存在！`));
    shell.exit(1); // 退出程序
  }

  console.log(`\n###### ${deployEnv.name}开始部署 ######`);

  const date = dayjs().format('YYYY_MM_DD_HH_mm_ss');
  // 压缩打包后的文件夹
  await tools.file.archiveFile(deployEnv, date);

  // 连接服务器
  const sshGroup = new tools.SSHGroup(deployEnv.servers);
  await sshGroup.connect().catch(e =>{
    console.log(chalk.red(`\n获取服务器授权失败`));
    shell.exit(1); 
  });

  // 部署连接成功之后执行命令
  if (deployEnv.commandBeforeDeploy) {
    console.log('正在执行连接成功命令');
    await tools.command.execCommand(sshGroup.connects, deployEnv, deployEnv.commandBeforeDeploy);
    console.log('连接成功命令执行完毕');
  }

  // 如果清空当前文件夹下面的所有文件
  if (deployEnv.clearWebDir === true) {
    const clearCommand = 'rm -rf `ls | grep -v "dist-releases"`';
    console.log('正在清理文件夹');
    await tools.command.execCommand(sshGroup.connects, deployEnv, clearCommand);
    console.log('文件夹清理完毕');
  }

  // 将打包后的压缩包上传到服务器指定路径
  await tools.file.putFiles(sshGroup.connects, deployEnv, date);

  // 删除本地的压缩包
  await tools.file.deleteLocalArchiveFile(deployEnv, date);

  // 在服务器端解压压缩包
  await tools.file.unArchiveFile(sshGroup.connects, deployEnv, date);

  // 部署完成之后执行命令
  if (deployEnv.commandAfterDeploy) {
    console.log('正在执行部署完成命令');
    await tools.command.execCommand(sshGroup.connects, deployEnv, deployEnv.commandAfterDeploy);
    console.log('部署完成命令执行完毕');
  }

  console.log(`\n###### ${deployEnv.name}部署完成 ######\n`);
  shell.exit(0); // 部署完成，结束程序
};
