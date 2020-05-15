const axios = require('axios')
const qs = require('qs')
const config = require('../config')

async function handleSubject(authorization) {
  const res = await requestRegister(authorization)
  const response = await requestChapter(res.data.versionId, authorization)
  const resourceIdList = response.data[0].courseChapterSections.map(
    item => item.resourceId
  )
  return resourceIdList
}
function requestRegister(authorization) {
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
function requestChapter(versionId, authorization) {
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

module.exports = handleSubject
