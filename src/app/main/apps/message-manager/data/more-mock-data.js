export const mockTemplates = [
  {
    id: '1',
    name: 'Default OTP Template',
    content: 'Your OTP code is: {otp_code}. Valid for 5 minutes.',
    type: 'sms',
    enabled: true,
    systemTemplate: true
  },
  {
    id: '2',
    name: 'Company Verification',
    content: 'Please verify your company account using code: {verification_code}',
    type: 'sms',
    enabled: true,
    systemTemplate: true
  },
  {
    id: '3',
    name: 'Registration Confirmation',
    subject: 'Welcome to {app_name}',
    content: 'Thank you for registering. Please confirm your email by clicking: {confirmation_url}',
    type: 'email',
    enabled: true,
    systemTemplate: true
  }
];

export const mockSmartTextVariables = [
  { key: 'user_name', description: 'User\'s full name' },
  { key: 'otp_code', description: 'One-time password code' },
  { key: 'verification_code', description: 'Account verification code' },
  { key: 'app_name', description: 'Application name' },
  { key: 'confirmation_url', description: 'Email confirmation URL' }
];

export const mockRecipients = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1987654321' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1122334455' }
];