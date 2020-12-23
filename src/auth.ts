import { post } from './http'

interface LoginData {
  captcha: string
  key: string
  password: string
  loginType: string
  passwordType: string
  username: string
}

const membersEncryptUrl = 'oauth/api/v1/members-encrypt'

const authUrl = 'oauth/api/v1/auth'

export const auth = async (loginData: LoginData): Promise<string> => {
  const {
    data: {
      check_token,
      members: [{ id }]
    }
  } = await post(membersEncryptUrl, loginData)

  const {
    data: { token_type, access_token }
  } = await post(
    authUrl,
    {
      check_token,
      key: loginData.key,
      userid: id
    },
    false
  )

  return token_type + '__' + access_token
}
