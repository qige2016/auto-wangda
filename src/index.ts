import { LoginData, getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
import { getCourses } from './get-courses'
import { getSections } from './get-sections'
import { runTask } from './run-task'
import { store } from './store'
import { logger } from './logger'
import originLoginData from '../config/loginData.json'

export class AutoWangda {
  loginData: LoginData
  courseId: string

  constructor(loginData: LoginData, courseId: string) {
    this.loginData = Object.assign(originLoginData, loginData)
    this.courseId = courseId
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
    runTask(sections, 'series')
  }
}

const autoWangda = new AutoWangda(
  {
    password: 'Linda@135',
    username: '13608170940'
  },
  '30890ef8-7b7e-4d3b-bd63-017484a76ad2'
)

autoWangda.run()
