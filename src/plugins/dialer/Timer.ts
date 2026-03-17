export class Timer {
  private _offset = 0
  private _paused = true

  public start () {
    if (this._paused) {
      this._paused = false;
      this._offset -= Date.now();
    }
  }

  public stop () {
    if (!this._paused) {
      this._paused = true;
      this._offset += Date.now();
    }
  }

  public reset () {
    this._offset = 0;
    this._paused = true;
  }

  public render (): string {
    const value: number = this._paused ? this._offset : Date.now() + this._offset;
    return `${this.format(value, 60000, 60, 2)}:${this.format(value, 1000, 60, 2)}:${this.format(value, 1, 1000, 3)}`;
  }

  private format (value: number, scale: number, modulo: number, padding: number) {
    value = Math.floor(value / scale) % modulo;
    return value.toString().padStart(padding, String(0));
  }
}
