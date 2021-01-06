import { LoginData, getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
import { getLogIds } from './get-logIds'
import { runTask } from './run-task'
import { store } from './store'
import { logger } from './logger'

interface Data {
  loginData: LoginData
  courseId: string
}
export class AutoWangda {
  data: Data

  constructor(data: Data) {
    this.data = Object.assign({}, data)
  }

  async run(): Promise<void> {
    const auth = await getAuth(this.data.loginData)
    store.set('AUTH_TOKEN', auth)
    logger.success('登录成功')

    const resourceIds = await getResourceIds(this.data.courseId)
    logger.success('获取专题信息完成')

    const logIds = await getLogIds(resourceIds)
    logger.success('获取课程信息完成')

    runTask(logIds, 'parallel')
  }
}

const autoWangda = new AutoWangda({
  loginData: {
    captcha: '',
    key: 'no-data',
    loginType: '0',
    password: 'Linda@135',
    passwordType: 'static',
    username: '13608170940'
  },
  courseId: 'fd48b9d5-e92c-47e6-9c3b-a856605678b8'
})

autoWangda.run()
