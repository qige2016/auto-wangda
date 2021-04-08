import { cac } from 'cac'
import { prompt } from 'enquirer'
import { AutoWangda } from '.'
import { loginDataList } from './login-data-list'
import { getDynamicPassword } from './get-dynamicPassword'

const cli = cac('autoWangda')

interface CLIOptions {
  '--'?: string[]
  username?: string
  password?: string
  subjectId?: string
  series?: boolean
  s?: boolean
  limit?: number
}

cli
  .command('')
  .alias('parallel')
  .option('--username <username>', 'Username')
  .option('--password <password>', 'Password')
  .option(
    '--subjectId <subjectId>',
    'Subject ID, e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx'
  )
  .option('-s, --series', 'Serial request means request one by one in order')
  .option('--limit <limit>', 'The maximum number of async operations at a time')
  .action(async (options: CLIOptions) => {
    let { username, password, subjectId } = options
    const { series, limit } = options
    if (!username || !password) {
      const loginDatasMap = loginDataList.groupedLoginDatas
      if (JSON.stringify(loginDatasMap) !== '{}') {
        const { _u } = (await prompt({
          name: '_u',
          type: 'select',
          message: '请选择登录模板',
          choices: [...Object.keys(loginDatasMap), '']
        })) as { _u: string }
        username = _u
      }
    }
    if (!username) {
      const { u } = (await prompt({
        name: 'u',
        type: 'input',
        message: '请输入手机号码/员工编号',
        validate: (v) => /\S+/.test(v)
      })) as { u: string }
      username = u.trim()
    }
    if (!password) {
      getDynamicPassword(username)
      const { p } = (await prompt({
        name: 'p',
        type: 'password',
        message: '请输入验证码',
        validate: (v) => /\S+/.test(v)
      })) as { p: string }
      password = p.trim()
    }
    if (!subjectId) {
      const { s } = (await prompt({
        name: 's',
        type: 'input',
        message:
          '请输入专题ID，e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx',
        validate: (v) => /\S+/.test(v)
      })) as { s: string }
      subjectId = s.trim()
    }
    const autoWangda = new AutoWangda(
      {
        username,
        password
      },
      subjectId,
      series ? 'series' : 'parallel',
      limit
    )
    autoWangda.run()
    return
  })

cli.help()
cli.version(require('../../package.json').version)
cli.parse()
