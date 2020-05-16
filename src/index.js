const config = require('../config')
const data = require('../config/loginForm')
const AutoWangda = require('./AutoWangda')

const subjectId = config.subjectId
const autoWangda = new AutoWangda({ data, subjectId })
autoWangda.run()
