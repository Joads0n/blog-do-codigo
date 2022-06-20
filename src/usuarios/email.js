const nodemailer = require('nodemailer');

class Email {
    
    async sendEmail() {
        const acountTest = await nodemailer.createTestAccount();
        const transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            auth: acountTest,
        });
        const info = await transport.sendMail(this);
    
        //console.log('URL: ' + nodemailer.getTestMessageUrl(info));
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