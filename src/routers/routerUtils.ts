import { findError, CusError } from "./responseErr"
import { ParameterizedContext } from 'koa'
import * as Router from 'koa-router'

export const responseDeal: GlobalTypes.ResponseQuick = (type, code, message, cusProps?: { [key: string]: any }) => {
    let responseObj: CusError
    if (!type) {
        responseObj = {
            ...findError(code)
        }
        if (message) {
            responseObj.message = message
        }
    } else {
        responseObj = {
            code: code,
            success: type,
            message: message || ''
        }
    }
    if (cusProps) {
        responseObj = {
            ...responseObj,
            ...cusProps
        }
    }
    return JSON.stringify(responseObj)
}

/** token验证 */
type CheckToken = (token: string, ctx:ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>) => Promise<boolean>
export const checkToken: CheckToken = async (token, ctx) => {
    try {
        const info = await global.redis.client.get(token)
        if (info) {
            return true
        } else {
            ctx.body = responseDeal(false, 307)
        }
    } catch (e) {
        console.log('token验证出错', e)
    }
}