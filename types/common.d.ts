export interface LoginData {
  captcha?: string
  key?: string
  password: string
  loginType?: string
  passwordType?: string
  username: string
}

export type Type = 'series' | 'parallel'

export interface Progress {
  [key: string]: string | number
  finishStatus: number
  id: string
  studyTotalTime: string | null
}
export interface Section {
  id?: string
  chunk_num: number
  logId?: string
  name: string
  referenceId: string
  sectionType: number
  timeSecond: number
}

export interface CourseChapter {
  courseChapterSections: Section[]
}

export interface Course {
  courseChapters: CourseChapter[]
}
