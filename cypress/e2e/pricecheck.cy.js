describe("FT_Price check", () => {


  it("Check product offering", function () {
      cy.task("dbQuery", {"query": "CREATE TABLE prices_" + Cypress.env("market") + "_b2b_actual (productId int, qev varchar PRIMARY KEY, net float, gross float, taxRate float, currency varchar, runtime int, runtimeUnit varchar)"})
      cy.request("GET", Cypress.env("preprod_api")+Cypress.env("base_store")+"/products").then((response) => {
          for (var i = 0; i < response.body.products.length ; i++) {
              cy.request("GET", Cypress.env("preprod_api")+Cypress.env("base_store")+"/users/anonymous/connect/products/"+response.body.products[i].code+"?fields=FULL&lang="+Cypress.env("lang")).then((response) => {  
              for (var j = 0; j < response.body.variantOptions.length; j++) {
                  cy.wrap(response.body.variantOptions[j].price.priceDetail.netPrice).as("actualNetPrice")
                  cy.wrap(response.body.variantOptions[j].price.priceDetail.grossPrice).as("actualGrossPrice")
                  cy.wrap(response.body.variantOptions[j].price.priceDetail.taxRate).as("actualTaxRate")
                  cy.wrap(response.body.variantOptions[j].price.currencyIso).as("actualCurrency")
                  cy.wrap(response.body.variantOptions[j].license.duration).as("actualRuntime")
                  cy.wrap(response.body.variantOptions[j].license.unit_en).as("actualRuntimeUnit")
                  cy.wrap(response.body.variantOptions[j].code).as("qev")
                  cy.wrap(Cypress.env("market")).as("market")

                      cy.task("dbQuery", {"query": "SELECT net, gross, taxRate, currency, runtime, runtimeUnit FROM prices_" + Cypress.env("market") + "_b2b WHERE qev = '" + response.body.variantOptions[j].code + "'"}).then(result => {
                          cy.softAssert(this.actualNetPrice,result[0].net)
                          cy.softAssert(this.actualGrossPrice, result[0].gross)
                          cy.softAssert(this.actualTaxRate,result[0].taxrate)
                          //cy.softAssert(this.actualTaxRate,10)
                          cy.softAssert(this.actualCurrency,result[0].currency)
                          cy.softAssert(this.actualRuntime,result[0].runtime)
                          cy.softAssert(this.actualRuntimeUnit,result[0].runtimeunit)
                      })

                      cy.task("dbQuery", {"query": "INSERT INTO prices_" + Cypress.env("market") + "_b2b_actual VALUES (" + response.body.code + " ,'" + response.body.variantOptions[j].code + "' , " + response.body.variantOptions[j].price.priceDetail.netPrice + ", " + response.body.variantOptions[j].price.priceDetail.grossPrice + " , " + response.body.variantOptions[j].price.priceDetail.taxRate + " , '" + response.body.variantOptions[j].price.currencyIso + "' , " + response.body.variantOptions[j].license.duration + " , '" +response.body.variantOptions[j].license.unit_en + "')"});
                  }
              })
          }
          cy.softAssertAll()
      })
      
  })

  it("Check for unexpected products", function () {
      cy.task("dbQuery", {"query": "SELECT productId, qev FROM prices_" + Cypress.env("market") + "_b2b_actual LEFT OUTER JOIN prices_" + Cypress.env("market") + "_b2b USING (productId, qev) WHERE prices_it_b2b.qev IS NULL"}).then(result => {
          cy.log("Not expected: " + result.length)
      })
  })

  it("Check for missing products", function () {
      cy.task("dbQuery", {"query": "SELECT productId, qev FROM prices_" + Cypress.env("market") + "_b2b_actual RIGHT OUTER JOIN prices_" + Cypress.env("market") + "_b2b USING (productId, qev) WHERE prices_it_b2b_actual.qev IS NULL"}).then(result => {
          cy.log("Missing: " + result.length)
      })
  })

  after(() => {
      cy.task("dbQuery", {"query": "DROP TABLE prices_" + Cypress.env("market") + "_b2b_actual"})
  })
})