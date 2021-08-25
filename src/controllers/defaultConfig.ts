type DBpool<T, U> = {
    dataBase: T,
    redis: U
}
/** mysql pool */
export const dbConfig:DBpool<GlobalTypes.DBconfig, GlobalTypes.RedisConf> = {
    dataBase: {
        DATABASE: '', //数据库名称
        USERNAME: '', //mysql用户名
        PASSWORD: '', //mysql密码
        PORT: '', //mysql端口号
        HOST: '' //服务器ip
    },
    redis: {
        port: 6379,
        host: '',
        auth: '',
        ipv: 4
    }
}