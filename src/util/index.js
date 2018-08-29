
const sortBy = (array, property, {order = 'ascending'} = {order: 'ascending'}) => {
  if (typeof array === 'object') array = Object.values(array)

  let deepCopyArray = array.slice(0)
  deepCopyArray.sort((a, b) => a[property] - b[property])

  if (order === 'descending') deepCopyArray = deepCopyArray.reverse()

  return deepCopyArray
}

const timeout = (ms, options) => {
  let secsRemaining = ms / 1000
  if (!options || !options.silent) countdown(secsRemaining)
  return new Promise((resolve, reject) => setTimeout(() => { resolve() }, ms))
}

const countdown = (secsRemaining) => {
  setTimeout(() => {
    process.stdout.write(secsRemaining + 's left to wait...' + '\r')
    secsRemaining--
    if (secsRemaining > 0) countdown(secsRemaining)
  }, 1000)
}

export {sortBy, timeout}
