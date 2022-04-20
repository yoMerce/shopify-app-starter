const { PORT } = process.env;

const config = {
  API: {
    port: PORT,
  },
};

export default Object.freeze(config);
