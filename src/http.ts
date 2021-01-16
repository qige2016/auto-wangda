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
  config: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      ...baseConfig,
      ...config
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(
          error.response?.data?.message || `Failed to get ${config.url}`
        )
        reject(error)
      })
  })
}

export const post = async (
  config: AxiosRequestConfig,
  encrypt?: boolean
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      ...baseConfig,
      ...config,
      data: encrypt
        ? qs.stringify(aes.encryptObj(config.data))
        : qs.stringify(config.data)
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(
          error.response?.data?.message || `Failed to post ${config.url}`
        )
        reject(error)
      })
  })
}

export const fetchParallel = async (
  requests: AxiosRequestConfig[],
  chunk_size?: number,
  encrypt?: boolean
): Promise<AxiosResponse[]> => {
  const chunks: any[] = []

  chunk_size = toFinite(chunk_size) || 10

  for (let i = 0; i < requests.length; i += chunk_size) {
    chunks.push(requests.slice(i, i + chunk_size))
  }

  let result: any[] = []

  await series(chunks, (chunk: AxiosRequestConfig[]) => {
    const promises = chunk.map((item: AxiosRequestConfig) =>
      fetch(item, encrypt)
    )

    return Promise.all(promises).then((res) => {
      result = result.concat(res)
    })
  })

  return result
}

async function fetch(req: AxiosRequestConfig, encrypt?: boolean) {
  return new Promise((resolve, reject) => {
    axios({
      ...baseConfig,
      ...req,
      data: encrypt
        ? qs.stringify(aes.encryptObj(req.data))
        : qs.stringify(req.data)
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        logger.error(
          err.response?.data?.message || `Failed to fetch ${req.url}`
        )
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
