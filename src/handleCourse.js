const axios = require('axios')
const config = require('../config')

async function handleCourse(resourceId, authorization) {
  const res = await requestCourse(resourceId, authorization)
  const idList = res.data.courseChapters[0].courseChapterSections.map(item => ({
    id: item.id,
    name: item.name,
    timeSecond: item.timeSecond
  }))
  const logIdList = await Promise.all(
    idList.map(async item => {
      const response = await requestLog(item.id, authorization)
      const logId = response.data.id
      return {
        logId,
        name: item.name,
        timeSecond: item.timeSecond
      }
    })
  )
  return logIdList
}
function requestCourse(resourceId, authorization) {
  return axios.get(
    config.url + 'api/v1/course-study/course-front/info/' + resourceId,
    {
      headers: {
        Authorization: authorization,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
      }
    }
  )
}
function requestLog(id, authorization) {
  return axios.get(
    config.url + 'api/v1/course-study/course-front/start-progress/' + id,
    {
      params: {
        clientType: 0
      },
      headers: {
        Authorization: authorization,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
      }
    }
  )
}

module.exports = handleCourse
