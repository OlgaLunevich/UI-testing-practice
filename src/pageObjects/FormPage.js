import {BasePage} from './index';
import UserCreator from "../helpers/UserCreator";
import DataStorage from "../helpers/DataStorage";

export default class FormPage extends BasePage {
    constructor(page) {
        super(page);
        this.firstNameField = page.locator('//input[@id="firstName"]');
        this.lastNameField = page.locator('//input[@id="lastName"]');
        this.genderRadioButton = button => page.locator(`//input[@value="${button}"]`);
        this.mobileNumberField = page.locator('//input[@id="userNumber"]');
        this.modalWindowForm = page.locator('//div[@class="modal-content"]');
        this.modalWindowFormField = field => page.locator(`//td[contains(text(), "${field}")]/following-sibling::*`)
    }
    async fillMandatoryFormFields(userName, userNumber){
        const user = UserCreator.createUser();
        await DataStorage.setNamespace(userName, userNumber, user);
        await this.firstNameField.fill(user.firstName);
        await this.lastNameField.fill(user.lastName);

        await this.clickOnGenderRadioButton(user.gender);

        await this.mobileNumberField.fill(user.phoneNumber);
    }

    async clickOnGenderRadioButton(buttonName){
        const radioButton = this.genderRadioButton(buttonName);
        await radioButton.waitFor({ state: 'visible' });
        const box = await radioButton.boundingBox();
        if (!box) {
            throw new Error('Radio button is not visible or not found on the page');
        }
        await radioButton.click({ force: true });
    }
}