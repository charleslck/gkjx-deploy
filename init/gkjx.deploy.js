module.exports = {
  default: {
    name: '全部环境',
    webDir: '/opt/webApp',
    // buildCommands: 'npm run build',
    archiveDir: 'dist',
    // keepReleases: 5,
    // commandBeforeDeploy: 'mkdir commandBeforeDeploy',
    // commandAfterDeploy: 'npm run start',
    servers: [{
      host: '192.168.1.100',
      port: 22,
      username: 'root',
      password: '123',
      privateKey: '/Users/x.pem'
    }],
  },
};
