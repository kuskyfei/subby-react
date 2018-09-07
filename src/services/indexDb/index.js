import idb from 'idb'

const db = await idb.open('keyval-store', 2, upgradeDB => {
  // Note: we don't use 'break' in this switch statement,
  // the fall-through behaviour is what we want.
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('keyval');
    case 1:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
  }
})

window.myIdb = db
console.log(db)

const tx = await db
  .transaction('objs', 'readwrite')
  .objectStore('objs')
  .put({
    id: 123456,
    data: {foo: "bar"}
  })

console.log(tx)

const allObjs = await db
  .transaction('objs')
  .objectStore('objs')
  .getAll()

console.log(allObjs)