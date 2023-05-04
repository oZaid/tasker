const nodeMailer = require('nodemailer');
const pug = require('pug')

module.exports = class Email {
  constructor(user, url) {
    this.user = user;
    this.to = user.email;
    this.firstName = user.username;
    this.url = url;
    this.from = `Tasker Support <${process.env.Email}>`
  }

  transporter() {
    return nodeMailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS
      }
    })
  }

  async sendReset() {
    const subject = 'Tasker | Reset You Password!';
    const html = pug.renderFile(`${__dirname}/../views/email/passwordReset.pug`, {
      // this info will be recived in pug file
      user: this.user,
      firstName: this.firstName,
      url: this.url,
      subject
    })

    const mailOptions = {
      from: this.from,
      to: this.user.email,
      subject,
      html,
    }

    await this.transporter().sendMail(mailOptions);
  }

}