import { get, post } from './http'
import originLoginData from '../config/login-data.json'

const generateSignUrl = 'api/v1/system/sign/generate'

const dynamicPasswordSignUrl = 'oauth/api/v1/dynamic-password-sign'

export const getDynamicPassword = async (username: string): Promise<void> => {
  const {
    data: { sign }
  } = await get({
    url: generateSignUrl,
    params: {
      prefix: 'oauth-login'
    }
  })
  await post({
    url: dynamicPasswordSignUrl,
    data: {
      key: originLoginData.key,
      username,
      sign
    }
  })
}
