import { LoginData, getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
import { getLogIds } from './get-logIds'
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
    logger.success('登录成功')

    const resourceIds = await getResourceIds(this.courseId)
    logger.success('获取专题信息完成')

    const logIds = await getLogIds(resourceIds)
    logger.success('获取课程信息完成')

    runTask(logIds, 'parallel')
  }
}

const autoWangda = new AutoWangda(
  {
    password: 'Linda@135',
    username: '13608170940'
  },
  '73d293a6-465c-4560-ad1d-c0837b384218'
)

autoWangda.run()
