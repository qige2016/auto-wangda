import { get, post } from './http'

const registerUrl = 'api/v1/course-study/course-front/register'

const chapterProgressUrl = 'api/v1/course-study/course-front/chapter-progress'

export const resourceIds = async (courseId: string): Promise<string[]> => {
  const {
    data: { versionId }
  } = await post(registerUrl, { courseId })

  const { data } = await get(chapterProgressUrl, {
    courseId,
    versionId,
    isRegister: false
  })

  const arr: string[] = []

  for (const { courseChapterSections } of data) {
    for (const { sectionType, resourceId } of courseChapterSections) {
      sectionType === 10 && arr.push(resourceId)
    }
  }

  return arr
}
