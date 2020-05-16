const schedule = require('node-schedule')

// 定时任务
class Schedule {
  constructor({ timer, fn }) {
    this.timer = timer // 每几分钟执行, 前端源码为1分钟轮询1次
    this.fn = fn //执行的回调
    this.stop = false
  }

  getStop() {
    return this.stop
  }
  setStop(ifStop) {
    this.stop = ifStop
  }

  run() {
    const job = schedule.scheduleJob(`*/${this.timer} * * * *`, () => {
      if (!this.getStop()) {
        this.fn()
      } else {
        job.cancel()
      }
    })
  }
}

module.exports = Schedule
