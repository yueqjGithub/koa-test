declare namespace GlobalTypes {
    type RedisConf = {
        port: number,
        host: string,
        auth: string,
        ipv: 4 | 6
    }
    type DBconfig = {
        DATABASE: string,
        USERNAME: string,
        PASSWORD: string,
        PORT: string,
        HOST: string
    }
    /** 快捷response */
    type ResponseSuc = boolean
    type ResponseQuick = (type: ResponseSuc, code: number, message?: string, ...arg:any[]) => string
}