import * as Mysql from 'mysql'
import { dbConfig } from './defaultConfig'

const pool = Mysql.createPool({
  host: dbConfig.dataBase.HOST,
  user: dbConfig.dataBase.USERNAME,
  password: dbConfig.dataBase.PASSWORD,
  database: dbConfig.dataBase.DATABASE
})

export class ConnectionSql {
  constructor () {}
  /** 基本连接查询 */
  queryInfo (sql:string):Promise<any> {
    return new Promise((resolve, reject)=>{
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        } else {
          connection.query(sql, (err, val) => {
            if (err) {
              reject(err)
            } else {
              resolve(val)
            }
          })
        }
      })
    })
  }
  testQuery () {
    const sql = 'SELECT * FROM dev_test'
    return this.queryInfo(sql)
  }
}
