const router = require("express").Router();
const { Resend } = require("resend");
const nodemailer = require("nodemailer");

const Invitation = require("../models/Invitation.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { sendInvitationEmail } = require("../utils/email");

// POST api/invitations - create an invitation
router.post("/invitations", isAuthenticated, async (req, res) => {
  const { capsule, email } = req.body;
  const userId = req.payload._id;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  try {
    await sendInvitationEmail(email, `${process.env.ORIGIN}/signup`);
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
