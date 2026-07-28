import resend
from app.core.config import settings


class EmailService:
    """Service responsible for sending transactional emails via the Resend API."""

    FROM_EMAIL = "Prep ME <onboarding@resend.dev>"

    @staticmethod
    def _build_verification_html(full_name: str, verification_link: str) -> str:
        return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email - Prep ME</title>
</head>
<body style="margin:0;padding:0;background-color:#070A11;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070A11;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background-color:#0D1117;border-radius:24px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);">

          <!-- Top Accent Gradient -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#06b6d4,#3b82f6,#8b5cf6);"></td>
          </tr>

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding:40px 40px 20px;">
              <div style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6,#8b5cf6);border-radius:16px;padding:2px;">
                <div style="background-color:#0D1117;border-radius:14px;padding:14px 24px;">
                  <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Prep </span>
                  <span style="font-size:26px;font-weight:900;color:#06b6d4;letter-spacing:-0.5px;">ME</span>
                </div>
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:10px 40px 30px;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 16px;text-align:center;letter-spacing:-0.3px;">
                Verify Your Email Address
              </h1>

              <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hi <strong style="color:#f1f5f9;">{full_name}</strong>,
              </p>

              <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
                Thank you for joining <strong style="color:#06b6d4;">Prep ME</strong>. Please verify your email address to complete your account registration and unlock full access to your AI interview &amp; resume analysis copilot.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="{verification_link}" target="_blank"
                  style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;padding:16px 36px;border-radius:14px;box-shadow:0 10px 25px rgba(6,182,212,0.35);">
                  Verify Email Address &rarr;
                </a>
              </div>

              <!-- Expiration Warning -->
              <div style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;margin-bottom:28px;">
                <p style="color:#64748b;font-size:13px;line-height:1.5;margin:0;text-align:center;">
                  &bull; This link will expire in <strong style="color:#cbd5e1;">30 minutes</strong>.<br/>
                  If you didn't create an account with Prep ME, please ignore this email.
                </p>
              </div>

              <!-- Backup Link -->
              <p style="color:#475569;font-size:12px;line-height:1.6;margin:0;word-break:break-all;">
                If the button above doesn't work, copy and paste this link into your browser:<br/>
                <a href="{verification_link}" style="color:#06b6d4;text-decoration:underline;">{verification_link}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.06);padding:24px 40px;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">
                &copy; Prep ME &bull; AI Interview &amp; Resume Analysis Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    @classmethod
    def send_verification_email(cls, to_email: str, full_name: str, verification_token: str) -> None:
        """Send an email verification link using the official Resend SDK."""
        verification_link = f"{settings.FRONTEND_URL.rstrip('/')}/verify-email?token={verification_token}"

        print(f"\n{'='*70}")
        print(f"  [PREP ME VERIFICATION EMAIL VIA RESEND]")
        print(f"  To        : {to_email}")
        print(f"  Link      : {verification_link}")
        print(f"{'='*70}\n")

        if not settings.RESEND_API_KEY or settings.RESEND_API_KEY == "re_123456789":
            print("[RESEND NOTICE] RESEND_API_KEY is not configured in backend/.env.")
            print("                Use the link printed above for testing.")
            return

        resend.api_key = settings.RESEND_API_KEY

        try:
            params: resend.Emails.SendParams = {
                "from": cls.FROM_EMAIL,
                "to": [to_email],
                "subject": "Verify your email address - Prep ME",
                "html": cls._build_verification_html(full_name, verification_link),
            }
            email_res = resend.Emails.send(params)
            print(f"[RESEND SUCCESS] Email sent to {to_email}. Response: {email_res}")
        except Exception as e:
            print(f"[RESEND ERROR] Failed to send email to {to_email}: {e}")


# Helper function alias for backwards compatibility
send_verification_email = EmailService.send_verification_email
