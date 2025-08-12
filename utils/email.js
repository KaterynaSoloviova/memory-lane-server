const { Resend } = require("resend");

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Send invitation email using Resend
const sendInvitationEmail = async (to, invitationLink) => {
  try {
    console.log(`Attempting to send invitation email to: ${to}`);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [to],
      subject: "You're Invited to a Time Capsule! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2; text-align: center;">You're Invited to a Time Capsule! 🎉</h2>
          <p>Hi there,</p>
          <p>You've been invited to join a special <strong>Time Capsule</strong>! To unlock and view this capsule, please <strong>register an account</strong> on our platform.</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${invitationLink}" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Create Your Account & Access Your Capsule</a>
          </p>
          <p>Please use this email address to sign up, as it's linked to your invitation. Don't worry — once you're registered, you can update your email anytime inside your profile.</p>
          <p>We can't wait for you to explore the memories and messages saved just for you!</p>
          <p>If you have any questions, just reply to this email.</p>
          <p>Warm wishes,<br>The Time Capsule Team</p>
        </div>
      `,
      text: `You're invited to join a Time Capsule! Please register at: ${invitationLink}`
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
    return data;
    
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = {
  sendInvitationEmail
};
