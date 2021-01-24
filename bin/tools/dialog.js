const read = require('read');

module.exports = {
  // 压缩打包后的文件夹
  async confirm(prompt, okWord) {
    return new Promise((resolve, reject) => {
      read({
        prompt: prompt || '请输入: ',
        timeout: 60000,
      }, (error, result) => {
        if(result === okWord){
          resolve()
        } else {
          reject()
        }
      });
    });
  }
}