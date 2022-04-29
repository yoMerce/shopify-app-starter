const { PORT, MONGO_URI, DB_NAME, ENCRYPTION_KEY } = process.env;

const config = {
  API: {
    port: PORT,
  },
  DB: {
    connectionString: MONGO_URI,
    name: DB_NAME,
    encryptionKey: ENCRYPTION_KEY,
  },
};

export default Object.freeze(config);
