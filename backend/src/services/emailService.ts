import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'nguyentuanviet12k1@gmail.com';
const GMAIL_APP_PASS = (process.env.GMAIL_APP_PASS || 'urlhfkvjbojrljts').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Port 465 uses SSL directly (not STARTTLS on 587)
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS
    },
    connectionTimeout: 6000, // 6s timeout
    greetingTimeout: 6000,
    socketTimeout: 8000
});

export const sendVerificationOtp = async (toEmail: string, otp: string, username: string): Promise<boolean> => {
    try {
        const mailOptions = {
            from: `"MCODE Platform" <${GMAIL_USER}>`,
            to: toEmail,
            subject: `[MCODE] Mã xác thực đăng ký tài khoản: ${otp}`,
            html: `
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
                            Mã xác thực có hiệu lực trong vòng 10 phút.
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
            `
        };

        // Enforce 7-second hard timeout so backend never hangs the user request
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Email sending timed out after 7s')), 7000)
        );

        await Promise.race([sendPromise, timeoutPromise]);
        console.log(`[EmailService] Sent OTP ${otp} to ${toEmail} successfully`);
        return true;
    } catch (error: any) {
        console.error('[EmailService] Error sending OTP email:', error.message || error);
        return false;
    }
};
