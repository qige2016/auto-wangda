import { cac } from 'cac'
import { prompt } from './prompt'
import { AutoWangda } from '.'

const cli = cac('autoWangda')

cli
  .command('', 'Parallel request')
  .alias('parallel')
  .option(
    '-l <chunk_size>, -limit <chunk_size>',
    'The maximum number of async operations at a time'
  )
  .action(async (chunk_size) => {
    const { username, password, subjectId } = await prompt()
    const autoWangda = new AutoWangda(
      {
        username,
        password
      },
      subjectId,
      'parallel',
      chunk_size
    )
    autoWangda.run()
    return
  })

cli
  .command('series', 'Serial request means request one by one in order')
  .action(async () => {
    const { username, password, subjectId } = await prompt()
    const autoWangda = new AutoWangda(
      {
        username,
        password
      },
      subjectId,
      'series'
    )
    autoWangda.run()
    return
  })

cli.help()
cli.version(require('../../package.json').version)
cli.parse()
