/* eslint-disable no-restricted-syntax */
const NodeSSH = require('node-ssh');
const chalk = require('chalk');

module.exports = class SSHGroup {
  // 构造函数
  constructor(servers) {
    this.servers = servers;
    this.connects = [];
  }

  // 连接服务器
  connect() {
    return new Promise((resolve, reject) => {
      for (const server of this.servers) {
        console.log(`服务器 ${server.host} 正在连接...`);
        const NodeSSHConfig = {
          host: server.host,
          port: server.port,
          username: server.username,
        };
        if (server.password) {
          NodeSSHConfig.password = server.password;
        } else {
          NodeSSHConfig.privateKey = server.privateKey;
        }
        const ssh = new NodeSSH();
        ssh.connect(NodeSSHConfig).then(() => {
          console.log(chalk.cyan(`服务器 ${server.host} 连接成功`));
          this.connects.push(ssh);
          if (this.connects.length === this.servers.length) {
            resolve(this.connects);
          }
        }).catch((err) => {
          reject(err);
        });
      }
    });
  }
};
