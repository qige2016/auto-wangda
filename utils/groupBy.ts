interface Dictionary<T> {
  [index: string]: T
}
export const groupBy = <T>(
  arr: Array<T>,
  criteria: ((value: T) => unknown) | string | number
): Dictionary<T[]> => {
  return arr.reduce((obj, item) => {
    const key = typeof criteria === 'function' ? criteria(item) : item[criteria]
    if (!obj.hasOwnProperty(key)) {
      obj[key] = []
    }
    obj[key].push(item)
    return obj
  }, {})
}
