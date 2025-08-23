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
// import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
// import { z } from 'zod';
// import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// import FuseLoading from '@fuse/core/FuseLoading';
//
// const schema = z.object({
//     contact: z.array(z.object({
//         title: z.string().min(1, 'فیلد عنوان الزامی است'),
//         icon: z.string().min(1, 'فیلد آیکون الزامی است'),
//         content: z.array(z.string().min(1, 'محتوا نمی‌تواند خالی باشد')).min(1, 'حداقل یک محتوا الزامی است')
//     })).min(1, 'حداقل یک اطلاعات تماس الزامی است')
// });
//
// function ContactPageTab() {
//     const { data: configData, isLoading: configLoading, error: configError } = useGetConfigQuery('contactPageConfig');
//     const { data: schemas, isLoading: schemasLoading } = useGetSchemasQuery();
//     const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
//
//     const { control, handleSubmit, formState, reset } = useForm({
//         defaultValues: {
//             contact: []
//         },
//         mode: 'all',
//         resolver: zodResolver(schema)
//     });
//
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'contact'
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
//             const contactSchema = schemas?.find(s => s.name === 'contactPageConfig');
//             if (!contactSchema) {
//                 console.error('Contact page schema not found');
//                 return;
//             }
//
//             await updateConfig({
//                 section: 'contactPageConfig',
//                 configData: {
//                     schemaId: contactSchema.id,
//                     configData: formData
//                 }
//             }).unwrap();
//         } catch (error) {
//             console.error('Error updating contact page config:', error);
//         }
//     };
//
//     const addContact = () => {
//         append({
//             title: '',
//             icon: '',
//             content: ['']
//         });
//     };
//
//     if (configLoading || schemasLoading) {
//         return <FuseLoading />;
//     }
//
//     if (configError) {
//         return <Typography color="error">خطا در بارگذاری تنظیمات صفحه تماس</Typography>;
//     }
//
//     return (
//         <div className="w-full max-w-3xl">
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="w-full">
//                     <Typography className="text-xl">تنظیمات صفحه تماس با ما</Typography>
//                     <Typography color="text.secondary" className="font-300">
//                         تنظیمات اطلاعات تماس و راه‌های ارتباطی را انجام دهید.
//                     </Typography>
//                 </div>
//
//                 <div className="mt-32 w-full space-y-24">
//                     <div className="flex items-center justify-between">
//                         <Typography className="text-lg">اطلاعات تماس</Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={addContact}
//                             startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                         >
//                             افزودن روش تماس
//                         </Button>
//                     </div>
//
//                     {fields.map((field, index) => (
//                         <ContactItem
//                             key={field.id}
//                             control={control}
//                             index={index}
//                             remove={remove}
//                             errors={errors}
//                         />
//                     ))}
//
//                     {fields.length === 0 && (
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
//                             <Typography color="text.secondary">
//                                 هیچ اطلاعات تماسی وجود ندارد. برای شروع روی دکمه "افزودن روش تماس" کلیک کنید.
//                             </Typography>
//                         </div>
//                     )}
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
// function ContactItem({ control, index, remove, errors }) {
//     const [newContent, setNewContent] = useState('');
//
//     const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({
//         control,
//         name: `contact.${index}.content`
//     });
//
//     const addContent = () => {
//         if (newContent.trim()) {
//             appendContent(newContent.trim());
//             setNewContent('');
//         }
//     };
//
//     const getIconSuggestions = () => [
//         { value: 'phone', label: 'تلفن', icon: <HiOutlinePhone /> },
//         { value: 'email', label: 'ایمیل', icon: <HiOutlineMail /> },
//         { value: 'location', label: 'آدرس', icon: <HiOutlineLocationMarker /> },
//         { value: 'heroicons-outline:phone', label: 'Heroicon Phone', icon: null },
//         { value: 'heroicons-outline:mail', label: 'Heroicon Mail', icon: null },
//         { value: 'heroicons-outline:location-marker', label: 'Heroicon Location', icon: null },
//     ];
//
//     return (
//         <div className="border rounded-lg p-24 space-y-24">
//             <div className="flex items-center justify-between">
//                 <Typography className="text-base font-medium">روش تماس {index + 1}</Typography>
//                 <IconButton color="error" onClick={() => remove(index)} size="small">
//                     <MdDelete />
//                 </IconButton>
//             </div>
//
//             <div className="space-y-24">
//                 <div className="grid gap-20 sm:grid-cols-2">
//                     <Controller
//                         control={control}
//                         name={`contact.${index}.title`}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="عنوان"
//                                 placeholder="عنوان روش تماس (مثل: تلفن، ایمیل، آدرس)"
//                                 error={!!errors?.contact?.[index]?.title}
//                                 helperText={errors?.contact?.[index]?.title?.message}
//                                 variant="outlined"
//                                 required
//                                 fullWidth
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <LuHeading1 size={20} />
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />
//                         )}
//                     />
//
//                     <Controller
//                         control={control}
//                         name={`contact.${index}.icon`}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="آیکون"
//                                 placeholder="نام آیکون (مثل: phone، email، location)"
//                                 error={!!errors?.contact?.[index]?.icon}
//                                 helperText={errors?.contact?.[index]?.icon?.message || 'مثال: heroicons-outline:phone'}
//                                 variant="outlined"
//                                 required
//                                 fullWidth
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <FuseSvgIcon size={20}>heroicons-outline:star</FuseSvgIcon>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//
//                 {/* Icon Suggestions */}
//                 <div className="space-y-8">
//                     <Typography variant="caption" color="text.secondary">
//                         پیشنهادات آیکون:
//                     </Typography>
//                     <div className="flex gap-8 flex-wrap">
//                         {getIconSuggestions().map((suggestion) => (
//                             <Button
//                                 key={suggestion.value}
//                                 variant="outlined"
//                                 size="small"
//                                 onClick={() => {
//                                     const currentValue = control._getWatch(`contact.${index}.icon`);
//                                     control._setValue(`contact.${index}.icon`, suggestion.value, { shouldDirty: true });
//                                 }}
//                                 startIcon={suggestion.icon}
//                             >
//                                 {suggestion.label}
//                             </Button>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Content Section */}
//                 <div className="space-y-16">
//                     <Typography className="text-base font-medium">محتوا</Typography>
//                     <div className="flex gap-8 flex-wrap">
//                         {contentFields.map((contentField, contentIndex) => (
//                             <Controller
//                                 key={contentField.id}
//                                 control={control}
//                                 name={`contact.${index}.content.${contentIndex}`}
//                                 render={({ field }) => (
//                                     <Chip
//                                         label={field.value}
//                                         onDelete={() => removeContent(contentIndex)}
//                                         variant="outlined"
//                                         color="primary"
//                                     />
//                                 )}
//                             />
//                         ))}
//                     </div>
//                     <div className="flex gap-8">
//                         <TextField
//                             value={newContent}
//                             onChange={(e) => setNewContent(e.target.value)}
//                             placeholder="محتوای جدید اضافه کنید (شماره تلفن، ایمیل، آدرس و ...)"
//                             variant="outlined"
//                             size="small"
//                             onKeyPress={(e) => e.key === 'Enter' && addContent()}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <BsTextLeft size={16} />
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                         <Button
//                             variant="outlined"
//                             onClick={addContent}
//                             disabled={!newContent.trim()}
//                             startIcon={<MdAdd />}
//                         >
//                             افزودن
//                         </Button>
//                     </div>
//                     {errors?.contact?.[index]?.content && (
//                         <Typography color="error" variant="caption">
//                             {errors.contact[index].content.message}
//                         </Typography>
//                     )}
//                 </div>
//
//                 {/* Example Content */}
//                 <div className="p-16 bg-gray-50 rounded-lg">
//                     <Typography variant="caption" color="text.secondary" className="block mb-8">
//                         مثال‌هایی از محتوا:
//                     </Typography>
//                     <div className="space-y-4 text-xs text-gray-600">
//                         <div>• تلفن: 021-12345678، 0912-3456789</div>
//                         <div>• ایمیل: info@example.com، support@example.com</div>
//                         <div>• آدرس: تهران، خیابان ولیعصر، پلاک 123</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default ContactPageTab;
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
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { z } from 'zod';
import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
import FuseLoading from '@fuse/core/FuseLoading';

const schema = z.object({
    contact: z.array(z.object({
        title: z.string().min(1, 'فیلد عنوان الزامی است'),
        icon: z.string().min(1, 'فیلد آیکون الزامی است'),
        content: z.array(z.string().min(1, 'محتوا نمی‌تواند خالی باشد')).min(1, 'حداقل یک محتوا الزامی است')
    })).min(1, 'حداقل یک اطلاعات تماس الزامی است')
});

function ContactPageTab() {
    const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('CONTACT_US_PAGE_CONFIG');
    const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
    const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();

    const { control, handleSubmit, formState, reset } = useForm({
        defaultValues: {
            contact: []
        },
        mode: 'all',
        resolver: zodResolver(schema)
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contact'
    });

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        // Extract the actual config data from the API response structure
        const configData = configResponse?.data;

        if (configData) {
            // Check if contact exists in the data
            const contactData = configData.contact || configData;

            // Normalize incoming config so contact is ALWAYS an array
            const normalizedContact = Array.isArray(contactData)
                ? contactData
                : [];

            reset({ contact: normalizedContact });
        }
    }, [configResponse, reset]);

    const onSubmit = async (formData) => {
        try {
            // Extract schemas array from response
            const schemas = schemasResponse?.data || [];

            // Find the correct schema - note the schema name is different from section name
            const contactSchema = schemas.find(s => s.name === 'CONTACT_US_PAGE_CONFIG_SCHEMA');

            if (!contactSchema) {
                console.error('Contact page schema not found');
                return;
            }

            await updateConfig({
                section: 'CONTACT_PAGE_CONFIG',
                configData: {
                    schemaId: contactSchema.id,
                    configData: formData
                }
            }).unwrap();
        } catch (error) {
            console.error('Error updating contact page config:', error);
        }
    };

    const addContact = () => {
        append({
            title: '',
            icon: '',
            content: ['']
        });
    };

    if (configLoading || schemasLoading) {
        return <FuseLoading />;
    }

    if (configError) {
        return <Typography color="error">خطا در بارگذاری تنظیمات صفحه تماس</Typography>;
    }

    const configData = configResponse?.data;

    return (
        <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <Typography className="text-xl">تنظیمات صفحه تماس با ما</Typography>
                    <Typography color="text.secondary" className="font-300">
                        تنظیمات اطلاعات تماس و راه‌های ارتباطی را انجام دهید.
                    </Typography>
                </div>

                <div className="mt-32 w-full space-y-24">
                    <div className="flex items-center justify-between">
                        <Typography className="text-lg">اطلاعات تماس</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addContact}
                            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                        >
                            افزودن روش تماس
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <ContactItem
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
                                هیچ اطلاعات تماسی وجود ندارد. برای شروع روی دکمه "افزودن روش تماس" کلیک کنید.
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
                            const data = configData?.contact || [];
                            reset({ contact: Array.isArray(data) ? data : [] });
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

function ContactItem({ control, index, remove, errors }) {
    const [newContent, setNewContent] = useState('');

    const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({
        control,
        name: `contact.${index}.content`
    });

    const addContent = () => {
        if (newContent.trim()) {
            appendContent(newContent.trim());
            setNewContent('');
        }
    };

    const getIconSuggestions = () => [
        { value: 'phone', label: 'تلفن', icon: <HiOutlinePhone /> },
        { value: 'email', label: 'ایمیل', icon: <HiOutlineMail /> },
        { value: 'location', label: 'آدرس', icon: <HiOutlineLocationMarker /> },
        { value: 'heroicons-outline:phone', label: 'Heroicon Phone', icon: null },
        { value: 'heroicons-outline:mail', label: 'Heroicon Mail', icon: null },
        { value: 'heroicons-outline:location-marker', label: 'Heroicon Location', icon: null },
    ];

    return (
        <div className="border rounded-lg p-24 space-y-24">
            <div className="flex items-center justify-between">
                <Typography className="text-base font-medium">روش تماس {index + 1}</Typography>
                <IconButton color="error" onClick={() => remove(index)} size="small">
                    <MdDelete />
                </IconButton>
            </div>

            <div className="space-y-24">
                <div className="grid gap-20 sm:grid-cols-2">
                    <Controller
                        control={control}
                        name={`contact.${index}.title`}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="عنوان"
                                placeholder="عنوان روش تماس (مثل: تلفن، ایمیل، آدرس)"
                                error={!!errors?.contact?.[index]?.title}
                                helperText={errors?.contact?.[index]?.title?.message}
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
                        name={`contact.${index}.icon`}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="آیکون"
                                placeholder="نام آیکون (مثل: phone، email، location)"
                                error={!!errors?.contact?.[index]?.icon}
                                helperText={errors?.contact?.[index]?.icon?.message || 'مثال: heroicons-outline:phone'}
                                variant="outlined"
                                required
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FuseSvgIcon size={20}>heroicons-outline:star</FuseSvgIcon>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    />
                </div>

                {/* Icon Suggestions */}
                <div className="space-y-8">
                    <Typography variant="caption" color="text.secondary">
                        پیشنهادات آیکون:
                    </Typography>
                    <div className="flex gap-8 flex-wrap">
                        {getIconSuggestions().map((suggestion) => (
                            <Button
                                key={suggestion.value}
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    const currentValue = control._getWatch(`contact.${index}.icon`);
                                    control._setValue(`contact.${index}.icon`, suggestion.value, { shouldDirty: true });
                                }}
                                startIcon={suggestion.icon}
                            >
                                {suggestion.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-16">
                    <Typography className="text-base font-medium">محتوا</Typography>
                    <div className="flex gap-8 flex-wrap">
                        {contentFields.map((contentField, contentIndex) => (
                            <Controller
                                key={contentField.id}
                                control={control}
                                name={`contact.${index}.content.${contentIndex}`}
                                render={({ field }) => (
                                    <Chip
                                        label={field.value}
                                        onDelete={() => removeContent(contentIndex)}
                                        variant="outlined"
                                        color="primary"
                                    />
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex gap-8">
                        <TextField
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="محتوای جدید اضافه کنید (شماره تلفن، ایمیل، آدرس و ...)"
                            variant="outlined"
                            size="small"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addContent();
                                }
                            }}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BsTextLeft size={16} />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={addContent}
                            disabled={!newContent.trim()}
                            startIcon={<MdAdd />}
                        >
                            افزودن
                        </Button>
                    </div>
                    {errors?.contact?.[index]?.content && (
                        <Typography color="error" variant="caption">
                            {errors.contact[index].content.message}
                        </Typography>
                    )}
                </div>

                {/* Example Content */}
                <div className="p-16 bg-gray-50 rounded-lg">
                    <Typography variant="caption" color="text.secondary" className="block mb-8">
                        مثال‌هایی از محتوا:
                    </Typography>
                    <div className="space-y-4 text-xs text-gray-600">
                        <div>• تلفن: 021-12345678، 0912-3456789</div>
                        <div>• ایمیل: info@example.com، support@example.com</div>
                        <div>• آدرس: تهران، خیابان ولیعصر، پلاک 123</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPageTab;