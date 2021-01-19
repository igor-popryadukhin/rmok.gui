
Feature('Авторизация');

Scenario('Тестирование процесса авторизации...', ({ I }) => {
    I.amOnPage('/administrator');
    I.fillField('//*[@name="login"]', 'admin');
    I.fillField('//*[@name="password"]', 'admin');
    I.click('//*[@id="v-btn-sig-in"]');
    I.see('для администратора', 'div');
});
