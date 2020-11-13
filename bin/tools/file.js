/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-async-promise-executor */
const archiver = require('archiver');
const fs = require('fs');
const chalk = require('chalk');

module.exports = {
  // 压缩打包后的文件夹
  async archiveFile(deployEnv, date) {
    return new Promise((resolve, reject) => {
      console.log(`\n开始打包文件 ${deployEnv.archiveDir}-${date}.tar`);

      const output = fs.createWriteStream(`${process.cwd()}/${deployEnv.archiveDir}-${date}.tar`);
      const archive = archiver('tar', { zlib: { level: 9 } });// 压缩级别

      // 通过管道方法将输出流存档到文件
      archive.pipe(output);
      // 把打包后的文件夹压缩
      archive.directory(`${process.cwd()}/${deployEnv.archiveDir}`, false);

      output.on('close', (err) => {
        if (err) {
          reject(err);
          return console.log('关闭 压缩包 异常：', err);
        }
        console.log(chalk.cyan(`创建压缩包完成 ${deployEnv.archiveDir}-${date}.tar - ${archive.pointer()} bytes.\n`));
        resolve();
      });
      archive.on('error', (err) => {
        reject(err);
        throw err;
      });

      // 完成归档
      archive.finalize();
    });
  },

  async putFiles(connects, deployEnv, date) {
    // 在服务器上创建对应的部署目录
    return new Promise(async (resolve, reject) => {
      // 上传文件
      const localFile = `${deployEnv.archiveDir}-${date}.tar`;
      try {
        for (const ssh of connects) {
          console.log(`${localFile}开始上传`);
          await ssh.putFile(localFile, `${deployEnv.webDir}/${localFile}`, null, {
            concurrency: 1,
          });
          console.log(`${localFile}上传成功`);
        }
      } catch (error) {
        reject();
      }
      resolve();
    });
  },

  // 删除本地压缩包
  async deleteLocalArchiveFile(deployEnv, date) {
    return new Promise(async (resolve, reject) => {
      const localFile = `${deployEnv.archiveDir}-${date}.tar`;
      try {
        fs.unlinkSync(localFile);
      } catch (error) {
        reject();
      }
      resolve();
    });
  },

  // 在服务器端解压压缩包
  async unArchiveFile(connects, deployEnv, date) {
    for (const ssh of connects) {
      // 解压压缩包
      await ssh.execCommand(`cd ${deployEnv.webDir}; tar xvf ${deployEnv.archiveDir}-${date}.tar;`);
      // 把压缩包 move 到备份文件夹
      await ssh.execCommand(`cd ${deployEnv.webDir};mkdir ${deployEnv.archiveDir}-releases ; mv ${deployEnv.archiveDir}-${date}.tar ${deployEnv.archiveDir}-releases`);
      // 仅保留特定数量的压缩包文件 - 保留文件夹下最新的特定数量文件
      await ssh.execCommand(`cd ${deployEnv.webDir}/${deployEnv.archiveDir}-releases; ls -t | awk 'NR > ${deployEnv.keepReleases || 3} {print "rm -rf "$0}' | sh`);
      console.log(chalk.cyan('解压文件成功'));
    }
  },
};
