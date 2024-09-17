describe('payments', () => {
  beforeEach(() => {
    cy.visit("/en_US/products/knitted-wool-blend-green-cap");
    cy.get('*[class^="ui huge primary icon labeled button"]').click();
    cy.get('*[class^="ui huge primary fluid labeled icon button"]').click();

    // Inserindo o email do usuário.
    cy.get('*[id^="sylius_checkout_address_customer_email"]').type("user@gmail.com");
    
    // Inserindo o nome do usuário.
    cy.get('*[id^="sylius_checkout_address_billingAddress_firstName"]').type("user name");

    // Inserindo o sobrenome do usuário.
    cy.get('*[id^="sylius_checkout_address_billingAddress_lastName"]').type("last name");


    // Inserindo dados do endereço da compania onde o usuário trabalha.
    cy.get('*[id^="sylius_checkout_address_billingAddress_company"]').type("center");

    // Inserindo dados do endereço onde o usuário mora.
    cy.get('*[id^="sylius_checkout_address_billingAddress_street"]').type("center");

    // Inserindo dados do pais onde o usuário mora.
    cy.get('*[id^="sylius_checkout_address_billingAddress_countryCode"').select('Portugal');
  
    // Inserindo dados da cidade onde o usuário mora.
    cy.get('*[id^="sylius_checkout_address_billingAddress_city"]').type("city");

    
    // Inserindo dados do código postal onde o usuário mora.
    cy.get('*[id^="sylius_checkout_address_billingAddress_postcode"]').type("99999-999");

    // Inserindo dados do telefone do usuário.
    cy.get('*[id^="sylius_checkout_address_billingAddress_phoneNumber"]').type("(99) 99999-9999");

    
    // Confirmando dados para ir a próxima página. 
    cy.get('*[class^="ui large primary icon labeled button"]').click();
    
    // Confirmando dados para ir a próxima página. 
    cy.get('*[class^="ui large primary icon labeled button"]').click();
    
    // Confirmando dados para ir a próxima página. 
    cy.get('*[class^="ui large primary icon labeled button"]').click();

    // Confirmando dados para ir a próxima página. 
    cy.get('*[class^="ui huge primary fluid icon labeled button"]').click();

    
    // Visitando a página de login do administrador. 
    cy.visit('/admin');

    // Inserindo login do administrador.  
    cy.get('[id="_username"]').type('sylius');

    // Inserindo senha do administrador.  
    cy.get('[id="_password"]').type('sylius');

    // Confirmando o login. 
    cy.get('.primary').click();
  });

  it('Completando um novo pagamento', () => {
    // Movendo para a página de pagamentos do administrador. 
    cy.clickInFirst('a[href="/admin/payments/"]');

    // Selecionando novos pagamentos dos usuários. 
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('new');

    // Clicando no botão de filtrar.   
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Movendo para a página de pagamentos do administrador. 
    cy.clickInFirst('*[class^="ui loadable teal labeled icon button"]');

    // Checando se o corpo da notificação contém a mensagem esperada.   
    cy.get('body').should('contain', 'Payment has been completed.');
  });
  
  it('Removendo filtros', () => {
    // Movendo para a página de pagamentos do administrador. 
    cy.clickInFirst('a[href="/admin/payments/"]');

    // Selecionando pedidos cancelados dos usuários. 
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('cancelled');

    // Clicando no botão de filtrar.   
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Clicando em limpar filtros. 
    cy.get('*[class^="ui labeled icon button"]').click();

    // Checando se o label do seletor State está em All. 
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').should('contain', 'All');
  });

  it('Reembolsando o cliente', () => {
    // Movendo para a página de pagamentos do administrador. 
    cy.clickInFirst('a[href="/admin/payments/"]');

    // Selecionando pedidos completados dos usuários. 
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('completed');

    // Clicando no botão de filtrar.   
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Clicando no primeiro pedido. 
    cy.get('a[href^="/admin/orders/"]').filter((_, el) => {
      const href = Cypress.$(el).attr('href');
      return /\d+$/.test(href); 
    }).first().click();

    // Clicando no botão de reembolso. 
    cy.get('*[class^="ui icon labeled tiny yellow fluid loadable button"]').click();

    // Checando se o corpo da notificação contém a mensagem esperada.   
    cy.get('body').should('contain', 'Payment has been successfully refunded.');
  });

  it("Cancelando um pedido", () => {
    // Movendo para a página de pagamentos do administrador. 
    cy.clickInFirst('a[href="/admin/payments/"]');

    // Selecionando novos pedidos dos usuários. 
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('new');


    // Clicando no botão de filtar. 
    cy.get('*[class^="ui blue labeled icon button"]').click();

    // Clicando no primeiro pedido. 
    cy.get('a[href^="/admin/orders/"]').filter((_, el) => {
      const href = Cypress.$(el).attr('href');
      return /\d+$/.test(href); 
    }).first().click();


    // Clicando no botão de cancelar pedido. 
    cy.get('*[class^="ui yellow labeled icon  button"]').click();

    // Clicando no botão de confirmar.
    cy.get('*[class^="ui green ok inverted button"]').click();

    // Checando se o corpo da notificação contém a mensagem esperada.   
    cy.get('body').should('contain', 'Order has been successfully updated.');
  });

  it.only("Clicando em next", () => {
    // Movendo para a página de pagamentos do administrador.
    cy.clickInFirst('a[href="/admin/payments/"]');


    // Clicando no primeiro pedido. 
    cy.get('a[href^="/admin/orders/"]').filter((_, el) => {
      const href = Cypress.$(el).attr('href');
      return /\d+$/.test(href); 
    }).first().click();

    
    // Checando se o corpo da notificação contém a mensagem esperada.   
    cy.get('*[class^="ui yellow labeled icon  button"]').click();

    // Checando se o corpo da notificação contém a mensagem esperada. 
    cy.get('*[class^="ui green ok inverted button"]').click();

    // Checando se o corpo da notificação contém a mensagem esperada.   
    cy.get('body').should('contain', 'Order has been successfully updated.');
  });

  it("Confirmando o envio", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');
          
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('completed');
  
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('a[href^="/admin/orders/"]').filter((_, el) => {
      const href = Cypress.$(el).attr('href');
      return /\d+$/.test(href); 
    }).first().click();

    cy.get('*[id^="sylius_shipment_ship_tracking"]').type("qwdqwd");
    cy.get('*[class^="ui labeled icon teal button"]').click();

    cy.get('body').should('contain', 'Shipment has been successfully updated.'); 

    cy.get('*[class^="ui icon labeled tiny yellow fluid loadable button"]').click();

    cy.get('body').should('contain', 'Payment has been successfully refunded.');
  });

  it("Quando clicamos em next sucessivas vezes até está desabilitado", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');

    function clickUntilDisabled() {
      cy.get('a').contains('Next').then($next => {
        if (!$next.parent().hasClass('disabled')) {
          cy.wrap($next).click().then(() => {
            cy.get('div').contains('Next').then($nextDisabled => {
              if ($nextDisabled.length > 0 && $nextDisabled.hasClass('disabled')) {
                cy.wrap($nextDisabled).should('have.class', 'disabled').and('have.class', 'item');
              } else {
                clickUntilDisabled();
              }
            });
          });
        }
      });
    }
    
    clickUntilDisabled();
  });

  it("Quando checamos se o filtro de quantidade em 25 mostra 25 itens na tabela", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');
    cy.get('*[class^="ui simple fluid dropdown item"]').click();
    cy.clickInFirst('a[href="/admin/payments/?limit=25"]');
    cy.get('tbody').children().should('have.length', 25);
  });

  it("Quando filtramos todos estados como novos", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');

    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('New');
    cy.get('*[class^="ui blue labeled icon button"]').click();


    cy.get('tbody > tr').each(($tr) => {
      cy.wrap($tr)
        .find('span.ui.olive.label') 
        .invoke('text').then((text) => {
            expect(text.trim()).to.equal('New'); 
        });
    });

  });

  it("Quando filtramos todos estados como completos", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');

    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('Completed');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tbody > tr').each(($tr) => {
      cy.wrap($tr)
        .find('span.ui.green.label') 
        .invoke('text').then((text) => {
            expect(text.trim()).to.equal('Completed'); 
        });
    });
  });

  it("Quando filtramos todos canais em Fashion Web Store", () => {
    cy.clickInFirst('a[href="/admin/payments/"]');

    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_channel').select('Fashion Web Store');
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('tbody > tr').each(($tr) => {
      cy.wrap($tr)
        .find('span.channel__item') 
        .invoke('text').then((text) => {
            expect(text.trim()).to.equal('Fashion Web Store'); 
        });
    });

  });

});
