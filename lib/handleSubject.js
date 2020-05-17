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
  const resData = response.data
  let resourceIdList = []
  for (const item of resData) {
    const courseChapterSections = item.courseChapterSections
    for (const i of courseChapterSections) {
      if (i.sectionType === 10) {
        resourceIdList.push(i.resourceId)
      }
    }
  }
  return resourceIdList
}
function requestRegister(postData) {
  return http.post('api/v1/course-study/course-front/register', postData)
}
function requestChapter(params) {
  return http.get('api/v1/course-study/course-front/chapter-progress', params)
}

module.exports = handleSubject
