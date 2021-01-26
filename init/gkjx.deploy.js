module.exports = {
  default: {
    name: '全部环境',
    confirmTip: '请确认AppId，正式环境为 臻孕，测试环境为 我知健康',
    // withOutConfirm: true,
    webDir: '/opt/webApp',
    // buildCommands: 'npm run build',
    archiveDir: 'dist',
    // keepReleases: 5,
    // commandBeforeDeploy: 'mkdir commandBeforeDeploy',
    // commandAfterDeploy: 'npm run start',
    servers: [{
      host: '192.168.100.18',
      port: 22,
      username: 'root',
      password: '123',
      privateKey: '/Users/x.pem'
    }],
  },
};
