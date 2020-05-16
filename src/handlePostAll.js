const qs = require('qs')
const aes = require('../utils/aes')
const http = require('../utils/http')
const Schedule = require('./Schedule')
const chalk = require('chalk')

async function handlePostAll(logIds) {
  console.log('  开始学习')
  for (const item of logIds) {
    const data =
      item.sectionType === 6
        ? {
            logId: item.logId,
            lessonLocation: item.timeSecond,
            studyTime: item.timeSecond,
            resourceTotalTime: item.timeSecond,
            organizationId: '1'
          }
        : {
            logId: item.logId,
            lessonLocation: 1
          }
    const schedule = new Schedule({
      timer: 1,
      fn: async () => {
        const res =
          item.sectionType === 6
            ? await requestVideoProgress(qs.stringify(aes.encryptObj(data)))
            : await requestDocProgress(qs.stringify(aes.encryptObj(data)))
        const resData = res.data || {}
        if (resData.finishStatus === 2) {
          console.log(
            '  ' +
              item.name +
              ' -- ' +
              chalk.green('已完成') +
              chalk.green(' ✔')
          )
          schedule.setStop(true)
        } else {
          console.log(
            '  ' + item.name + ' -- ' + chalk.cyan('学习中') + chalk.cyan(' ~')
          )
        }
      }
    })
    schedule.run()
  }
}
function requestVideoProgress(postData) {
  return http.post('api/v1/course-study/course-front/video-progress', postData)
}
function requestDocProgress(postData) {
  return http.post('api/v1/course-study/course-front/doc-progress', postData)
}

module.exports = handlePostAll
