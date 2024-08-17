import { test as baseTest, Page, Browser, BrowserContext } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { RecruitmentPage } from '@pages/RecruitmentPage';
import * as dotenv from 'dotenv';
import { PIMPage } from '@pages/PIMPage';
import { HomePage } from '@pages/HomePage';

dotenv.config();

const caps = {
    'build': 'playwright-build-' + Math.floor(Math.random() * 300),
    'browserstack.username': process.env.BROWSERSTACK_USERNAME,
    'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'browser': process.env.BROWSER_NAME,
    'os': process.env.OS,
    'os_version': process.env.OS_VERSION,
};

const test = baseTest.extend<{
    loginPage: LoginPage;
    homePage:HomePage;
    pimPage: PIMPage;
    recruitmentPage: RecruitmentPage;
}>({

    page: async ({ playwright }, use, testInfo) => {
        let browser: Browser;
        let context: BrowserContext;
        let page: Page;

        if (process.env.RUN_ON_BROWSERSTACK === 'true') {
            browser = await playwright.chromium.connect({
                wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,
            });
            context = await browser.newContext(testInfo.project.use);
        } else {
            browser = await playwright.chromium.launch();
            context = await browser.newContext(testInfo.project.use);
        }

        page = await context.newPage();
        await use(page);

        await page.close();
        await context.close();
        await browser.close();
    },


    loginPage: async ({ page, context }, use) => {
        await use(new LoginPage(page, context));
    },

     homePage: async ({ page, context }, use) => {
        await use(new HomePage(page, context));
    },

    pimPage: async ({ page, context }, use) => {
        await use(new PIMPage(page, context));
    },

    recruitmentPage: async ({ page, context }, use) => {
        await use(new RecruitmentPage(page, context));
    },

})

export default test;