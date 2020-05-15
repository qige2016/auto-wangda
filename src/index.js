const axios = require('axios')
const qs = require('qs')
const schedule = require('node-schedule')
const aes = require('../utils/aes')
const config = require('../config')
const data = require('../config/loginForm')
const handleLogin = require('./login')
const handleSubject = require('./handleSubject')

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
    const resourceIdList = await handleSubject(authorization)
  }
  async handleCourse() {}
  requestCourse() {}
  handleVideoProgress() {}
  requestVideoProgress() {}
}

const autoWangda = new AutoWangda({ data })
autoWangda.init()
