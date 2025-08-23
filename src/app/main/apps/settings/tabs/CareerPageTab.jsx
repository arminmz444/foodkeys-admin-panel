// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { zodResolver } from '@hookform/resolvers/zod';
// import _ from '@lodash';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Chip from '@mui/material/Chip';
// import { useState, useEffect } from 'react';
// import { Controller, useForm, useFieldArray } from 'react-hook-form';
// import { BsTextLeft } from 'react-icons/bs';
// import { LuHeading1 } from 'react-icons/lu';
// import { MdDelete, MdAdd } from 'react-icons/md';
// import { z } from 'zod';
// import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// import FuseLoading from '@fuse/core/FuseLoading';
//
// const schema = z.object({
//     career: z.array(z.object({
//         title: z.string().min(1, 'فیلد عنوان الزامی است'),
//         conditions: z.array(z.string().min(1, 'شرط نمی‌تواند خالی باشد')).min(1, 'حداقل یک شرط الزامی است'),
//         overview: z.string().min(1, 'فیلد نمای کلی الزامی است'),
//         requirements: z.array(z.string().min(1, 'الزام نمی‌تواند خالی باشد')).min(1, 'حداقل یک الزام الزامی است'),
//         description: z.string().min(1, 'فیلد توضیحات الزامی است')
//     })).min(1, 'حداقل یک مسیر شغلی الزامی است')
// });
//
// function CareerPageTab() {
//     const { data: configData, isLoading: configLoading, error: configError } = useGetConfigQuery('careerPageConfig');
//     const { data: schemas, isLoading: schemasLoading } = useGetSchemasQuery();
//     const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
//
//     const { control, handleSubmit, formState, reset } = useForm({
//         defaultValues: {
//             career: []
//         },
//         mode: 'all',
//         resolver: zodResolver(schema)
//     });
//
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'career'
//     });
//
//     const { isValid, dirtyFields, errors } = formState;
//
//     useEffect(() => {
//         if (configData) {
//             reset(configData);
//         }
//     }, [configData, reset]);
//
//     const onSubmit = async (formData) => {
//         try {
//             const careerSchema = schemas?.find(s => s.name === 'careerPageConfig');
//             if (!careerSchema) {
//                 console.error('Career page schema not found');
//                 return;
//             }
//
//             await updateConfig({
//                 section: 'careerPageConfig',
//                 configData: {
//                     schemaId: careerSchema.id,
//                     configData: formData
//                 }
//             }).unwrap();
//         } catch (error) {
//             console.error('Error updating career page config:', error);
//         }
//     };
//
//     const addCareer = () => {
//         append({
//             title: '',
//             conditions: [''],
//             overview: '',
//             requirements: [''],
//             description: ''
//         });
//     };
//
//     if (configLoading || schemasLoading) {
//         return <FuseLoading />;
//     }
//
//     if (configError) {
//         return <Typography color="error">خطا در بارگذاری تنظیمات صفحه شغل</Typography>;
//     }
//
//     return (
//         <div className="w-full max-w-3xl">
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="w-full">
//                     <Typography className="text-xl">تنظیمات صفحه مسیر شغلی</Typography>
//                     <Typography color="text.secondary" className="font-300">
//                         تنظیمات مسیرهای شغلی و موقعیت‌های استخدامی را انجام دهید.
//                     </Typography>
//                 </div>
//
//                 <div className="mt-32 w-full space-y-24">
//                     <div className="flex items-center justify-between">
//                         <Typography className="text-lg">مسیرهای شغلی</Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={addCareer}
//                             startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                         >
//                             افزودن مسیر شغلی
//                         </Button>
//                     </div>
//
//                     {fields.map((field, index) => (
//                         <CareerItem
//                             key={field.id}
//                             control={control}
//                             index={index}
//                             remove={remove}
//                             errors={errors}
//                         />
//                     ))}
//                 </div>
//
//                 <Divider className="mb-40 mt-44 border-t" />
//                 <div className="flex items-center justify-end gap-x-10 w-1/2">
//                     <Button
//                         variant="outlined"
//                         disabled={_.isEmpty(dirtyFields)}
//                         onClick={() => reset(configData)}
//                         size="large"
//                         fullWidth
//                     >
//                         لغو
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         disabled={_.isEmpty(dirtyFields) || !isValid || updateLoading}
//                         type="submit"
//                         size="large"
//                         fullWidth
//                     >
//                         {updateLoading ? 'در حال ذخیره...' : 'ذخیره'}
//                     </Button>
//                 </div>
//             </form>
//         </div>
//     );
// }
//
// function CareerItem({ control, index, remove, errors }) {
//     const [newCondition, setNewCondition] = useState('');
//     const [newRequirement, setNewRequirement] = useState('');
//
//     const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
//         control,
//         name: `career.${index}.conditions`
//     });
//
//     const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
//         control,
//         name: `career.${index}.requirements`
//     });
//
//     const addCondition = () => {
//         if (newCondition.trim()) {
//             appendCondition(newCondition.trim());
//             setNewCondition('');
//         }
//     };
//
//     const addRequirement = () => {
//         if (newRequirement.trim()) {
//             appendRequirement(newRequirement.trim());
//             setNewRequirement('');
//         }
//     };
//
//     return (
//         <div className="border rounded-lg p-24 space-y-24">
//             <div className="flex items-center justify-between">
//                 <Typography className="text-base font-medium">مسیر شغلی {index + 1}</Typography>
//                 <IconButton color="error" onClick={() => remove(index)} size="small">
//                     <MdDelete />
//                 </IconButton>
//             </div>
//
//             <div className="space-y-24">
//                 <Controller
//                     control={control}
//                     name={`career.${index}.title`}
//                     render={({ field }) => (
//                         <TextField
//                             {...field}
//                             label="عنوان شغل"
//                             placeholder="عنوان موقعیت شغلی را وارد کنید"
//                             error={!!errors?.career?.[index]?.title}
//                             helperText={errors?.career?.[index]?.title?.message}
//                             variant="outlined"
//                             required
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <LuHeading1 size={20} />
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     )}
//                 />
//
//                 <Controller
//                     control={control}
//                     name={`career.${index}.overview`}
//                     render={({ field }) => (
//                         <TextField
//                             {...field}
//                             label="نمای کلی"
//                             placeholder="نمای کلی از موقعیت شغلی"
//                             error={!!errors?.career?.[index]?.overview}
//                             helperText={errors?.career?.[index]?.overview?.message}
//                             variant="outlined"
//                             required
//                             multiline
//                             minRows={3}
//                             fullWidth
//                             InputProps={{
//                                 className: 'max-h-min h-min items-start',
//                                 startAdornment: (
//                                     <InputAdornment position="start" className="mt-16">
//                                         <BsTextLeft size={20} />
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     )}
//                 />
//
//                 <Controller
//                     control={control}
//                     name={`career.${index}.description`}
//                     render={({ field }) => (
//                         <TextField
//                             {...field}
//                             label="توضیحات"
//                             placeholder="توضیحات تفصیلی موقعیت شغلی"
//                             error={!!errors?.career?.[index]?.description}
//                             helperText={errors?.career?.[index]?.description?.message}
//                             variant="outlined"
//                             required
//                             multiline
//                             minRows={4}
//                             fullWidth
//                             InputProps={{
//                                 className: 'max-h-min h-min items-start',
//                                 startAdornment: (
//                                     <InputAdornment position="start" className="mt-16">
//                                         <BsTextLeft size={20} />
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     )}
//                 />
//
//                 {/* Conditions Section */}
//                 <div className="space-y-16">
//                     <Typography className="text-base font-medium">شرایط</Typography>
//                     <div className="flex gap-8 flex-wrap">
//                         {conditionFields.map((conditionField, conditionIndex) => (
//                             <Controller
//                                 key={conditionField.id}
//                                 control={control}
//                                 name={`career.${index}.conditions.${conditionIndex}`}
//                                 render={({ field }) => (
//                                     <Chip
//                                         label={field.value}
//                                         onDelete={() => removeCondition(conditionIndex)}
//                                         variant="outlined"
//                                         color="primary"
//                                     />
//                                 )}
//                             />
//                         ))}
//                     </div>
//                     <div className="flex gap-8">
//                         <TextField
//                             value={newCondition}
//                             onChange={(e) => setNewCondition(e.target.value)}
//                             placeholder="شرط جدید اضافه کنید"
//                             variant="outlined"
//                             size="small"
//                             onKeyPress={(e) => e.key === 'Enter' && addCondition()}
//                             fullWidth
//                         />
//                         <Button
//                             variant="outlined"
//                             onClick={addCondition}
//                             disabled={!newCondition.trim()}
//                             startIcon={<MdAdd />}
//                         >
//                             افزودن
//                         </Button>
//                     </div>
//                     {errors?.career?.[index]?.conditions && (
//                         <Typography color="error" variant="caption">
//                             {errors.career[index].conditions.message}
//                         </Typography>
//                     )}
//                 </div>
//
//                 {/* Requirements Section */}
//                 <div className="space-y-16">
//                     <Typography className="text-base font-medium">الزامات</Typography>
//                     <div className="flex gap-8 flex-wrap">
//                         {requirementFields.map((requirementField, requirementIndex) => (
//                             <Controller
//                                 key={requirementField.id}
//                                 control={control}
//                                 name={`career.${index}.requirements.${requirementIndex}`}
//                                 render={({ field }) => (
//                                     <Chip
//                                         label={field.value}
//                                         onDelete={() => removeRequirement(requirementIndex)}
//                                         variant="outlined"
//                                         color="secondary"
//                                     />
//                                 )}
//                             />
//                         ))}
//                     </div>
//                     <div className="flex gap-8">
//                         <TextField
//                             value={newRequirement}
//                             onChange={(e) => setNewRequirement(e.target.value)}
//                             placeholder="الزام جدید اضافه کنید"
//                             variant="outlined"
//                             size="small"
//                             onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
//                             fullWidth
//                         />
//                         <Button
//                             variant="outlined"
//                             onClick={addRequirement}
//                             disabled={!newRequirement.trim()}
//                             startIcon={<MdAdd />}
//                         >
//                             افزودن
//                         </Button>
//                     </div>
//                     {errors?.career?.[index]?.requirements && (
//                         <Typography color="error" variant="caption">
//                             {errors.career[index].requirements.message}
//                         </Typography>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default CareerPageTab;

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { BsTextLeft } from 'react-icons/bs';
import { LuHeading1 } from 'react-icons/lu';
import { MdDelete, MdAdd } from 'react-icons/md';
import { z } from 'zod';
import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
import FuseLoading from '@fuse/core/FuseLoading';

const schema = z.object({
    career: z.array(z.object({
        title: z.string().min(1, 'فیلد عنوان الزامی است'),
        conditions: z.array(z.string().min(1, 'شرط نمی‌تواند خالی باشد')).min(1, 'حداقل یک شرط الزامی است'),
        overview: z.string().min(1, 'فیلد نمای کلی الزامی است'),
        requirements: z.array(z.string().min(1, 'الزام نمی‌تواند خالی باشد')).min(1, 'حداقل یک الزام الزامی است'),
        description: z.string().min(1, 'فیلد توضیحات الزامی است')
    })).min(1, 'حداقل یک مسیر شغلی الزامی است')
});

function CareerPageTab() {
    const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('CAREER_PAGE_CONFIG');
    const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
    const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();

    const { control, handleSubmit, formState, reset } = useForm({
        defaultValues: {
            career: []
        },
        mode: 'all',
        resolver: zodResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'career'
    });

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        // Extract the actual config data from the API response structure
        const configData = configResponse?.data;

        if (configData) {
            // Check if career exists in the data
            const careerData = configData.career || configData;

            // Normalize incoming config so career is ALWAYS an array
            const normalizedCareer = Array.isArray(careerData)
                ? careerData
                : [];

            reset({ career: normalizedCareer });
        }
    }, [configResponse, reset]);

    const onSubmit = async (formData) => {
        try {
            // Extract schemas array from response
            const schemas = schemasResponse?.data || [];

            // Find the correct schema
            const careerSchema = schemas.find(s => s.name === 'CAREER_PAGE_CONFIG_SCHEMA');

            if (!careerSchema) {
                console.error('Career page schema not found');
                return;
            }

            await updateConfig({
                section: 'CAREER_PAGE_CONFIG',
                configData: {
                    schemaId: careerSchema.id,
                    configData: formData
                }
            }).unwrap();
        } catch (error) {
            console.error('Error updating career page config:', error);
        }
    };

    const addCareer = () => {
        append({
            title: '',
            conditions: [''],
            overview: '',
            requirements: [''],
            description: ''
        });
    };

    if (configLoading || schemasLoading) {
        return <FuseLoading />;
    }

    if (configError) {
        return <Typography color="error">خطا در بارگذاری تنظیمات صفحه شغل</Typography>;
    }

    const configData = configResponse?.data;

    return (
        <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <Typography className="text-xl">تنظیمات صفحه مسیر شغلی</Typography>
                    <Typography color="text.secondary" className="font-300">
                        تنظیمات مسیرهای شغلی و موقعیت‌های استخدامی را انجام دهید.
                    </Typography>
                </div>

                <div className="mt-32 w-full space-y-24">
                    <div className="flex items-center justify-between">
                        <Typography className="text-lg">مسیرهای شغلی</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addCareer}
                            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                        >
                            افزودن مسیر شغلی
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <CareerItem
                            key={field.id}
                            control={control}
                            index={index}
                            remove={remove}
                            errors={errors}
                        />
                    ))}

                    {fields.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
                            <Typography color="text.secondary">
                                هیچ مسیر شغلی وجود ندارد. برای شروع روی دکمه "افزودن مسیر شغلی" کلیک کنید.
                            </Typography>
                        </div>
                    )}
                </div>

                <Divider className="mb-40 mt-44 border-t" />
                <div className="flex items-center justify-end gap-x-10 w-1/2">
                    <Button
                        variant="outlined"
                        disabled={_.isEmpty(dirtyFields)}
                        onClick={() => {
                            const data = configData?.career || [];
                            reset({ career: Array.isArray(data) ? data : [] });
                        }}
                        size="large"
                        fullWidth
                    >
                        لغو
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={_.isEmpty(dirtyFields) || !isValid || updateLoading}
                        type="submit"
                        size="large"
                        fullWidth
                    >
                        {updateLoading ? 'در حال ذخیره...' : 'ذخیره'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function CareerItem({ control, index, remove, errors }) {
    const [newCondition, setNewCondition] = useState('');
    const [newRequirement, setNewRequirement] = useState('');

    const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
        control,
        name: `career.${index}.conditions`
    });

    const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
        control,
        name: `career.${index}.requirements`
    });

    const addCondition = () => {
        if (newCondition.trim()) {
            appendCondition(newCondition.trim());
            setNewCondition('');
        }
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            appendRequirement(newRequirement.trim());
            setNewRequirement('');
        }
    };

    return (
        <div className="border rounded-lg p-24 space-y-24">
            <div className="flex items-center justify-between">
                <Typography className="text-base font-medium">مسیر شغلی {index + 1}</Typography>
                <IconButton color="error" onClick={() => remove(index)} size="small">
                    <MdDelete />
                </IconButton>
            </div>

            <div className="space-y-24">
                <Controller
                    control={control}
                    name={`career.${index}.title`}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="عنوان شغل"
                            placeholder="عنوان موقعیت شغلی را وارد کنید"
                            error={!!errors?.career?.[index]?.title}
                            helperText={errors?.career?.[index]?.title?.message}
                            variant="outlined"
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LuHeading1 size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={`career.${index}.overview`}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="نمای کلی"
                            placeholder="نمای کلی از موقعیت شغلی"
                            error={!!errors?.career?.[index]?.overview}
                            helperText={errors?.career?.[index]?.overview?.message}
                            variant="outlined"
                            required
                            multiline
                            minRows={3}
                            fullWidth
                            InputProps={{
                                className: 'max-h-min h-min items-start',
                                startAdornment: (
                                    <InputAdornment position="start" className="mt-16">
                                        <BsTextLeft size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={`career.${index}.description`}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="توضیحات"
                            placeholder="توضیحات تفصیلی موقعیت شغلی"
                            error={!!errors?.career?.[index]?.description}
                            helperText={errors?.career?.[index]?.description?.message}
                            variant="outlined"
                            required
                            multiline
                            minRows={4}
                            fullWidth
                            InputProps={{
                                className: 'max-h-min h-min items-start',
                                startAdornment: (
                                    <InputAdornment position="start" className="mt-16">
                                        <BsTextLeft size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />

                {/* Conditions Section */}
                <div className="space-y-16">
                    <Typography className="text-base font-medium">شرایط</Typography>
                    <div className="flex gap-8 flex-wrap">
                        {conditionFields.map((conditionField, conditionIndex) => (
                            <Controller
                                key={conditionField.id}
                                control={control}
                                name={`career.${index}.conditions.${conditionIndex}`}
                                render={({ field }) => (
                                    <Chip
                                        label={field.value}
                                        onDelete={() => removeCondition(conditionIndex)}
                                        variant="outlined"
                                        color="primary"
                                    />
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex gap-8">
                        <TextField
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            placeholder="شرط جدید اضافه کنید"
                            variant="outlined"
                            size="small"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCondition();
                                }
                            }}
                            fullWidth
                        />
                        <Button
                            variant="outlined"
                            onClick={addCondition}
                            disabled={!newCondition.trim()}
                            startIcon={<MdAdd />}
                        >
                            افزودن
                        </Button>
                    </div>
                    {errors?.career?.[index]?.conditions && (
                        <Typography color="error" variant="caption">
                            {errors.career[index].conditions.message}
                        </Typography>
                    )}
                </div>

                {/* Requirements Section */}
                <div className="space-y-16">
                    <Typography className="text-base font-medium">الزامات</Typography>
                    <div className="flex gap-8 flex-wrap">
                        {requirementFields.map((requirementField, requirementIndex) => (
                            <Controller
                                key={requirementField.id}
                                control={control}
                                name={`career.${index}.requirements.${requirementIndex}`}
                                render={({ field }) => (
                                    <Chip
                                        label={field.value}
                                        onDelete={() => removeRequirement(requirementIndex)}
                                        variant="outlined"
                                        color="secondary"
                                    />
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex gap-8">
                        <TextField
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            placeholder="الزام جدید اضافه کنید"
                            variant="outlined"
                            size="small"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addRequirement();
                                }
                            }}
                            fullWidth
                        />
                        <Button
                            variant="outlined"
                            onClick={addRequirement}
                            disabled={!newRequirement.trim()}
                            startIcon={<MdAdd />}
                        >
                            افزودن
                        </Button>
                    </div>
                    {errors?.career?.[index]?.requirements && (
                        <Typography color="error" variant="caption">
                            {errors.career[index].requirements.message}
                        </Typography>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CareerPageTab;