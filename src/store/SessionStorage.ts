import StorageInterface from './StorageInterface';

export default class SessionStorage implements StorageInterface {
  getItem (key: string): string {
    return sessionStorage.getItem(key);
  }

  removeItem (key: string): void {
    sessionStorage.removeItem(key);
  }

  setItem (key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
