// @see https://stackoverflow.com/questions/52122011/failed-to-execute-postmessage-on-window-googletagmanager
const obj = { something: window }

const postMessageTemp = window.postMessage
// @ts-expect-error: window.postMessage
window.postMessage = function (message, targetOrigin, transfer) {
  function cloneObject (obj) {
    const clone = {}
    for (const i in obj) {
      if (typeof (obj[i]) === 'object' && obj[i] != null) {
        if (('' + obj[i]) === '[object Window]') {
          delete obj[i]
          continue
        }

        clone[i] = cloneObject(obj[i])
      } else { clone[i] = obj[i] }
    }
    return clone
  }

  // to avoid weird error causing by window object by JSON.stringify() execution.
  const clone = cloneObject(message)

  postMessageTemp(JSON.parse(JSON.stringify(clone)), targetOrigin, transfer)
}

window.postMessage(obj, '*')
