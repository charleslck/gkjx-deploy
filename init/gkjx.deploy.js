module.exports = {
  default: {
    name: '全部环境',
    webDir: '/opt/webApp',
    buildCommands: 'npm run build',
    archiveDir: 'dist',
    // keepReleases: 5,
    // commandBeforeDeploy: 'mkdir commandBeforeDeploy',
    // commandAfterDeploy: 'npm run start',
    servers: [{
      host: '192.168.100.17',
      port: 22,
      username: 'root',
      password: '123456',
    }],
  },
};
