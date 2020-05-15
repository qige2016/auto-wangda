const axios = require('axios')
const qs = require('qs')
const aes = require('../utils/aes')
const config = require('../config')

async function handleLogin(data) {
  const res = await requestMembersEncrypt(qs.stringify(aes.encryptObj(data)))
  const dataTemp = {
    check_token: res.data.check_token,
    key: data.key,
    userid: res.data.members[0].id
  }
  const response = await requestAuth(qs.stringify(dataTemp))
  return response.data.token_type + '__' + response.data.access_token
}
function requestMembersEncrypt(postData) {
  return axios.post(config.url + 'oauth/api/v1/members-encrypt', postData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    }
  })
}
function requestAuth(postData) {
  return axios.post(config.url + 'oauth/api/v1/auth', postData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    }
  })
}

module.exports = handleLogin
