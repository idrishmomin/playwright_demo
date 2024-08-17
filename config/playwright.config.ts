import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
// import { testConfig } from '../testConfig';
import * as dotenv from 'dotenv';
dotenv.config();

const ENV = 'qa';
const browserNm = process.env.BROWSER_NAME as 'chromium' | 'chrome' | 'firefox' | 'webkit' | 'edge';
const URL = process.env.WEB_URL;


if (browserNm && !['chromium', 'chrome', 'firefox', 'webkit', 'edge'].includes(browserNm)) {
  throw new Error(`Unsupported browser: ${browserNm}`);
}
if (!ENV || ![`qa`, `dev`, `qaApi`, `devApi`].includes(ENV)) {
  console.log(`Please provide a correct environment value after command like "--ENV=qa|dev|qaApi|devApi"`);
  process.exit();
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const config = defineConfig({
  //Global Setup to run before all tests
  globalSetup: `../global-setup`,

  //sets timeout for each test case
  timeout: 120000,

  //number of retries if test case fails
  retries: 0,

  workers: 2,

  //Reporters
  reporter: [['list'], ['playwright-html', {
    testFolder: 'tests',
    title: 'Playwright HTML Report',
    project: 'QA Tests',
    testEnvironment: 'DEV',
    embedAssets: true,
    embedAttachments: true,
    outputFolder: 'playwright-html-report',
    minifyAssets: true,
    startServer: true,
  }], [`html`, { outputFolder: '../html-report' }]],


  projects: [
    {
      use: {
        // Configure the browser to use.
        browserName: browserNm === 'chrome' || browserNm === 'edge' ? 'chromium' : (browserNm || 'chromium'),
        ...(browserNm === 'chrome' ? { channel: 'chrome' } : {}),
        ...(browserNm === 'edge' ? { channel: 'msedge' } : {}),

        //Picks Base Url based on User input
        baseURL: URL,
        actionTimeout: 200000, // Timeout for each action (click, fill, etc.)
        navigationTimeout: 600000, // Timeout for each navigation

        //Browser Mode
        headless: true,

        //Browser height and width
        viewport: { width: 1500, height: 730 },
        ignoreHTTPSErrors: true,

        //Enable File Downloads in Chrome
        acceptDownloads: true,

        //Artifacts
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,

        //Slows down execution by ms
        launchOptions: {
          slowMo: 0
        }
      },
    },
  ],
});
