const router = require("express").Router();
const { Resend } = require("resend");
const nodemailer = require("nodemailer");

const Invitation = require("../models/Invitation.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST api/invitations - create an invitation
router.post("/invitations", isAuthenticated, async (req, res) => {
  const { capsule, email } = req.body;
  const userId = req.payload._id;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  try {
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
      to: email,
      subject: "You're Invited to a Time Capsule! 🎉",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4a90e2;">You're Invited to a Time Capsule! 🎉</h2>
      <p>Hi there,</p>
      <p>You’ve been invited to join a special <strong>Time Capsule</strong>! To unlock and view this capsule, please <strong>register an account</strong> on our platform.</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${process.env.INVITATION_LINK}" style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Create Your Account & Access Your Capsule</a>
      </p>
      <p>Please use this email address to sign up, as it’s linked to your invitation. Don’t worry — once you’re registered, you can update your email anytime inside your profile.</p>
      <p>We can’t wait for you to explore the memories and messages saved just for you!</p>
      <p>If you have any questions, just reply to this email.</p>
      <p>Warm wishes,<br>The Time Capsule Team</p>
    </div>
  `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    const newInvitation = await Invitation.create({
      capsule,
      email,
      invitedBy: userId,
    });
    res.status(201).json(newInvitation);
  } catch (err) {
    console.error("Error creating invitation:", err);
    res.status(500).json({ error: "Failed to create invitation" });
  }
});

// GET /api/invitations - get current user’s pending invitations
router.get("/invitations", isAuthenticated, (req, res) => {
  const email = req.payload.email;
  console.log(req.payload);

  Invitation.find({
    email: email,
    status: "pending",
  })
    .then((invitations) => res.status(200).json(invitations))
    .catch((err) => {
      console.error("Error getting invitation:", err);
      res.status(500).json({ error: "Failed to get invitation" });
    });
});

// POST /sendmail
router.post("/sendmail", async (req, res) => {
  const destinationEmail = req.body.destinationEmail;

  if (!destinationEmail) {
    return res.status(400).json({ error: "destinationEmail is required" });
  }

  try {
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
      to: destinationEmail,
      subject: "Test Email",
      text: "Hello, this is a test",
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.json({
      message: "Email sent successfully",
      info: info,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
