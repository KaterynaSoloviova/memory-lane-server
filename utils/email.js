const nodemailer = require("nodemailer");

// Send invitation email using nodemailer
const sendInvitationEmail = async (to, invitationLink) => {
  try {
    await sendEmail(
      to,
      "You're Invited to a Time Capsule! 🎉",
      `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4a90e2;">You're Invited to a Time Capsule! 🎉</h2>
      <p>Hi there,</p>
      <p>You’ve been invited to join a special <strong>Time Capsule</strong>! To unlock and view this capsule, please <strong>register an account</strong> on our platform.</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${invitationLink}" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Create Your Account & Access Your Capsule</a>
      </p>
      <p>Please use this email address to sign up, as it’s linked to your invitation. Don’t worry — once you’re registered, you can update your email anytime inside your profile.</p>
      <p>We can’t wait for you to explore the memories and messages saved just for you!</p>
      <p>If you have any questions, just reply to this email.</p>
      <p>Warm wishes,<br>The Time Capsule Team</p>
    </div>
  `,
    );
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};


// Send unlock capsule email using nodemailer
const sendUnlockCapsuleEmail = async (to, title, capsuleLink) => {
  try {
    console.log(`Sending unlock capsule email to ${to} with link ${capsuleLink}`);
    await sendEmail(
      to,
      `Your Time Capsule ${title} is Unlocked! 🎉`,
      `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4a90e2;">Your Time Capsule is Unlocked! 🎉</h2>
      <p>Hi there,</p>
      <p>Your Time Capsule is now unlocked! You can view the contents and messages shared by your friends and family.</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${capsuleLink}" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Your Capsule</a>
      </p>
      <p>Warm wishes,<br>The Memory Lane Team</p>
    </div>
  `);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`Sending email to ${to} with subject ${subject}`);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PWD,
      },
    });

    // Email options
    const mailOptions = {
      from: "memorylane.emailnotifications@gmail.com",
      to,
      subject,
      html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail,
  sendUnlockCapsuleEmail,
  sendEmail,
};
