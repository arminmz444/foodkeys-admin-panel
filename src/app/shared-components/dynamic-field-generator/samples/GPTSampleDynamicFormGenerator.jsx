import { z } from 'zod';
import FormFactory from '../FormFactory';
import { useCreateCategoryMutation } from '../../../main/category/CategoriesApi';
import { useState } from 'react';

function GPTSampleDynamicFormGenerator() {
  const [createCategory] = useCreateCategoryMutation();
  const [open, setOpen] = useState(false);
  // Function to load categories for dropdown (example; replace with your API)
  const loadCategories = async (inputValue) => {
    return [
      { value: 1, label: 'دسته‌بندی ۱' },
      { value: 2, label: 'دسته‌بندی ۲' },
      { value: 3, label: 'دسته‌بندی ۳' },
    ].filter((i) => i.label.includes(inputValue));
  };

  // Handle form submission
  const handleCreate = async (values) => {
    const data = { ...values };
    data.categoryStatus = values.categoryStatus === 'فعال' ? 1 : 2;
    try {
      await createCategory(data);
      return true; // Close form on success
    } catch (error) {
      console.error('خطا در ثبت دسته‌بندی:', error);
      return false;
    }
  };

  return (
    <FormFactory
      zodSchema={z.object({
        name: z
          .string({
            invalid_type_error: 'فرمت داده ورودی اشتباه است',
            required_error: 'این فیلد الزامی است',
          })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            displayName: 'نام',
            label: 'نام دسته‌بندی',
            placeholder: 'نام دسته‌بندی را وارد کنید',
          }),
        nameEn: z
          .string({
            invalid_type_error: 'فرمت داده ورودی اشتباه است',
            required_error: 'این فیلد الزامی است',
          })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            displayName: 'نام انگلیسی',
            label: 'نام انگلیسی دسته‌بندی',
            placeholder: 'نام انگلیسی دسته‌بندی را وارد کنید',
          }),
        categoryStatus: z
          .enum(['فعال', 'غیرفعال'], {
            required_error: 'این فیلد الزامی است',
            invalid_type_error: 'فرمت داده ورودی اشتباه است',
            message: 'مقدار انتخاب شده معتبر نیست',
          })
          .uniforms({
            displayName: 'وضعیت دسته‌بندی',
            label: 'وضعیت دسته‌بندی',
            placeholder: 'وضعیت دسته‌بندی را انتخاب کنید',
          }),
        pageOrder: z
          .number({
            invalid_type_error: 'فرمت داده ورودی اشتباه است',
            required_error: 'این فیلد الزامی است',
          })
          .min(1, { message: 'حداقل مقدار برای این فیلد ۱ است' })
          .uniforms({
            displayName: 'ترتیب صفحه',
            label: 'ترتیب صفحه دسته‌بندی',
            placeholder: 'اولویت نمایش دسته‌بندی در سایت اصلی را انتخاب کنید',
          }),
      })}
      formValidationStruct="ZOD_SCHEMA"
      defaultValues={{
        name: '',
        nameEn: '',
        categoryStatus: 'فعال',
        pageOrder: 1,
      }}
      formHeaderTitle="ثبت دسته‌بندی"
      presentationType="MODAL" // Or "DRAWER"
      buttonLabel="افزودن دسته‌بندی جدید"
      dialogTitle="ایجاد دسته‌بندی جدید"
      onCreate={handleCreate}
      layoutConfig={{
        type: 'two-column', // 'single-column', 'two-column', 'three-column', or 'custom'
        spacing: 2,
      }}
      // List the field names that should be rendered (they will use uniforms’ AutoField by default,
      // or you can override per field via the customComponents prop in FormFactory)
      formFieldsInputTypes={['name', 'nameEn', 'categoryStatus', 'pageOrder']}
    />
  );
}

export default GPTSampleDynamicFormGenerator;
