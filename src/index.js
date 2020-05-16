const axios = require('axios')
const qs = require('qs')
const aes = require('../utils/aes')
const config = require('../config')
const data = require('../config/loginForm')
const store = require('../utils/store')
const handleLogin = require('./login')
const handleSubject = require('./handleSubject')
const handleCourse = require('./handleCourse')
const Schedule = require('./Schedule')

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
    console.log('登录成功')
    const resourceIdList = await handleSubject(this.subjectId)
    console.log('获取专题信息完成')
    let logIds = []
    for (const resourceId of resourceIdList) {
      const logIdList = await handleCourse(resourceId)
      logIds = logIds.concat(logIdList)
    }
    console.log('获取课程信息完成')
    await this.handlePostAll(logIds, authorization)
  }
  async handlePostAll(logIds, authorization) {
    console.log('开始学习')
    for (const item of logIds) {
      const data = {
        logId: item.logId,
        lessonLocation: item.timeSecond,
        studyTime: item.timeSecond,
        resourceTotalTime: item.timeSecond,
        organizationId: '1'
      }
      const job = new Schedule({
        timer: 1,
        fn: async () => {
          const res = await this.requestVideoProgress(
            qs.stringify(aes.encryptObj(data)),
            authorization
          )
          const resData = res.data || {}
          if (resData.finishStatus === 2) {
            console.log(item.name + '已完成')
            job.setStop(true)
          } else {
            console.log(item.name + '学习中')
          }
        }
      })
      job.run()
    }
  }
  requestVideoProgress(postData, authorization) {
    return axios.post(
      config.url + 'api/v1/course-study/course-front/video-progress',
      postData,
      {
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
        }
      }
    )
  }
}

const subjectId = config.subjectId
const autoWangda = new AutoWangda({ data, subjectId })
autoWangda.run()
