// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import FuseLoading from '@fuse/core/FuseLoading';
// import { TextField, Button, MenuItem } from '@mui/material';
// import Typography from '@mui/material/Typography';
// import { useParams } from 'react-router-dom';
// import FormBuilder from '../../../../shared-components/form-builder/FormBuilder';
// import { useGetServiceByIdQuery, useUpdateServiceMutation, useGetSubcategoryOptionsQuery } from '../ServicesBankApi';

// function ServiceDetails() {
//   const { id } = useParams();
//   const isDraft = id && id.toString().startsWith('draft-');
//   const [localService, setLocalService] = useState(null);

//   const { data: serviceFromApi, isLoading: apiLoading } = useGetServiceByIdQuery(id, { skip: isDraft });
//   const { data: subcategoryOptions } = useGetSubcategoryOptionsQuery();
//   const [updateService] = useUpdateServiceMutation();

//   const { register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       name: '',
//       ranking: 0,
//       description: '',
//       subCategoryId: '',
//       elasticFields: '',
//       serviceSchemaData: {}
//     }
//   });

//   useEffect(() => {
//     if (isDraft) {
//       const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
//       const found = drafts.find((draft) => draft.id === id);
//       if (found) {
//         setLocalService(found);
//         reset({
//           name: found.name,
//           ranking: found.ranking,
//           description: found.description,
//           subCategoryId: found.subCategoryId,
//           elasticFields: found.elasticFields ? found.elasticFields.join(',') : '',
//           serviceSchemaData: found.serviceData || {}
//         });
//       }
//     } else if (serviceFromApi) {
//       reset({
//         name: serviceFromApi.name,
//         ranking: serviceFromApi.ranking,
//         description: serviceFromApi.description,
//         subCategoryId: serviceFromApi.subCategoryId,
//         elasticFields: serviceFromApi.elasticFields ? serviceFromApi.elasticFields.join(',') : '',
//         serviceSchemaData: serviceFromApi.serviceData || {}
//       });
//     }
//   }, [isDraft, id, serviceFromApi, reset]);

//   const onSubmit = async (data) => {
//     if (isDraft) {
//       const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
//       const updatedDrafts = drafts.map((draft) =>
//         draft.id === id
//           ? {
//               ...draft,
//               name: data.name,
//               ranking: data.ranking,
//               description: data.description,
//               subCategoryId: data.subCategoryId,
//               elasticFields: data.elasticFields
//                 ? data.elasticFields.split(',').map((f) => f.trim())
//                 : [],
//               serviceData: data.serviceSchemaData,
//               updatedAt: new Date().toISOString()
//             }
//           : draft
//       );
//       localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
//       alert('پیش‌نویس سرویس به‌روزرسانی شد!');
//     } else {
//       const updatedService = {
//         ...serviceFromApi,
//         name: data.name,
//         ranking: data.ranking,
//         description: data.description,
//         subCategoryId: data.subCategoryId,
//         elasticFields: data.elasticFields
//           ? data.elasticFields.split(',').map((field) => field.trim())
//           : [],
//         serviceData: data.serviceSchemaData
//       };
//       try {
//         await updateService({ id: serviceFromApi.id, service: updatedService }).unwrap();
//         alert('سرویس به‌روزرسانی شد!');
//       } catch (error) {
//         console.error('Update failed:', error);
//       }
//     }
//   };

//   if ((isDraft && !localService) || (!isDraft && apiLoading)) {
//     return <FuseLoading />;
//   }

//   return (
//     <div className="p-8 sm:p-16">
//       <Typography variant="h4" className="mb-6">
//         {isDraft ? 'ویرایش پیش‌نویس سرویس' : 'ویرایش سرویس'}
//       </Typography>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <TextField fullWidth label="نام سرویس" {...register('name')} variant="outlined" />
//         <TextField fullWidth label="رتبه" type="number" {...register('ranking')} variant="outlined" />
//         <TextField fullWidth label="توضیحات" {...register('description')} variant="outlined" multiline rows={3} />
//         <TextField select fullWidth label="زیر شاخه" {...register('subCategoryId')} variant="outlined">
//           {subcategoryOptions?.map((option) => (
//             <MenuItem key={option.id} value={option.id}>
//               {option.name}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           fullWidth
//           label="فیلدهای ایندکس (با ویرگول یا کاما جدا کنید)"
//           {...register('elasticFields')}
//           variant="outlined"
//           helperText="اگر خالی باشد، نام سرویس و زیر شاخه به‌صورت خودکار اضافه می‌شوند"
//         />
//         <div className="mt-8">
//           <Typography variant="h5" className="mb-2">
//             ساختار فرم سرویس
//           </Typography>
//           <FormBuilder />
//         </div>
//         <Button type="submit" variant="contained" color="primary">
//           ذخیره تغییرات
//         </Button>
//       </form>
//     </div>
//   );
// }

// export default ServiceDetails;

// src/app/main/banks/services/subcategories/SubcategoryDetails.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FuseLoading from '@fuse/core/FuseLoading';
import { TextField, Button, MenuItem, Switch, FormControlLabel } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetSubCategoryQuery, 
  useUpdateSubCategoryMutation,
  useCreateSubCategoryMutation 
} from '../../../category/sub-category/SubCategoriesApi';

function SubcategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDraft = id && id.toString().startsWith('draft-');
  const [localSubcategory, setLocalSubcategory] = useState(null);

  const { data: subcategoryFromApi, isLoading: apiLoading } = useGetSubCategoryQuery(id, { skip: isDraft });
  const [updateSubcategory] = useUpdateSubCategoryMutation();
  const [createSubcategory] = useCreateSubCategoryMutation();

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      pageOrder: 0,
      hasDetailsPage: true,
      status: 1
    }
  });

  useEffect(() => {
    if (isDraft) {
      const drafts = JSON.parse(localStorage.getItem('draftSubcategories')) || [];
      const found = drafts.find((draft) => draft.id === id);
      if (found) {
        setLocalSubcategory(found);
        reset({
          name: found.name,
          nameEn: found.nameEn,
          description: found.description,
          pageOrder: found.pageOrder,
          hasDetailsPage: found.hasDetailsPage !== false,
          status: found.status || 1
        });
      }
    } else if (subcategoryFromApi) {
      reset({
        name: subcategoryFromApi.subCategoryDisplayName,
        nameEn: subcategoryFromApi.subCategoryName,
        description: subcategoryFromApi.subCategoryDescription,
        pageOrder: subcategoryFromApi.subCategoryPageOrder || 0,
        hasDetailsPage: subcategoryFromApi.hasDetailsPage !== false,
        status: subcategoryFromApi.status || 1
      });
    }
  }, [isDraft, id, subcategoryFromApi, reset]);

  const onSubmit = async (data) => {
    if (isDraft) {
      try {
        // Create a new subcategory from draft
        const subcategoryData = {
          name: data.name,
          nameEn: data.nameEn,
          description: data.description,
          pageOrder: data.pageOrder,
          categoryId: 4, // Default category ID for service bank
          hasDetailsPage: data.hasDetailsPage,
          status: data.status
        };
        
        const result = await createSubcategory(subcategoryData).unwrap();
        
        // Remove from drafts
        const drafts = JSON.parse(localStorage.getItem('draftSubcategories')) || [];
        const updatedDrafts = drafts.filter((draft) => draft.id !== id);
        localStorage.setItem('draftSubcategories', JSON.stringify(updatedDrafts));
        
        alert('زیرشاخه با موفقیت ایجاد شد!');
        navigate(`/banks/service/subcategory/${result.data.subCategoryId}/details`);
      } catch (error) {
        console.error('Creation failed:', error);
        alert('خطا در ایجاد زیرشاخه!');
      }
    } else {
      try {
        // Update existing subcategory
        const updatedSubcategory = {
          name: data.name,
          nameEn: data.nameEn,
          description: data.description,
          pageOrder: data.pageOrder,
          categoryId: subcategoryFromApi.categoryId,
          hasDetailsPage: data.hasDetailsPage,
          status: data.status
        };
        
        await updateSubcategory({ 
          id: subcategoryFromApi.subCategoryId, 
          subcategory: updatedSubcategory 
        }).unwrap();
        
        alert('زیرشاخه به‌روزرسانی شد!');
      } catch (error) {
        console.error('Update failed:', error);
        alert('خطا در به‌روزرسانی زیرشاخه!');
      }
    }
  };

  const handleUpdateDraft = () => {
    const formData = watch();
    const drafts = JSON.parse(localStorage.getItem('draftSubcategories')) || [];
    const updatedDrafts = drafts.map((draft) =>
      draft.id === id
        ? {
            ...draft,
            name: formData.name,
            nameEn: formData.nameEn,
            description: formData.description,
            pageOrder: formData.pageOrder,
            hasDetailsPage: formData.hasDetailsPage,
            status: formData.status,
            updatedAt: new Date().toISOString()
          }
        : draft
    );
    localStorage.setItem('draftSubcategories', JSON.stringify(updatedDrafts));
    alert('پیش‌نویس زیرشاخه به‌روزرسانی شد!');
  };

  if ((isDraft && !localSubcategory) || (!isDraft && apiLoading)) {
    return <FuseLoading />;
  }

  return (
    <div className="p-8 sm:p-16">
      <Typography variant="h4" className="mb-6">
        {isDraft ? 'ویرایش پیش‌نویس زیرشاخه' : 'ویرایش زیرشاخه'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField fullWidth label="نام زیرشاخه" {...register('name')} variant="outlined" required />
        <TextField 
          fullWidth 
          label="نام انگلیسی" 
          {...register('nameEn')} 
          variant="outlined" 
          required
          helperText="به عنوان شناسه یکتا استفاده می‌شود"
        />
        <TextField 
          fullWidth 
          label="توضیحات" 
          {...register('description')} 
          variant="outlined" 
          multiline 
          rows={3} 
        />
        <TextField 
          fullWidth 
          label="ترتیب نمایش" 
          type="number" 
          {...register('pageOrder')} 
          variant="outlined" 
        />
        <TextField 
          select 
          fullWidth 
          label="وضعیت" 
          {...register('status')} 
          variant="outlined"
        >
          <MenuItem value={0}>غیرفعال</MenuItem>
          <MenuItem value={1}>فعال</MenuItem>
          <MenuItem value={2}>در انتظار تایید</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch 
              checked={watch('hasDetailsPage')} 
              onChange={(e) => setValue('hasDetailsPage', e.target.checked)}
            />
          }
          label="دارای صفحه جزئیات"
        />
        
        <div className="flex gap-4">
          {isDraft ? (
            <>
              <Button type="submit" variant="contained" color="primary">
                ذخیره و ایجاد زیرشاخه
              </Button>
              <Button type="button" variant="outlined" color="secondary" onClick={handleUpdateDraft}>
                به‌روزرسانی پیش‌نویس
              </Button>
            </>
          ) : (
            <Button type="submit" variant="contained" color="primary">
              ذخیره تغییرات
            </Button>
          )}
          <Button 
            type="button" 
            variant="outlined" 
            onClick={() => navigate('/banks/service/subcategory')}
          >
            بازگشت
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SubcategoryDetails;