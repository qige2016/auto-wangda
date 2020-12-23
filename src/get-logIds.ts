import { get, post } from './http'

const registerStudyUrl = 'api/v1/course-study/course-front/registerStudy'

const courseInfoUrl = 'api/v1/course-study/course-front/info/'

const startProgressUrl = 'api/v1/course-study/course-front/start-progress/'

export const getLogIds = async (
  resourceId: string[]
): Promise<{ [key: string]: string | number }[]> => {
  await post(registerStudyUrl, { courseId: resourceId, type: 6 })

  const {
    data: { courseChapters }
  } = await get(courseInfoUrl + resourceId)

  const arr: { [key: string]: string | number }[] = []

  for (const { courseChapterSections } of courseChapters) {
    for (const { id, name, sectionType, timeSecond } of courseChapterSections) {
      const { data } = await get(startProgressUrl + id, { clientType: 0 })

      arr.push({ logId: data.id, name, sectionType, timeSecond })
    }
  }

  return arr
}
