export function useLocalStorage<T>(key: string) {
  function read(): T | null {
    try {
      const rawValue = localStorage.getItem(key)

      if (!rawValue) {
        return null
      }

      return JSON.parse(rawValue) as T
    } catch (error) {
      console.warn(`Không thể đọc dữ liệu localStorage với khóa "${key}".`, error)
      return null
    }
  }

  function write(value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Không thể lưu dữ liệu localStorage với khóa "${key}".`, error)
      return false
    }
  }

  function remove(): void {
    localStorage.removeItem(key)
  }

  return {
    read,
    write,
    remove,
  }
}
