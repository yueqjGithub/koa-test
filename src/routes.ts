import * as Router from 'koa-router'
import { ConnectionSql } from './controllers/mysqlConfig';
import { CustomRedis } from './controllers/redisConf';
import { Main } from './routers/main'

declare global {
    namespace NodeJS {
        interface Global {
            redis: typeof CustomRedis | undefined,
            mysql: typeof ConnectionSql
        }
    }
}

global.mysql = new ConnectionSql()
global.redis = new CustomRedis()

const router = new Router()
router.prefix('/api')

router.post('/regist', async ctx => Main.registerCtl(ctx))

router.post('/login', async ctx => Main.loginCtl(ctx))

router.get('/c', async ctx => Main.indexCtl(ctx))

export default router