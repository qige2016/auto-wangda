const qs = require('qs')
const aes = require('../utils/aes')
const http = require('../utils/http')
const Schedule = require('./Schedule')

async function handlePostAll(logIds) {
  console.log('开始学习')
  for (const item of logIds) {
    const data = {
      logId: item.logId,
      lessonLocation: item.timeSecond,
      studyTime: item.timeSecond,
      resourceTotalTime: item.timeSecond,
      organizationId: '1'
    }
    const schedule = new Schedule({
      timer: 1,
      fn: async () => {
        const res = await requestVideoProgress(
          qs.stringify(aes.encryptObj(data))
        )
        const resData = res.data || {}
        if (resData.finishStatus === 2) {
          console.log(item.name + '已完成')
          schedule.setStop(true)
        } else {
          console.log(item.name + '学习中')
        }
      }
    })
    schedule.run()
  }
}
function requestVideoProgress(postData) {
  return http.post('api/v1/course-study/course-front/video-progress', postData)
}

module.exports = handlePostAll
