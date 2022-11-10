const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
      // implement node event listeners here
    },
    env: {
      preprod_api: "https://shop-preprod.mercedes-benz.com/dcpconb2b-api/dcp-api/v2/",
      base_store: "dcp-mbcb2b-de",
      market: "de",
      lang: "de_DE"
    }
  },
  db: {
    user: "user",
    password: "Test1234!",
    host: "acidic-raspberries.db.elephantsql.com",
    database: "testb2b",
  }
})