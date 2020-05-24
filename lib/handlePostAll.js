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
        item.sectionType === 6
          ? outputResult(
              resData.studyTotalTime >= item.timeSecond,
              item.name,
              schedule
            )
          : outputResult(resData.finishStatus === 2, item.name, schedule)
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
function outputResult(condition, name, schedule) {
  if (condition) {
    console.log(
      '  ' + name + ' -- ' + chalk.green('已完成') + chalk.green(' ✔')
    )
    schedule.setStop(true)
  } else {
    console.log('  ' + name + ' -- ' + chalk.cyan('学习中') + chalk.cyan(' ~'))
  }
}

module.exports = handlePostAll
