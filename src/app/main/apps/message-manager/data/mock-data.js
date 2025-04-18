// Mock data for email templates
export const mockSystemTemplates = [
  {
    id: "1",
    name: "Registration Confirmation",
    subject: "Registration Confirmation",
    body: 'Thank you for registering and creating an account with the "{app_name}" application. Before you login and begin working with the application, please confirm your email address by following the link below:',
    isSystem: true,
  },
  {
    id: "2",
    name: "User Logs In For The First Time",
    subject: "Welcome to Our Platform",
    body: "Welcome to our platform! We're excited to have you on board.",
    isSystem: true,
  },
  {
    id: "3",
    name: "User Made Registration",
    subject: "Registration Complete",
    body: "Your registration is complete. You can now access all features of our platform.",
    isSystem: true,
  },
  {
    id: "4",
    name: "User Requests Password Recovery",
    subject: "Password Recovery",
    body: "You have requested to reset your password. Please click the link below to create a new password.",
    isSystem: true,
  },
  {
    id: "5",
    name: "User Requests Password Recovery By...",
    subject: "Password Recovery Request",
    body: "A password recovery request has been initiated for your account.",
    isSystem: true,
  },
]

export const mockTemplates = [
  {
    id: "6",
    name: "fnfgn",
    subject: "fnfgn",
    body: "",
    isSystem: false,
  },
  {
    id: "7",
    name: "sdsc",
    subject: "sdsc",
    body: "Hello,\n\nThis is a custom email template.",
    isSystem: false,
  },
]

// Mock data for SMS templates
export const mockSystemSmsTemplates = [
  {
    id: "1",
    name: "OTP Verification",
    subject: "OTP Verification",
    body: "Your verification code is {otp_code}. Please enter this code to verify your identity.",
    isSystem: true,
  },
  {
    id: "2",
    name: "Company OTP",
    subject: "Company OTP",
    body: "{company_name}: Your one-time password is {otp_code}. This code will expire in 10 minutes.",
    isSystem: true,
  },
  {
    id: "3",
    name: "Password Reset",
    subject: "Password Reset",
    body: "You have requested to reset your password. Your temporary password is {otp_code}.",
    isSystem: true,
  },
  {
    id: "4",
    name: "Account Verification",
    subject: "Account Verification",
    body: "Please verify your account by entering the following code: {otp_code}.",
    isSystem: true,
  },
  {
    id: "5",
    name: "Login Notification",
    subject: "Login Notification",
    body: "A new login was detected on your account. If this wasn't you, please contact support immediately.",
    isSystem: true,
  },
]

export const mockSmsTemplates = [
  {
    id: "6",
    name: "Marketing Campaign",
    subject: "Special Offer",
    body: "Special offer just for you! Use code SAVE20 for 20% off your next purchase.",
    isSystem: false,
  },
  {
    id: "7",
    name: "Appointment Reminder",
    subject: "Appointment Reminder",
    body: "Reminder: You have an appointment scheduled for tomorrow at 2:00 PM.",
    isSystem: false,
  },
]

