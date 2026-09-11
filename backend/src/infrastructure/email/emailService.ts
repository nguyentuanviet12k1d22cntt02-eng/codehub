import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'nguyentuanviet12k1@gmail.com';
const GMAIL_APP_PASS = (process.env.GMAIL_APP_PASS || 'urlhfkvjbojrljts').replace(/\s+/g, '');
const GMAIL_RELAY_URL = process.env.GMAIL_RELAY_URL || '';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 6000
});

export const sendVerificationOtp = async (toEmail: string, otp: string, username: string): Promise<boolean> => {
    const subject = `[MCODE] Mã xác thực đăng ký tài khoản: ${otp}`;
    const html = `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #0b0b0e; color: #ffffff; border-radius: 16px; border: 1px solid #27272a;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #ffffff; margin: 0 0 8px 0;">MCODE PLATFORM</h1>
                <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Nền tảng Học Lập trình Python & Cơ sở Dữ liệu</p>
            </div>

            <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: #e4e4e7; font-size: 14px; margin: 0 0 16px 0;">Xin chào <strong>${username}</strong>,</p>
                <p style="color: #a1a1aa; font-size: 13px; margin: 0 0 20px 0;">Cảm ơn bạn đã đăng ký tài khoản tại MCODE. Dưới đây là mã xác thực 6 số của bạn:</p>

                <div style="margin: 0 auto; display: inline-block;">
                    <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #c084fc; background: #2e1065; padding: 12px 28px; border-radius: 10px; border: 1px solid #7e22ce; display: inline-block; font-family: monospace;">
                        ${otp}
                    </span>
                </div>

                <p style="color: #ef4444; font-size: 12px; margin: 20px 0 0 0; font-weight: 600;">
                    Mã xác thực có hiệu lực trong vòng 10 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.
                </p>
            </div>

            <div style="text-align: center; border-top: 1px solid #27272a; padding-top: 16px;">
                <p style="color: #71717a; font-size: 12px; margin: 0;">
                    Nếu bạn không thực hiện yêu cầu đăng ký này, vui lòng bỏ qua email.
                </p>
                <p style="color: #52525b; font-size: 11px; margin: 8px 0 0 0;">
                    © ${new Date().getFullYear()} MCODE Platform. All rights reserved.
                </p>
            </div>
        </div>
    `;

    // 1. If Google Apps Script Web App URL is provided, send over HTTPS (Port 443 - 0 blocked)
    if (GMAIL_RELAY_URL) {
        try {
            console.log(`[EmailService] Sending OTP via Google Apps Script HTTPS Relay to ${toEmail}...`);
            const res = await fetch(GMAIL_RELAY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: toEmail, subject, html })
            });
            if (res.ok) {
                console.log(`[EmailService] Sent OTP via Google Apps Script to ${toEmail} successfully`);
                return true;
            }
        } catch (e: any) {
            console.error('[EmailService] GAS Relay failed:', e.message);
        }
    }

    // 2. If Brevo API Key is provided, send over HTTPS (Port 443)
    if (BREVO_API_KEY) {
        try {
            console.log(`[EmailService] Sending OTP via Brevo HTTPS API to ${toEmail}...`);
            const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': BREVO_API_KEY
                },
                body: JSON.stringify({
                    sender: { name: 'MCODE Platform', email: GMAIL_USER },
                    to: [{ email: toEmail, name: username }],
                    subject,
                    htmlContent: html
                })
            });
            if (res.ok) {
                console.log(`[EmailService] Sent OTP via Brevo to ${toEmail} successfully`);
                return true;
            }
        } catch (e: any) {
            console.error('[EmailService] Brevo API failed:', e.message);
        }
    }

    // 3. Fallback to Nodemailer SMTP
    try {
        console.log(`[EmailService] Sending OTP via SMTP (smtp.gmail.com:465) to ${toEmail}...`);
        const sendPromise = transporter.sendMail({
            from: `"MCODE Platform" <${GMAIL_USER}>`,
            to: toEmail,
            subject,
            html
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('SMTP connection timed out')), 6000)
        );

        await Promise.race([sendPromise, timeoutPromise]);
        console.log(`[EmailService] Sent OTP via SMTP to ${toEmail} successfully`);
        return true;
    } catch (error: any) {
        console.error('[EmailService] Error sending OTP email via SMTP:', error.message || error);
        return false;
    }
};
