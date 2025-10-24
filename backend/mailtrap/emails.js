const { mailtrapClient, sender } = require("./mailtrap");
const asyncHandler = require("../middleware/asyncHandler.js");
const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplates.js");

const sendVerificationEmail = asyncHandler(async (recipientEmail, verificationToken) => {
    const recipient = [{ email: recipientEmail }];

    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Email Verification",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        category: "Verification Emails",
    })

    console.log('email sent successfully:', response);
});

const sendWelcomeEmail = asyncHandler(async (recipientEmail, name) => {
    const recipient = [{ email: recipientEmail }];

    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        template_uuid: "a5260eac-7ce6-4bec-8d15-58f12932bae9",
        template_variables: { name: name },
        
    })

    console.log('Welcome email sent successfully:', response);
});

module.exports = { sendVerificationEmail, sendWelcomeEmail };