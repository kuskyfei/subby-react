// this CLI is useful for testing ipfs
// use "babel-node cli" from the ipfs folder
// to start. Then use ipfs.method in the
// cli.

const ipfs = require('./index')
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

dog-loves-baby.mp4 QmPrg9qm6RPpRTPF9cxHcYBtQKHjjytYEriU37PQpKeJTV
sleeping-dogs.mp4 QmWK3hDK8wDRgcTTiedXkWzEtj5aZpkqnYLWqXUMv6VhN9
sleepy-dog.mp4 QmdbaL9CpPoJXHTSx9BxxkHAv9k1wcyzbdRLdKHPsPVfYs

*/
