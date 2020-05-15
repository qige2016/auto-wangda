const qs = require('qs')
const aes = require('../utils/aes')
const http = require('../utils/http')

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
  return http.post('oauth/api/v1/members-encrypt', postData)
}
function requestAuth(postData) {
  return http.post('oauth/api/v1/auth', postData)
}

module.exports = handleLogin
