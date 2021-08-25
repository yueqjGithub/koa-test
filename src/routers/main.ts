import { ParameterizedContext } from 'koa'
import * as Router from 'koa-router'
import {responseDeal,checkToken} from './routerUtils'
import * as MD5 from 'md5'

type RouteCtrl = (ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>, ...args:any[]) => Promise<any>
interface MainType {
  [key:string]: RouteCtrl
}

const regExps: {[key:string]: RegExp} = {
  uname: /^[a-zA-Z0-9_-]{4,16}$/,
  pwd: /^[a-zA-Z0-9@!#$%.]{6,20}$/
}

export const Main: MainType = {
  /** 注册控制 */
  registerCtl: async (ctx) => {
    const { username, pwd } = ctx.request.body
    if (!username || !regExps.uname.test(username as string)) {
      ctx.body = responseDeal(false, 301)
      return
    }
    
    if (!pwd || !regExps.pwd.test(pwd as string)) {
      ctx.body = responseDeal(false, 302)
      return
    }
    const salt = `${Math.random().toString(16).substr(2, 10)}${new Date().getMilliseconds().toString().substr(1,5)}`
    const md5pwd = MD5(MD5(pwd as string) + salt)
    try {
      await global.mysql.queryInfo(`
      INSERT user_info (\`username\`, \`pwd\`, \`salt\`) VALUES ('${username}', '${md5pwd}', '${salt}')
      `)
      ctx.body = responseDeal(true, 200, '注册成功')
    } catch (e) {
      console.log('注册服务失败==》', e.code)
      if (e.code === 'ER_DUP_ENTRY') {
        ctx.body = responseDeal(false, 304)
      } else {
        ctx.body = responseDeal(false, 303)
      }
    } 
  },

  /** 登录控制 */
  loginCtl: async (ctx) => {
    const { username, pwd } = ctx.request.body

    if (!username || !regExps.uname.test(username as string)) {
      ctx.body = responseDeal(false, 301)
      return
    }
    
    if (!pwd || !regExps.pwd.test(pwd as string)) {
      ctx.body = responseDeal(false, 302)
      return
    }
    const sql = `SELECT * FROM user_info WHERE username='${username}'`
    try {
      const sqlRes = await global.mysql.queryInfo(sql)
      if (!sqlRes[0]) {
        ctx.body = responseDeal(false, 306)
        return
      }
      const { salt, pwd: correct } = sqlRes[0]
      const curMd5 = MD5(MD5(pwd as string) + salt)

      if (curMd5 === correct) {
        const token = MD5((Math.random()*10).toString(16).substr(2, 10))
        await global.mysql.queryInfo(`UPDATE user_info SET token='${token}' WHERE username='${username}'`)
        await global.redis.client.set(token, username)
        await global.redis.client.expire(token, 3 * 60 * 60)
        ctx.body = responseDeal(true, 200, '登录成功', { token: token })
      } else {
        ctx.body = responseDeal(false, 305)
      }
    } catch (e) {
      console.log('登录错误===》', e)
    }
  },
  /** token验证测试 */
  indexCtl: async (ctx) => {
    const token = ctx.request.headers.token
    const result = await checkToken(token as string, ctx)
    if (result) {
      ctx.body = 'token验证成功'
    }
  }
}