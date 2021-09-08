export default class Sound {
  private _audio = new Audio()

  public play (src: string): void {
    this._audio.src = src
    this._audio.volume = 1
    this._audio.play()
  }

  public pause (): void {
    this._audio.pause()
  }
}
