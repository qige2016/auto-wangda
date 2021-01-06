import { scheduleJob } from 'node-schedule'
import { post } from './http'
import { logger } from './logger'

type LogId = { [key: string]: string | number }

type Type = 'series' | 'parallel'

const videoProgressUrl = 'api/v1/course-study/course-front/video-progress'

const docProgressUrl = 'api/v1/course-study/course-front/doc-progress'

export const runParallel = (logIds: LogId[]): void => {
  logIds.map((logId) => {
    const job = scheduleJob('0 */1 * * * ?', async () => {
      const { data } =
        logId.sectionType === 6
          ? await post(
              videoProgressUrl,
              {
                logId: logId.logId,
                lessonLocation: logId.timeSecond,
                studyTime: logId.timeSecond,
                resourceTotalTime: logId.timeSecond,
                organizationId: '1'
              },
              true
            )
          : await post(
              docProgressUrl,
              { logId: logId.logId, lessonLocation: 1 },
              true
            )
      data.studyTotalTime >= logId.timeSecond || data.finishStatus === 2
        ? (logger.success(logId.name + '已完成'), job.cancel())
        : logger.info(logId.name + '学习中')
    })
  })
}

export const runTask = (logIds: LogId[], type: Type): void => {
  logger.info('开始学习')
  if (type === 'parallel') {
    runParallel(logIds)
  }
}
