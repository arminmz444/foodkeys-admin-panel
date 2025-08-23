// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { zodResolver } from '@hookform/resolvers/zod';
// import _ from '@lodash';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import { useEffect } from 'react';
// import { Controller, useForm, useFieldArray } from 'react-hook-form';
// import { BsTextLeft } from 'react-icons/bs';
// import { LuHeading1 } from 'react-icons/lu';
// import { MdDelete } from 'react-icons/md';
// import { HiOutlineHashtag } from 'react-icons/hi';
// import { z } from 'zod';
// import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// import FuseLoading from '@fuse/core/FuseLoading';
//
// const schema = z.object({
//     faq: z
//         .array(
//             z.object({
//                 title: z.string().min(1, 'فیلد عنوان الزامی است'),
//                 content: z.string().min(1, 'فیلد محتوا الزامی است'),
//                 order: z.number().min(0, 'فیلد ترتیب الزامی است'),
//             })
//         )
//         .min(1, 'حداقل یک سوال متداول الزامی است'),
// });
//
// function FAQPageTab() {
//     const { data: configData, isLoading: configLoading, error: configError } = useGetConfigQuery('FAQ_PAGE_CONFIG');
//     const { data: schemas, isLoading: schemasLoading } = useGetSchemasQuery();
//     const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
//
//     const { control, handleSubmit, formState, reset, watch } = useForm({
//         defaultValues: {
//             faq: [],
//         },
//         mode: 'all',
//         resolver: zodResolver(schema),
//     });
//
//     // Always watch with a fallback so .map never runs on undefined
//     const watchedFAQs = watch('faq', []);
//
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'faq',
//     });
//
//     const { isValid, dirtyFields, errors } = formState;
//
//     useEffect(() => {
//         if (configData) {
//             // Normalize incoming config so faq is ALWAYS an array
//             const normalizedFaq = Array.isArray(configData?.faq)
//                 ? configData.faq
//                 : Array.isArray(configData)
//                     ? configData
//                     : [];
//             reset({ faq: normalizedFaq });
//         }
//     }, [configData, reset]);
//
//     const onSubmit = async (formData) => {
//         try {
//             const faqSchema = schemas?.find((s) => s.name === 'FAQ_PAGE_CONFIG_SCHEMA');
//             if (!faqSchema) {
//                 console.error('FAQ page schema not found');
//                 return;
//             }
//
//             await updateConfig({
//                 section: 'FAQ_PAGE_CONFIG',
//                 configData: {
//                     schemaId: faqSchema.id,
//                     configData: formData,
//                 },
//             }).unwrap();
//         } catch (error) {
//             console.error('Error updating FAQ page config:', error);
//         }
//     };
//
//     const addFAQ = () => {
//         const list = Array.isArray(watchedFAQs) ? watchedFAQs : [];
//         const maxOrder = Math.max(0, ...list.map((faq) => Number(faq?.order) || 0));
//         append({
//             title: '',
//             content: '',
//             order: maxOrder + 1,
//         });
//     };
//
//     if (configLoading || schemasLoading) {
//         return <FuseLoading />;
//     }
//
//     if (configError) {
//         return <Typography color="error">خطا در بارگذاری تنظیمات صفحه سوالات متداول</Typography>;
//     }
//
//     return (
//         <div className="w-full max-w-3xl">
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="w-full">
//                     <Typography className="text-xl">تنظیمات صفحه سوالات متداول</Typography>
//                     <Typography color="text.secondary" className="font-300">
//                         تنظیمات سوالات متداول و پاسخ‌های آن‌ها را انجام دهید.
//                     </Typography>
//                 </div>
//
//                 <div className="mt-32 w-full space-y-24">
//                     <div className="flex items-center justify-between">
//                         <Typography className="text-lg">سوالات متداول</Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={addFAQ}
//                             startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                         >
//                             افزودن سوال
//                         </Button>
//                     </div>
//
//                     {fields.map((field, index) => (
//                         <div key={field.id} className="border rounded-lg p-24 space-y-24">
//                             <div className="flex items-center justify-between">
//                                 <Typography className="text-base font-medium">سوال {index + 1}</Typography>
//                                 <IconButton color="error" onClick={() => remove(index)} size="small">
//                                     <MdDelete />
//                                 </IconButton>
//                             </div>
//
//                             <div className="grid gap-24 sm:grid-cols-2">
//                                 <Controller
//                                     control={control}
//                                     name={`faq.${index}.title`}
//                                     render={({ field }) => (
//                                         <TextField
//                                             {...field}
//                                             label="عنوان سوال"
//                                             placeholder="سوال خود را وارد کنید"
//                                             error={!!errors?.faq?.[index]?.title}
//                                             helperText={errors?.faq?.[index]?.title?.message}
//                                             variant="outlined"
//                                             required
//                                             fullWidth
//                                             InputProps={{
//                                                 startAdornment: (
//                                                     <InputAdornment position="start">
//                                                         <LuHeading1 size={20} />
//                                                     </InputAdornment>
//                                                 ),
//                                             }}
//                                         />
//                                     )}
//                                 />
//
//                                 <Controller
//                                     control={control}
//                                     name={`faq.${index}.order`}
//                                     render={({ field }) => (
//                                         <TextField
//                                             {...field}
//                                             type="number"
//                                             label="ترتیب نمایش"
//                                             placeholder="ترتیب نمایش سوال"
//                                             error={!!errors?.faq?.[index]?.order}
//                                             helperText={errors?.faq?.[index]?.order?.message}
//                                             variant="outlined"
//                                             required
//                                             fullWidth
//                                             onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
//                                             InputProps={{
//                                                 startAdornment: (
//                                                     <InputAdornment position="start">
//                                                         <HiOutlineHashtag size={20} />
//                                                     </InputAdornment>
//                                                 ),
//                                             }}
//                                         />
//                                     )}
//                                 />
//
//                                 <div className="sm:col-span-2">
//                                     <Controller
//                                         control={control}
//                                         name={`faq.${index}.content`}
//                                         render={({ field }) => (
//                                             <TextField
//                                                 {...field}
//                                                 label="پاسخ"
//                                                 placeholder="پاسخ سوال را وارد کنید"
//                                                 error={!!errors?.faq?.[index]?.content}
//                                                 helperText={errors?.faq?.[index]?.content?.message}
//                                                 variant="outlined"
//                                                 required
//                                                 multiline
//                                                 minRows={4}
//                                                 fullWidth
//                                                 InputProps={{
//                                                     className: 'max-h-min h-min items-start',
//                                                     startAdornment: (
//                                                         <InputAdornment position="start" className="mt-16">
//                                                             <BsTextLeft size={20} />
//                                                         </InputAdornment>
//                                                     ),
//                                                 }}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//
//                     {fields.length === 0 && (
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
//                             <Typography color="text.secondary">
//                                 هیچ سوال متداولی وجود ندارد. برای شروع روی دکمه "افزودن سوال" کلیک کنید.
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
//                         onClick={() =>
//                             reset({
//                                 faq: Array.isArray(configData?.faq)
//                                     ? configData.faq
//                                     : Array.isArray(configData)
//                                         ? configData
//                                         : [],
//                             })
//                         }
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
// export default FAQPageTab;

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { BsTextLeft } from 'react-icons/bs';
import { LuHeading1 } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { HiOutlineHashtag } from 'react-icons/hi';
import { z } from 'zod';
import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
import FuseLoading from '@fuse/core/FuseLoading';

const schema = z.object({
    faq: z
        .array(
            z.object({
                title: z.string().min(1, 'فیلد عنوان الزامی است'),
                content: z.string().min(1, 'فیلد محتوا الزامی است'),
                order: z.number().min(0, 'فیلد ترتیب الزامی است'),
            })
        )
        .min(1, 'حداقل یک سوال متداول الزامی است'),
});

function FAQPageTab() {
    const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('FAQ_PAGE_CONFIG');
    const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
    const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();

    const { control, handleSubmit, formState, reset, watch } = useForm({
        defaultValues: {
            faq: [],
        },
        mode: 'all',
        resolver: zodResolver(schema),
    });

    // Always watch with a fallback so .map never runs on undefined
    const watchedFAQs = watch('faq', []);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'faq',
    });

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        // Extract the actual config data from the API response structure
        const configData = configResponse?.data;

        if (configData) {
            // Check if faq exists in the data
            const faqData = configData.faq || configData;

            // Normalize incoming config so faq is ALWAYS an array
            const normalizedFaq = Array.isArray(faqData)
                ? faqData
                : [];

            reset({ faq: normalizedFaq });
        }
    }, [configResponse, reset]);

    const onSubmit = async (formData) => {
        try {
            // Extract schemas array from response
            const schemas = schemasResponse?.data || [];

            // Find the correct schema
            const faqSchema = schemas.find((s) => s.name === 'FAQ_PAGE_CONFIG_SCHEMA');

            if (!faqSchema) {
                console.error('FAQ page schema not found');
                return;
            }

            await updateConfig({
                section: 'FAQ_PAGE_CONFIG',
                configData: {
                    schemaId: faqSchema.id,
                    configData: formData,
                },
            }).unwrap();
        } catch (error) {
            console.error('Error updating FAQ page config:', error);
        }
    };

    const addFAQ = () => {
        const list = Array.isArray(watchedFAQs) ? watchedFAQs : [];
        const maxOrder = Math.max(0, ...list.map((faq) => Number(faq?.order) || 0));
        append({
            title: '',
            content: '',
            order: maxOrder + 1,
        });
    };

    if (configLoading || schemasLoading) {
        return <FuseLoading />;
    }

    if (configError) {
        return <Typography color="error">خطا در بارگذاری تنظیمات صفحه سوالات متداول</Typography>;
    }

    const configData = configResponse?.data;

    return (
        <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <Typography className="text-xl">تنظیمات صفحه سوالات متداول</Typography>
                    <Typography color="text.secondary" className="font-300">
                        تنظیمات سوالات متداول و پاسخ‌های آن‌ها را انجام دهید.
                    </Typography>
                </div>

                <div className="mt-32 w-full space-y-24">
                    <div className="flex items-center justify-between">
                        <Typography className="text-lg">سوالات متداول</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addFAQ}
                            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                        >
                            افزودن سوال
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-24 space-y-24">
                            <div className="flex items-center justify-between">
                                <Typography className="text-base font-medium">سوال {index + 1}</Typography>
                                <IconButton color="error" onClick={() => remove(index)} size="small">
                                    <MdDelete />
                                </IconButton>
                            </div>

                            <div className="grid gap-24 sm:grid-cols-2">
                                <Controller
                                    control={control}
                                    name={`faq.${index}.title`}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="عنوان سوال"
                                            placeholder="سوال خود را وارد کنید"
                                            error={!!errors?.faq?.[index]?.title}
                                            helperText={errors?.faq?.[index]?.title?.message}
                                            variant="outlined"
                                            required
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LuHeading1 size={20} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name={`faq.${index}.order`}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="ترتیب نمایش"
                                            placeholder="ترتیب نمایش سوال"
                                            error={!!errors?.faq?.[index]?.order}
                                            helperText={errors?.faq?.[index]?.order?.message}
                                            variant="outlined"
                                            required
                                            fullWidth
                                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <HiOutlineHashtag size={20} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                <div className="sm:col-span-2">
                                    <Controller
                                        control={control}
                                        name={`faq.${index}.content`}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="پاسخ"
                                                placeholder="پاسخ سوال را وارد کنید"
                                                error={!!errors?.faq?.[index]?.content}
                                                helperText={errors?.faq?.[index]?.content?.message}
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
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
                            <Typography color="text.secondary">
                                هیچ سوال متداولی وجود ندارد. برای شروع روی دکمه "افزودن سوال" کلیک کنید.
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
                            const data = configData?.faq || [];
                            reset({ faq: Array.isArray(data) ? data : [] });
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

export default FAQPageTab;