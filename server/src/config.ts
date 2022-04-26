const { PORT, MONGO_URI, DB_NAME } = process.env;

const config = {
  API: {
    port: PORT,
  },
  DB: {
    connectionString: MONGO_URI,
    name: DB_NAME,
  },
};

export default Object.freeze(config);
