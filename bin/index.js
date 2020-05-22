#!/usr/bin/env node

const inquirer = require('inquirer')
const loginForm = require('../config/loginForm')
const AutoWangda = require('../lib')
const store = require('../utils/store')

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
  },
  {
    type: 'list',
    message: '请选择一种方式:',
    name: 'pattern',
    choices: [
      {
        name: '计时: 默认1分钟请求1次，计时生效还需从专题点击进入课程',
        value: 'time'
      },
      {
        name: '完成: 默认即刻完成',
        value: 'finish'
      }
    ]
  }
]
inquirer
  .prompt(promptList)
  .then(({ username, password, subjectId, pattern }) => {
    store.set('pattern', pattern)
    const data = Object.assign({ username, password }, loginForm)
    const autoWangda = new AutoWangda({ data, subjectId })
    autoWangda.run()
  })
