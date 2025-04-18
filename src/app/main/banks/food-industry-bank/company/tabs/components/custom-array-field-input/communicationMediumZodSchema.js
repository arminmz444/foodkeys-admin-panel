// communicationZodSchema.ts
import { z } from "zod";

// All your “famous communication mediums,” storing them in uppercase in DB.
export const COMMUNICATION_TYPES = [
  { type: "TELEGRAM", name: "تلگرام" },
  { type: "WHATSAPP", name: "واتساپ" },
  { type: "INSTAGRAM", name: "اینستاگرام" },
  { type: "SKYPE", name: "اسکایپ" },
  { type: "EMAIL", name: "ایمیل" },
  { type: "WEBSITE", name: "وبسایت" },
  { type: "FAX", name: "فکس" },
  { type: "PHONE", name: "تلفن" },
  { type: "MOBILE", name: "موبایل" },
  { type: "HOTLINE", name: "خط ویژه" },
  { type: "SMS", name: "پیامک" },
  // Add more if needed
];

// Build a base schema for a single item in the array:
export const singleCommunicationItemSchema = z.object({
  mediumType: z
    .string()
    .refine(
      (val) => COMMUNICATION_TYPES.some((item) => item.type === val),
      "نوع رسانه نامعتبر است"
    ), // must be one of the known uppercase strings
  value: z.string().nonempty({ message: "این فیلد نمیتواند خالی باشد" }),
  label: z.string().optional(),
});

// Then refine conditionally:
export const extendedCommunicationItemSchema =
  singleCommunicationItemSchema.superRefine((data, ctx) => {
    // data.mediumType => e.g. "EMAIL", "PHONE", ...
    // data.value => the user’s input
    switch (data.mediumType) {
      case "EMAIL":
        if (!/^\S+@\S+\.\S+$/.test(data.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "فرمت وارد شده برای ایمیل صحیح نمی‌باشد",
          });
        }
        break;
      case "PHONE":
      case "MOBILE":
      case "FAX":
      case "HOTLINE":
      case "SMS":
        if (!/^[0-9+\-\s]{5,}$/.test(data.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "شماره وارد شده معتبر نمی‌باشد (حداقل 5 رقم)",
          });
        }
        break;
      case "WEBSITE":
        if (!/^https?:\/\//i.test(data.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "آدرس وبسایت باید با http:// یا https:// شروع شود",
          });
        }
        break;
      // etc. for other mediums if you want specialized checks
      default:
        // For TELEGRAM, WHATSAPP, INSTAGRAM, SKYPE, etc. we can skip or add patterns
        break;
    }
  });

export const communicationArraySchema = z.array(
  extendedCommunicationItemSchema
);
