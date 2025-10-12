// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { zodResolver } from '@hookform/resolvers/zod';
// import _ from '@lodash';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useEffect } from 'react';
// import { Controller, useForm, useFieldArray } from 'react-hook-form';
// import { BsTextLeft } from 'react-icons/bs';
// import { MdDelete } from 'react-icons/md';
// import { HiOutlineHashtag } from 'react-icons/hi';
// import { z } from 'zod';
// import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// import FuseLoading from '@fuse/core/FuseLoading';
//
// const schema = z.object({
//     guide: z.array(z.object({
//         order: z.number().min(0, 'فیلد ترتیب الزامی است'),
//         content: z.string().min(1, 'فیلد محتوا الزامی است')
//     })).min(1, 'حداقل یک بخش راهنما الزامی است'),
//     aboutUs: z.array(z.object({
//         order: z.number().min(0, 'فیلد ترتیب الزامی است'),
//         content: z.string().min(1, 'فیلد محتوا الزامی است')
//     })).min(1, 'حداقل یک بخش درباره ما الزامی است'),
//     ranking: z.object({
//         mainContent: z.string().min(1, 'فیلد محتوای اصلی الزامی است'),
//         rules: z.array(z.object({
//             order: z.number().min(0, 'فیلد ترتیب الزامی است'),
//             content: z.string().min(1, 'فیلد محتوا الزامی است')
//         })).min(1, 'حداقل یک قانون الزامی است')
//     })
// });
//
// function GuidePageTab() {
//     const { data: configData, isLoading: configLoading, error: configError } = useGetConfigQuery('guidePageConfig');
//     const { data: schemas, isLoading: schemasLoading } = useGetSchemasQuery();
//     const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
//
//     const { control, handleSubmit, formState, reset, watch } = useForm({
//         defaultValues: {
//             guide: [],
//             aboutUs: [],
//             ranking: {
//                 mainContent: '',
//                 rules: []
//             }
//         },
//         mode: 'all',
//         resolver: zodResolver(schema)
//     });
//
//     const { fields: guideFields, append: appendGuide, remove: removeGuide } = useFieldArray({
//         control,
//         name: 'guide'
//     });
//
//     const { fields: aboutUsFields, append: appendAboutUs, remove: removeAboutUs } = useFieldArray({
//         control,
//         name: 'aboutUs'
//     });
//
//     const { fields: rulesFields, append: appendRule, remove: removeRule } = useFieldArray({
//         control,
//         name: 'ranking.rules'
//     });
//
//     const { isValid, dirtyFields, errors } = formState;
//     const watchedData = watch();
//
//     useEffect(() => {
//         if (configData) {
//             reset(configData);
//         }
//     }, [configData, reset]);
//
//     const onSubmit = async (formData) => {
//         try {
//             const guideSchema = schemas?.find(s => s.name === 'guidePageConfig');
//             if (!guideSchema) {
//                 console.error('Guide page schema not found');
//                 return;
//             }
//
//             await updateConfig({
//                 section: 'guidePageConfig',
//                 configData: {
//                     schemaId: guideSchema.id,
//                     configData: formData
//                 }
//             }).unwrap();
//         } catch (error) {
//             console.error('Error updating guide page config:', error);
//         }
//     };
//
//     const addGuideItem = () => {
//         const maxOrder = Math.max(0, ...watchedData.guide.map(item => item.order || 0));
//         appendGuide({
//             order: maxOrder + 1,
//             content: ''
//         });
//     };
//
//     const addAboutUsItem = () => {
//         const maxOrder = Math.max(0, ...watchedData.aboutUs.map(item => item.order || 0));
//         appendAboutUs({
//             order: maxOrder + 1,
//             content: ''
//         });
//     };
//
//     const addRuleItem = () => {
//         const maxOrder = Math.max(0, ...watchedData.ranking.rules.map(rule => rule.order || 0));
//         appendRule({
//             order: maxOrder + 1,
//             content: ''
//         });
//     };
//
//     if (configLoading || schemasLoading) {
//         return <FuseLoading />;
//     }
//
//     if (configError) {
//         return <Typography color="error">خطا در بارگذاری تنظیمات صفحه راهنما</Typography>;
//     }
//
//     return (
//         <div className="w-full max-w-4xl">
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="w-full">
//                     <Typography className="text-xl">تنظیمات صفحه راهنما</Typography>
//                     <Typography color="text.secondary" className="font-300">
//                         تنظیمات محتوای راهنما، درباره ما و قوانین رتبه‌بندی را انجام دهید.
//                     </Typography>
//                 </div>
//
//                 <div className="mt-32 w-full space-y-32">
//                     {/* Guide Section */}
//                     <Accordion defaultExpanded>
//                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                             <Typography className="text-lg font-medium">بخش راهنما</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div className="space-y-24">
//                                 <div className="flex items-center justify-between">
//                                     <Typography className="text-base">محتوای راهنما</Typography>
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={addGuideItem}
//                                         startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                                         size="small"
//                                     >
//                                         افزودن بخش
//                                     </Button>
//                                 </div>
//
//                                 {guideFields.map((field, index) => (
//                                     <GuideContentItem
//                                         key={field.id}
//                                         control={control}
//                                         index={index}
//                                         remove={removeGuide}
//                                         errors={errors?.guide?.[index]}
//                                         namePrefix="guide"
//                                         title={`بخش راهنما ${index + 1}`}
//                                     />
//                                 ))}
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
//
//                     {/* About Us Section */}
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                             <Typography className="text-lg font-medium">بخش درباره ما</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div className="space-y-24">
//                                 <div className="flex items-center justify-between">
//                                     <Typography className="text-base">محتوای درباره ما</Typography>
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={addAboutUsItem}
//                                         startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                                         size="small"
//                                     >
//                                         افزودن بخش
//                                     </Button>
//                                 </div>
//
//                                 {aboutUsFields.map((field, index) => (
//                                     <GuideContentItem
//                                         key={field.id}
//                                         control={control}
//                                         index={index}
//                                         remove={removeAboutUs}
//                                         errors={errors?.aboutUs?.[index]}
//                                         namePrefix="aboutUs"
//                                         title={`بخش درباره ما ${index + 1}`}
//                                     />
//                                 ))}
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
//
//                     {/* Ranking Section */}
//                     <Accordion>
//                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                             <Typography className="text-lg font-medium">بخش رتبه‌بندی</Typography>
//                         </AccordionSummary>
//                         <AccordionDetails>
//                             <div className="space-y-24">
//                                 <Controller
//                                     control={control}
//                                     name="ranking.mainContent"
//                                     render={({ field }) => (
//                                         <TextField
//                                             {...field}
//                                             label="محتوای اصلی رتبه‌بندی"
//                                             placeholder="توضیحات کلی در مورد نحوه رتبه‌بندی"
//                                             error={!!errors?.ranking?.mainContent}
//                                             helperText={errors?.ranking?.mainContent?.message}
//                                             variant="outlined"
//                                             required
//                                             multiline
//                                             minRows={4}
//                                             fullWidth
//                                             InputProps={{
//                                                 className: 'max-h-min h-min items-start',
//                                                 startAdornment: (
//                                                     <InputAdornment position="start" className="mt-16">
//                                                         <BsTextLeft size={20} />
//                                                     </InputAdornment>
//                                                 )
//                                             }}
//                                         />
//                                     )}
//                                 />
//
//                                 <div className="flex items-center justify-between">
//                                     <Typography className="text-base">قوانین رتبه‌بندی</Typography>
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={addRuleItem}
//                                         startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
//                                         size="small"
//                                     >
//                                         افزودن قانون
//                                     </Button>
//                                 </div>
//
//                                 {rulesFields.map((field, index) => (
//                                     <GuideContentItem
//                                         key={field.id}
//                                         control={control}
//                                         index={index}
//                                         remove={removeRule}
//                                         errors={errors?.ranking?.rules?.[index]}
//                                         namePrefix="ranking.rules"
//                                         title={`قانون ${index + 1}`}
//                                     />
//                                 ))}
//                             </div>
//                         </AccordionDetails>
//                     </Accordion>
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
// function GuideContentItem({ control, index, remove, errors, namePrefix, title }) {
//     return (
//         <div className="border rounded-lg p-20 space-y-20">
//             <div className="flex items-center justify-between">
//                 <Typography className="text-sm font-medium">{title}</Typography>
//                 <IconButton color="error" onClick={() => remove(index)} size="small">
//                     <MdDelete />
//                 </IconButton>
//             </div>
//
//             <div className="grid gap-20 sm:grid-cols-4">
//                 <Controller
//                     control={control}
//                     name={`${namePrefix}.${index}.order`}
//                     render={({ field }) => (
//                         <TextField
//                             {...field}
//                             type="number"
//                             label="ترتیب"
//                             placeholder="ترتیب نمایش"
//                             error={!!errors?.order}
//                             helperText={errors?.order?.message}
//                             variant="outlined"
//                             required
//                             size="small"
//                             onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <HiOutlineHashtag size={16} />
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     )}
//                 />
//
//                 <div className="sm:col-span-3">
//                     <Controller
//                         control={control}
//                         name={`${namePrefix}.${index}.content`}
//                         render={({ field }) => (
//                             <TextField
//                                 {...field}
//                                 label="محتوا"
//                                 placeholder="محتوای این بخش را وارد کنید"
//                                 error={!!errors?.content}
//                                 helperText={errors?.content?.message}
//                                 variant="outlined"
//                                 required
//                                 multiline
//                                 minRows={3}
//                                 size="small"
//                                 fullWidth
//                                 InputProps={{
//                                     className: 'max-h-min h-min items-start',
//                                     startAdornment: (
//                                         <InputAdornment position="start" className="mt-12">
//                                             <BsTextLeft size={16} />
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />
//                         )}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default GuidePageTab;

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { BsTextLeft } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { HiOutlineHashtag } from 'react-icons/hi';
import { z } from 'zod';
import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
import FuseLoading from '@fuse/core/FuseLoading';

const schema = z.object({
    guide: z.array(z.object({
        order: z.number().min(0, 'فیلد ترتیب الزامی است'),
        content: z.string().min(1, 'فیلد محتوا الزامی است')
    })).min(1, 'حداقل یک بخش راهنما الزامی است'),
    aboutUs: z.array(z.object({
        order: z.number().min(0, 'فیلد ترتیب الزامی است'),
        content: z.string().min(1, 'فیلد محتوا الزامی است')
    })).min(1, 'حداقل یک بخش درباره ما الزامی است'),
    ranking: z.object({
        mainContent: z.string().min(1, 'فیلد محتوای اصلی الزامی است'),
        rules: z.array(z.object({
            order: z.number().min(0, 'فیلد ترتیب الزامی است'),
            content: z.string().min(1, 'فیلد محتوا الزامی است')
        })).min(1, 'حداقل یک قانون الزامی است')
    })
});

function GuidePageTab() {
    const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('GUIDE_PAGE_CONFIG');
    const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
    const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();

    const { control, handleSubmit, formState, reset, watch } = useForm({
        defaultValues: {
            guide: [],
            aboutUs: [],
            ranking: {
                mainContent: '',
                rules: []
            }
        },
        mode: 'all',
        resolver: zodResolver(schema)
    });

    // Watch arrays with safe fallbacks so `.map` never runs on undefined
    const watchedGuide = watch('guide', []);
    const watchedAboutUs = watch('aboutUs', []);
    const watchedRules = watch('ranking.rules', []);

    const { fields: guideFields, append: appendGuide, remove: removeGuide } = useFieldArray({
        control,
        name: 'guide'
    });

    const { fields: aboutUsFields, append: appendAboutUs, remove: removeAboutUs } = useFieldArray({
        control,
        name: 'aboutUs'
    });

    const { fields: rulesFields, append: appendRule, remove: removeRule } = useFieldArray({
        control,
        name: 'ranking.rules'
    });

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        // Extract the actual config data from the API response structure
        const configData = configResponse?.data;

        if (configData) {
            // Ensure arrays/fields always exist after reset
            reset({
                guide: Array.isArray(configData.guide) ? configData.guide : [],
                aboutUs: Array.isArray(configData.aboutUs) ? configData.aboutUs : [],
                ranking: {
                    mainContent: configData?.ranking?.mainContent ?? '',
                    rules: Array.isArray(configData?.ranking?.rules) ? configData.ranking.rules : []
                }
            });
        }
    }, [configResponse, reset]);

    const onSubmit = async (formData) => {
        try {
            // Extract schemas array from response
            const schemas = schemasResponse?.data || [];

            // Find the correct schema
            const guideSchema = schemas.find((s) => s.name === 'GUIDE_CONFIG_SCHEMA');

            if (!guideSchema) {
                console.error('Guide page schema not found');
                return;
            }

            await updateConfig({
                section: 'GUIDE_PAGE_CONFIG',
                configData: {
                    schemaId: guideSchema.id,
                    configData: formData
                }
            }).unwrap();
        } catch (error) {
            console.error('Error updating guide page config:', error);
        }
    };

    const addGuideItem = () => {
        const maxOrder = Math.max(0, ...watchedGuide.map((item) => Number(item?.order) || 0));
        appendGuide({
            order: maxOrder + 1,
            content: ''
        });
    };

    const addAboutUsItem = () => {
        const maxOrder = Math.max(0, ...watchedAboutUs.map((item) => Number(item?.order) || 0));
        appendAboutUs({
            order: maxOrder + 1,
            content: ''
        });
    };

    const addRuleItem = () => {
        const maxOrder = Math.max(0, ...watchedRules.map((rule) => Number(rule?.order) || 0));
        appendRule({
            order: maxOrder + 1,
            content: ''
        });
    };

    if (configLoading || schemasLoading) {
        return <FuseLoading />;
    }

    if (configError) {
        return <Typography color="error">خطا در بارگذاری تنظیمات صفحه راهنما</Typography>;
    }

    const configData = configResponse?.data;

    return (
        <div className="w-full max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full">
                    <Typography className="text-xl">تنظیمات صفحه راهنما</Typography>
                    <Typography color="text.secondary" className="font-300">
                        تنظیمات محتوای راهنما، درباره ما و قوانین رتبه‌بندی را انجام دهید.
                    </Typography>
                </div>

                <div className="mt-32 w-full space-y-32">
                    {/* Guide Section */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-lg font-medium">بخش راهنما</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="space-y-24">
                                <div className="flex items-center justify-between">
                                    <Typography className="text-base">محتوای راهنما</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={addGuideItem}
                                        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                                        size="small"
                                    >
                                        افزودن بخش
                                    </Button>
                                </div>

                                {guideFields.map((field, index) => (
                                    <GuideContentItem
                                        key={field.id}
                                        control={control}
                                        index={index}
                                        remove={removeGuide}
                                        errors={errors?.guide?.[index]}
                                        namePrefix="guide"
                                        title={`بخش راهنما ${index + 1}`}
                                    />
                                ))}

                                {guideFields.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center">
                                        <Typography color="text.secondary" variant="body2">
                                            هیچ بخشی وجود ندارد. برای شروع روی دکمه "افزودن بخش" کلیک کنید.
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* About Us Section */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-lg font-medium">بخش درباره ما</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="space-y-24">
                                <div className="flex items-center justify-between">
                                    <Typography className="text-base">محتوای درباره ما</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={addAboutUsItem}
                                        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                                        size="small"
                                    >
                                        افزودن بخش
                                    </Button>
                                </div>

                                {aboutUsFields.map((field, index) => (
                                    <GuideContentItem
                                        key={field.id}
                                        control={control}
                                        index={index}
                                        remove={removeAboutUs}
                                        errors={errors?.aboutUs?.[index]}
                                        namePrefix="aboutUs"
                                        title={`بخش درباره ما ${index + 1}`}
                                    />
                                ))}

                                {aboutUsFields.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center">
                                        <Typography color="text.secondary" variant="body2">
                                            هیچ بخشی وجود ندارد. برای شروع روی دکمه "افزودن بخش" کلیک کنید.
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* Ranking Section */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className="text-lg font-medium">بخش رتبه‌بندی</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="space-y-24">
                                <Controller
                                    control={control}
                                    name="ranking.mainContent"
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="محتوای اصلی رتبه‌بندی"
                                            placeholder="توضیحات کلی در مورد نحوه رتبه‌بندی"
                                            error={!!errors?.ranking?.mainContent}
                                            helperText={errors?.ranking?.mainContent?.message}
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

                                <div className="flex items-center justify-between">
                                    <Typography className="text-base">قوانین رتبه‌بندی</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={addRuleItem}
                                        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                                        size="small"
                                    >
                                        افزودن قانون
                                    </Button>
                                </div>

                                {rulesFields.map((field, index) => (
                                    <GuideContentItem
                                        key={field.id}
                                        control={control}
                                        index={index}
                                        remove={removeRule}
                                        errors={errors?.ranking?.rules?.[index]}
                                        namePrefix="ranking.rules"
                                        title={`قانون ${index + 1}`}
                                    />
                                ))}

                                {rulesFields.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-20 text-center">
                                        <Typography color="text.secondary" variant="body2">
                                            هیچ قانونی وجود ندارد. برای شروع روی دکمه "افزودن قانون" کلیک کنید.
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>

                <Divider className="mb-40 mt-44 border-t" />
                <div className="flex items-center justify-end gap-x-10 w-1/2">
                    <Button
                        variant="outlined"
                        disabled={_.isEmpty(dirtyFields)}
                        onClick={() => {
                            const data = configData || {};
                            reset({
                                guide: Array.isArray(data.guide) ? data.guide : [],
                                aboutUs: Array.isArray(data.aboutUs) ? data.aboutUs : [],
                                ranking: {
                                    mainContent: data?.ranking?.mainContent ?? '',
                                    rules: Array.isArray(data?.ranking?.rules) ? data.ranking.rules : []
                                }
                            });
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

function GuideContentItem({ control, index, remove, errors, namePrefix, title }) {
    return (
        <div className="border rounded-lg p-20 space-y-20">
            <div className="flex items-center justify-between">
                <Typography className="text-sm font-medium">{title}</Typography>
                <IconButton color="error" onClick={() => remove(index)} size="small">
                    <MdDelete />
                </IconButton>
            </div>

            <div className="grid gap-20 sm:grid-cols-4">
                <Controller
                    control={control}
                    name={`${namePrefix}.${index}.order`}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            label="ترتیب"
                            placeholder="ترتیب نمایش"
                            error={!!errors?.order}
                            helperText={errors?.order?.message}
                            variant="outlined"
                            required
                            size="small"
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HiOutlineHashtag size={16} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />

                <div className="sm:col-span-3">
                    <Controller
                        control={control}
                        name={`${namePrefix}.${index}.content`}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="محتوا"
                                placeholder="محتوای این بخش را وارد کنید"
                                error={!!errors?.content}
                                helperText={errors?.content?.message}
                                variant="outlined"
                                required
                                multiline
                                minRows={3}
                                size="small"
                                fullWidth
                                InputProps={{
                                    className: 'max-h-min h-min items-start',
                                    startAdornment: (
                                        <InputAdornment position="start" className="mt-12">
                                            <BsTextLeft size={16} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default GuidePageTab;