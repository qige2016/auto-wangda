import ProgressBar from 'progress'
import { scheduleJob } from 'node-schedule'
import { logger } from './logger'
import { fetchParallel } from '../src/http'

type LogId = { [key: string]: string | number }

type Type = 'series' | 'parallel'

const videoProgressUrl = 'api/v1/course-study/course-front/video-progress'

const docProgressUrl = 'api/v1/course-study/course-front/doc-progress'

export const runParallel = (logIds: LogId[]): void => {
  const job = scheduleJob('0 */1 * * * ?', async () => {
    const requests = logIds.map((logId) =>
      logId.sectionType === 6
        ? {
            method: 'POST' as const,
            url: videoProgressUrl,
            data: {
              logId: logId.logId,
              lessonLocation: logId.timeSecond,
              studyTime: logId.timeSecond,
              resourceTotalTime: logId.timeSecond,
              organizationId: '1'
            }
          }
        : {
            method: 'POST' as const,
            url: docProgressUrl,
            data: {
              logId: logId.logId,
              lessonLocation: 1
            }
          }
    )
    const responses = await fetchParallel(requests, 30)
    for (let i = 0; i < logIds.length; i++) {
      const logId = logIds[i]
      const { data } = responses[i]
      const bar = new ProgressBar(`${logId.name} :percent`, {
        total: logId.timeSecond as number
      })
      logId.sectionType === 6
        ? bar.complete
          ? bar.terminate()
          : bar.tick(data.studyTotalTime)
        : data.finishStatus === 2
        ? console.log(`${logId.name} complete`)
        : console.log(`${logId.name} ing`)
    }
  })
}

export const runTask = (logIds: LogId[], type: Type): void => {
  logger.info('开始学习')
  if (type === 'parallel') {
    runParallel(logIds)
  }
}
