import nodemailer from "nodemailer";

export const sendMail = async (to, subject, type, value) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
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

  const html = `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f2f4f8;padding:40px 0;font-family:Arial">

    <tr>
      <td align="center">

        <table width="480"
          style="background:white;border-radius:10px;padding:30px">

          <tr>
            <td align="center">

              <h2>LearnVoco</h2>

              ${content}

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    html,
  });

};