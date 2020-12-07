import { join } from 'path'
import envPaths from 'env-paths'
import dotProp from 'dot-prop'
import { writeFileSync, readFileSync, mkdirSync } from 'fs'

const configDir = envPaths('autoWangda').config
const storePath = join(configDir, 'config.json')

try {
  mkdirSync(configDir, { recursive: true })
} catch (error) {
  console.error(error)
}

class Store {
  data: { [k: string]: any }

  constructor() {
    this.data = this.read()
  }

  read(): { [k: string]: any } {
    try {
      return JSON.parse(readFileSync(storePath, 'utf8'))
    } catch (_) {
      return {}
    }
  }

  set(key: string, value: any): void {
    dotProp.set(this.data, key, value)
    writeFileSync(storePath, JSON.stringify(this.data), 'utf8')
  }

  get(key: string): any {
    return dotProp.get(this.data, key)
  }
}

export const store = new Store()
