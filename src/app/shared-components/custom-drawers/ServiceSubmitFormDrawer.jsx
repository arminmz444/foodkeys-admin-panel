import React from 'react';
import { z } from 'zod';
import SubmitFormDrawer from './SubmitFormDrawer';
import DynamicFormGenerator from '../dynamic-field-generator/DynamicFormGenerator';
import { useCreateServiceMutation } from '@/app/store/servicesApi';

function ServiceSubmitFormDrawer() {
  const [createService] = useCreateServiceMutation();
  const [open, setOpen] = React.useState(false);

  const handleCreate = async (values) => {
    try {
      await createService(values).unwrap();
      return true;
    } catch (error) {
      console.error('Error creating service:', error);
      return false;
    }
  };

  const formProps = {
    zodSchema: z.object({
      name: z
        .string({ 
          invalid_type_error: 'فرمت داده ورودی اشتباه است',
          required_error: 'این فیلد الزامی است' 
        })
        .min(1, { message: 'این فیلد الزامی است' })
        .uniforms({
          label: 'نام خدمت',
          placeholder: 'نام خدمت را وارد کنید'
        }),
      description: z
        .string({ 
          invalid_type_error: 'فرمت داده ورودی اشتباه است',
          required_error: 'این فیلد الزامی است'
        })
        .min(1, { message: 'این فیلد الزامی است' })
        .max(500, { message: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد' })
        .uniforms({
          label: 'توضیحات',
          placeholder: 'توضیحات خدمت را وارد کنید'
        }),
      banner: z
        .string()
        .optional()
        .uniforms({
          label: 'تصویر شاخص',
          placeholder: 'تصویر شاخص را انتخاب کنید'
        }),
      attachments: z
        .array(
          z.object({
            filename: z.string(),
            contentType: z.string(),
            content: z.string(),
            size: z.number()
          })
        )
        .optional()
        .uniforms({
          label: 'فایل‌های پیوست'
        })
    }),
    formHeaderTitle: 'ثبت خدمت جدید',
    defaultValues: {
      name: '',
      description: '',
      banner: '',
      attachments: []
    },
    formValidationStruct: 'ZOD_SCHEMA',
    formGenerationType: 'MANUAL',
    hideSubmitField: false,
    formFieldsInputTypes: ['name', 'description', 'banner', 'attachments'],
    onCreate: handleCreate
  };

  return (
    <SubmitFormDrawer
      buttonTitle="ثبت خدمت جدید"
      title="ثبت خدمت"
      open={open}
      setOpen={setOpen}
      onSubmit={handleCreate}
      cancelButtonTitle="انصراف"
      submitButtonTitle="ثبت"
    >
      <DynamicFormGenerator
        {...formProps}
        setCreateDialogOpen={setOpen}
      />
    </SubmitFormDrawer>
  );
}

export default ServiceSubmitFormDrawer;
