const { PORT, MONGO_USER, MONGO_PASSWORD, MONGO_HOST, DB_NAME, NODE_ENV, VITE_TEST_BUILD, SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, HOST } = process.env;

const config = {
  API: {
    port: parseInt(PORT, 10) || 0,
  },
  DB: {
    connectionString: "mongodb://".concat(encodeURIComponent(MONGO_USER), ":").concat(encodeURIComponent(MONGO_PASSWORD), "@").concat(MONGO_HOST, "/"),
    host: MONGO_HOST || "",
    user: MONGO_USER || "mongo",
    password: MONGO_PASSWORD || "mongo",
    name: DB_NAME || "appdb",
  },
  SHOPIFY: {
    key: SHOPIFY_API_KEY || "",
    secret: SHOPIFY_API_SECRET || "",
    scopes: SCOPES || "",
    host: HOST || ""
  },
  ISTEST: NODE_ENV === "test" || !!VITE_TEST_BUILD,
  DEV_INDEX_PATH: `${process.cwd()}/frontend/`,
  PROD_INDEX_PATH: `${process.cwd()}/frontend/dist/`,
};

export default Object.freeze(config);
