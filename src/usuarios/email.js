const { process_params } = require('express/lib/router');
const nodemailer = require('nodemailer');

const emailProdConfig = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    secure: true
};

const emailTestConfig = (accountTest) => ({
    host: 'smtp.ethereal.email',
    auth: accountTest,
});

async function createEmailConfig(){
    if(process.env.NODE_ENV === 'production'){
        return emailProdConfig;
    } else {
        const accountTest = await nodemailer.createTestAccount();
        return emailTestConfig(accountTest);
    }
}

class Email {
    async sendEmail() {
        const emailConfig = await createEmailConfig();
        const transport = nodemailer.createTransport(emailConfig);
        const info = await transport.sendMail(this);
    
        if(process.env.NODE_ENV !== 'production'){
            console.log('URL: ' + nodemailer.getTestMessageUrl(info));
        }
    }
}

class VerificationEmail extends Email{
    constructor(user, address){
        super();
        this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>';
        this.to = user.email;
        this.subject = 'Email Verification';
        this.text = `Hello! Check your email here: ${address}`;
        this.html = `<h1>Hello!</h1> <p>Check your email here: <a href="${address}">${address}</a></p>`;
    }
}

module.exports = { VerificationEmail }