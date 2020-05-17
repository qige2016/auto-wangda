const http = require('../utils/http')

async function handleCourse(resourceId) {
  const res = await requestCourse(resourceId)
  const courseChapters = res.data.courseChapters
  let idList = []
  for (const item of courseChapters) {
    const courseChapterSections = item.courseChapterSections
    for (const i of courseChapterSections) {
      idList.push({
        id: i.id,
        name: i.name,
        timeSecond: i.timeSecond
      })
    }
  }
  const logIdList = await Promise.all(
    idList.map(async item => {
      const params = {
        clientType: 0
      }
      const response = await requestLog(item.id, params)
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
function requestCourse(resourceId) {
  return http.get('api/v1/course-study/course-front/info/' + resourceId)
}
function requestLog(id, params) {
  return http.get(
    'api/v1/course-study/course-front/start-progress/' + id,
    params
  )
}

module.exports = handleCourse
