import { AxiosRequestConfig } from 'axios'
import { fetchParallel } from './http'
import { Course } from '../types/couse'

const registerStudyUrl = 'api/v1/course-study/course-front/registerStudy'

const courseInfoUrl = 'api/v1/course-study/course-front/info/'

export const getCourses = async (resourceIds: string[]): Promise<Course[]> => {
  // get courses of resources
  const postRequests: AxiosRequestConfig[] = []
  const getRequests: AxiosRequestConfig[] = []
  for (const resourceId of resourceIds) {
    postRequests.push({
      method: 'POST',
      url: registerStudyUrl,
      data: { courseId: resourceId, type: 6 }
    })
    getRequests.push({
      method: 'GET',
      url: courseInfoUrl + resourceId
    })
  }
  await fetchParallel(postRequests)
  const responses = await fetchParallel(getRequests)
  const arr = responses.map((response) => ({
    courseChapters: response.data.courseChapters
  }))
  return arr
}
