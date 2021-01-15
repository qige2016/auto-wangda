import chalk from 'chalk'

class Logger {
  info(...args: any[]): void {
    console.log(chalk.cyan('info'), ...args)
  }

  tip(...args: any[]): void {
    console.log(chalk.blue('tip'), ...args)
  }

  success(...args: any[]): void {
    console.log(chalk.green('success'), ...args)
  }

  warn(...args: any[]): void {
    console.warn(chalk.yellow('warning'), ...args)
  }

  error(...args: any[]): void {
    console.error(chalk.red('error'), ...args)
  }

  status(...args: any[]): void {
    console.log(...args)
  }
}

export const logger = new Logger()
