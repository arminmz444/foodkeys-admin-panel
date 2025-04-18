import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FuseLoading from '@fuse/core/FuseLoading';
import { TextField, Button, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import FormBuilder from '../../../../shared-components/form-builder/FormBuilder';
import { useGetServiceByIdQuery, useUpdateServiceMutation, useGetSubcategoryOptionsQuery } from '../ServicesBankApi';

function ServiceDetails() {
  const { id } = useParams();
  const isDraft = id && id.toString().startsWith('draft-');
  const [localService, setLocalService] = useState(null);

  const { data: serviceFromApi, isLoading: apiLoading } = useGetServiceByIdQuery(id, { skip: isDraft });
  const { data: subcategoryOptions } = useGetSubcategoryOptionsQuery();
  const [updateService] = useUpdateServiceMutation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      ranking: 0,
      description: '',
      subCategoryId: '',
      elasticFields: '',
      serviceSchemaData: {}
    }
  });

  useEffect(() => {
    if (isDraft) {
      const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
      const found = drafts.find((draft) => draft.id === id);
      if (found) {
        setLocalService(found);
        reset({
          name: found.name,
          ranking: found.ranking,
          description: found.description,
          subCategoryId: found.subCategoryId,
          elasticFields: found.elasticFields ? found.elasticFields.join(',') : '',
          serviceSchemaData: found.serviceData || {}
        });
      }
    } else if (serviceFromApi) {
      reset({
        name: serviceFromApi.name,
        ranking: serviceFromApi.ranking,
        description: serviceFromApi.description,
        subCategoryId: serviceFromApi.subCategoryId,
        elasticFields: serviceFromApi.elasticFields ? serviceFromApi.elasticFields.join(',') : '',
        serviceSchemaData: serviceFromApi.serviceData || {}
      });
    }
  }, [isDraft, id, serviceFromApi, reset]);

  const onSubmit = async (data) => {
    if (isDraft) {
      const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
      const updatedDrafts = drafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              name: data.name,
              ranking: data.ranking,
              description: data.description,
              subCategoryId: data.subCategoryId,
              elasticFields: data.elasticFields
                ? data.elasticFields.split(',').map((f) => f.trim())
                : [],
              serviceData: data.serviceSchemaData,
              updatedAt: new Date().toISOString()
            }
          : draft
      );
      localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
      alert('پیش‌نویس سرویس به‌روزرسانی شد!');
    } else {
      const updatedService = {
        ...serviceFromApi,
        name: data.name,
        ranking: data.ranking,
        description: data.description,
        subCategoryId: data.subCategoryId,
        elasticFields: data.elasticFields
          ? data.elasticFields.split(',').map((field) => field.trim())
          : [],
        serviceData: data.serviceSchemaData
      };
      try {
        await updateService({ id: serviceFromApi.id, service: updatedService }).unwrap();
        alert('سرویس به‌روزرسانی شد!');
      } catch (error) {
        console.error('Update failed:', error);
      }
    }
  };

  if ((isDraft && !localService) || (!isDraft && apiLoading)) {
    return <FuseLoading />;
  }

  return (
    <div className="p-8 sm:p-16">
      <Typography variant="h4" className="mb-6">
        {isDraft ? 'ویرایش پیش‌نویس سرویس' : 'ویرایش سرویس'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField fullWidth label="نام سرویس" {...register('name')} variant="outlined" />
        <TextField fullWidth label="رتبه" type="number" {...register('ranking')} variant="outlined" />
        <TextField fullWidth label="توضیحات" {...register('description')} variant="outlined" multiline rows={3} />
        <TextField select fullWidth label="زیر شاخه" {...register('subCategoryId')} variant="outlined">
          {subcategoryOptions?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="فیلدهای ایندکس (با ویرگول یا کاما جدا کنید)"
          {...register('elasticFields')}
          variant="outlined"
          helperText="اگر خالی باشد، نام سرویس و زیر شاخه به‌صورت خودکار اضافه می‌شوند"
        />
        <div className="mt-8">
          <Typography variant="h5" className="mb-2">
            ساختار فرم سرویس
          </Typography>
          <FormBuilder />
        </div>
        <Button type="submit" variant="contained" color="primary">
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}

export default ServiceDetails;
