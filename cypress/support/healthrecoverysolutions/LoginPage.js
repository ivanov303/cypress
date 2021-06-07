import { BasePage } from './BasePage'

class LoginPage extends BasePage {

    get emailOrUserNameField(){
        return cy.get('#loginEmail')
    }

    get passwordField(){
        return cy.get('#password')
    }

    get signInButton(){
        return cy.get('#loginSubmitButton')
    }

    get forgotPasswordButton(){
        return cy.get('.qa-login--link-forgot_password')
    }

    get errorNotification(){
        return cy.contains('Username and/or password invalid')
    }

    get resetPasswordUserNameField(){
        return cy.get('#resetPassword_username')
    }

    get resetPasswordBackButton(){
        return cy.get('#resetPasswordBackButton')
    }

    get resetPasswordSaveButton(){
        return cy.get('#resetPasswordSaveButton')
    }

    get resetPasswordRequestSentMessage(){
        return cy.contains('Reset password request successfully submitted.')
    }

    // ======= commands ========

    checkFillInNotification(el){
        el.then(($input) => {
            expect($input[0].validationMessage).to.eq('Please fill in this field.');
            expect($input[0]).to.be.enabled;
        })
    }

    clickSignInButton(){
        this.clickOn(this.signInButton)
    }

    clickForgotPasswordButton(){
        this.clickOn(this.forgotPasswordButton)
    }

    typeInEmailOrUserNameField(emailOrUser){
        this.typeIn(this.emailOrUserNameField, emailOrUser)
    }

    typeInPasswordField(emailOrUser){
        this.typeIn(this.passwordField, emailOrUser)
    }

    loginAs(user){
        this.typeIn(this.emailOrUserNameField, user.name)
        this.typeIn(this.passwordField, user.password)
        this.clickSignInButton();
    }

}

export const loginPage = new LoginPage()