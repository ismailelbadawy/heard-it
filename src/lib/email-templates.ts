export function renderWaitlistConfirmationEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HeardIt Waitlist!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 32px; text-align: center;">
      <!-- Logo -->
      <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="white"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18v4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 22h8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 style="color: white; font-size: 32px; font-weight: bold; margin: 0;">HeardIt</h1>
      </div>
      
      <h2 style="color: white; font-size: 28px; font-weight: 600; margin: 0 0 8px 0;">You're on the list! 🎉</h2>
      <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 0;">Thanks for joining our waitlist</p>
    </div>

    <!-- Main content -->
    <div style="padding: 40px 32px;">
      <p style="font-size: 16px; margin-bottom: 24px; color: #64748b;">Hi there! 👋</p>
      
      <p style="font-size: 16px; margin-bottom: 24px; color: #334155;">
        We're thrilled to have you join the <strong>HeardIt</strong> waitlist! You're now part of an exclusive group that will be the first to experience our AI-powered voice-to-task transformation platform.
      </p>

      <!-- Features preview -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1e293b;">What to expect from HeardIt:</h3>
        
        <div style="margin-bottom: 12px;">
          <span style="color: #9333ea; margin-right: 8px;">✨</span>
          <span style="color: #334155;">Turn voice recordings into organized tasks instantly</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #ec4899; margin-right: 8px;">🧠</span>
          <span style="color: #334155;">AI-powered insights and key point extraction</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #9333ea; margin-right: 8px;">📋</span>
          <span style="color: #334155;">Smart categorization and priority detection</span>
        </div>
        <div>
          <span style="color: #ec4899; margin-right: 8px;">🚀</span>
          <span style="color: #334155;">Export to your favorite productivity tools</span>
        </div>
      </div>

      <p style="font-size: 16px; margin-bottom: 32px; color: #334155;">
        We'll keep you updated on our progress and notify you as soon as HeardIt is ready for early access. 
        In the meantime, follow us on social media for behind-the-scenes updates and productivity tips!
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://heardit.com" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Visit HeardIt
        </a>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
        <p style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
          <strong>Your waitlist email:</strong> ${email}
        </p>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          Questions? Just reply to this email – we'd love to hear from you!
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0;">
        © ${new Date().getFullYear()} HeardIt. All rights reserved.
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        You're receiving this because you joined our waitlist.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
