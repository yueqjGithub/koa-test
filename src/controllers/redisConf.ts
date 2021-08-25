import * as redis from "ioredis";
import { dbConfig } from './defaultConfig'

export class CustomRedis {
    client: redis.Redis | undefined
    constructor () {
        const { redis: RedisConf } = dbConfig
        this.client = new redis({
            port: RedisConf.port,
            host: RedisConf.host,
            family: RedisConf.ipv,
            password: RedisConf.auth
        })
        this.client.on('error', (err) => {
            console.log('Redis错误', err)
        })
    }
}