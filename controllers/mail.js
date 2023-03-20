const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajay@spakcomm.com',
        pass: 'ajayundershivbhai'
    }
});

let mailOptions = {
    from: 'ajay@spakcomm.com',
    to: 'ajay@spakcomm.com',
    subject: 'Sending Email using Node.js',
    html: null
};

exports.MailOptions = (options) => {
    mailOptions.subject = options.subject;
    mailOptions.html = options.html;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


