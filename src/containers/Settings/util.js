const onFinishedTyping = (cb) => {
  this.onFinishedTypingCounter = 0

  clearInterval(this.onFinishedTypingInterval)

  this.onFinishedTypingInterval = setInterval(() => {
    if (this.onFinishedTypingCounter > 1) {
      cb()
      clearInterval(this.onFinishedTypingInterval)
    }
    this.onFinishedTypingCounter++
  }, 700)
}

module.exports = {onFinishedTyping}
