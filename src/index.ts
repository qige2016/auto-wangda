import { getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
import { getCourses } from './get-courses'
import { getSections } from './get-sections'
import { runTask } from './run-task'
import { store } from './store'
import { logger } from './logger'
import { LoginData, Type } from '../types/common'
import originLoginData from '../config/loginData.json'

export class AutoWangda {
  loginData: LoginData
  courseId: string
  type: Type
  chunk_size?: number

  constructor(
    loginData: LoginData,
    courseId: string,
    type: Type,
    chunk_size?: number
  ) {
    this.loginData = Object.assign(originLoginData, loginData)
    this.courseId = courseId
    this.type = type
    this.chunk_size = chunk_size
  }

  async run(): Promise<void> {
    const auth = await getAuth(this.loginData)
    store.set('AUTH_TOKEN', auth)
    logger.success('Logined')

    const resourceIds = await getResourceIds(this.courseId)
    logger.success('Got Resources')

    const courses = await getCourses(resourceIds)
    logger.success('Got Courses')

    const sections = await getSections(courses)
    logger.success('Got Sections')

    logger.info('Starting...')
    runTask(sections, this.type, this.chunk_size)
  }
}
