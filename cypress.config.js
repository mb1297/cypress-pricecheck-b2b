const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
      // implement node event listeners here
    },
  },
  db: {
    user: 'user',
    password: 'Test1234!',
    host: 'acidic-raspberries.db.elephantsql.com',
    database: 'testb2b',
  },
});