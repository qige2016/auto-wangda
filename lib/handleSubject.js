const qs = require('qs')
const http = require('../utils/http')

async function handleSubject(subjectId) {
  const res = await requestRegister(qs.stringify({ courseId: subjectId }))
  const params = {
    courseId: subjectId,
    versionId: res.data.versionId,
    isRegister: false
  }
  const response = await requestChapter(params)
  const resourceIdList = response.data[0].courseChapterSections.map(
    item => item.resourceId
  )
  return resourceIdList
}
function requestRegister(postData) {
  return http.post('api/v1/course-study/course-front/register', postData)
}
function requestChapter(params) {
  return http.get('api/v1/course-study/course-front/chapter-progress', params)
}

module.exports = handleSubject
