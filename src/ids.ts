import { get, post } from './http'

const registerStudyUrl = 'api/v1/course-study/course-front/registerStudy'

const courseInfoUrl = 'api/v1/course-study/course-front/info/'

export const ids = async (
  resourceId: string
): Promise<{ [key: string]: string | number }[]> => {
  await post(registerStudyUrl, { courseId: resourceId, type: 6 })

  const {
    data: { courseChapters }
  } = await get(courseInfoUrl + resourceId)

  const arr: { [key: string]: string | number }[] = []

  for (const { courseChapterSections } of courseChapters) {
    for (const { id, name, sectionType, timeSecond } of courseChapterSections) {
      arr.push({ id, name, sectionType, timeSecond })
    }
  }

  return arr
}
