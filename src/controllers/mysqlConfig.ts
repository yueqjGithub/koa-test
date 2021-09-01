import * as Mysql from 'mysql'
import { dbConfig } from './defaultConfig'

const pool = Mysql.createPool({
  host: dbConfig.dataBase.HOST,
  user: dbConfig.dataBase.USERNAME,
  password: dbConfig.dataBase.PASSWORD,
  database: dbConfig.dataBase.DATABASE
})

export class ConnectionSql {
  connection:any
  constructor () {
  }
  /** 基本连接查询
   *  这里对connection的if判断很重要，不做判断会导致连接数过多，后面的连接查询均会失败
   */
  queryInfo (sql:string):Promise<any> {
    return new Promise((resolve, reject)=>{
      if (this.connection) {
        this.connection.query(sql, (err, val) => {
          if (err) {
            reject(err)
          } else {
            resolve(val)
          }
        })
      } else {
        pool.getConnection((err, connection) => {
          if (err) {
            reject(err)
          } else {
            this.connection = connection
            connection.query(sql, (err, val) => {
              if (err) {
                reject(err)
              } else {
                resolve(val)
              }
            })
          }
        })
      }
    })
  }
  testQuery () {
    const sql = 'SELECT * FROM dev_test'
    return this.queryInfo(sql)
  }
}
