/**
 * Email Service - Template-Based Email Sending
 * 
 * Supports multiple providers:
 * - Resend (recommended for modern apps)
 * - SendGrid
 * - AWS SES
 * - Postmark
 * 
 * @author Superheat Engineering
 */

// ============================================
// TYPES
// ============================================

export interface EmailConfig {
    provider: 'resend' | 'sendgrid' | 'ses' | 'postmark'
    apiKey: string
    fromEmail: string
    fromName: string
    replyTo?: string
}

export interface EmailOptions {
    to: string
    subject: string
    html: string
    text?: string
    tags?: string[]
}

export interface EmailResult {
    success: boolean
    messageId?: string
    error?: string
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export const emailTemplates = {
    /**
     * Verification email template
     */
    verification: (name: string, verifyUrl: string): { subject: string; html: string; text: string } => ({
        subject: 'Verify your Superheat waitlist spot',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d14;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0d14;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#1a1a2e;border-radius:16px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 40px 20px;">
              <img src="https://superheat.ca/logo.png" alt="Superheat" width="150" style="display:block;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:20px 40px;">
              <h1 style="color:#f7931a;font-size:24px;margin:0 0 20px;">Welcome${name ? `, ${name}` : ''}! 🔥</h1>
              <p style="color:#e8e8f0;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Thank you for joining the Superheat waitlist! You're one step closer to zero-cost heating.
              </p>
              <p style="color:#9898b0;font-size:16px;line-height:1.6;margin:0 0 30px;">
                Please verify your email to confirm your spot and receive updates about our Spring 2026 launch.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius:8px;background:linear-gradient(135deg,#f7931a,#ff6b35);">
                    <a href="${verifyUrl}" target="_blank" style="display:inline-block;padding:16px 32px;font-size:18px;font-weight:bold;color:#ffffff;text-decoration:none;">
                      Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color:#6868a0;font-size:14px;line-height:1.6;margin:30px 0 0;">
                Or copy this link: <a href="${verifyUrl}" style="color:#f7931a;">${verifyUrl}</a>
              </p>
              <p style="color:#6868a0;font-size:14px;margin:20px 0 0;">
                This link expires in 48 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:30px 40px;background-color:#16162a;border-top:1px solid #2a2a4a;">
              <p style="color:#6868a0;font-size:12px;line-height:1.6;margin:0;text-align:center;">
                © ${new Date().getFullYear()} Superheat Technologies Inc.<br>
                London, Ontario, Canada<br><br>
                <a href="https://superheat.ca/unsubscribe" style="color:#9898b0;">Unsubscribe</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
        text: `
Welcome${name ? `, ${name}` : ''}!

Thank you for joining the Superheat waitlist! You're one step closer to zero-cost heating.

Please verify your email to confirm your spot:
${verifyUrl}

This link expires in 48 hours.

---
Superheat Technologies Inc.
London, Ontario, Canada
    `.trim(),
    }),

    /**
     * Welcome email (after verification)
     */
    welcome: (name: string, position: number): { subject: string; html: string; text: string } => ({
        subject: `You're #${position} on the Superheat waitlist!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0d0d14;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d0d14;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#1a1a2e;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:40px;">
              <h1 style="color:#f7931a;font-size:28px;margin:0 0 20px;text-align:center;">
                🎉 You're In!
              </h1>
              <p style="color:#e8e8f0;font-size:18px;text-align:center;margin:0 0 10px;">
                ${name ? `${name}, you're` : "You're"} <strong style="color:#f7931a;">#${position}</strong> on the waitlist!
              </p>
              <p style="color:#9898b0;font-size:16px;line-height:1.6;margin:20px 0;">
                We're working hard to bring zero-cost heating to London, Ontario in Spring 2026. As an early supporter, you'll get:
              </p>
              <ul style="color:#e8e8f0;font-size:16px;line-height:2;">
                <li>Priority installation scheduling</li>
                <li>Exclusive early-bird pricing</li>
                <li>First access to beta program</li>
              </ul>
              <p style="color:#9898b0;font-size:14px;margin:30px 0 0;">
                We'll be in touch soon with more details. In the meantime, 
                <a href="https://superheat.ca?ref=email" style="color:#f7931a;">share Superheat</a> 
                with friends to move up the list!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background-color:#16162a;border-top:1px solid #2a2a4a;">
              <p style="color:#6868a0;font-size:12px;margin:0;text-align:center;">
                © ${new Date().getFullYear()} Superheat Technologies Inc. | London, Ontario
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
        text: `
You're In! 🎉

${name ? `${name}, you're` : "You're"} #${position} on the Superheat waitlist!

We're working hard to bring zero-cost heating to London, Ontario in Spring 2026.

As an early supporter, you'll get:
- Priority installation scheduling
- Exclusive early-bird pricing
- First access to beta program

We'll be in touch soon!

---
Superheat Technologies Inc.
    `.trim(),
    }),
}

// ============================================
// EMAIL PROVIDERS
// ============================================

async function sendWithResend(config: EmailConfig, options: EmailOptions): Promise<EmailResult> {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `${config.fromName} <${config.fromEmail}>`,
                to: [options.to],
                subject: options.subject,
                html: options.html,
                text: options.text,
                reply_to: config.replyTo,
                tags: options.tags?.map(name => ({ name })),
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            return { success: false, error: error.message || 'Failed to send email' }
        }

        const data = await response.json()
        return { success: true, messageId: data.id }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

async function sendWithSendGrid(config: EmailConfig, options: EmailOptions): Promise<EmailResult> {
    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: options.to }] }],
                from: { email: config.fromEmail, name: config.fromName },
                reply_to: config.replyTo ? { email: config.replyTo } : undefined,
                subject: options.subject,
                content: [
                    { type: 'text/plain', value: options.text || '' },
                    { type: 'text/html', value: options.html },
                ],
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            return { success: false, error: error || 'Failed to send email' }
        }

        const messageId = response.headers.get('x-message-id')
        return { success: true, messageId: messageId || undefined }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// ============================================
// MAIN SEND FUNCTION
// ============================================

export async function sendEmail(config: EmailConfig, options: EmailOptions): Promise<EmailResult> {
    switch (config.provider) {
        case 'resend':
            return sendWithResend(config, options)
        case 'sendgrid':
            return sendWithSendGrid(config, options)
        default:
            return { success: false, error: `Provider ${config.provider} not implemented` }
    }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function sendVerificationEmail(
    config: EmailConfig,
    email: string,
    name: string,
    verificationToken: string,
    baseUrl: string
): Promise<EmailResult> {
    const verifyUrl = `${baseUrl}/api/verify?token=${verificationToken}`
    const template = emailTemplates.verification(name, verifyUrl)

    return sendEmail(config, {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: ['verification', 'waitlist'],
    })
}

export async function sendWelcomeEmail(
    config: EmailConfig,
    email: string,
    name: string,
    position: number
): Promise<EmailResult> {
    const template = emailTemplates.welcome(name, position)

    return sendEmail(config, {
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: ['welcome', 'waitlist'],
    })
}
