import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { url } from '../config/url.json'
import { store } from './store'
import { logger } from './logger'
import { aes } from '../utils/aes'
import { toFinite } from '../utils/toFinite'

const baseConfig: AxiosRequestConfig = {
  timeout: 30000,
  baseURL: url,
  headers: {
    common: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    },
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
}

axios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = store.get('AUTH_TOKEN') || ''
    return config
  },
  (error) => Promise.reject(error)
)

export const get = async (
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      params,
      ...baseConfig,
      ...config
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(error.response.data.message)
        reject(error)
      })
  })
}

export const post = async (
  url: string,
  data?: any,
  encrypt?: boolean,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data: encrypt ? qs.stringify(aes.encryptObj(data)) : qs.stringify(data),
      ...baseConfig,
      ...config
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(error.response.data.message)
        reject(error)
      })
  })
}

export const fetchParallel = async (
  requests: AxiosRequestConfig[],
  chunk_size?: number
): Promise<AxiosResponse[]> => {
  const chunks: any[] = []

  chunk_size = toFinite(chunk_size) || 30

  for (let i = 0; i < requests.length; i += chunk_size) {
    chunks.push(requests.slice(i, i + chunk_size))
  }

  let result: any[] = []

  await series(chunks, (chunk: AxiosRequestConfig[]) => {
    const promises = chunk.map((item: AxiosRequestConfig) => fetch(item))

    return Promise.all(promises).then((res) => {
      result = result.concat(res)
    })
  })

  return result
}

async function fetch(req: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    axios({ ...baseConfig, ...req })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

async function series(items: AxiosRequestConfig[], fn: any) {
  const result: any[] = []

  await items.reduce(
    (acc, item) =>
      acc.then(() => fn(item).then((res: any) => result.push(res))),
    Promise.resolve()
  )

  return result
}
