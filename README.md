# express-sync-request
基于Promise的express异步请求队列控制，一般用于控制数据库的删改并发请求

## 安装
```
npm install express-verify
```
## 使用
以下示例基本囊括了常见的请求控制，您可以直接复制该代码启一个express工程测试
```
import express from 'express'
import syncRequest from '../libs/express-sync-request'
const router = express.Router()
function promiseFun (res) {
  return new Promise(resolve => setTimeout(() => resolve(res.send('ok')), 1000))
}
// 并发该post请求，每次请求都会在上一次promiseFun执行结束后才会继续处理当前请求
router.post('/', syncRequest(
  // 该参数必须是一个返回Promise的函数
  (req, res) => promiseFun(res)
))

const syncRequestForResources = syncRequest(
  (req, res) => promiseFun(res),
  // 你也可以传入一个同步队列id的getter函数，用于让同步队列区分不同资源
  req => req.params._id
)
// 并发resources资源的post或delete请求，如果请求的是同一份资源（req.params._id相同），那么该请求的处理是串行的
// 假设当前有个delete或post请求A：'/resources/id1'正在进行，又来了一个delete或post请求B：'/resources/id1'，又来了一个delete或post请求C：'/resources/id2'。那么请求B只会在请求A结束之后才能处理，请求C会立即处理
router.post('/resources/:_id', syncRequestForResources)
router.delete('/resources/:_id', syncRequestForResources)
export default router
```
