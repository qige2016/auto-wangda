const axios = require('axios')
const config = require('../config')
const store = require('./store')

const instance = axios.create({
  timeout: 30000,
  baseURL: config.url
})
instance.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = store.get('AUTH_TOKEN') || ''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/* 统一封装get请求 */
const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.log(error.response)
        reject(error)
      })
  })
}

/* 统一封装post请求  */
const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.log(error.response)
        reject(error)
      })
  })
}

module.exports = { get, post }
