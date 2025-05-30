import BasePage from './BasePage';


export default class ToolTipsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.button = page.locator('#toolTipButton');
        this.textField = page.locator('#toolTipTextField');
        this.contraryLink = page.locator('a', { hasText: 'Contrary' });
        this.sectionLink = page.locator('a', { hasText: '1.10.32' });
        this.tooltip = page.locator('.tooltip-inner');
    }


    async hoverAndGetTooltipText(elementName) {
        let targetLocator;

        switch (elementName) {
            case 'Button':
                targetLocator = this.button;
                break;
            case 'Text Field':
                targetLocator = this.textField;
                break;
            case 'Contrary':
                targetLocator = this.contraryLink;
                break;
            case 'Section':
                targetLocator = this.sectionLink;
                break;
            default:
                throw new Error(`Unknown element name: ${elementName}`);
        }

        const tooltipLocator = this.page.locator('.tooltip-inner');

        await this.page.locator('body').hover();
        await this.page.waitForTimeout(300);

        await targetLocator.scrollIntoViewIfNeeded();

        let tooltipText = '';
        for (let i = 0; i < 3; i++) {
            await targetLocator.hover();

            await tooltipLocator.waitFor({ state: 'visible', timeout: 5000 });

            const tooltips = await tooltipLocator.allTextContents();
            const lastTooltip = tooltips[tooltips.length - 1].trim();

            if (lastTooltip !== tooltipText) {
                tooltipText = lastTooltip;
                break;
            }

            await this.page.waitForTimeout(300);
        }
        return tooltipText;
    }
}
