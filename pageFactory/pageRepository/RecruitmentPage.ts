import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class RecruitmentPage {
    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;

    }

    async addCandidate(firstName: string, lastName: string, email: string): Promise<void> {
        await this.page.locator('//button[normalize-space()="Add"]').click();
        await this.page.locator('input[placeholder="First Name"]').fill(firstName);
        await this.page.locator('input[placeholder="Last Name"]').fill(lastName);
        await this.page.locator('(//input[@placeholder="Type here"])[1]').fill(email);
        await this.page.locator('//button[normalize-space()="Save"]').click();
    }

    async candidateList(): Promise<void> {
        await this.page.locator(`//nav[@aria-label='Topbar Menu']//li[1]`).click();
    }


    async removeCandidate(name: string): Promise<void> {
        await this.page.locator(`(//button[@class='oxd-icon-button oxd-table-cell-action-space']//i)[2]`).click();
        await this.page.locator(`//button[text()=' No, Cancel ']/following-sibling::button`).click();
    }

    async viewCandidate(name: string): Promise<void> {
        await this.page.locator(`(//button[@class='oxd-icon-button oxd-table-cell-action-space']//i)[1]`).click();
    }


    getRandomLastName(): string {
        const chars = 'abcd';
        let lastName = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            lastName += chars[randomIndex];
        }
        return lastName;
    }



}