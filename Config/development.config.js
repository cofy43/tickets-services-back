module.exports = {
  ENV: "development",
  FRONT_URL: process.env.FRONT_URL,
  database: {
    URL: process.env.DATABASE_URL,
    OPTIONS: {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: { underscored: true, timestamps: true, freezeTableName: true },
    },
    SYNC: {
      // Evita que se ejecute algun drop cuando sincroniza la base de datos
      alter: {
        drop: false,
      },
    },
  },
};
