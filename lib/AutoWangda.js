const store = require('../utils/store')
const handleLogin = require('./login')
const handleSubject = require('./handleSubject')
const handleCourse = require('./handleCourse')
const handlePostAll = require('./handlePostAll')
const chalk = require('chalk')

class AutoWangda {
  /**
   *Creates an instance of AutoWangda.
   * @param data {Object} 登录参数
   */
  constructor({ data, subjectId }) {
    this.data = data
    this.subjectId = subjectId
  }
  async run() {
    const authorization = await handleLogin(this.data)
    store.set('AUTH_TOKEN', authorization)
    console.log(chalk.green('✔') + ' 登录成功')
    const resourceIdList = await handleSubject(this.subjectId)
    console.log(chalk.green('✔') + ' 获取专题信息完成')
    let logIds = []
    for (const resourceId of resourceIdList) {
      const logIdList = await handleCourse(resourceId)
      logIds = logIds.concat(logIdList)
    }
    console.log(chalk.green('✔') + ' 获取课程信息完成')
    await handlePostAll(logIds, authorization)
  }
}

module.exports = AutoWangda
