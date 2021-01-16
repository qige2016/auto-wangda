import Enquirer from 'enquirer'

export const prompt = async (): Promise<{ [key: string]: any }> => {
  const enquirer = new Enquirer()
  const answers = await enquirer.prompt([
    {
      type: 'input',
      message: '请输入手机号码/员工编号',
      name: 'username'
    },
    {
      type: 'password',
      message: '请输入登录密码',
      name: 'password'
    },
    {
      type: 'input',
      message:
        '请输入专题ID，e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx',
      name: 'subjectId'
    }
  ])
  return answers
}
