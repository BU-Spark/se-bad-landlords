describe('sample test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // it('displays the resources text', () => {
  //   cy.get('h1')
  //   .contains('Welcome to my app!');
  // })
  // it('renders the Netlify logo image', () => {
  //   cy.get('img')
  //   .should('be.visible')
  //   .and(($img) => {
  //     expect($img[0].naturalWidth).to.be.greaterThan(0);
  //   })
  // })
  it("display 'HOME' text in main page", () => {
    cy.contains("div", "HOME").should("be.visible");
  })
})
