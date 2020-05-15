const qs = require('qs')
const http = require('../utils/http')

async function handleSubject(subjectId, authorization) {
  const res = await requestRegister(
    qs.stringify({ courseId: subjectId }),
    authorization
  )
  const params = {
    courseId: subjectId,
    versionId: res.data.versionId,
    isRegister: false
  }
  const response = await requestChapter(params, authorization)
  const resourceIdList = response.data[0].courseChapterSections.map(
    item => item.resourceId
  )
  return resourceIdList
}
function requestRegister(postData, authorization) {
  return http.post('api/v1/course-study/course-front/register', postData, {
    headers: {
      Authorization: authorization
    }
  })
}
function requestChapter(params, authorization) {
  return http.get('api/v1/course-study/course-front/chapter-progress', params, {
    headers: {
      Authorization: authorization
    }
  })
}

module.exports = handleSubject
