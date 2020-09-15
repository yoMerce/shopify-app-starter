const setupAuth = require("./shopifyAuthMW");
const mwVerifyRequest = require("./mwVerifyRequest");

module.exports = {
  setupAuth,
  mwVerifyRequest
};
