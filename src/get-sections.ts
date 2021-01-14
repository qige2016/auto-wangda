import { AxiosRequestConfig } from 'axios'
import { fetchParallel } from './http'
import { Section, Course } from '../types/couse'

const startProgressUrl = 'api/v1/course-study/course-front/start-progress/'

export const getSections = async (courses: Course[]): Promise<Section[]> => {
  // get sections of courses
  const arr: Section[] = []
  const requests: AxiosRequestConfig[] = []
  for (const [index, { courseChapters }] of courses.entries()) {
    for (const { courseChapterSections } of courseChapters) {
      for (const {
        id,
        referenceId,
        name,
        sectionType,
        timeSecond
      } of courseChapterSections) {
        requests.push({
          method: 'GET',
          url: startProgressUrl + id,
          params: { clientType: 0 }
        })
        arr.push({
          referenceId,
          name,
          sectionType,
          timeSecond,
          chunk_num: index
        })
      }
    }
  }
  const responses = await fetchParallel(requests)
  for (let i = 0; i < responses.length; i++) {
    arr[i].logId = responses[i].data.id
  }
  return arr
}
