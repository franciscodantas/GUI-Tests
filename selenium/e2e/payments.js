const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Esses testes estão um pouco estaveis as vezes quebra sem motivo aparente
describe('payments', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/en_US/products/knitted-wool-blend-green-cap');
    await driver.findElement(By.className('ui huge primary icon labeled button')).click();
    await driver.sleep(500);
    await driver.findElement(By.className('ui huge primary fluid labeled icon button')).click();

    await driver.findElement(By.id('sylius_checkout_address_customer_email')).sendKeys("user@gmail.com");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_firstName')).sendKeys("user name");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_lastName')).sendKeys("last name");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_company')).sendKeys("center");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_street')).sendKeys("center");
    
    const dropdown = await driver.findElement(By.id('sylius_checkout_address_billingAddress_countryCode'));
    await dropdown.findElement(By.xpath("//option[. = 'Portugal']")).click();
    await driver.sleep(1000);

    await driver.findElement(By.id('sylius_checkout_address_billingAddress_city')).sendKeys("city");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_postcode')).sendKeys("99999-999");
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_phoneNumber')).sendKeys("(99) 99999-9999");

    for (let index = 0; index < 3; index++) {
      const button = await driver.findElement(By.className('ui large primary icon labeled button'));
      await button.click();
    }
    
    const button = await driver.findElement(By.className('ui huge primary fluid icon labeled button'));
    await button.click();



    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('complete a new payment', async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();

    // Select the state to search for new payments
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'New']")).click();

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in complete of the first payment listed
    const buttons = await driver.findElements(By.css('*[class^="ui loadable teal labeled icon button"]'));
    await buttons[0].click();

    // Assert that payment has been completed
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment has been completed.'));
  });

  it('Removendo filtros', async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();

    // Select the state to search for new payments
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'New']")).click();

    await driver.sleep(300);

    await driver.findElement(By.className('ui blue labeled icon button')).click();
    await driver.findElement(By.className('ui labeled icon button')).click();

    const dropdownAfther = await driver.findElement(By.id('criteria_state')).getText();
    assert(dropdownAfther.includes('All'));
  });

  it('Reembolsando o cliente', async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Completed']")).click();

    await driver.findElement(By.className('ui blue labeled icon button')).click();

    await driver.sleep(300);

    let links = await driver.findElements(By.css("a[href^='/admin/orders/']"));
    for (let link of links) {
      let href = await link.getAttribute('href');
      if (/\d+$/.test(href)) {
          await link.click();
          break;
      }
    }
    await driver.findElement(By.className('ui icon labeled tiny yellow fluid loadable button')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment has been successfully refunded.'));
  });

  it('Cancelando um pedido', async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'New']")).click();

    await driver.findElement(By.className('ui blue labeled icon button')).click();

    await driver.sleep(300);

    let links = await driver.findElements(By.css("a[href^='/admin/orders/']"));
    for (let link of links) {
      let href = await link.getAttribute('href');
      if (/\d+$/.test(href)) {
          await link.click();
          break;
      }
    }

    await driver.findElement(By.className('ui yellow labeled icon  button')).click();

    await driver.findElement(By.className('ui green ok inverted button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Order has been successfully updated.'));
  });

  it('Quando clicamos em next sucessivas vezes até está desabilitado', async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);

    // Função para clicar no botão Next até que ele esteja desabilitado
    async function clickUntilDisabled() {
      while (true) {
          let nextButton;

          try {
              // Obtém o botão Next mais atualizado
              nextButton = await driver.findElement(By.xpath("//a[contains(text(), 'Next')]"));
              const disabledClass = await nextButton.getAttribute('class');

              // Verifica se o botão está desabilitado
              if (disabledClass.includes('disabled')) {
                  console.log('Botão Next está desabilitado.');
                  break;
              } else {
                  await nextButton.click();
                  await driver.sleep(100); // Aguarda um pouco para o botão carregar
              }
          } catch (error) {
              break;
          }
      }
  }

  await clickUntilDisabled();
  });

  it("Quando checamos se o filtro de quantidade em 25 mostra 25 itens na tabela", async () => {
    // Click in payments in side menu
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);

    await driver.findElement(By.className('ui simple fluid dropdown item')).click();
    await driver.findElement(By.css('a[href="/admin/payments/?limit=25"]')).click();

    // Espera a tabela carregar
    await driver.wait(until.elementLocated(By.css('tbody')), 10000);

    // Obtém todas as linhas da tabela
    const rows = await driver.findElements(By.css('tbody tr'));

    // Verifica se o número de linhas na tabela é igual a 25
    assert.strictEqual(rows.length, 25, `O número de itens na tabela é ${rows.length}. Esperado: 25.`);
  });

  it("Quando filtramos todos estados como novos", async () => {
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);

    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'New']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    await driver.wait(until.elementLocated(By.css('tbody')), 10000);

      const rows = await driver.findElements(By.css('tbody > tr'));

      for (let row of rows) {
          const label = await row.findElement(By.css('span.ui.olive.label'));
          const text = await label.getText();
          assert.strictEqual(text.trim(), 'New', `O texto esperado era 'New', mas foi '${text.trim()}'`);
      }
  });

  it("Quando filtramos todos estados como completos", async () => {
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);

    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Completed']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    await driver.wait(until.elementLocated(By.css('tbody')), 10000);

      const rows = await driver.findElements(By.css('tbody > tr'));

      for (let row of rows) {
          const label = await row.findElement(By.css('span.ui.green.label'));
          const text = await label.getText();
          assert.strictEqual(text.trim(), 'Completed', `O texto esperado era 'Completed', mas foi '${text.trim()}'`);
      }
  });

  it("Quando filtramos todos canais em Fashion Web Store", async () => {
    await driver.findElement(By.linkText('Payments')).click();
    await driver.sleep(500);

    const dropdown = await driver.findElement(By.id('criteria_channel'));
    await dropdown.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    await driver.wait(until.elementLocated(By.css('tbody')), 10000);
    await driver.wait(until.elementsLocated(By.css('tbody > tr')), 10000);

    const rows = await driver.findElements(By.css('tbody > tr'));

    for (let row of rows) {
      // Encontra o segundo <span> dentro da div .channel
      const label = await row.findElement(By.xpath('.//div[@class="channel"]/span[2]'));

      // Rola para o elemento para garantir que ele está visível no viewport
      await driver.executeScript("arguments[0].scrollIntoView(true);", label);

      // Aguarda até que o elemento tenha algum texto
      await driver.wait(async () => {
          const text = await label.getText();
          return text.trim() !== '';  // Espera até que o texto não seja vazio
      }, 5000, 'O texto do elemento permaneceu vazio após 5 segundos.');

      // Obtém o texto após a espera
      const text = await label.getText();
      assert.strictEqual(text.trim(), 'Fashion Web Store', `O texto esperado era 'Fashion Web Store', mas foi '${text.trim()}'`);
  }
  });
});