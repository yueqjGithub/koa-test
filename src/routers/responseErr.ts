export type CusError = {
    code: number,
    message?: string,
    success?: boolean
}
const customErrors:CusError[] = [
    {code: 301,message: '非法用户名',success: false},
    {code: 302,message: '密码不符合规定',success: false},
    {code: 303,message: '注册失败',success: false},
    {code: 304,message: '用户名被占用', success: false},
    {code: 305,message: '密码错误', success: false},
    {code: 306,message: '用户名不存在', success: false},
    {code: 307,message: '登录过期', success: false},
]

export const findError:(code:number)=>CusError = (code) => {
    return customErrors.find(item => item.code === code)
}