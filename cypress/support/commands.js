const jsonAssertion = require("soft-assert")

Cypress.Commands.add("softAssert", (actual, expected, message) => {
    jsonAssertion.softAssert(actual, expected, message)
    if (jsonAssertion.jsonDiffArray.length) {
      jsonAssertion.jsonDiffArray.forEach(diff => {
  
        const log = Cypress.log({
          name: "Soft assertion error",
          displayName: "softAssert",
          message: diff.error.message      })
          })
    }
  })
  Cypress.Commands.add("softAssertAll", () => jsonAssertion.softAssertAll())