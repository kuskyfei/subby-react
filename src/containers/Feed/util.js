const getPercentScrolled = () => {
  const winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
  const docheight = getDocHeight()
  const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
  const trackLength = docheight - winheight
  const pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
  return pctScrolled
}

const getDocHeight = () => {
  const D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}

module.exports = {getPercentScrolled}
