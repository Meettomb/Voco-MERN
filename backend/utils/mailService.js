import nodemailer from "nodemailer";

export const sendMail = async (to, subject, type, value) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  let content = "";

  // ✅ OTP MAIL
  if (type === "otp") {

    content = `
    <h2>OTP Verification</h2>

    <div style="
      font-size:30px;
      background:#111827;
      color:white;
      padding:15px;
      border-radius:8px;
      display:inline-block;
      letter-spacing:5px;
    ">
      ${value}
    </div>

    <p>Valid for 2 minutes</p>
    `;

  }

  // ✅ SUCCESS MAIL
  if (type === "success") {

    content = `
    <h2>Registration Successful</h2>

    <div style="
      font-size:22px;
      background:#16a34a;
      color:white;
      padding:20px;
      border-radius:8px;
      display:inline-block;
    ">
      Your registration has been completed successfully
    </div>

    <p>Welcome to LearnVoco 🎉</p>
    `;

  }

  // ✅ RESET PASSWORD MAIL
  if (type === "reset") {

    content = `
  <h2>Password Reset Successful</h2>

  <div style="
    font-size:20px;
    background:#2563eb;
    color:white;
    padding:20px;
    border-radius:8px;
    display:inline-block;
  ">
    Your password has been reset successfully
  </div>

  <p>If this was not you, please contact support.</p>
  `;

  }

  // Final Exam Result

  if (type === "finalExam") {

    const { percentage, isPassed, language } = value;

    content = `
    <div style="max-width:520px;margin:auto;text-align:center;">

      <h2 style="margin-bottom:10px;">Final Exam Result</h2>

      <p style="font-size:15px;color:#6b7280;margin-bottom:20px;">
        Language: <strong>${language}</strong>
      </p>

      <div style="
        font-size:20px;
        font-weight:600;
        background:${isPassed ? "#16a34a" : "#dc2626"};
        color:white;
        padding:18px;
        border-radius:10px;
        margin-bottom:20px;
      ">
        ${isPassed ? "Congratulations! You passed 🎉" : "You did not pass"}
      </div>

      <div style="
        background:#f3f4f6;
        padding:15px;
        border-radius:8px;
        margin-bottom:20px;
      ">
        <p style="margin:0;font-size:14px;color:#374151;">Your Score</p>
        <h3 style="margin:5px 0 0 0;font-size:24px;">
          ${percentage}%
        </h3>
      </div>

      ${isPassed
        ? `<p style="font-size:15px;color:#16a34a;">
              You have successfully completed the course.
            </p>`
        : `<p style="font-size:15px;color:#dc2626;">
              Please try again to improve your score.
            </p>`
      }

    </div>
  `;
  }

  // ✅ PASSWORD UPDATED MAIL
  if (type === "passwordUpdate") {

    content = `
  <h2>Password Updated</h2>

  <div style="
    font-size:20px;
    background:#16a34a;
    color:white;
    padding:20px;
    border-radius:8px;
    display:inline-block;
  ">
    Your password has been changed successfully
  </div>

  <p style="margin-top:15px;">
    If you did not make this change, please reset your password immediately or contact support.
  </p>
  `;
  }
  
  // Email Change OTP
  if (type === "emailChangeOtp") {

    content = `
        <h2>Email Change Verification</h2>

        <p>
            We received a request to change the email address
            associated with your LearnVoco account.
        </p>

        <p>
            Your verification OTP is:
        </p>

        <div style="
            font-size:30px;
            background:#111827;
            color:white;
            padding:15px 25px;
            border-radius:8px;
            display:inline-block;
            letter-spacing:6px;
            font-weight:bold;
        ">
            ${value}
        </div>

        <p>
            This OTP is valid for <strong>15 minutes</strong>.
        </p>

        <p>
            If you did not request this change, you can safely ignore
            this email.
        </p>
    `;
  }
  // new Email Verification Link
  if (type === "emailChangeLink") {

    content = `
        <h2 style="color:#111827;">
            Verify Your New Email Address
        </h2>

        <p style="color:#374151;">
            You requested to change the email address
            associated with your LearnVoco account.
        </p>

        <p style="color:#374151;">
            To continue, verify that you have access to
            this email address by clicking the button below.
        </p>

        <a href="${value}"
           style="
                display:inline-block;
                padding:14px 24px;
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
           ">
            Verify New Email
        </a>

        <p style="
            margin-top:20px;
            color:#6b7280;
            font-size:14px;
        ">
            This verification link will expire in 15 minutes.
        </p>

        <p style="
            color:#6b7280;
            font-size:14px;
        ">
            If you did not request an email change,
            you can safely ignore this email.
        </p>
    `;
}

  const html = `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#f2f4f8;padding:40px 0;font-family:Arial">

  <tr>
    <td align="center">

      <table width="600"
        style="background:white;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.05)">

        <tr>
          <td align="center">

            <h2 style="margin-bottom:20px;">LearnVoco</h2>

            ${content}

          </td>
        </tr>

      </table>

    </td>
  </tr>

</table>
`;

  await transporter.sendMail({
    from: `"LearnVoco" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });

};