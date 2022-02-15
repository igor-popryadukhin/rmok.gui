import StorageInterface from './StorageInterface'

export default class LocalStorage implements StorageInterface {
  getItem (key: string): string {
    return localStorage.getItem(key)
  }

  removeItem (key: string): void {
    localStorage.removeItem(key)
  }

  setItem (key: string, value: string): void {
    localStorage.setItem(key, value)
  }
}
