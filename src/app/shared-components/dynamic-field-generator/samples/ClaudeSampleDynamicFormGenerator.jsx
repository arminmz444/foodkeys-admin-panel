import React from 'react';
import { z } from 'zod';
import FormFactory from '../FormFactory';
import { useCreateCategoryMutation } from '../../../main/category/CategoriesApi';
import { CustomUniformsAsyncSelect } from '../custom-fields/CustomFormFields';
import { useCreateSubCategoryMutation } from '../../../main/category/sub-category/SubCategoriesApi';

function CategoriesFormExample() {
  const [createCategory] = useCreateCategoryMutation();
  
  // Function to load categories for dropdown
  const loadCategories = async (inputValue) => {
    // Sample implementation - replace with actual API call
    return [
      { value: 1, label: 'دسته‌بندی ۱' },
      { value: 2, label: 'دسته‌بندی ۲' },
      { value: 3, label: 'دسته‌بندی ۳' },
    ].filter(i => i.label.includes(inputValue));
  };
  
  // Handle form submission
  const handleCreate = async (values) => {
    // Process form data
    const data = { ...values };
    data.categoryStatus = values.categoryStatus === 'فعال' ? 1 : 2;
    
    try {
      // Submit to API
      await createCategory(data);
      return true; // Return true to close form
    } catch (error) {
      console.error('خطا در ثبت دسته‌بندی:', error);
      return false;
    }
  };
  
  // Example with Modal presentation
  return (
    <FormFactory
      zodSchema={z.object({
        name: z
          .string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            displayName: 'نام',
            label: 'نام دسته‌بندی',
            placeholder: 'نام دسته‌بندی را وارد کنید'
          }),
        nameEn: z
          .string({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            displayName: 'نام انگلیسی',
            label: 'نام انگلیسی دسته‌بندی',
            placeholder: 'نام انگلیسی دسته‌بندی را وارد کنید'
          }),
        categoryStatus: z
          .enum(['فعال', 'غیرفعال'], {
            required_error: 'این فیلد الزامی است',
            invalid_type_error: 'فرمت داده ورودی اشتباه است',
            message: 'مقدار انتخاب شده معتبر نیست'
          })
          .uniforms({
            displayName: 'وضعیت دسته‌بندی',
            label: 'وضعیت دسته‌بندی',
            placeholder: 'وضعیت دسته‌بندی را انتخاب کنید'
          }),
        pageOrder: z
          .number({ invalid_type_error: 'فرمت داده ورودی اشتباه است', required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'حداقل مقدار برای این فیلد ۱ است' })
          .uniforms({
            displayName: 'ترتیب صفحه',
            label: 'ترتیب صفحه دسته‌بندی',
            placeholder: 'اولویت نمایش دسته‌بندی در سایت اصلی را انتخاب کنید'
          })
      })}
      formValidationStruct="ZOD_SCHEMA"
      defaultValues={{ 
        name: '', 
        nameEn: '', 
        categoryStatus: 'فعال', 
        pageOrder: 1 
      }}
      formHeaderTitle="ثبت دسته‌بندی"
      presentationType="MODAL" // Or "DRAWER"
      buttonLabel="افزودن دسته‌بندی جدید"
      dialogTitle="ایجاد دسته‌بندی جدید"
      onCreate={handleCreate}
      layoutConfig={{
        type: 'two-column', // 'single-column', 'two-column', 'three-column', 'custom'
        spacing: 2
      }}
      formFieldsInputTypes={['name', 'nameEn', 'categoryStatus', 'pageOrder']}
    />
  );
}

// Example with Drawer presentation and custom layout
function SubCategoryFormExample() {
  const [createSubCategory] = useCreateSubCategoryMutation();
  
  const loadCategories = async (inputValue) => {
    return [
      { value: 1, label: 'دسته‌بندی ۱' },
      { value: 2, label: 'دسته‌بندی ۲' },
    ].filter(i => i.label.includes(inputValue));
  };
  
  const handleCreate = async (values) => {
    try {
      await createSubCategory(values);
      return true;
    } catch (error) {
      console.error('خطا در ثبت زیرشاخه:', error);
      return false;
    }
  };
  
  // Custom layout example
  const customLayout = (fields) => (
    <>
      <div className="flex flex-row gap-4">
        {fields[0]}
        {fields[1]}
      </div>
      <div className="mt-4">
        {fields[2]}
      </div>
      <div className="flex flex-row gap-4 mt-4">
        {fields[3]}
        {fields[4]}
      </div>
    </>
  );
  
  return (
    <FormFactory
      zodSchema={z.object({
        name: z
          .string({ required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            label: 'نام زیرشاخه',
            placeholder: 'نام زیرشاخه را وارد کنید'
          }),
        nameEn: z
          .string({ required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'این فیلد الزامی است' })
          .uniforms({
            label: 'نام انگلیسی زیرشاخه',
            placeholder: 'نام انگلیسی زیرشاخه را وارد کنید'
          }),
        categoryId: z
          .number({ required_error: 'این فیلد الزامی است' })
          .uniforms({
            label: 'دسته‌بندی',
            placeholder: 'دسته‌بندی را انتخاب کنید',
            loadOptions: loadCategories,
            component: CustomUniformsAsyncSelect,
          }),
        pageOrder: z
          .number({ required_error: 'این فیلد الزامی است' })
          .min(1, { message: 'حداقل مقدار برای این فیلد ۱ است' })
          .uniforms({
            label: 'ترتیب صفحه',
            placeholder: 'اولویت نمایش را انتخاب کنید'
          }),
        hasDetailsPage: z
          .boolean()
          .optional()
          .uniforms({
            label: 'ایجاد صفحه اختصاصی',
          }),
      })}
      formValidationStruct="ZOD_SCHEMA"
      defaultValues={{
        name: '',
        nameEn: '',
        categoryId: null,
        pageOrder: 1,
        hasDetailsPage: false
      }}
      formHeaderTitle="ثبت زیرشاخه"
      presentationType="DRAWER"
      buttonLabel="افزودن زیرشاخه جدید"
      dialogTitle="ایجاد زیرشاخه جدید"
      onCreate={handleCreate}
      layoutConfig={{
        type: 'custom',
        customLayout: customLayout
      }}
      formFieldsInputTypes={['name', 'nameEn', 'categoryId', 'pageOrder', 'hasDetailsPage']}
      drawerProps={{
        anchor: 'right'
      }}
    />
  );
}

function ClaudeSampleDynamicFormGenerator() {
  return (
    <>
    <CategoriesFormExample />
    <SubCategoryFormExample />
    </>
  );
};
export default ClaudeSampleDynamicFormGenerator;