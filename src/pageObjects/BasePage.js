export default class BasePage {
    constructor(page) {
        this.page = page;
    }

    async clickOnButton(name) {
        await this.page.getByRole('button', { name }).click({ force: true });
    }
    async removeFixedBanner() {
        await this.page.evaluate(() => {
            const fixedBan = document.querySelector('#fixedban');
            if (fixedBan) fixedBan.remove();

            const footer = document.querySelector('footer');
            if (footer) footer.remove();

            const overlays = document.querySelectorAll('.overlay, .modal-backdrop, .advertisement, .ads, .popup, .banner');
            overlays.forEach(el => el.remove());
        });
        await this.page.waitForTimeout(500);
    }
}
