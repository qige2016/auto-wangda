import { get, post } from './http'
import { Course } from '../types/couse'

const registerStudyUrl = 'api/v1/course-study/course-front/registerStudy'

const courseInfoUrl = 'api/v1/course-study/course-front/info/'

export const getCourses = async (resourceIds: string[]): Promise<Course[]> => {
  const arr: Course[] = []
  // get courses of resources
  for (const resourceId of resourceIds) {
    await post({
      url: registerStudyUrl,
      data: { courseId: resourceId, type: 6 }
    })
    const {
      data: { courseChapters }
    } = await get({ url: courseInfoUrl + resourceId })

    arr.push({ courseChapters })
  }
  return arr
}
