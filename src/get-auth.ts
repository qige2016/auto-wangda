import { post } from './http'
import { LoginData } from '../types/common'

const membersEncryptUrl = 'oauth/api/v1/members-encrypt'

const authUrl = 'oauth/api/v1/auth'

export const getAuth = async (loginData: LoginData): Promise<string> => {
  const {
    data: {
      check_token,
      members: [{ id }]
    }
  } = await post({ url: membersEncryptUrl, data: loginData }, true)
  const {
    data: { token_type, access_token }
  } = await post({
    url: authUrl,
    data: {
      check_token,
      key: loginData.key,
      userid: id
    }
  })
  return token_type + '__' + access_token
}
