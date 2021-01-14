export interface Section {
  [key: string]: string | number
}

export interface CourseChapter {
  courseChapterSections: Section[]
}

export interface Course {
  courseChapters: CourseChapter[]
}
