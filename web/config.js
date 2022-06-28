const {
  PORT,
  MONGO_URI,
  DB_NAME,
  NODE_ENV,
  VITE_TEST_BUILD,
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  SCOPES,
  HOST,
  ENCRYPTION_KEY,
} = process.env;

const config = {
  API: {
    port: parseInt(PORT, 10) || 0,
  },
  DB: {
    connectionString: MONGO_URI || "mongodb://localhost:27017",
    name: DB_NAME || "appdb",
    encryptionKey: ENCRYPTION_KEY || "test",
  },
  SHOPIFY: {
    key: SHOPIFY_API_KEY || "",
    secret: SHOPIFY_API_SECRET || "",
    scopes: SCOPES || "",
    host: HOST || "",
  },
  ISTEST: NODE_ENV === "test" || !!VITE_TEST_BUILD,
  DEV_INDEX_PATH: `${process.cwd()}/frontend/`,
  PROD_INDEX_PATH: `${process.cwd()}/frontend/dist/`,
};

export default Object.freeze(config);
