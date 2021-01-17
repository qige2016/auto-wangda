import { cac } from 'cac'
import { prompt } from 'enquirer'
import { AutoWangda } from '.'

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
    if (!username) {
      const { u } = (await prompt({
        type: 'input',
        message: '请输入手机号码/员工编号',
        name: 'username'
      })) as { u: string }
      username = u
    }
    if (!password) {
      const { p } = (await prompt({
        type: 'password',
        message: '请输入登录密码',
        name: 'password'
      })) as { p: string }
      password = p
    }
    if (!subjectId) {
      const { s } = (await prompt({
        type: 'input',
        message:
          '请输入专题ID，e.g. `xxx-xxx-xxx-xxx` in #/study/subject/detail/xxx-xxx-xxx-xxx',
        name: 'subjectId'
      })) as { s: string }
      subjectId = s
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
