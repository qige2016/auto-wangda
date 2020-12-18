import schedule from 'node-schedule'

interface ScheduleConfig {
  cron: string
  fn: () => void
}

export class Schedule {
  config: ScheduleConfig
  stop: boolean

  constructor(config: ScheduleConfig) {
    this.config = Object.assign({}, config)
    this.stop = false
  }

  getStop(): boolean {
    return this.stop
  }

  setStop(stop: boolean): void {
    this.stop = stop
  }

  run(): void {
    const job = schedule.scheduleJob(this.config.cron, () => {
      if (!this.getStop()) {
        this.config.fn()
      } else {
        job.cancel()
      }
    })
  }
}
