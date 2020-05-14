const axios = require('axios')
const qs = require('qs')
const schedule = require('node-schedule')
const aes = require('../utils/aes')
const data = require('../config')

const url = 'https://wangda.chinamobile.com/'
const subjectId = 'd6bd78b1-911d-4017-aa11-0c054cb06f72'

class AutoWangda {
  /**
   *Creates an instance of AutoWangda.
   * @param data {Object} 登录参数
   */
  constructor({ data, url, subjectId }) {
    this.data = data
    this.url = url
    this.subjectId = subjectId
  }
  async init() {
    const authorization = await this.handleLogin()
    const list = await this.handleSubject(authorization)
  }
  async handleLogin() {
    const res = await this.requestMembersEncrypt(
      qs.stringify(aes.encryptObj(this.data))
    )
    const data = {
      check_token: res.data.check_token,
      key: this.data.key,
      userid: res.data.members[0].id
    }
    const response = await this.requestAuth(qs.stringify(data))
    return response.data.token_type + '__' + response.data.access_token
  }
  requestMembersEncrypt(postData) {
    return axios.post(url + 'oauth/api/v1/members-encrypt', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
      }
    })
  }
  requestAuth(postData) {
    return axios.post(url + 'oauth/api/v1/auth', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
      }
    })
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
      url + 'api/v1/course-study/course-front/register',
      qs.stringify({ courseId: this.subjectId }),
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
      url + 'api/v1/course-study/course-front/chapter-progress',
      {
        params: {
          courseId: this.subjectId,
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

const autoWangda = new AutoWangda({ data, url, subjectId })
autoWangda.init()
