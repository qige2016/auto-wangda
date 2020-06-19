#!/usr/bin/env node

const cac = require('cac')
const { version } = require('../package')
const inquirer = require('inquirer')
const loginForm = require('../config/loginForm')
const AutoWangda = require('../lib')

const cli = cac('auto-wangda')

const promptList = [
  {
    type: 'input',
    message: '请输入手机号码/员工编号:',
    name: 'username'
  },
  {
    type: 'password',
    message: '请输入登录密码:',
    name: 'password'
  },
  {
    type: 'input',
    message: '请输入专题ID:',
    name: 'subjectId'
  }
]

cli.command('').action(() => {
  inquirer.prompt(promptList).then(({ username, password, subjectId }) => {
    const data = Object.assign({ username, password }, loginForm)
    const autoWangda = new AutoWangda({ data, subjectId })
    autoWangda.run()
  })
})

cli.version(version)
cli.help()

cli.parse()
