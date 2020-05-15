const axios = require('axios')
const qs = require('qs')
const schedule = require('node-schedule')
const aes = require('../utils/aes')
const config = require('../config')
const data = require('../config/loginForm')
const handleLogin = require('./login')

class AutoWangda {
  /**
   *Creates an instance of AutoWangda.
   * @param data {Object} 登录参数
   */
  constructor({ data }) {
    this.data = data
  }
  async init() {
    const authorization = await handleLogin(this.data)
    const list = await this.handleSubject(authorization)
  }
  async handleSubject(authorization) {
    const res = await this.requestRegister(authorization)
    const response = await this.requestChapter(
      res.data.versionId,
      authorization
    )
    return response.data
  }
  requestRegister(authorization) {
    return axios.post(
      config.url + 'api/v1/course-study/course-front/register',
      qs.stringify({ courseId: config.subjectId }),
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
  requestChapter(versionId, authorization) {
    return axios.get(
      config.url + 'api/v1/course-study/course-front/chapter-progress',
      {
        params: {
          courseId: config.subjectId,
          versionId: versionId,
          isRegister: false
        },
        headers: {
          Authorization: authorization,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
        }
      }
    )
  }
  async handleCourse() {}
  requestCourse() {}
  handleVideoProgress() {}
  requestVideoProgress() {}
}

const autoWangda = new AutoWangda({ data })
autoWangda.init()
