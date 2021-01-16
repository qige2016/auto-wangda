export interface LoginData {
  captcha?: string
  key?: string
  password: string
  loginType?: string
  passwordType?: string
  username: string
}

export type Type = 'series' | 'parallel'

export interface Section {
  [key: string]: string | number
}

export interface CourseChapter {
  courseChapterSections: Section[]
}

export interface Course {
  courseChapters: CourseChapter[]
}
