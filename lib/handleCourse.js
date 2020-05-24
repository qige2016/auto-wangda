const qs = require('qs')
const http = require('../utils/http')

async function handleCourse(resourceId) {
  await requestRegister(qs.stringify({ courseId: resourceId, type: 6 }))
  const res = await requestCourse(resourceId)
  const courseChapters = res.data.courseChapters
  let idList = []
  for (const item of courseChapters) {
    const courseChapterSections = item.courseChapterSections
    for (const i of courseChapterSections) {
      idList.push({
        id: i.id,
        name: i.name,
        sectionType: i.sectionType,
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
        sectionType: item.sectionType,
        timeSecond: item.timeSecond
      }
    })
  )
  return logIdList
}
function requestRegister(postData) {
  return http.post('api/v1/course-study/course-front/registerStudy', postData)
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
