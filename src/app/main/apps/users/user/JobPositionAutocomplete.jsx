import React, { useState } from 'react';
import { 
  Autocomplete, 
  TextField, 
  createFilterOptions, 
  Box, 
  Typography,
  Chip,
  Paper,
  InputAdornment
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const filter = createFilterOptions();

const JobPositionAutocomplete = ({ field, error, helperText }) => {
  return (
    <Autocomplete
    className='w-full mt-32'
      {...field}
      id="jobPosition"
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={persianJobPositions}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.label || '';
      }}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          field.onChange(newValue);
        } else if (newValue && newValue.inputValue) {
          field.onChange(newValue.inputValue);
        } else {
          field.onChange(newValue?.value || '');
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `اضافه کردن "${inputValue}"`,
            value: inputValue
          });
        }

        return filtered;
      }}
      renderOption={(props, option) => (
        <li {...props} dir="rtl">
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="سمت شغلی"
          placeholder="سمت شغلی کاربر را بنویسید"
          error={!!error}
          helperText={helperText}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FuseSvgIcon size={20}>heroicons-solid:briefcase</FuseSvgIcon>
              </InputAdornment>
            ),
            sx: { textAlign: 'right' }
          }}
          InputLabelProps={{
            sx: { right: 'auto'}
          }}
          sx={{
            '& .MuiAutocomplete-input': {
              textAlign: 'left',
            }
          }}
        />
      )}
    />
  );
};

export default JobPositionAutocomplete;

const persianJobPositions = [
  { value: "مدیر عامل", label: "مدیر عامل" },
  { value: "مدیر مالی", label: "مدیر مالی" },
  { value: "مدیر منابع انسانی", label: "مدیر منابع انسانی" },
  { value: "مدیر بازاریابی", label: "مدیر بازاریابی" },
  { value: "مدیر فروش", label: "مدیر فروش" },
  { value: "مدیر تدارکات", label: "مدیر تدارکات" },
  { value: "مدیر پروژه", label: "مدیر پروژه" },
  { value: "مدیر تولید", label: "مدیر تولید" },
  { value: "مدیر تحقیق و توسعه", label: "مدیر تحقیق و توسعه" },
  { value: "مدیر روابط عمومی", label: "مدیر روابط عمومی" },
  { value: "مدیر خدمات مشتریان", label: "مدیر خدمات مشتریان" },
  { value: "مدیر آموزش", label: "مدیر آموزش" },
  { value: "مدیر فناوری اطلاعات", label: "مدیر فناوری اطلاعات" },
  { value: "مدیر لجستیک", label: "مدیر لجستیک" },
  { value: "مدیر کنترل کیفیت", label: "مدیر کنترل کیفیت" },
  { value: "مدیر بازرگانی", label: "مدیر بازرگانی" },
  { value: "مدیر اجرایی", label: "مدیر اجرایی" },
  { value: "مدیر عملیات", label: "مدیر عملیات" },
  { value: "مدیر استراتژی", label: "مدیر استراتژی" },
  { value: "توسعه دهنده نرم‌افزار", label: "توسعه دهنده نرم‌افزار" },
  { value: "توسعه دهنده فرانت‌اند", label: "توسعه دهنده فرانت‌اند" },
  { value: "توسعه دهنده بک‌اند", label: "توسعه دهنده بک‌اند" },
  { value: "توسعه دهنده موبایل", label: "توسعه دهنده موبایل" },
  { value: "توسعه دهنده وب", label: "توسعه دهنده وب" },
  { value: "توسعه دهنده بلاکچین", label: "توسعه دهنده بلاکچین" },
  { value: "توسعه دهنده هوش مصنوعی", label: "توسعه دهنده هوش مصنوعی" },
  { value: "توسعه دهنده بازی", label: "توسعه دهنده بازی" },
  { value: "برنامه‌نویس پایتون", label: "برنامه‌نویس پایتون" },
  { value: "برنامه‌نویس جاوا", label: "برنامه‌نویس جاوا" },
  { value: "برنامه‌نویس جاوااسکریپت", label: "برنامه‌نویس جاوااسکریپت" },
  { value: "برنامه‌نویس PHP", label: "برنامه‌نویس PHP" },
  { value: "برنامه‌نویس C++", label: "برنامه‌نویس C++" },
  { value: "برنامه‌نویس C#", label: "برنامه‌نویس C#" },
  { value: "مهندس نرم‌افزار", label: "مهندس نرم‌افزار" },
  { value: "مهندس مکانیک", label: "مهندس مکانیک" },
  { value: "مهندس برق", label: "مهندس برق" },
  { value: "مهندس عمران", label: "مهندس عمران" },
  { value: "مهندس معماری", label: "مهندس معماری" },
  { value: "مهندس شیمی", label: "مهندس شیمی" },
  { value: "مهندس صنایع", label: "مهندس صنایع" },
  { value: "مهندس کشاورزی", label: "مهندس کشاورزی" },
  { value: "مهندس پزشکی", label: "مهندس پزشکی" },
  { value: "مهندس هوافضا", label: "مهندس هوافضا" },
  { value: "مهندس نفت", label: "مهندس نفت" },
  { value: "مهندس معدن", label: "مهندس معدن" },
  { value: "مهندس متالورژی", label: "مهندس متالورژی" },
  { value: "مهندس رباتیک", label: "مهندس رباتیک" },
  { value: "مهندس شبکه", label: "مهندس شبکه" },
  { value: "مهندس هوش مصنوعی", label: "مهندس هوش مصنوعی" },
  { value: "مهندس امنیت سایبری", label: "مهندس امنیت سایبری" },
  { value: "مهندس داده", label: "مهندس داده" },
  { value: "مهندس DevOps", label: "مهندس DevOps" },
  { value: "مهندس کنترل", label: "مهندس کنترل" },
  { value: "طراح گرافیک", label: "طراح گرافیک" },
  { value: "طراح رابط کاربری", label: "طراح رابط کاربری" },
  { value: "طراح تجربه کاربری", label: "طراح تجربه کاربری" },
  { value: "طراح محصول", label: "طراح محصول" },
  { value: "طراح داخلی", label: "طراح داخلی" },
  { value: "طراح صنعتی", label: "طراح صنعتی" },
  { value: "طراح لباس", label: "طراح لباس" },
  { value: "طراح وب", label: "طراح وب" },
  { value: "طراح موشن گرافیک", label: "طراح موشن گرافیک" },
  { value: "طراح بازی", label: "طراح بازی" },
  { value: "طراح جواهرات", label: "طراح جواهرات" },
  { value: "تحلیلگر داده", label: "تحلیلگر داده" },
  { value: "تحلیلگر کسب و کار", label: "تحلیلگر کسب و کار" },
  { value: "تحلیلگر مالی", label: "تحلیلگر مالی" },
  { value: "تحلیلگر بازار", label: "تحلیلگر بازار" },
  { value: "تحلیلگر سیستم", label: "تحلیلگر سیستم" },
  { value: "متخصص بهینه‌سازی موتورهای جستجو", label: "متخصص بهینه‌سازی موتورهای جستجو" },
  { value: "متخصص بازاریابی دیجیتال", label: "متخصص بازاریابی دیجیتال" },
  { value: "متخصص شبکه‌های اجتماعی", label: "متخصص شبکه‌های اجتماعی" },
  { value: "متخصص تبلیغات", label: "متخصص تبلیغات" },
  { value: "متخصص روابط عمومی", label: "متخصص روابط عمومی" },
  { value: "متخصص یادگیری ماشین", label: "متخصص یادگیری ماشین" },
  { value: "متخصص پردازش زبان طبیعی", label: "متخصص پردازش زبان طبیعی" },
  { value: "متخصص بینایی ماشین", label: "متخصص بینایی ماشین" },
  { value: "متخصص تغذیه", label: "متخصص تغذیه" },
  { value: "متخصص آمار", label: "متخصص آمار" },
  { value: "کارشناس پشتیبانی فنی", label: "کارشناس پشتیبانی فنی" },
  { value: "کارشناس فروش", label: "کارشناس فروش" },
  { value: "کارشناس منابع انسانی", label: "کارشناس منابع انسانی" },
  { value: "کارشناس آموزش", label: "کارشناس آموزش" },
  { value: "کارشناس حقوق و دستمزد", label: "کارشناس حقوق و دستمزد" },
  { value: "کارشناس بیمه", label: "کارشناس بیمه" },
  { value: "کارشناس مالیات", label: "کارشناس مالیات" },
  { value: "کارشناس گمرک", label: "کارشناس گمرک" },
  { value: "کارشناس بورس", label: "کارشناس بورس" },
  { value: "کارشناس کنترل کیفیت", label: "کارشناس کنترل کیفیت" },
  { value: "کارشناس روابط عمومی", label: "کارشناس روابط عمومی" },
  { value: "کارشناس بازاریابی", label: "کارشناس بازاریابی" },
  { value: "کارشناس تحقیقات بازار", label: "کارشناس تحقیقات بازار" },
  { value: "کارشناس امور مشتریان", label: "کارشناس امور مشتریان" },
  { value: "کارشناس مالی", label: "کارشناس مالی" },
  { value: "حسابدار", label: "حسابدار" },
  { value: "حسابرس", label: "حسابرس" },
  { value: "حسابدار مدیریت", label: "حسابدار مدیریت" },
  { value: "کارشناس حسابداری", label: "کارشناس حسابداری" },
  { value: "مسئول حسابداری", label: "مسئول حسابداری" },
  { value: "مشاور مالی", label: "مشاور مالی" },
  { value: "مشاور حقوقی", label: "مشاور حقوقی" },
  { value: "مشاور کسب و کار", label: "مشاور کسب و کار" },
  { value: "مشاور املاک", label: "مشاور املاک" },
  { value: "مشاور سرمایه‌گذاری", label: "مشاور سرمایه‌گذاری" },
  { value: "مشاور مالیاتی", label: "مشاور مالیاتی" },
  { value: "مشاور روانشناسی", label: "مشاور روانشناسی" },
  { value: "مشاور تحصیلی", label: "مشاور تحصیلی" },
  { value: "مشاور شغلی", label: "مشاور شغلی" },
  { value: "کارمند اداری", label: "کارمند اداری" },
  { value: "منشی", label: "منشی" },
  { value: "مسئول دفتر", label: "مسئول دفتر" },
  { value: "کارمند دبیرخانه", label: "کارمند دبیرخانه" },
  { value: "کارمند بایگانی", label: "کارمند بایگانی" },
  { value: "پزشک", label: "پزشک" },
  { value: "پزشک متخصص", label: "پزشک متخصص" },
  { value: "متخصص قلب", label: "متخصص قلب" },
  { value: "متخصص مغز و اعصاب", label: "متخصص مغز و اعصاب" },
  { value: "متخصص چشم", label: "متخصص چشم" },
  { value: "متخصص گوش و حلق و بینی", label: "متخصص گوش و حلق و بینی" },
  { value: "متخصص پوست", label: "متخصص پوست" },
  { value: "متخصص اطفال", label: "متخصص اطفال" },
  { value: "متخصص زنان و زایمان", label: "متخصص زنان و زایمان" },
  { value: "متخصص ارتوپدی", label: "متخصص ارتوپدی" },
  { value: "متخصص داخلی", label: "متخصص داخلی" },
  { value: "جراح", label: "جراح" },
  { value: "دندانپزشک", label: "دندانپزشک" },
  { value: "متخصص ارتودنسی", label: "متخصص ارتودنسی" },
  { value: "داروساز", label: "داروساز" },
  { value: "روانشناس", label: "روانشناس" },
  { value: "روانپزشک", label: "روانپزشک" },
  { value: "فیزیوتراپیست", label: "فیزیوتراپیست" },
  { value: "کایروپراکتور", label: "کایروپراکتور" },
  { value: "پرستار", label: "پرستار" },
  { value: "ماما", label: "ماما" },
  { value: "بهیار", label: "بهیار" },
  { value: "تکنسین اورژانس", label: "تکنسین اورژانس" },
  { value: "تکنسین رادیولوژی", label: "تکنسین رادیولوژی" },
  { value: "تکنسین آزمایشگاه", label: "تکنسین آزمایشگاه" },
  { value: "اپتومتریست", label: "اپتومتریست" },
  { value: "شنوایی‌سنج", label: "شنوایی‌سنج" },
  { value: "گفتاردرمانگر", label: "گفتاردرمانگر" },
  { value: "کاردرمانگر", label: "کاردرمانگر" },
  { value: "معلم", label: "معلم" },
  { value: "آموزگار", label: "آموزگار" },
  { value: "دبیر", label: "دبیر" },
  { value: "استاد دانشگاه", label: "استاد دانشگاه" },
  { value: "هیأت علمی", label: "هیأت علمی" },
  { value: "مدرس", label: "مدرس" },
  { value: "مربی", label: "مربی" },
  { value: "معاون آموزشی", label: "معاون آموزشی" },
  { value: "مدیر مدرسه", label: "مدیر مدرسه" },
  { value: "رئیس دانشگاه", label: "رئیس دانشگاه" },
  { value: "معمار", label: "معمار" },
  { value: "نقشه‌کش", label: "نقشه‌کش" },
  { value: "نقشه‌بردار", label: "نقشه‌بردار" },
  { value: "وکیل", label: "وکیل" },
  { value: "قاضی", label: "قاضی" },
  { value: "کارشناس حقوقی", label: "کارشناس حقوقی" },
  { value: "بازپرس", label: "بازپرس" },
  { value: "دادستان", label: "دادستان" },
  { value: "خبرنگار", label: "خبرنگار" },
  { value: "گزارشگر", label: "گزارشگر" },
  { value: "مجری", label: "مجری" },
  { value: "سردبیر", label: "سردبیر" },
  { value: "دبیر خبر", label: "دبیر خبر" },
  { value: "روزنامه‌نگار", label: "روزنامه‌نگار" },
  { value: "نویسنده", label: "نویسنده" },
  { value: "مترجم", label: "مترجم" },
  { value: "ویراستار", label: "ویراستار" },
  { value: "خلبان", label: "خلبان" },
  { value: "مهماندار", label: "مهماندار" },
  { value: "خدمه پرواز", label: "خدمه پرواز" },
  { value: "کنترلر ترافیک هوایی", label: "کنترلر ترافیک هوایی" },
  { value: "راننده", label: "راننده" },
  { value: "راننده اتوبوس", label: "راننده اتوبوس" },
  { value: "راننده کامیون", label: "راننده کامیون" },
  { value: "راننده تاکسی", label: "راننده تاکسی" },
  { value: "لوکوموتیوران", label: "لوکوموتیوران" },
  { value: "کاپیتان کشتی", label: "کاپیتان کشتی" },
  { value: "ملوان", label: "ملوان" },
  { value: "آشپز", label: "آشپز" },
  { value: "سرآشپز", label: "سرآشپز" },
  { value: "شیرینی‌پز", label: "شیرینی‌پز" },
  { value: "نانوا", label: "نانوا" },
  { value: "قصاب", label: "قصاب" },
  { value: "گارسون", label: "گارسون" },
  { value: "متصدی کافی‌شاپ", label: "متصدی کافی‌شاپ" },
  { value: "باریستا", label: "باریستا" },
  { value: "میزبان رستوران", label: "میزبان رستوران" },
  { value: "مدیر رستوران", label: "مدیر رستوران" },
  { value: "باغبان", label: "باغبان" },
  { value: "گل‌فروش", label: "گل‌فروش" },
  { value: "طراح فضای سبز", label: "طراح فضای سبز" },
  { value: "نجار", label: "نجار" },
  { value: "برقکار", label: "برقکار" },
  { value: "لوله کش", label: "لوله کش" },
  { value: "مکانیک", label: "مکانیک" },
  { value: "تعمیرکار", label: "تعمیرکار" },
  { value: "نقاش ساختمان", label: "نقاش ساختمان" },
  { value: "جوشکار", label: "جوشکار" },
  { value: "آهنگر", label: "آهنگر" },
  { value: "بنا", label: "بنا" },
  { value: "گچ‌کار", label: "گچ‌کار" },
  { value: "کاشی‌کار", label: "کاشی‌کار" },
  { value: "سنگ‌کار", label: "سنگ‌کار" },
  { value: "عکاس", label: "عکاس" },
  { value: "فیلمبردار", label: "فیلمبردار" },
  { value: "تدوینگر", label: "تدوینگر" },
  { value: "انیماتور", label: "انیماتور" },
  { value: "صدابردار", label: "صدابردار" },
  { value: "موسیقیدان", label: "موسیقیدان" },
  { value: "آهنگساز", label: "آهنگساز" },
  { value: "نوازنده", label: "نوازنده" },
  { value: "خواننده", label: "خواننده" },
  { value: "بازیگر", label: "بازیگر" },
  { value: "کارگردان", label: "کارگردان" },
  { value: "تهیه کننده", label: "تهیه کننده" },
  { value: "فیلمنامه‌نویس", label: "فیلمنامه‌نویس" },
  { value: "مدل", label: "مدل" },
  { value: "گریمور", label: "گریمور" },
  { value: "طراح صحنه", label: "طراح صحنه" },
  { value: "طراح لباس صحنه", label: "طراح لباس صحنه" },
  { value: "ورزشکار", label: "ورزشکار" },
  { value: "مربی ورزش", label: "مربی ورزش" },
  { value: "داور ورزشی", label: "داور ورزشی" },
  { value: "مدیر باشگاه ورزشی", label: "مدیر باشگاه ورزشی" },
  { value: "فیزیوتراپیست ورزشی", label: "فیزیوتراپیست ورزشی" },
  { value: "کارآفرین", label: "کارآفرین" },
  { value: "سرمایه‌گذار", label: "سرمایه‌گذار" },
  { value: "فروشنده", label: "فروشنده" },
  { value: "صندوقدار", label: "صندوقدار" },
  { value: "انباردار", label: "انباردار" },
  { value: "نگهبان", label: "نگهبان" },
  { value: "مأمور امنیتی", label: "مأمور امنیتی" },
  { value: "آتش‌نشان", label: "آتش‌نشان" },
  { value: "نظامی", label: "نظامی" },
  { value: "پلیس", label: "پلیس" },
  { value: "خلبان پهپاد", label: "خلبان پهپاد" },
  { value: "مدیر محتوا", label: "مدیر محتوا" },
  { value: "تولیدکننده محتوا", label: "تولیدکننده محتوا" },
  { value: "اینفلوئنسر", label: "اینفلوئنسر" },
  { value: "بلاگر", label: "بلاگر" },
  { value: "یوتیوبر", label: "یوتیوبر" },
  { value: "استریمر", label: "استریمر" },
  { value: "توسعه‌دهنده محتوا", label: "توسعه‌دهنده محتوا" },
  { value: "متخصص امور گمرکی", label: "متخصص امور گمرکی" },
  { value: "کارگزار بورس", label: "کارگزار بورس" },
  { value: "راهنمای تور", label: "راهنمای تور" },
  { value: "مدیر هتل", label: "مدیر هتل" },
  { value: "پذیرشگر هتل", label: "پذیرشگر هتل" },
  { value: "مسئول خدمات مشتریان", label: "مسئول خدمات مشتریان" },
  { value: "مدیر سالن زیبایی", label: "مدیر سالن زیبایی" },
  { value: "آرایشگر", label: "آرایشگر" },
  { value: "ماساژور", label: "ماساژور" },
  { value: "مربی یوگا", label: "مربی یوگا" },
  { value: "مربی بدنسازی", label: "مربی بدنسازی" },
  { value: "پستچی", label: "پستچی" },
  { value: "کتابدار", label: "کتابدار" },
  { value: "مدیر موزه", label: "مدیر موزه" },
  { value: "راهنمای موزه", label: "راهنمای موزه" },
  { value: "دامپزشک", label: "دامپزشک" },
  { value: "تکنسین دامپزشکی", label: "تکنسین دامپزشکی" },
  { value: "مربی حیوانات", label: "مربی حیوانات" },
  { value: "کشاورز", label: "کشاورز" },
  { value: "دامدار", label: "دامدار" },
  { value: "ماهیگیر", label: "ماهیگیر" },
  { value: "جنگلبان", label: "جنگلبان" },
  { value: "محیط‌بان", label: "محیط‌بان" },
  { value: "متخصص محیط زیست", label: "متخصص محیط زیست" },
  { value: "زمین‌شناس", label: "زمین‌شناس" },
  { value: "هواشناس", label: "هواشناس" },
  { value: "اخترشناس", label: "اخترشناس" },
  { value: "فیزیکدان", label: "فیزیکدان" },
  { value: "شیمیدان", label: "شیمیدان" },
  { value: "زیست‌شناس", label: "زیست‌شناس" },
  { value: "ریاضیدان", label: "ریاضیدان" },
  { value: "باستان‌شناس", label: "باستان‌شناس" },
  { value: "مورخ", label: "مورخ" },
  { value: "جامعه‌شناس", label: "جامعه‌شناس" },
  { value: "انسان‌شناس", label: "انسان‌شناس" },
  { value: "روانشناس اجتماعی", label: "روانشناس اجتماعی" },
  { value: "مددکار اجتماعی", label: "مددکار اجتماعی" },
  { value: "مشاور خانواده", label: "مشاور خانواده" },
  { value: "فیلسوف", label: "فیلسوف" },
  { value: "الهیدان", label: "الهیدان" },
  { value: "روحانی", label: "روحانی" },
  { value: "مترجم شفاهی", label: "مترجم شفاهی" },
  { value: "زبان‌شناس", label: "زبان‌شناس" },
  { value: "ویرایشگر", label: "ویرایشگر" },
  { value: "بازی‌ساز", label: "بازی‌ساز" },
  { value: "طراح الگوریتم", label: "طراح الگوریتم" },
  { value: "خبره هوش مصنوعی", label: "خبره هوش مصنوعی" },
  { value: "مجری رادیو", label: "مجری رادیو" },
  { value: "مجری تلویزیون", label: "مجری تلویزیون" },
  { value: "تحلیلگر اقتصادی", label: "تحلیلگر اقتصادی" },
  { value: "اقتصاددان", label: "اقتصاددان" },
  { value: "بانکدار", label: "بانکدار" },
  { value: "تحلیلگر اوراق بهادار", label: "تحلیلگر اوراق بهادار" },
  { value: "بیمه‌گر", label: "بیمه‌گر" },
  { value: "آب‌شناس", label: "آب‌شناس" },
  { value: "نانوتکنولوژیست", label: "نانوتکنولوژیست" },
  { value: "متخصص انرژی‌های تجدیدپذیر", label: "متخصص انرژی‌های تجدیدپذیر" },
  { value: "اخلاق‌پژوه", label: "اخلاق‌پژوه" },
  { value: "دیجیتال مارکتر", label: "دیجیتال مارکتر" },
  { value: "متخصص رمزارز", label: "متخصص رمزارز" },
  { value: "متخصص امنیت اطلاعات", label: "متخصص امنیت اطلاعات" },
  { value: "پایگاه داده‌کار", label: "پایگاه داده‌کار" },
  { value: "ادمین سیستم", label: "ادمین سیستم" },
  { value: "مشاور املاک", label: "مشاور املاک" },
  { value: "مدیر لجستیک", label: "مدیر لجستیک" },
  { value: "خبرنگار آزاد", label: "خبرنگار آزاد" },
  { value: "فریلنسر", label: "فریلنسر" },
  { value: "کارگردان هنری", label: "کارگردان هنری" }
];