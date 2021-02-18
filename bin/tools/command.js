/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-async-promise-executor */

module.exports = {

  async execCommand(connects, deployEnv, command) {
    // 在服务器上创建对应的部署目录
    return new Promise(async (resolve, reject) => {
      // 上传文件
      try {
        for (const ssh of connects) {
          // console.log(deployEnv.webDir, command)
          await ssh.execCommand(command, { cwd: deployEnv.webDir }).then((result) => {
            if (result.stdout) {
              console.log(`输出日志: ${result.stdout}`);
            }
            if (result.stderr) {
              console.log(`错误日志: ${result.stderr}`);
            }
          });
        }
      } catch (error) {
        reject();
      }
      resolve();
    });
  },

};
