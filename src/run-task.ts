import { groupBy, isDate } from 'lodash'
import { AxiosRequestConfig } from 'axios'
import { scheduleJob } from 'node-schedule'
import { post, fetchParallel } from './http'
import { Section } from '../types/couse'
import { logger } from './logger'

type Type = 'series' | 'parallel'

const courseProgressUrl = 'api/v1/course-study/course-front/course-progress'

const videoProgressUrl = 'api/v1/course-study/course-front/video-progress'

const docProgressUrl = 'api/v1/course-study/course-front/doc-progress'

export const runParallel = async (sections: Section[]): Promise<void> => {
  const chunks = Object.values(groupBy(sections, 'chunk_num'))
  const configs: AxiosRequestConfig[] = []
  for (const chunk of chunks) {
    const ids = chunk.map((item) => item.referenceId).join(',')
    configs.push({
      method: 'POST',
      url: courseProgressUrl,
      data: { ids }
    })
  }
  const courseProgressResponses = await fetchParallel(configs)

  const reqs: AxiosRequestConfig[] = sections.map((section) =>
    section.sectionType === 6
      ? {
          method: 'POST',
          url: videoProgressUrl,
          data: {
            logId: section.logId,
            lessonLocation: section.timeSecond,
            studyTime: section.timeSecond,
            resourceTotalTime: section.timeSecond,
            organizationId: '1'
          }
        }
      : {
          method: 'POST',
          url: docProgressUrl,
          data: {
            logId: section.logId,
            lessonLocation: 1
          }
        }
  )
  const cachedResponses = await fetchParallel(reqs, 30)

  const job = scheduleJob('0 */1 * * * ?', async () => {
    cachedResponses.length === 0 && job.cancel()
    const requests: AxiosRequestConfig[] = []
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      // data may be null when post docProgress
      const { data } = cachedResponses[i]
      if (section.sectionType === 6) {
        data?.studyTotalTime < section.timeSecond &&
          (requests[i] = {
            method: 'POST',
            url: videoProgressUrl,
            data: {
              logId: section.logId,
              lessonLocation: section.timeSecond,
              studyTime: section.timeSecond,
              resourceTotalTime: section.timeSecond,
              organizationId: '1'
            }
          })
      } else {
        data?.finishStatus !== 2 &&
          (requests[i] = {
            method: 'POST',
            url: docProgressUrl,
            data: {
              logId: section.logId,
              lessonLocation: 1
            }
          })
      }
    }
    const responses = await fetchParallel(requests, 30)
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const { data } = responses[i] || {}
      cachedResponses[i] = data
      section.sectionType === 6
        ? data?.studyTotalTime >= section.timeSecond
          ? console.log(`${section.name} complete`)
          : console.log(`${section.name} ing`)
        : data?.finishStatus === 2
        ? console.log(`${section.name} complete`)
        : console.log(`${section.name} ing`)
    }
  })
}

export const runTask = (sections: Section[], type: Type): void => {
  logger.info('开始学习')
  if (type === 'parallel') {
    runParallel(sections)
  }
}
