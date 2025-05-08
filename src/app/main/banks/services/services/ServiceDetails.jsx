// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import FuseLoading from '@fuse/core/FuseLoading';
// import { TextField, Button, MenuItem, Paper, Divider, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import Typography from '@mui/material/Typography';
// import { useParams, useNavigate } from 'react-router-dom';
// import FormPreview from '../../../../shared-components/form-builder/FormPreview';
// import { useGetServiceByIdQuery, useUpdateServiceMutation, useGetSubcategoryOptionsQuery, useDeleteServiceMutation } from '../ServicesBankApi';
// import { convertSchemaToFields, formatFormDataForApi } from '../../../../../utils/schemaConverter';
// import axios from 'axios';

// function ServiceDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isDraft = id && id.toString().startsWith('draft-');
  
//   // State
//   const [localService, setLocalService] = useState(null);
//   const [serviceFormData, setServiceFormData] = useState({});
//   const [schemaFields, setSchemaFields] = useState([]);
//   const [formTitle, setFormTitle] = useState('');
//   const [formDescription, setFormDescription] = useState('');
//   const [jsonSchema, setJsonSchema] = useState(null);
//   const [error, setError] = useState(null);
//   const [subcategories, setSubcategories] = useState([]);
//   const [hasFetchedSubCategories, setHasFetchedSubCategories] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   // Queries
//   const { data: serviceFromApi, isLoading: apiLoading } = useGetServiceByIdQuery(id, { skip: isDraft });
//   const { data: subcategoryOptions } = useGetSubcategoryOptionsQuery();
//   const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
//   const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

//   const { register, handleSubmit, reset, methods } = useForm({
//     defaultValues: {
//       name: '',
//       nameEn: '',
//       ranking: 0,
//       rankingAll: 0,
//       description: '',
//       subCategoryId: '',
//       elasticFields: ''
//     }
//   });

//   // Handle form data from FormPreview component
//   const handleFormDataChange = (data) => {
//     setServiceFormData(data);
//   };

//   useEffect(() => {
//     const fetchSubCategories = async () => {
//       try {
//         const response = await axios.get(`/category/4/subcategory?pageSize=999999999`);
//         if (response.data.status === "SUCCESS") {
//           setSubcategories(response.data.data);
//           methods.setValue("subcategories", response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//       }
//     };
//     if((!subcategories || subcategories.length === 0) && !hasFetchedSubCategories) {
//       fetchSubCategories();
//       setHasFetchedSubCategories(true);
//     }
//   }, []);
//   // Initialize form and schema data
//   useEffect(() => {
//     if (isDraft) {
//       // Handle draft services from localStorage
//       const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
//       const found = drafts.find((draft) => draft.id === id);
//       if (found) {
//         setLocalService(found);
//         reset({
//           name: found.name || '',
//           nameEn: found.nameEn || '',
//           ranking: found.ranking || 0,
//           rankingAll: found.rankingAll || 0,
//           description: found.description || '',
//           subCategoryId: found.subCategoryId || '',
//           elasticFields: found.elasticFields ? found.elasticFields.join(',') : ''
//         });
        
//         // Set form data for preview
//         setServiceFormData(found.serviceData || {});
//       }
//     } else if (serviceFromApi) {
//       // Handle services from API
//       reset({
//         name: serviceFromApi.name || '',
//         nameEn: serviceFromApi.nameEn || '',
//         ranking: serviceFromApi.ranking || 0,
//         rankingAll: serviceFromApi.rankingAll || 0,
//         description: serviceFromApi.description || '',
//         subCategoryId: serviceFromApi.subCategoryId || '',
//         elasticFields: serviceFromApi.elasticFields ? serviceFromApi.elasticFields.join(',') : ''
//       });
      
//       // Set form data for preview
//       setServiceFormData(serviceFromApi.data || {});
      
//       // Extract schema information if available
//       if (serviceFromApi.serviceSchemaDTO) {
//         try {
//           const schema = serviceFromApi.serviceSchemaDTO.schemaDefinition;
//           setJsonSchema(schema);
          
//           if (schema && schema.properties) {
//             const fieldsArray = convertSchemaToFields(schema);
//             setSchemaFields(fieldsArray);
//             setFormTitle(serviceFromApi.serviceSchemaDTO.formTitle || 'فرم سرویس');
//             setFormDescription(serviceFromApi.serviceSchemaDTO.formDescription || '');
//           }
//         } catch (err) {
//           console.error('Error processing schema:', err);
//           setError('خطا در پردازش اسکیمای فرم');
//         }
//       }
//     }
//   }, [isDraft, id, serviceFromApi, reset]);

//   // Submit both form data and schema data
//   const onSubmit = async (data) => {
//     try {
//       // Format form data according to schema
//       const formattedSchemaData = jsonSchema 
//         ? formatFormDataForApi(serviceFormData, jsonSchema) 
//         : serviceFormData;
      
//       if (isDraft) {
//         // Update draft in localStorage
//         const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
//         const updatedDrafts = drafts.map((draft) =>
//           draft.id === id
//             ? {
//                 ...draft,
//                 name: data.name,
//                 nameEn: data.nameEn,
//                 ranking: data.ranking,
//                 rankingAll: data.rankingAll,
//                 description: data.description,
//                 subCategoryId: data.subCategoryId,
//                 elasticFields: data.elasticFields
//                   ? data.elasticFields.split(',').map((f) => f.trim())
//                   : [],
//                 serviceData: formattedSchemaData,
//                 updatedAt: new Date().toISOString()
//               }
//             : draft
//         );
//         localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
//         alert('پیش‌نویس سرویس به‌روزرسانی شد!');
//         navigate('/banks/services');
//       } else {
//         // Update service via API
//         const updatedService = {
//           id: serviceFromApi.id,
//           name: data.name,
//           nameEn: data.nameEn,
//           ranking: data.ranking,
//           rankingAll: data.rankingAll,
//           description: data.description,
//           subCategoryId: data.subCategoryId,
//           elasticFields: data.elasticFields
//             ? data.elasticFields.split(',').map((field) => field.trim())
//             : [],
//           data: formattedSchemaData
//         };
        
//         await updateService({ id: serviceFromApi.id, service: updatedService }).unwrap();
//         alert('سرویس با موفقیت به‌روزرسانی شد!');
//         navigate('/banks/services');
//       }
//     } catch (err) {
//       console.error('Update failed:', err);
//       setError('خطا در به‌روزرسانی سرویس');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       if (isDraft) {
//         const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
//         const updatedDrafts = drafts.filter(draft => draft.id !== id);
//         localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
//         alert('پیش‌نویس سرویس با موفقیت حذف شد!');
//       } else {
//         await deleteService(id).unwrap();
//         alert('سرویس با موفقیت حذف شد!');
//       }
//       navigate('/banks/services');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       setError('خطا در حذف سرویس');
//     }
//   };

//   if ((isDraft && !localService) || (!isDraft && apiLoading)) {
//     return <FuseLoading />;
//   }

//   return (
//     <div className="p-8 sm:p-16 max-w-5xl mx-auto">
//       <Box className="flex flex-row items-center mb-6">
//         <Typography variant="h4" className="flex-grow">
//           {isDraft ? 'ویرایش پیش‌نویس سرویس' : 'ویرایش سرویس'}
//         </Typography>
//         <Button 
//           variant="outlined" 
//           color="error"
//           className="ml-4"
//           onClick={() => setDeleteDialogOpen(true)}
//           disabled={isDeleting}
//         >
//           حذف
//         </Button>
//         <Button 
//           variant="outlined" 
//           className="ml-4"
//           onClick={() => navigate('/banks/services')}
//         >
//           انصراف
//         </Button>
//       </Box>
      
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>تایید حذف</DialogTitle>
//         <DialogContent>
//           <Typography>
//             آیا از حذف این {isDraft ? 'پیش‌نویس سرویس' : 'سرویس'} اطمینان دارید؟
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>انصراف</Button>
//           <Button 
//             onClick={() => {
//               setDeleteDialogOpen(false);
//               handleDelete();
//             }} 
//             color="error"
//             variant="contained"
//           >
//             حذف
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {error && (
//         <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Paper className="p-6 mb-8" elevation={2}>
//           <Typography variant="h6" className="mb-4">
//             اطلاعات پایه سرویس
//           </Typography>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <TextField 
//               fullWidth 
//               label="نام سرویس" 
//               {...register('name')} 
//               variant="outlined" 
//               required
//             />
//             <TextField 
//               fullWidth 
//               label="نام انگلیسی سرویس" 
//               {...register('nameEn')} 
//               variant="outlined" 
//             />
//             <TextField 
//               fullWidth 
//               label="رتبه" 
//               type="number" 
//               {...register('ranking')} 
//               variant="outlined" 
//             />
//             <TextField 
//               fullWidth 
//               label="رتبه کلی" 
//               type="number" 
//               {...register('rankingAll')} 
//               variant="outlined" 
//             />
//             <TextField 
//               select 
//               fullWidth 
//               label="زیر شاخه" 
//               {...register('subCategoryId')} 
//               variant="outlined"
//               required
//             >
//               {subcategoryOptions?.map((option) => (
//                 <MenuItem key={option.id} value={option.id}>
//                   {option.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </div>
          
//           <TextField 
//             fullWidth 
//             label="توضیحات" 
//             {...register('description')} 
//             variant="outlined" 
//             multiline 
//             rows={3} 
//             className="mb-4"
//           />
          
//           <TextField
//             fullWidth
//             label="فیلدهای ایندکس (با ویرگول یا کاما جدا کنید)"
//             {...register('elasticFields')}
//             variant="outlined"
//             helperText="اگر خالی باشد، نام سرویس و زیر شاخه به‌صورت خودکار اضافه می‌شوند"
//           />
//         </Paper>
        
//         {schemaFields.length > 0 && (
//           <Paper className="p-6 mb-8" elevation={2}>
//             <Typography variant="h6" className="mb-4">
//               اطلاعات تخصصی سرویس
//             </Typography>
            
//             <FormPreview
//               fields={schemaFields}
//               formTitle={formTitle}
//               formDescription={formDescription}
//               initialData={serviceFormData}
//               onDataChange={handleFormDataChange}
//               submitButtonLabel="ذخیره اطلاعات"
//               hideSubmitButton={true}
//             />
//           </Paper>
//         )}
        
//         <Box className="flex justify-end mt-6">
//           <Button 
//             type="submit" 
//             variant="contained" 
//             color="primary"
//             disabled={isUpdating}
//           >
//             {isUpdating ? 'در حال ارسال...' : 'ذخیره تغییرات'}
//           </Button>
//         </Box>
//       </form>
//     </div>
//   );
// }

// export default ServiceDetails;
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FuseLoading from '@fuse/core/FuseLoading';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Paper, 
  Divider, 
  Box, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams, useNavigate } from 'react-router-dom';
import FormPreview from '../../../../shared-components/form-builder/FormPreview';
import { useGetServiceByIdQuery, useUpdateServiceMutation, useCreateServiceMutation, useDeleteServiceMutation } from '../ServicesBankApi';
import { convertSchemaToFields, formatFormDataForApi } from '../../../../../utils/schemaConverter';
import axios from 'axios';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = !id || id === 'new';
  const isDraft = id && id.toString().startsWith('draft-');
  
  // State
  const [localService, setLocalService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({});
  const [schemaFields, setSchemaFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [jsonSchema, setJsonSchema] = useState(null);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Queries
  const { data: serviceFromApi, isLoading: apiLoading } = useGetServiceByIdQuery(id, { 
    skip: isCreateMode || isDraft 
  });
  
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      nameEn: '',
      ranking: 0,
      rankingAll: 0,
      description: '',
      subCategoryId: '',
      elasticFields: ''
    }
  });

  // Watch subcategory ID to load schema when it changes
  const watchSubCategoryId = watch('subCategoryId');

  // Handle form data from FormPreview component
  const handleFormDataChange = (data) => {
    setServiceFormData(data);
  };

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get('/subcategory/options?categoryId=4&pageSize=100');
        if (response.data.status === "SUCCESS") {
          setSubcategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("خطا در دریافت زیرشاخه‌ها");
      }
    };
    
    fetchSubCategories();
  }, []);

  // Fetch schema when subcategory changes (in create/draft mode)
  useEffect(() => {
    const fetchSubCategorySchema = async (subCategoryId) => {
      if (!subCategoryId) return;
      
      setIsLoadingSchema(true);
      try {
        const response = await axios.get(`/subcategory/${subCategoryId}/schema`);
        if (response.data.status === "SUCCESS" && response.data.data) {
          const schema = response.data.data;
          setJsonSchema(schema.schemaDefinition);
          
          if (schema.schemaDefinition && schema.schemaDefinition.properties) {
            const fieldsArray = convertSchemaToFields(schema.schemaDefinition);
            setSchemaFields(fieldsArray);
            setFormTitle(schema.formTitle || 'فرم سرویس');
            setFormDescription(schema.formDescription || '');
          }
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
        setError("خطا در دریافت ساختار فرم");
      } finally {
        setIsLoadingSchema(false);
      }
    };

    // Only fetch schema on subcategory change for create/draft mode
    if ((isCreateMode || isDraft) && watchSubCategoryId && watchSubCategoryId !== selectedSubcategory) {
      setSelectedSubcategory(watchSubCategoryId);
      // Reset form data when subcategory changes
      setServiceFormData({});
      fetchSubCategorySchema(watchSubCategoryId);
    }
  }, [watchSubCategoryId, isCreateMode, isDraft, selectedSubcategory]);

  // Initialize form and schema data
  useEffect(() => {
    if (isDraft) {
      // Handle draft services from localStorage
      const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
      const found = drafts.find((draft) => draft.id === id);
      if (found) {
        setLocalService(found);
        reset({
          name: found.name || '',
          nameEn: found.nameEn || '',
          ranking: found.ranking || 0,
          rankingAll: found.rankingAll || 0,
          description: found.description || '',
          subCategoryId: found.subCategoryId || '',
          elasticFields: found.elasticFields ? found.elasticFields.join(',') : ''
        });
        
        // Set form data for preview
        setServiceFormData(found.serviceData || {});
        
        // Load schema if subcategory is set
        if (found.subCategoryId) {
          setSelectedSubcategory(found.subCategoryId);
        }
      }
    } else if (isCreateMode) {
      // Handle new service creation
      reset({
        name: '',
        nameEn: '',
        ranking: 0,
        rankingAll: 0,
        description: '',
        subCategoryId: '',
        elasticFields: ''
      });
      setServiceFormData({});
    } else if (serviceFromApi) {
      // Handle services from API (edit mode)
      reset({
        name: serviceFromApi.name || '',
        nameEn: serviceFromApi.nameEn || '',
        ranking: serviceFromApi.ranking || 0,
        rankingAll: serviceFromApi.rankingAll || 0,
        description: serviceFromApi.description || '',
        subCategoryId: serviceFromApi.subCategoryId || '',
        elasticFields: serviceFromApi.elasticFields ? serviceFromApi.elasticFields.join(',') : ''
      });
      
      // Set form data for preview
      setServiceFormData(serviceFromApi.data || {});
      
      // Extract schema information if available
      if (serviceFromApi.serviceSchemaDTO) {
        try {
          const schema = serviceFromApi.serviceSchemaDTO.schemaDefinition;
          setJsonSchema(schema);
          
          if (schema && schema.properties) {
            const fieldsArray = convertSchemaToFields(schema);
            setSchemaFields(fieldsArray);
            setFormTitle(serviceFromApi.serviceSchemaDTO.formTitle || 'فرم سرویس');
            setFormDescription(serviceFromApi.serviceSchemaDTO.formDescription || '');
          }
        } catch (err) {
          console.error('Error processing schema:', err);
          setError('خطا در پردازش اسکیمای فرم');
        }
      }
    }
  }, [isDraft, isCreateMode, id, serviceFromApi, reset]);

  // Submit both form data and schema data
  const onSubmit = async (data) => {
    try {
      // Format form data according to schema
      const formattedSchemaData = jsonSchema 
        ? formatFormDataForApi(serviceFormData, jsonSchema) 
        : serviceFormData;
      
      if (isDraft) {
        // Update draft in localStorage
        const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
        const updatedDrafts = drafts.map((draft) =>
          draft.id === id
            ? {
                ...draft,
                name: data.name,
                nameEn: data.nameEn,
                ranking: data.ranking,
                rankingAll: data.rankingAll,
                description: data.description,
                subCategoryId: data.subCategoryId,
                elasticFields: data.elasticFields
                  ? data.elasticFields.split(',').map((f) => f.trim())
                  : [],
                serviceData: formattedSchemaData,
                updatedAt: new Date().toISOString()
              }
            : draft
        );
        localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
        alert('پیش‌نویس سرویس به‌روزرسانی شد!');
        navigate('/banks/services');
      } else if (isCreateMode) {
        // Create new service via API
        const newService = {
          name: data.name,
          nameEn: data.nameEn,
          ranking: data.ranking || 0,
          rankingAll: data.rankingAll || 0,
          description: data.description,
          subCategoryId: data.subCategoryId,
          elasticFields: data.elasticFields
            ? data.elasticFields.split(',').map((field) => field.trim())
            : [],
          data: formattedSchemaData
        };
        
        await createService(newService).unwrap();
        alert('سرویس با موفقیت ایجاد شد!');
        navigate('/banks/services');
      } else {
        // Update service via API
        const updatedService = {
          id: serviceFromApi.id,
          name: data.name,
          nameEn: data.nameEn,
          ranking: data.ranking,
          rankingAll: data.rankingAll,
          description: data.description,
          subCategoryId: data.subCategoryId,
          elasticFields: data.elasticFields
            ? data.elasticFields.split(',').map((field) => field.trim())
            : [],
          data: formattedSchemaData
        };
        
        await updateService({ id: serviceFromApi.id, service: updatedService }).unwrap();
        alert('سرویس با موفقیت به‌روزرسانی شد!');
        navigate('/banks/services');
      }
    } catch (err) {
      console.error('Operation failed:', err);
      setError(isCreateMode ? 'خطا در ایجاد سرویس' : 'خطا در به‌روزرسانی سرویس');
    }
  };

  const handleDelete = async () => {
    try {
      if (isDraft) {
        const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
        const updatedDrafts = drafts.filter(draft => draft.id !== id);
        localStorage.setItem('draftServices', JSON.stringify(updatedDrafts));
        alert('پیش‌نویس سرویس با موفقیت حذف شد!');
      } else if (!isCreateMode) {
        await deleteService(id).unwrap();
        alert('سرویس با موفقیت حذف شد!');
      }
      navigate('/banks/services');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('خطا در حذف سرویس');
    }
  };

  // Find subcategory label by ID
  const getSubcategoryLabel = (subcategoryId) => {
    const subcategory = subcategories.find(item => item.value.toString() === subcategoryId.toString());
    return subcategory ? subcategory.label : subcategoryId;
  };

  if ((!isCreateMode && !isDraft && apiLoading) || (isDraft && !localService && !isCreateMode)) {
    return <FuseLoading />;
  }

  return (
    <div className="p-8 sm:p-16 max-w-5xl mx-auto">
      <Box className="flex flex-row items-center mb-6">
        <Typography variant="h4" className="flex-grow">
          {isCreateMode ? 'ایجاد سرویس جدید' : (isDraft ? 'ویرایش پیش‌نویس سرویس' : 'ویرایش سرویس')}
        </Typography>
        {!isCreateMode && (
          <Button 
            variant="outlined" 
            color="error"
            className="ml-4"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            حذف
          </Button>
        )}
        <Button 
          variant="outlined" 
          className="ml-4"
          onClick={() => navigate('/banks/service')}
        >
          انصراف
        </Button>
      </Box>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف این {isDraft ? 'پیش‌نویس سرویس' : 'سرویس'} اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>انصراف</Button>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDelete();
            }} 
            color="error"
            variant="contained"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper className="p-6 mb-8" elevation={2}>
          <Typography variant="h6" className="mb-4">
            اطلاعات پایه سرویس
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextField 
              fullWidth 
              label="نام سرویس" 
              {...register('name', { required: 'نام سرویس الزامی است' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="نام انگلیسی سرویس" 
              {...register('nameEn')} 
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="رتبه" 
              type="number" 
              {...register('ranking')} 
              variant="outlined" 
            />
            <TextField 
              fullWidth 
              label="رتبه کلی" 
              type="number" 
              {...register('rankingAll')} 
              variant="outlined" 
            />
            
            {/* Subcategory Select - disabled in edit mode, enabled in create mode */}
            {(!isCreateMode && !isDraft) ? (
              // Edit mode - show selected subcategory as text
              <TextField 
                fullWidth 
                label="زیر شاخه" 
                value={getSubcategoryLabel(watchSubCategoryId)}
                disabled
                variant="outlined"
              />
            ) : (
              // Create/Draft mode - show select dropdown
              <FormControl 
                fullWidth 
                error={!!errors.subCategoryId}
                required
              >
                <InputLabel>زیر شاخه</InputLabel>
                <Select
                  {...register('subCategoryId', { 
                    required: 'انتخاب زیر شاخه الزامی است'
                  })}
                  label="زیر شاخه"
                >
                  {subcategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subCategoryId && (
                  <FormHelperText>{errors.subCategoryId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          </div>
          
          <TextField 
            fullWidth 
            label="توضیحات" 
            {...register('description')} 
            variant="outlined" 
            multiline 
            rows={3} 
            className="mb-4"
          />
          
          <TextField
            fullWidth
            label="فیلدهای ایندکس (با ویرگول یا کاما جدا کنید)"
            {...register('elasticFields')}
            variant="outlined"
            helperText="اگر خالی باشد، نام سرویس و زیر شاخه به‌صورت خودکار اضافه می‌شوند"
          />
        </Paper>
        
        {isLoadingSchema && (
          <Paper className="p-6 mb-8 text-center" elevation={2}>
            <Typography variant="body1" className="mb-2">
              در حال بارگذاری فرم...
            </Typography>
            <FuseLoading />
          </Paper>
        )}
        
        {!isLoadingSchema && schemaFields.length > 0 && (
          <Paper className="p-6 mb-8" elevation={2}>
            <Typography variant="h6" className="mb-4">
              اطلاعات تخصصی سرویس
            </Typography>
            
            <FormPreview
              fields={schemaFields}
              formTitle={formTitle}
              formDescription={formDescription}
              initialData={serviceFormData}
              onDataChange={handleFormDataChange}
              submitButtonLabel="ذخیره اطلاعات"
              hideSubmitButton={true}
            />
          </Paper>
        )}
        
        <Box className="flex justify-end mt-6">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isUpdating || isCreating || isLoadingSchema}
          >
            {isUpdating || isCreating ? 'در حال ارسال...' : (isCreateMode ? 'ایجاد سرویس' : 'ذخیره تغییرات')}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default ServiceDetails;