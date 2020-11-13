# 欢迎使用自动化部署工具 gkjx-deploy

gkjx-deploy是一键自动化部署工具，可以根据配置文件中定义的参数自动化部署至服务器。

##Npm安装
全局安装 `npm install gkjx-deploy -g`

##命令
初始化配置文件 `g-deploy -V`
> 查看当前版本

初始化配置文件 `g-deploy init`
> 初始化配置文件命令，执行完成之后会在当前目录生成一个 gkjx.deploy.js 文件，可自由配置。

执行部署 `g-deploy deploy`
> 根据配置文件信息执行一键部署命令

版本回退 `g-deploy rollback`
> 在部署成功之后，工具会把创建一个release文件夹，保留至多默认3个版本，执行此命令会回退至更旧的版本。

##配置文件示例
```javascript
module.exports = {
  default: {
    name: '全部环境',
    webDir: '/opt/webApp',
    buildCommands: 'npm run build',
    archiveDir: 'dist',
    keepReleases: 5,
    commandBeforeDeploy: 'mkdir commandBeforeDeploy',
    commandAfterDeploy: 'npm run start',
    servers: [{
      host: '192.168.100.17',
      port: 22,
      username: 'root',
      password: '123456',
    },{
      host: '192.168.100.18',
      port: 22,
      username: 'root',
      password: '123456',
    }],
  },
  aliyun: {
    name: '开发环境',
    webDir: '/opt/webApp',
    buildCommands: 'npm run build',
    archiveDir: 'dist',
    servers: [{
        host: '192.168.100.18',
        port: 22,
        username: 'root',
        password: '123456',
      }],
  },
};

```

##配置文件参数说明
| 参数名        | 说明   |  类型 |  默认值 | 是否必须 |
| --------   | :-----:  | :-----:  |:-----: |:-----: |
| name      | 为配置项指定一个name名称   | String | - | 是 |
| webDir    | 目标服务器上的部署目录   | String | - | 是 |
| archiveDir   |    需要部署至服务器的本机文件夹    | String | - | 是 |
| servers   |    需要部署服务器的配置列表    | Array | - | 是 |
| servers-host   |    服务器公网IP地址    | String | - | 是 |
| servers-port   |    服务器公网端口号    | Number | - | 是 |
| servers-username   |    服务器的用户名    | String | - | 是 |
| servers-password   |    服务器的密码    | String | - | 是 |
| buildCommands    |    开始部署前在本机执行的打包命令    | String | - | 否 |
| commandBeforeDeploy   |    当与服务器建立连接后执行的命令    | String | - | 否 |
| commandAfterDeploy   |    当文件部署完成后执行的命令    | String | - | 否 |
| keepReleases   |    指定保留版本的数量    | Number | 3 | 否 |
