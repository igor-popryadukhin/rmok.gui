export default class Str {
  public truncate (str: string, len: number, useWordBoundary = true) {
    if (str.length <= len) { return str }

    const subString = str.substr(0, len - 1)

    return useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(' ')) + ' ...'
      : subString + ' ...'
  }
}
