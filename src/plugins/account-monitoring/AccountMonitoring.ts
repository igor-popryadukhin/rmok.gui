import { ActionName } from './types'
import { $axios } from '../axios'

/**
 * Класс для выполнения записи активности пользователя во временном диапазоне
 */
export default class AccountMonitoring {
  get state (): 'active' | 'idle' {
    return this._state
  }

  private _id = 0
  private _state: 'active' | 'idle' = 'idle'

  /**
   * Начать действие
   * @param name
   */
  public begin (name: ActionName): void {
    if (this._id > 0) {
      this.end()
    }

    $axios.post('/account/monitoring', {
      name
    }).then((response) => {
      if (this._id > 0) {
        $axios.patch(`/account/monitoring/${this._id}`)
      }

      this._state = 'active'
      this._id = +response.data?.id
    })
  }

  /**
   * Завершить действие
   */
  public end (): void {
    if (this._id > 0) {
      $axios.patch(`/account/monitoring/${this._id}`)
        .then(() => {
          this._state = 'idle'
        })
      this._id = 0
    }
  }
}
