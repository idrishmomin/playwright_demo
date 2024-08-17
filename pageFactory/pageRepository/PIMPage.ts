import { Browser, BrowserContext, Locator, Page } from "@playwright/test";

export class PIMPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly PIM_MENU_OPTION: Locator;
    readonly ADD_BUTTON: Locator;
    readonly FIRSTNAME_INPUTBOX: Locator;
    readonly MIDDLENAME_INPUTBOX: Locator;
    readonly LASTNAME_INPUTBOX: Locator;
    readonly CREATE_LOGIN_DETAILS_TOGGLE: Locator
    readonly USERNAME: Locator
    readonly PASSWORD: Locator
    readonly CONFIRM_PASSWORD: Locator
    readonly SAVE_BUTTON: Locator

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.PIM_MENU_OPTION = page.locator("(//a[@class='oxd-main-menu-item'])[2]");
        this.ADD_BUTTON = page.locator("//button[contains(.,'Add')]");
        this.FIRSTNAME_INPUTBOX = page.locator("//input[@placeholder='First Name']");
        this.MIDDLENAME_INPUTBOX = page.locator("//input[@placeholder='Middle Name']");
        this.LASTNAME_INPUTBOX = page.locator("//input[@placeholder='Last Name']");
        this.CREATE_LOGIN_DETAILS_TOGGLE = page.locator("//input[@type='checkbox']/following-sibling::span[1]");
        this.USERNAME = page.locator("(//label[normalize-space(text())='Username']/following::input)[1]");
        this.PASSWORD = page.locator("(//input[@type='password'])[1]");
        this.CONFIRM_PASSWORD = page.locator("//label[normalize-space(text())='Confirm Password']/following::input");
        this.SAVE_BUTTON = page.locator("//button[contains(.,'Save')]");
    }

    async addEmployee() {  
      await this.PIM_MENU_OPTION.click();
      await this.ADD_BUTTON.click();
      await this.FIRSTNAME_INPUTBOX.fill("Aishwarya");
      await this.MIDDLENAME_INPUTBOX.fill("Suryakant");
      await this.LASTNAME_INPUTBOX.fill("Parab");
      await this.CREATE_LOGIN_DETAILS_TOGGLE.click();
      const username = await this.generateRandomUsername();
      await this.USERNAME.fill(username);
      await this.PASSWORD.fill("Aishwarya123");
      await this.CONFIRM_PASSWORD.fill("Aishwarya123");
      await this.SAVE_BUTTON.click();

    }
    //Generate random username
    async generateRandomUsername(length: number = 8): Promise<string> {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let username = '';
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          username += characters[randomIndex];
      }
      return username;
  }
  
}