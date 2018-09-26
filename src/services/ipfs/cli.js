// this CLI is useful for testing ipfs
// use "babel-node cli" from the ipfs folder
// to start. Then use ipfs.method in the
// cli.

const ipfs = require('./index').default
ipfs.setProvider('https://ipfs.infura.io:5001')

// init CLI
const repl = require('repl')

const context = repl.start('> ').context

context.ipfs = ipfs

/*

some valid ipfs images

dog-in-fence.jpg QmeeogFMkaWi3n1hurdMXLuAHjG2tSaYfFXvXqP6SPd1zo
dog-on-bus.jpg QmPqJfAyLbWrqPPVqNrBJ8UiSgh5oypUJez4SAUEW31qNX
dogs-in-car.jpg QmXYSUjeuWGmAFarASTwRHfCtHho3uGdo1mdbSGusARZ3T
happy-dog.jpg QmVg7o8qBvVuXZhDAgTkGreX2hFXAMjdQ88WTCsry7say9
mister-dog.jpg QmSxRVy8xK98bmZuq1cGnn2YQbDkiFQaepCrAZy2viGutg
officer-puppy.jpg QmYvjVtP9R1NXBnxyx89mcj72XXELyXa2JFLnUjQnkv9dE
pirate-dog.jpg QmScyMudhhZAAovRvMoHmFkaEiw4Tdxoecy1pEKppSE8PQ
puppies.jpg QmbZaLVhaj7tRjqQtrAZ8d5eDNQ35RPJE5A4P8zpTvC2ZB

some valid ipfs videos

non frag
--------
dog-loves-baby.mp4 QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV
sleeping-dogs.mp4 QmWK3hDK8wDRgcTTiedXkWzEtj5aZpkqnYLWqXUMv6VhN9
sleepy-dog.mp4 QmdbaL9CpPoJXHTSx9BxxkHAv9k1wcyzbdRLdKHPsPVfYs

frag
----
frag-bunny.mp4 QmR6QvFUBhHQ288VmpHQboqzLmDrrC2fcTUyT4hSMCwFyj

example of usage

ipfs
  .uploadFilePathWrappedWithDirectory(
    'dog-loves-baby.mp4',
    '/Users/dave/Documents/git/subby-react/src/services/ipfs/test/mock/media/videos/dog-loves-baby.mp4'
  )
  .then(console.log)

logs

[ { path: 'dog-loves-baby.mp4', // file name
    hash: 'QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV',
    size: 1119419 },
  { path: '',
    hash: 'QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM', // folder hash
    size: 1119485 } ]

use QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM/dog-loves-baby.mp4 to query it

ipfs.getIpfs().ls('QmZbp9u6yMDW94mfxTYe8hMaomBLr2NfckUhYf3J7ax7zM').then(console.log) // does not work on infura

*/
