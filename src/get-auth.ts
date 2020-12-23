import { post } from './http'

export interface LoginData {
  captcha: string
  key: string
  password: string
  loginType: string
  passwordType: string
  username: string
}

const membersEncryptUrl = 'oauth/api/v1/members-encrypt'

const authUrl = 'oauth/api/v1/auth'

export const getAuth = async (loginData: LoginData): Promise<string> => {
  const {
    data: {
      check_token,
      members: [{ id }]
    }
  } = await post(membersEncryptUrl, loginData, true)

  const {
    data: { token_type, access_token }
  } = await post(authUrl, {
    check_token,
    key: loginData.key,
    userid: id
  })

  return token_type + '__' + access_token
}
