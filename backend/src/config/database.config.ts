export default () => ({
    database:{
        host:process.env.DB_HOST,
        port: process.env.DB_PORT
          ? Number.parseInt(process.env.DB_PORT, 10)
          : 5432,
        name:process.env.DB_NAME,
        username:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        synchronize:process.env.DB_SYNC === 'true',
    }
})