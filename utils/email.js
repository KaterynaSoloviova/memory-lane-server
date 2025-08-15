const nodemailer = require("nodemailer");

// Send invitation email using nodemailer
const sendInvitationEmail = async (to, invitationLink) => {
  try {
    await sendEmail(
      to,
      "You're Invited to a Time Capsule! 🤎",
      `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Memory Lane Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FBF8F3; font-family: 'Georgia', serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FBF8F3;">
        <!-- Decorative header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 20px; height: 20px; background-color: #B07B4F; border-radius: 50%; margin: 0 auto 10px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; left: -50px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; right: -50px;"></div>
          </div>
        </div>
        
        <!-- Main title -->
        <h1 style="text-align: center; color: #7A4F30; font-size: 32px; font-weight: bold; margin: 0 0 20px 0; font-family: 'Georgia', serif;">
          🤎 Memory Lane 🤎
        </h1>
        
        <!-- Decorative mid-section -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 16px; height: 16px; background-color: #B07B4F; transform: rotate(45deg); margin: 0 auto 10px;"></div>
            <div style="width: 80px; height: 1px; background-color: #B07B4F; position: absolute; top: 8px; left: -40px;"></div>
            <div style="width: 80px; height: 1px; background-color: #B07B4F; position: absolute; top: 8px; right: -40px;"></div>
          </div>
        </div>
        
        <!-- Content -->
        <div style="color: #7A4F30; line-height: 1.6; text-align: center;">
          <h2 style="color: #7A4F30; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; font-style: italic;">
            A nostalgic sanctuary awaits you...
          </h2>
          
          <p style="font-size: 16px; margin: 20px 0; color: #7A4F30;">
            You've been invited to join a special <strong>Time Capsule</strong>! To unlock and view this capsule, please <strong>register an account</strong> on our platform.
          </p>
          
          <!-- Primary button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" style="
              display: inline-block;
              background: linear-gradient(90deg, #B07B4F 0%, #7A4F30 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(122, 79, 48, 0.3);
              transition: all 0.3s ease;
            ">✨ Create Your Account & Access Your Capsule</a>
          </div>
          
          <p style="font-size: 16px; margin: 20px 0; color: #7A4F30;">
            Please use this email address to sign up, as it's linked to your invitation. Don't worry — once you're registered, you can update your email anytime inside your profile.
          </p>
          
          <p style="font-size: 16px; margin: 20px 0; color: #7A4F30; font-style: italic;">
            We can't wait for you to explore the memories and messages saved just for you!
          </p>
          
          <p style="font-size: 16px; margin: 20px 0; color: #7A4F30;">
            If you have any questions, just reply to this email.
          </p>
          
          <p style="font-size: 16px; margin: 30px 0 0 0; color: #7A4F30;">
            Warm wishes,<br><strong>The Memory Lane Team</strong>
          </p>
        </div>
        
        <!-- Decorative footer -->
        <div style="text-align: center; margin-top: 40px;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 20px; height: 20px; background-color: #B07B4F; border-radius: 50%; margin: 0 auto 10px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; left: -50px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; right: -50px;"></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
    );
  } catch (err) {
    console.error("Send invitation email: Error sending invitation email:", err);
    throw err;
  }
};


// Send unlock capsule email using nodemailer
const sendUnlockCapsuleEmail = async (to, title, capsuleLink) => {
  try {
    console.log(`Sending unlock capsule email to ${to} with link ${capsuleLink}`);
    await sendEmail(
      to,
      `Your Time Capsule "${title}" is Unlocked! 🤎`,
      `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Memory Lane - Capsule Unlocked</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FBF8F3; font-family: 'Georgia', serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FBF8F3;">
        <!-- Decorative header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 20px; height: 20px; background-color: #B07B4F; border-radius: 50%; margin: 0 auto 10px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; left: -50px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; right: -50px;"></div>
          </div>
        </div>
        
        <!-- Main title -->
        <h1 style="text-align: center; color: #7A4F30; font-size: 32px; font-weight: bold; margin: 0 0 20px 0; font-family: 'Georgia', serif;">
          🤎 Memory Lane 🤎
        </h1>
        
        <!-- Decorative mid-section -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 16px; height: 16px; background-color: #B07B4F; transform: rotate(45deg); margin: 0 auto 10px;"></div>
            <div style="width: 80px; height: 1px; background-color: #B07B4F; position: absolute; top: 8px; left: -40px;"></div>
            <div style="width: 80px; height: 1px; background-color: #B07B4F; position: absolute; top: 8px; right: -40px;"></div>
          </div>
        </div>
        
        <!-- Content -->
        <div style="color: #7A4F30; line-height: 1.6; text-align: center;">
          <h2 style="color: #7A4F30; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; font-style: italic;">
            In every memory lies a treasure...
          </h2>
          
          <p style="font-size: 16px; margin: 20px 0; color: #7A4F30;">
            Your Time Capsule <strong>"${title}"</strong> is now unlocked! You can view the contents and messages shared by your friends and family.
          </p>
          
          <!-- Primary button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${capsuleLink}" style="
              display: inline-block;
              background: linear-gradient(90deg, #B07B4F 0%, #7A4F30 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(122, 79, 48, 0.3);
              transition: all 0.3s ease;
            ">✨ Access Your Capsule</a>
          </div>
          
          <p style="font-size: 16px; margin: 30px 0 0 0; color: #7A4F30;">
            Warm wishes,<br><strong>The Memory Lane Team</strong>
          </p>
        </div>
        
        <!-- Decorative footer -->
        <div style="text-align: center; margin-top: 40px;">
          <div style="display: inline-block; position: relative;">
            <div style="width: 20px; height: 20px; background-color: #B07B4F; border-radius: 50%; margin: 0 auto 10px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; left: -50px;"></div>
            <div style="width: 100px; height: 1px; background-color: #B07B4F; position: absolute; top: 10px; right: -50px;"></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  } catch (err) {
    console.error("Send unlock capsule email: Error sending unlock capsule email:", err);
    throw err;
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
  } catch (err) {
    console.error("Send email: Error sending email:", err);
    throw err;
  }
};

module.exports = {
  sendInvitationEmail,
  sendUnlockCapsuleEmail,
  sendEmail,
};
