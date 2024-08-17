import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly CHANGE_LANGUAGE_BUTTON: Locator;
    readonly ENGLISH_LANGUAGE_BUTTON: Locator;
    readonly CHINESE_LANGUAGE_BUTTON: Locator;
    readonly CHANGE_LANGUAGE_POPUP_CONFIRM_BUTTON: Locator;
    readonly FORUM: Locator;
    readonly COMMUNITY: Locator;
    readonly PRIMER: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.CHANGE_LANGUAGE_BUTTON = page.locator('[data-testid="language-icon-button"]');
        this.ENGLISH_LANGUAGE_BUTTON = page.locator(`//button[@data-testid='languageSelector-button-en']`);
        this.CHINESE_LANGUAGE_BUTTON = page.locator(`//button[@data-testid='languageSelector-button-zh']`);
        this.CHANGE_LANGUAGE_POPUP_CONFIRM_BUTTON = page.locator("(//div[@class='MuiBox-root css-18pmhcu']//button)[2]");
        this.FORUM = page.getByRole('tab', { name: 'Forum' });
        this.COMMUNITY = page.getByRole('tab', { name: 'Community' });
        this.PRIMER = page.getByRole('tab', { name: 'Primer' });
    }

    async getCardsCount(): Promise<number> {
        return await this.page.locator(`(//div[@class='MuiBox-root css-0'])`).count();
    }

    async openRecrutment(): Promise<void> {
        await this.page.locator('(//li[@class="oxd-main-menu-item-wrapper"])[5]').click();
    }
    async checkIfBookMarked(card: number): Promise<boolean> {
        await this.page.waitForLoadState('load');
        await this.page.locator(`(//button[@class='MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1cweq8y'])[${card}]`).click();
        var isBookMarked = await this.page.locator(`(//*[@class="PrivateSwitchBase-input css-1m9pwf3"])[1]`).isChecked();
        return isBookMarked;
    }

    async createBookMark(): Promise<void> {
        await this.page.locator(`(//input[@class='PrivateSwitchBase-input css-1m9pwf3'])[1]`).check();
    }

    async alertpage(): Promise<void> {
        // await this.page.locator(`(//div[@class='MuiListItemIcon-root css-16lzz5c']//div)[1]`).click();
        await this.page.getByRole('link', { name: 'Alerts' }).click();
    }

    async browsepage(): Promise<void> {
        await this.page.getByRole('link', { name: 'Browse' }).click();
    }

    async forumTab(): Promise<void> {
        await this.page.locator(`(//div[@class='MuiTabs-flexContainer css-7sga7m']//a)[2]`).click();
    }

    async closeBookMarkCardPopup(): Promise<void> {
        await this.page.waitForLoadState("load");
        await this.page.locator(`(//h6[contains(@class,'MuiTypography-root MuiTypography-h6')]/following-sibling::button)[1]`).click();
        // await this.page.goBack();
    }

    async changeLanguage(language: string): Promise<void> {
        await this.CHANGE_LANGUAGE_BUTTON.click();
        if (language == 'ENGLISH') {
            await this.ENGLISH_LANGUAGE_BUTTON.click();
        } else {
            await this.CHINESE_LANGUAGE_BUTTON.click();
        }
        await this.CHANGE_LANGUAGE_POPUP_CONFIRM_BUTTON.click();
        await this.page.waitForLoadState("load");
    }


    async checkUpcomingInterviews(page: Page): Promise<number> {
        await page.locator('text="Show Upcoming"').click();
        const currentDate = new Date();

        const interviewDates = await page.$$eval(
            '.MuiCard-root.css-ocfy66',
            cards => cards.map(card => {
                const dateText = card.querySelector('MuiTypography-root MuiTypography-body3 css-1mjq0hd')?.textContent?.trim();
                return new Date(dateText);
            })
        );

        const allUpcoming = interviewDates.map(date => date.getTime() > currentDate.getTime());
        return allUpcoming.length;
    }


    async applyFilters(page: Page): Promise<number> {
        await page.locator('text="Show Upcoming"').click();
        const currentDate = new Date();

        const interviewDates = await page.$$eval(
            '.MuiCard-root.css-ocfy66',
            cards => cards.map(card => {
                const dateText = card.querySelector('MuiTypography-root MuiTypography-body3 css-1mjq0hd')?.textContent?.trim();
                return new Date(dateText);
            })
        );

        const allUpcoming = interviewDates.map(date => date.getTime() > currentDate.getTime());
        return allUpcoming.length;
    }

    async setUpAndCheckNotification(): Promise<string | null> {
        const setUpNotificationXPath = `//span[@aria-label='Set up Transcript Notification']`;
        await this.page.locator(setUpNotificationXPath).first().waitFor({ timeout: 20000 });
        await this.page.locator(setUpNotificationXPath).first().click();

        const titleText = await this.page.locator("//div[@class='MuiBox-root css-maj3td']/following-sibling::*/h6").textContent();
        console.log(`Title of the interview: ${titleText}`);

        await this.page.locator("//button[contains(.,'Confirm')]").click();

        await this.page.locator("//div[@class='MuiBox-root css-zjm5l']//li[3]").click();
        await this.page.locator("//span[normalize-space()='Notifications']").waitFor({ timeout: 20000 });
        await this.page.locator("//span[normalize-space()='Notifications']").click();
        await this.page.waitForTimeout(5000);

        const notificationList = await this.page.locator('div[data-field="interviewTitle"] .MuiDataGrid-cellContent').allTextContents();
        console.log(`Notifications list: ${notificationList.join(', ')}`);

        return notificationList.includes(titleText) ? titleText : null;
    }


    async checkForumCards(): Promise<void> {
        await this.FORUM.click();
        const cardSelector = '.MuiCard-root.css-ocfy66';
        const cards = this.page.locator(cardSelector);
        const cardCount = await cards.count();
        console.log('Total Number of Forum Cards:', cardCount);
        if (cardCount === 0) {
            console.log('No cards found.');
            return;
        }

        for (let i = 0; i < cardCount; i++) {

            const card = cards.nth(i);
            const textContent = await card.locator("//span[contains(@class, 'MuiTypography-root') and text()='FORUM']").textContent();
            // const textContent = await card.locator('text=FORUM').textContent();
            if (textContent?.includes('FORUM')) {
                // console.log('Forum card found:', await card.innerHTML());
                const href = await card.locator('a').getAttribute('href');
                // console.log('Forum card link:', href);
            } else {
                console.log('Non-forum card found:', await card.innerHTML());
            }
        }

    }


    async checkCommunityCards(): Promise<void> {
        await this.COMMUNITY.click();
        const cardSelector = '.MuiCard-root.css-ocfy66';
        const cards = this.page.locator(cardSelector);
        const cardCount = await cards.count();
        console.log('Total Number of Community Cards:', cardCount);
        if (cardCount === 0) {
            console.log('No cards found.');
            return;
        }

        for (let i = 0; i < cardCount; i++) {

            const card = cards.nth(i);
            const textContent = await card.locator('text=COMMUNITY').textContent();
            if (textContent?.includes('COMMUNITY')) {
                // console.log('Forum card found:', await card.innerHTML());
                const href = await card.locator('a').getAttribute('href');
                // console.log('Community card link:', href);
            } else {
                console.log('Non-forum card found:', await card.innerHTML());
            }
        }

    }


    async checkPrimerCards(): Promise<void> {
        await this.PRIMER.click();
        const cardSelector = '.MuiCard-root.css-ocfy66';
        const cards = this.page.locator(cardSelector);
        const cardCount = await cards.count();
        console.log('Total Number of Primer Cards:', cardCount);
        if (cardCount === 0) {
            console.log('No cards found.');
            return;
        }

        for (let i = 0; i < cardCount; i++) {

            const card = cards.nth(i);
            const textContent = await card.locator('text=PRIMER').textContent();
            if (textContent?.includes('PRIMER')) {
                // console.log('Forum card found:', await card.innerHTML());
                const href = await card.locator('a').getAttribute('href');
                // console.log('Primer card link:', href);
            } else {
                console.log('Non-forum card found:', await card.innerHTML());
            }
        }

    }

    async navigateToInterviewDetailsTab(cardCount: number): Promise<void> {
        var endPoint = await this.page.locator(`(//div[contains(@class,'MuiPaper-root MuiPaper-outlined')]//a)[${cardCount}]`).getAttribute('href');
        var URL = 'https://forum.thirdbridge.com' + endPoint;
        await this.page.goto(URL);
    }

}