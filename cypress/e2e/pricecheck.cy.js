describe('FT_Price check', () => {

  it('Get actual results', function () {
      cy.task("dbQuery", {"query": "CREATE TABLE prices_it_b2b_actual (productId int, qev varchar PRIMARY KEY, net float, gross float, taxRate float, currency varchar, runtime int, runtimeUnit varchar)"})

      cy.request('GET', 'https://shop-preprod.mercedes-benz.com/dcpconb2b-api/dcp-api/v2/dcp-mbcb2b-it/products').then((response) => {
          for (var i = 0; i < response.body.products.length ; i++) {
                      
              cy.request("GET", "https://shop-preprod.mercedes-benz.com/dcpconb2b-api/dcp-api/v2/dcp-mbcb2b-it/users/anonymous/connect/products/"+response.body.products[i].code+"?fields=FULL&lang=it_IT").then((response) => {  
              for (var j = 0; j < response.body.variantOptions.length; j++) {

                  cy.wrap(response.body.variantOptions[j].price.priceDetail.netPrice).as("actualNetPrice")
                  cy.wrap(response.body.variantOptions[j].price.priceDetail.grossPrice).as("actualGrossPrice")
                  cy.wrap(response.body.variantOptions[j].price.priceDetail.taxRate).as("actualTaxRate")
                  cy.wrap(response.body.variantOptions[j].price.currencyIso).as("actualCurrency")
                  cy.wrap(response.body.variantOptions[j].license.duration).as("actualRuntime")
                  cy.wrap(response.body.variantOptions[j].license.unit_en).as("actualRuntimeUnit")
                  cy.wrap(response.body.variantOptions[j].code).as("qev")

                      cy.task("dbQuery", {"query": "SELECT net, gross, taxRate, currency, runtime, runtimeUnit FROM prices_it_b2b WHERE qev = '" + response.body.variantOptions[j].code + "'"}).then(result => {
                          
                          /*expect(this.actualNetPrice).to.deep.equal(result[0].net)
                          expect(this.actualGrossPrice).to.deep.equal(result[0].gross)
                          expect(this.actualTaxRate).to.deep.equal(result[0].taxrate)
                          expect(this.actualCurrency).to.deep.equal(result[0].currency)
                          expect(this.actualRuntime).to.deep.equal(result[0].runtime)
                          expect(this.actualRuntimeUnit).to.deep.equal(result[0].runtimeunit)*/

                          cy.softAssert(this.actualNetPrice,result[0].net)
                          cy.log("Expected "+this.actualNetPrice+ " = "+result[0].net)
                          cy.softAssert(this.actualGrossPrice, result[0].gross)
                          cy.softAssert(this.actualTaxRate,result[0].taxrate)
                          cy.softAssert(this.actualCurrency,result[0].currency)
                          cy.softAssert(this.actualRuntime,result[0].runtime)
                          cy.softAssert(this.actualRuntimeUnit,result[0].runtimeunit)
                      })



                      cy.task("dbQuery", {"query": "INSERT INTO prices_it_b2b_actual VALUES (" + response.body.code + " ,'" + response.body.variantOptions[j].code + "' , " + response.body.variantOptions[j].price.priceDetail.netPrice + ", " + response.body.variantOptions[j].price.priceDetail.grossPrice + " , " + response.body.variantOptions[j].price.priceDetail.taxRate + " , '" + response.body.variantOptions[j].price.currencyIso + "' , " + response.body.variantOptions[j].license.duration + " , '" +response.body.variantOptions[j].license.unit_en + "')"});
                  }
              })
          }
          cy.softAssertAll()
      })
      
  });


  it("Check for differences 1", function () {
      cy.task("dbQuery", {"query": "SELECT productId, qev FROM prices_it_b2b_actual LEFT OUTER JOIN prices_it_b2b USING (productId, qev) WHERE prices_it_b2b.qev IS NULL"}).then(result => {
          //expect(result).to.be.empty
          cy.log("Not expected: " + result.length)
      })
  })

  it("Check for differences 2", function () {
      cy.task("dbQuery", {"query": "SELECT productId, qev FROM prices_it_b2b_actual RIGHT OUTER JOIN prices_it_b2b USING (productId, qev) WHERE prices_it_b2b_actual.qev IS NULL"}).then(result => {
          //expect(result).to.be.empty
          cy.log("Missing: " + result.length)
      })
  })

  after(() => {
      cy.task("dbQuery", {"query": "DROP TABLE prices_it_b2b_actual"})
  })

})