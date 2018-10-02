const isValidImage = (imgUrl) => new Promise((resolve) => {
  const img = document.createElement('img')
  img.onload = () => {
    const width = img.naturalWidth
    const height = img.naturalHeight

    if (!width || !height) {
      return resolve(false)
    } else {
      return resolve(true)
    }
  }
  img.onerror = () => {
    return resolve(false)
  }
  img.src = imgUrl
})

export {isValidImage}
