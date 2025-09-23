const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Generate email verification token
const generateEmailToken = (userId) => {
    return jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: '🎉 Welcome to AI Diary!',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to AI Diary</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f8fafc;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        color: white;
                        padding: 2rem;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 2rem;
                        font-weight: 700;
                    }
                    .content {
                        padding: 2rem;
                    }
                    .welcome-message {
                        font-size: 1.1rem;
                        margin-bottom: 1.5rem;
                        color: #4a5568;
                    }
                    .features {
                        background-color: #f7fafc;
                        padding: 1.5rem;
                        border-radius: 8px;
                        margin: 1.5rem 0;
                    }
                    .feature {
                        display: flex;
                        align-items: center;
                        margin-bottom: 1rem;
                    }
                    .feature:last-child {
                        margin-bottom: 0;
                    }
                    .feature-icon {
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        color: white;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 1rem;
                        font-size: 0.9rem;
                    }
                    .btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        color: white;
                        padding: 1rem 2rem;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 1rem 0;
                        text-align: center;
                    }
                    .footer {
                        background-color: #f7fafc;
                        padding: 1.5rem;
                        text-align: center;
                        font-size: 0.9rem;
                        color: #718096;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📖 Welcome to AI Diary!</h1>
                    </div>
                    
                    <div class="content">
                        <p class="welcome-message">
                            Hi ${user.name || 'there'},<br><br>
                            Welcome to AI Diary! We're thrilled to have you join our community of thoughtful writers and self-reflection enthusiasts.
                        </p>
                        
                        <div class="features">
                            <h3 style="margin-top: 0; color: #2d3748;">✨ What you can do with AI Diary:</h3>
                            
                            <div class="feature">
                                <div class="feature-icon">🤖</div>
                                <div>
                                    <strong>AI-Powered Insights:</strong> Get personalized reflections and insights about your entries
                                </div>
                            </div>
                            
                            <div class="feature">
                                <div class="feature-icon">🔒</div>
                                <div>
                                    <strong>Private & Secure:</strong> Your thoughts are encrypted and completely private
                                </div>
                            </div>
                            
                            <div class="feature">
                                <div class="feature-icon">📊</div>
                                <div>
                                    <strong>Mood Tracking:</strong> Monitor your emotional journey over time
                                </div>
                            </div>
                            
                            <div class="feature">
                                <div class="feature-icon">💫</div>
                                <div>
                                    <strong>Daily Prompts:</strong> Never run out of things to write about
                                </div>
                            </div>
                        </div>
                        
                        <p>Ready to start your journaling journey?</p>
                        
                        <a href="${process.env.BASE_URL}/AI-diary" class="btn">
                            Start Writing Your First Entry 📝
                        </a>
                        
                        <p style="margin-top: 2rem; font-size: 0.95rem; color: #718096;">
                            If you have any questions or need help getting started, feel free to reply to this email. 
                            We're here to help you make the most of your journaling experience!
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>
                            Thanks for joining AI Diary!<br>
                            <strong>The AI Diary Team</strong>
                        </p>
                        <p style="margin-top: 0.5rem;">
                            <a href="${process.env.BASE_URL}" style="color: #6366f1; text-decoration: none;">Visit AI Diary</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
    try {
        const transporter = createTransporter();
        const verificationUrl = `${process.env.BASE_URL}/AI-diary/verify-email?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: '📧 Verify Your Email - AI Diary',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email - AI Diary</title>
                <style>
                    body {
                        font-family: 'Inter', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f8fafc;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        color: white;
                        padding: 2rem;
                        text-align: center;
                    }
                    .content {
                        padding: 2rem;
                        text-align: center;
                    }
                    .btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                        color: white;
                        padding: 1rem 2rem;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 1rem 0;
                    }
                    .footer {
                        background-color: #f7fafc;
                        padding: 1.5rem;
                        text-align: center;
                        font-size: 0.9rem;
                        color: #718096;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📧 Verify Your Email</h1>
                    </div>
                    
                    <div class="content">
                        <p>Hi ${user.name || 'there'},</p>
                        <p>Thank you for registering with AI Diary! Please verify your email address by clicking the button below:</p>
                        
                        <a href="${verificationUrl}" class="btn">Verify Email Address</a>
                        
                        <p style="margin-top: 2rem; font-size: 0.9rem; color: #718096;">
                            This verification link will expire in 24 hours.
                        </p>
                        
                        <p style="font-size: 0.9rem; color: #718096;">
                            If you didn't create an account with AI Diary, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>The AI Diary Team</p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendVerificationEmail,
    generateEmailToken
};