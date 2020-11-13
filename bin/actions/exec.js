
const shell = require('shelljs');


module.exports = function (command) {
  return new Promise((resolve, reject) => {
    try {
      shell.exec(`${command}`);
    } catch (error) {
      reject();
    }
    resolve();
  });
};
