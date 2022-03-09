const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const { config } = require("../config");
const logger = require("../utils/logger");

const SERVICE = config.serverEmail.service;
const HOST = config.serverEmail.host;
const FROM = `${config.serverEmail.from} <config.serverEmail.user>`;
const USER = config.serverEmail.user;
const PASSWORD = config.serverEmail.password;

exports.sendEmail = async (to, subject, content, models) => {
  try {
    if (!to) return;

    logger.log({
      service: SERVICE,
      host: HOST,
      auth: {
        user: USER,
        pass: PASSWORD,
      },
    });

    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: SERVICE,
        host: HOST,
        auth: {
          user: USER,
          pass: PASSWORD,
        },
      })
    );

    const mailOptions = {
      from: FROM,
      to: to,
      subject: subject,
      html: replaceVariables(content, models),
    };

    const info = await transporter.sendMail(mailOptions);

    logger.log("sent email", info);

    //transporter.close();

    return info;
  } catch (error) {
    logger.error("error sent mail", error);
  }
};

const replaceVariables = (content, models) => {
  let header = "";

  if (content.includes(`<style`)) {
    const html = splitHeader(content);
    content = html.content;
    header = html.header;
  }

  Object.keys(models)
    .concat(Object.keys(models))
    .forEach((model) => (content = content.replace(`{{${model}}}`, models[model])));

  return htmlBody(content, header);
};

const splitHeader = (content) => {
  let header = "";
  content = content.split("<style");

  content = content.reduce((sum, content_) => {
    const result = content_.split(`</style>`);
    if (result.length === 1) return sum.concat(result[0]);

    header = header.concat(`<style` + result[0] + `</style>`);
    return sum.concat(result[1]);
  }, "");

  return { content, header };
};

const htmlBody = (content, head) =>
  `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Type"
          content="text/html; charset=utf-8"/>
      <meta
        name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
      />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Email</title>
      ${head}
    </head>
    <body>
      ${content}
    </body>
  </html>`;
