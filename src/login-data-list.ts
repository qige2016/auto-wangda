import { existsSync, readFileSync, writeFileSync } from 'fs'
import { LoginData } from '../types/common'
import { LOGIN_DATA_PATH } from './paths'
import { groupBy } from '../utils/groupBy'

class LoginDataList {
  store: LoginData[]

  constructor() {
    this.store = []
    if (existsSync(LOGIN_DATA_PATH)) {
      this.store = JSON.parse(readFileSync(LOGIN_DATA_PATH, 'utf8'))
    }
  }

  add(loginData: LoginData): void {
    let exist = false
    for (const item of this.store) {
      if (
        item.username === loginData.username &&
        item.password === loginData.password
      ) {
        exist = true
      }
    }
    if (!exist) {
      this.store.push(loginData)
    }

    const newContent = JSON.stringify(this.store)
    writeFileSync(LOGIN_DATA_PATH, newContent, 'utf8')
  }

  get groupedLoginDatas(): { [key: string]: LoginData[] } {
    const loginDatasMap = groupBy(this.store, 'username')
    return loginDatasMap
  }
}

export const loginDataList = new LoginDataList()
