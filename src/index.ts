import { LoginData, getAuth } from './get-auth'
import { getResourceIds } from './get-resourceIds'
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
  }
}
