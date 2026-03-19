export const storageService = {
  initStorage(key: string, defaultValue: any) {
    const data = this.load(key)
    if (data) {
      return data
    }
    localStorage.setItem(key, JSON.stringify(defaultValue))
    return defaultValue
  },
  save<T>(key: string, value: T, idName: string) {
    // let data = this.load(key)
    // if (data) {
    //   value[idName] = data[data.length - 1][idName] + 1
    //   data.push(value)
    // } else {
    //   value[idName] = 1
    //   data = [value]
    // }
    localStorage.setItem(key, JSON.stringify(data))
    //  return value[idName]
  },
  load<T>(key: string) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  },
  getItem<T>(key: string, idName: string, id: number) {
    const data = this.load(key)
    return data ? data.find((item: T) => item[idName] === id) : null
  },
  remove<T>(key: string, id: number, idName: string) {
    let data = this.load(key)
    if (data) {
      data = data.filter((item: T) => item[idName] !== id)
      localStorage.setItem(key, JSON.stringify(data))
    }
  },
  updateItem<T>(key: string, value: T, idName: string) {
    const items = this.load(key)
    const index = items.findIndex((i: T) => i[idName] === value[idName])
    if (index !== -1) {
      items[index] = value
      localStorage.setItem(key, JSON.stringify(items))
    }
    return items
  },
}
