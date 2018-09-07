const faker = require('faker')
const toNumber = require('hashcode').hashCode().value

const fake = (seed) => {
  seed = toNumber(seed)
  faker.seed(seed)
  return faker
}

export {fake}