// src/app/modules/newsletter/newsletterValidation.js
import * as z from 'zod';

// Function to validate a date string in "YYYY-MM-DD HH:MM:SS" format
function isValidDateFormat(dateStr) {
  if (!dateStr) return false;
  
  // Check if the format matches "YYYY-MM-DD HH:MM:SS"
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  // Try converting to a Date object to validate the actual date values
  try {
    const date = new Date(dateStr.replace(' ', 'T'));
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}

// Function to check if a date string is in the future
function isDateInFuture(dateStr) {
  if (!dateStr) return false;
  
  try {
    const date = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(date.getTime())) return false;
    
    return date > new Date();
  } catch (e) {
    return false;
  }
}

export const newsletterSchema = z.object({
  title: z.string().min(1, { message: 'عنوان ضروری است' }),
  // Make content optional in the schema since we're handling it separately
  content: z.string().optional(),
  scheduledDate: z.string()
    .refine(isValidDateFormat, {
      message: "تاریخ ارسال باید با فرمت 'YYYY-MM-DD HH:MM:SS' باشد",
    })
    .refine(isDateInFuture, {
      message: "تاریخ ارسال باید در آینده باشد",
    })
});

export const subscriberSchema = z.object({
  email: z.string().email({ message: 'ایمیل معتبر نیست' }),
  name: z.string().optional()
});