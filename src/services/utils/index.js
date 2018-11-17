const urlToBlob = async (url) => {
  const res = await fetch(url)
  const blob = await res.blob()
  return blob
}

const blobToString = (blob) => new Promise(resolve => {
	const reader = new FileReader()
	reader.onload = () => {
	  resolve(reader.result)
	}
	reader.readAsText(blob)
})

const downloadSubby = async ({username, postId, fileName = 'subby'} = {}) => {
	const subbyHeaderSize = 2000
	const subbyBlob = await urlToBlob('')
	let subbyHeader = await blobToString(subbyBlob.slice(0, subbyHeaderSize))

	if (username) {
		username = escapeSingleQuote(username)
		subbyHeader = subbyHeader.replace(/HOMEPAGE_PROFILE: '.*'/, `HOMEPAGE_PROFILE: '${username}'`)
	}

	if (postId) {
		postId = escapeSingleQuote(postId)
		subbyHeader = subbyHeader.replace(`HOMEPAGE_POST_ID: ''`, `HOMEPAGE_POST_ID: '${postId}'`)
	}

	let newSubbyBlob = subbyBlob
	if (username !== null && username !== undefined) {
		newSubbyBlob = new Blob([subbyHeader, subbyBlob.slice(subbyHeaderSize + 1, subbyBlob.size)])
	}

	downloadBlob({blob: newSubbyBlob, fileName: fileName + '.html'})
}

const downloadBlob = ({blob, fileName}) => {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

const escapeSingleQuote = (string) => {
	string = String(string)
	string = string.replace(/'/g, '%27')
	return string
}

export {urlToBlob, blobToString, downloadSubby}
