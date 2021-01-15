import { groupBy } from 'lodash'
import { AxiosRequestConfig } from 'axios'
import { scheduleJob } from 'node-schedule'
import { fetchParallel } from './http'
import { Section } from '../types/couse'
import { logger } from './logger'

type Type = 'series' | 'parallel'

interface Incomplete {
  incompleteProgress: { [key: string]: string | number }[]
  incompleteSections: { [key: string]: string | number }[]
}

const courseProgressUrl = 'api/v1/course-study/course-front/course-progress'

const videoProgressUrl = 'api/v1/course-study/course-front/video-progress'

const docProgressUrl = 'api/v1/course-study/course-front/doc-progress'

async function getIncomplete(sections: Section[]): Promise<Incomplete> {
  const chunks: { [key: string]: string | number }[][] = Object.values(
    groupBy(sections, 'chunk_num')
  )
  const configs: AxiosRequestConfig[] = []
  for (const chunk of chunks) {
    const ids = chunk.map((item) => item.referenceId).join(',')
    configs.push({
      method: 'POST',
      url: courseProgressUrl,
      data: { ids }
    })
  }
  const progressResponses = await fetchParallel(configs)

  const incompleteProgress: { [key: string]: string | number }[] = []
  const incompleteSections: { [key: string]: string | number }[] = []
  for (let i = 0; i < progressResponses.length; i++) {
    const data = progressResponses[i].data.flat()
    const section = sections[i]
    for (const item of data) {
      if (item.finishStatus === 1) {
        incompleteProgress.push(item)
        incompleteSections.push(section)
      }
    }
  }

  return {
    incompleteProgress,
    incompleteSections
  }
}

function getIncompleteRequests(
  incompleteProgress: { [key: string]: string | number }[],
  sections: Section[]
): AxiosRequestConfig[] {
  const requests: AxiosRequestConfig[] = []
  for (let i = 0; i < incompleteProgress.length; i++) {
    const section = sections[i]
    requests.push(
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
  }
  return requests
}

async function postProgress(
  incompleteRequests: AxiosRequestConfig[],
  incompleteSections: Section[],
  chunk_size?: number
): Promise<void> {
  const progressResponses = await fetchParallel(incompleteRequests, chunk_size)
  for (let i = 0; i < progressResponses.length; i++) {
    // data may be null when post doc-progress
    const data = progressResponses[i].data
    const incompleteSection = incompleteSections[i]
    const percentage =
      data?.studyTotalTime / (incompleteSection.timeSecond as number)
    isFinite(percentage)
      ? logger.status(
          `${Math.floor(percentage * 100)}%`,
          incompleteSection.name
        )
      : logger.status(incompleteSection.name)
  }
}

export const runParallel = async (
  sections: Section[],
  chunk_size?: number
): Promise<void> => {
  let { incompleteProgress, incompleteSections } = await getIncomplete(sections)
  if (incompleteProgress.length === 0) {
    logger.success(`Completed`)
    return
  }

  let incompleteRequests = getIncompleteRequests(
    incompleteProgress,
    incompleteSections
  )
  await postProgress(incompleteRequests, incompleteSections, chunk_size)
  const incomplete = await getIncomplete(sections)
  incompleteProgress = incomplete.incompleteProgress
  incompleteSections = incomplete.incompleteSections

  const job = scheduleJob('0 */1 * * * ?', async () => {
    if (incompleteProgress.length === 0) {
      logger.success(`Completed`)
      job.cancel()
      return
    }

    incompleteRequests = getIncompleteRequests(
      incompleteProgress,
      incompleteSections
    )
    try {
      logger.status()
      await postProgress(incompleteRequests, incompleteSections, chunk_size)
    } catch {
      job.cancel()
    }
    const incomplete = await getIncomplete(sections)
    incompleteProgress = incomplete.incompleteProgress
    incompleteSections = incomplete.incompleteSections
  })
}

export const runTask = (sections: Section[], type: Type): void => {
  logger.info('Starting...')
  if (type === 'parallel') {
    runParallel(sections)
  }
}
