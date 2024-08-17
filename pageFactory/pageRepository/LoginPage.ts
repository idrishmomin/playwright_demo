import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class LoginPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly USERNAME_EDITBOX: Locator;
    readonly PASSWORD_EDITBOX: Locator;
    readonly LOGIN_BUTTON: Locator;
    
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.USERNAME_EDITBOX = page.locator("//input[@placeholder='Username']");
        this.PASSWORD_EDITBOX = page.locator("//input[@placeholder='Password']");
        this.LOGIN_BUTTON = page.locator("//button[contains(.,'Login')]");      
    }
    async login(): Promise<void> {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/');
        await this.USERNAME_EDITBOX.fill("Admin");
        await this.PASSWORD_EDITBOX.fill("admin123");
        await this.LOGIN_BUTTON.click();
    }  
}