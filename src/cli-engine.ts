import { cac } from 'cac'

const cli = cac()

cli.help()
cli.version(require('../package.json').version)
cli.parse()
