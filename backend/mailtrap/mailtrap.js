const {MailtrapClient} = require("mailtrap");

require("dotenv").config();
/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const SENDER_EMAIL = "hello@demomailtrap.co";

const mailtrapClient = new MailtrapClient({ token: TOKEN });

const sender = { name: "Bloom Shop", email: SENDER_EMAIL };

module.exports = { mailtrapClient, sender };