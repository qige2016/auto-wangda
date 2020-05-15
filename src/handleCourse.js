const axios = require('axios')
const http = require('../utils/http')

async function handleCourse(resourceId, authorization) {
  const res = await requestCourse(resourceId, authorization)
  const idList = res.data.courseChapters[0].courseChapterSections.map(item => ({
    id: item.id,
    name: item.name,
    timeSecond: item.timeSecond
  }))
  const logIdList = await Promise.all(
    idList.map(async item => {
      const params = {
        clientType: 0
      }
      const response = await requestLog(item.id, params, authorization)
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
  return http.get(
    'api/v1/course-study/course-front/info/' + resourceId,
    {},
    {
      headers: {
        Authorization: authorization
      }
    }
  )
}
function requestLog(id, params, authorization) {
  return http.get(
    'api/v1/course-study/course-front/start-progress/' + id,
    params,
    {
      headers: {
        Authorization: authorization
      }
    }
  )
}

module.exports = handleCourse
