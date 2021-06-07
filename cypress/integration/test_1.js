import { loginPage } from "../support/healthrecoverysolutions/LoginPage";

const user = {
    name: 'Johnson',
    password: '12345',
}

describe('Login suite', () => {
    beforeEach('Open Login page', () => {
        cy.visit(Cypress.env('host'))
    });

    it('All buttons and fields should be present', () => {
        loginPage.emailOrUserNameField.should('be.visible').and('be.enabled')
        loginPage.passwordField.should('be.visible').and('be.enabled')
        loginPage.signInButton.should('be.visible').and('be.disabled')
        loginPage.forgotPasswordButton.should('be.visible');
    });

    it('Login with invalid data', () => {
        loginPage.loginAs(user);
        loginPage.errorNotification.should('be.visible')
    });

    it('Login with empty password field', () => {
        loginPage.typeInEmailOrUserNameField(user.name)
        loginPage.clickSignInButton();
        loginPage.checkFillInNotification(loginPage.passwordField)
    });

    it('Login with empty email field', () => {
        loginPage.typeInPasswordField(user.password)
        loginPage.clickSignInButton();
        loginPage.checkFillInNotification(loginPage.emailOrUserNameField)
    });

    it('Forgot password elements', () => {
        loginPage.clickForgotPasswordButton();
        loginPage.resetPasswordSaveButton.should('be.visible').and('be.enabled')
        loginPage.resetPasswordBackButton.should('be.visible').and('be.enabled')
        loginPage.resetPasswordUserNameField.should('be.visible').and('be.enabled')
    });

    it('Forgot password and back', () => {
        loginPage.clickForgotPasswordButton();
        loginPage.resetPasswordBackButton.click();
        loginPage.signInButton.should('be.visible').and('be.disabled')
    });

    it('Forgot password and send email', () => {
        loginPage.clickForgotPasswordButton();
        loginPage.resetPasswordUserNameField.type('fake');
        loginPage.resetPasswordSaveButton.click();
        loginPage.resetPasswordRequestSentMessage.should('be.visible')
    });
})

describe('Login API', () => {

    const url = Cypress.env('url')
    it('Login.html API test', () => {
        cy.request(url + '/app/login/Login.html')
            .then((resp) => {
                expect(resp.status).to.equal(200);
                expect(resp.headers).to.have.property('content-type').to.equal('text/html');
            })
    });

    it('MainComponent.html API test', () => {
        cy.request(url + '/app/MainComponent/MainComponent.html')
            .then((resp) => {
                expect(resp.status).to.equal(200);
                expect(resp.headers).to.have.property('content-type').to.equal('text/html');
            })
    });

    it('ForgotPassword.html API test', () => {
        cy.request(url + '/app/forgotPassword/ForgotPassword.html')
            .then((resp) => {
                expect(resp.status).to.equal(200);
                expect(resp.headers).to.have.property('content-type').to.equal('text/html');
            })
    });

    it('EmbeddableConfig API test', () => {
        cy.request(url + '/embeddable/config')
            .then((resp) => {
                expect(resp.status).to.equal(200);
                expect(resp.headers).to.have.property('content-type').to.equal('text/html');
            })
    });

    it('Zendesk embeddable_blip API test', () => {
        cy.request('https://healthrecoverysolutions.zendesk.com' + '/embeddable_blip')
            .then((resp) => {
                expect(resp.status).to.equal(200);
        });
    });

    it('Invalid login credentials API test', () => {
        const requestBody = {
            data: {
                password: user.password,
                source: "ClinicianConnect 2",
                type: "credentials",
                username: user.name
            }
        }
        const headersData = {
            'Content-Type': 'application/json',
        }
        cy.request({
            method: 'POST',
            url: 'https://gateway.healthrecoverysolutions.com' + '/v1/tokens',
            body: requestBody,
            headers: headersData,
            failOnStatusCode:false
        }).then((resp) => {
            expect(resp.status).to.equal(422)
            expect(resp.body.message).to.equal("Invalid Credentials")
        })
    });

    it('Password recovery request', () => {
        const requestBody = {
            data: {
                landing_url: 'https://cc.healthrecoverysolutions.com/recovery',
                username: user.name
            }
        }
        const headersData = {
            'Content-Type': 'application/json',
        }
        cy.request({
            method: 'POST',
            url: 'https://gateway.healthrecoverysolutions.com' + '/v1/password-reset-tokens',
            body: requestBody,
            headers: headersData,
            failOnStatusCode: false
        }).then((resp) => {
            expect(resp.status).to.equal(204)
        })
    });
})