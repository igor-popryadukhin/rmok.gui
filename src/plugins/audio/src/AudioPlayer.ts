interface PlayOptions {
  loop?: boolean
}

export default class AudioPlayer {
  private _played: boolean
  private _player: HTMLAudioElement

  constructor () {
    this._player = new Audio()
    this._played = false

    this._player.onended = () => {
      this._played = false
    }
  }

  /**
   *
   * @param path
   * @param options
   */
  play (path: string, options: PlayOptions = {}): void {
    if (!this._played) {
      this._played = true
      this._player.src = path
      this._player.loop = options?.loop || false

      this._player.play().catch(() => {
        navigator
          .mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            this._player.play()
          })
          .catch(function (err) {
            console.log(err.name + ': ' + err.message)
          })
      })
    }
  }

  /**
   * Останавливает воспроизведение.
   */
  stop (): void {
    this._played = false
    this._player.pause()
    this._player.currentTime = 0
  }
}
