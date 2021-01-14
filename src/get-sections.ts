import { get } from './http'
import { Section, Course } from '../types/couse'

const startProgressUrl = 'api/v1/course-study/course-front/start-progress/'

export const getSections = async (courses: Course[]): Promise<Section[]> => {
  const arr: Section[] = []
  // get sections of courses
  for (const { courseChapters } of courses) {
    for (const { courseChapterSections } of courseChapters) {
      for (const {
        id,
        name,
        sectionType,
        timeSecond
      } of courseChapterSections) {
        const { data } = await get({
          url: startProgressUrl + id,
          params: { clientType: 0 }
        })
        arr.push({ id: id, logId: data.id, name, sectionType, timeSecond })
      }
    }
  }

  return arr
}
