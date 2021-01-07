import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { url } from '../config/url.json'
import { store } from './store'
import { logger } from './logger'
import { aes } from '../utils/aes'

const instance = axios.create({
  timeout: 30000,
  baseURL: url
})

instance.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'

instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

instance.interceptors.request.use(
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
    instance({
      method: 'get',
      url,
      params,
      ...config
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(error.response)
        return reject(error)
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
    instance({
      method: 'post',
      url,
      data: encrypt ? qs.stringify(aes.encryptObj(data)) : qs.stringify(data),
      ...config
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        logger.error(error.response)
        return reject(error)
      })
  })
}
