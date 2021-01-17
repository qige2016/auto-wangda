import os from 'os'
import path from 'path'
import { mkdirSync } from 'fs'

export const ROOT_CACHE_PATH = path.join(os.homedir(), '.autoWangda')

export const LOGIN_DATA_PATH = path.join(ROOT_CACHE_PATH, 'login-data.json')

mkdirSync(ROOT_CACHE_PATH, { recursive: true })
