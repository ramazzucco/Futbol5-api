module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "port": process.env.DB_PORT,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": 0
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "b608968b2f2ba2",
    "password": "fb07e3a4",
    "database": "heroku_c26957e453bd190",
    "host": "us-cdbr-east-02.cleardb.com",
    "dialect": "mysql",
    "operatorsAliases": 0
  }
}
