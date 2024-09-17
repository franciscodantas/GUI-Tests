const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('payments', () => {
  let driver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get("https://yourwebsite.com/en_US/products/knitted-wool-blend-green-cap");
    
    // Clicar no botão de adicionar ao carrinho
    await driver.findElement(By.css('*[class^="ui huge primary icon labeled button"]')).click();
    await driver.findElement(By.css('*[class^="ui huge primary fluid labeled icon button"]')).click();

    // Preenchendo os dados do checkout
    await driver.findElement(By.id('sylius_checkout_address_customer_email')).sendKeys('user@gmail.com');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_firstName')).sendKeys('user name');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_lastName')).sendKeys('last name');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_company')).sendKeys('center');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_street')).sendKeys('center');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_countryCode')).sendKeys('Portugal');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_city')).sendKeys('city');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_postcode')).sendKeys('99999-999');
    await driver.findElement(By.id('sylius_checkout_address_billingAddress_phoneNumber')).sendKeys('(99) 99999-9999');

    // Confirmando dados até finalizar o checkout
    await driver.findElement(By.css('*[class^="ui large primary icon labeled button"]')).click();
    await driver.findElement(By.css('*[class^="ui large primary icon labeled button"]')).click();
    await driver.findElement(By.css('*[class^="ui large primary icon labeled button"]')).click();
    await driver.findElement(By.css('*[class^="ui huge primary fluid icon labeled button"]')).click();

    // Login no admin
    await driver.get('https://yourwebsite.com/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
  });

  afterEach(async () => {
    await driver.quit();
  });

  it('Completing a new payment', async () => {
    await driver.findElement(By.css('a[href="/admin/payments/"]')).click();
    await driver.findElement(By.id('criteria_state')).sendKeys('new');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('*[class^="ui loadable teal labeled icon button"]')).click();
    const body = await driver.findElement(By.tagName('body')).getText();
    expect(body).toContain('Payment has been completed.');
  });

  it('Removing filters', async () => {
    await driver.findElement(By.css('a[href="/admin/payments/"]')).click();
    await driver.findElement(By.id('criteria_state')).sendKeys('cancelled');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('*[class^="ui labeled icon button"]')).click();
    const stateValue = await driver.findElement(By.id('criteria_state')).getAttribute('value');
    expect(stateValue).toBe('All');
  });

  it('Refunding a customer', async () => {
    await driver.findElement(By.css('a[href="/admin/payments/"]')).click();
    await driver.findElement(By.id('criteria_state')).sendKeys('completed');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    
    const orders = await driver.findElements(By.css('a[href^="/admin/orders/"]'));
    if (orders.length > 0) {
      await orders[0].click();
    }
    
    await driver.findElement(By.css('*[class^="ui icon labeled tiny yellow fluid loadable button"]')).click();
    const body = await driver.findElement(By.tagName('body')).getText();
    expect(body).toContain('Payment has been successfully refunded.');
  });

  it('Cancelling an order', async () => {
    await driver.findElement(By.css('a[href="/admin/payments/"]')).click();
    await driver.findElement(By.id('criteria_state')).sendKeys('new');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const orders = await driver.findElements(By.css('a[href^="/admin/orders/"]'));
    if (orders.length > 0) {
      await orders[0].click();
    }

    await driver.findElement(By.css('*[class^="ui yellow labeled icon button"]')).click();
    await driver.findElement(By.css('*[class^="ui green ok inverted button"]')).click();

    const body = await driver.findElement(By.tagName('body')).getText();
    expect(body).toContain('Order has been successfully updated.');
  });

  // Continue converting other tests similarly...
});
