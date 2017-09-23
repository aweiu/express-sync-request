import SyncPromise from 'synchronize-promise'
export default function (promiseController, queueIdGetter) {
  let syncPromises = {}
  return function (req, res, next) {
    const queueId = typeof queueIdGetter === 'function' ? queueIdGetter(req) : '__queue_id'
    if (!syncPromises.hasOwnProperty(queueId)) syncPromises[queueId] = new SyncPromise()
    syncPromises[queueId].do(() => promiseController(req, res, next))
      .then(() => delete syncPromises[queueId])
      .catch(() => delete syncPromises[queueId])
  }
}
