// @ts-check
import { defineConfig } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',
    // fullyParallel: true,
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // workers: process.env.CI ? 1 : undefined,
    workers: 1,
    timeout: 30000,

    reporter: 'html',

    use: {
        headless: true,
        screenshot: 'only-on-failure',
        video: 'off',
        baseURL: 'https://demoqa.com',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'Chrome-1920x1080',
            use: {
                browserName: 'chromium',
                viewport: { width: 1920, height: 1080 },
            },
        },
        {
            name: 'Chrome-1366x768',
            use: {
                browserName: 'chromium',
                viewport: { width: 1366, height: 768 },
            },
        },
        {
            name: 'Firefox-1920x1080',
            use: {
                browserName: 'firefox',
                viewport: { width: 1920, height: 1080 },
            },
        },
        {
            name: 'Firefox-1366x768',
            use: {
                browserName: 'firefox',
                viewport: { width: 1366, height: 768 },
            },
        },
    ],
})
