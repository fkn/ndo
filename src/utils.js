import mailgun from 'mailgun-js';
import config from './config';

const mailUtil = mailgun(config.emailSendConfig);
const sendEmail = (to, message, attachment) =>
  new Promise((resolve, reject) => {
    const { text, html, subject } = message;
    const data = {
      from: 'NDO team <info@ndoproject.com>',
      to,
      subject,
      text,
      inline: attachment,
      html,
    };

    mailUtil.messages().send(data, error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });

export default { sendEmail };
