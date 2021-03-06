module.exports = {
  api: {
    port: 3001,
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    socketPath: process.env.DB_SOCKET_PATH,
  },
  logger: {
    console: {
      level: 'debug',
    },
  },
  playerServices: {
    youtube: {
      api: {
        key: process.env.YOUTUBE_API_KEY,
      },
    },
  },
}
