import BasePage from './BasePage';


export default class ToolTipsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.button = page.locator('#toolTipButton');
        this.textField = page.locator('#toolTipTextField');
        this.contraryLink = page.getByRole('link', { name: 'Contrary' });
        this.sectionLink = page.getByRole('link', { name: '1.10.32' });
        // this.tooltip = page.locator('.tooltip-inner');
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

        await targetLocator.scrollIntoViewIfNeeded();
        await this.page.mouse.move(0, 0); // сброс мыши
        await this.page.waitForTimeout(200);

        let tooltipText = '';

        for (let i = 0; i < 3; i++) {
            await this.page.hover('body'); // "очистка" предыдущего ховера
            await this.page.waitForTimeout(200);
            await targetLocator.hover({ force: true });

            try {
                await tooltipLocator.waitFor({ state: 'visible', timeout: 2000 });

                const tooltips = await tooltipLocator.allTextContents();
                const lastTooltip = tooltips.length > 0 ? tooltips[tooltips.length - 1]?.trim() : '';

                if (lastTooltip && lastTooltip !== tooltipText) {
                    tooltipText = lastTooltip;
                    break;
                }
            } catch {
                console.warn(`Tooltip not visible (attempt ${i + 1})`);
            }

            await this.page.waitForTimeout(200);
        }

        if (!tooltipText) {
            throw new Error(`Tooltip not found for element "${elementName}"`);
        }

        return tooltipText;
    }
}
