import {lighten, styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {getServerFile} from 'src/utils/string-utils';

// Import Flmngr from the React package
import Flmngr from "@flmngr/flmngr-react";

// Configure Flmngr server URLs
const FLMNGR_SERVER = {
    urlFileManager:
        import.meta.env.VITE_FLMNGR_URL_FILE_MANAGER || "http://127.0.0.1:3500/flmngr",
    urlFiles:
        import.meta.env.VITE_FLMNGR_URL_FILES || "http://127.0.0.1:3500/files/"
};

const Root = styled('div')(({theme}) => ({
    '& .companyLogoContainer': {
        width: '100%',
        marginBottom: theme.spacing(4)
    },
    '& .logoUploadArea': {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        transition: theme.transitions.create(['box-shadow'], {
            duration: theme.transitions.duration.short
        }),
        '&:hover': {
            boxShadow: theme.shadows[3]
        }
    },
    '& .logoPreviewContainer': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 250,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: lighten(theme.palette.background.default, theme.palette.mode === 'light' ? 0.4 : 0.02),
        border: `1px dashed ${theme.palette.divider}`,
        marginBottom: theme.spacing(2)
    },
    '& .logoPreview': {
        maxWidth: '100%',
        maxHeight: 250,
        objectFit: 'contain',
        borderRadius: theme.shape.borderRadius
    },
    '& .logoButtons': {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2)
    },
    '& .uploadInstructions': {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(1)
    }
}));

function CompanyMainImagesTab(props) {
    const methods = useFormContext();
    const {control, setValue, watch} = methods;
    const [previewLogo, setPreviewLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Watch logo field and company ID
    const logo = watch('logo');
    const companyId = watch('id');

    // Initialize logo preview if exists
    useEffect(() => {
        if (logo) {
            // Make sure to use getServerFile to get the proper URL
            setPreviewLogo(getServerFile(logo));
        } else {
            setPreviewLogo(null);
        }
    }, [logo]);

    // Function to check if the company logo already exists
    const fetchExistingLogo = async () => {
        if (!companyId) return null;

        try {
            // You might need to adjust this endpoint to match your API
            const response = await axios.get(`/company/${companyId}/logo`);
            if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
                return response.data.data.filePath;
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    // Handle Flmngr file selection
    const handleSelectLogo = async (files) => {
        if (files && files.length > 0 && companyId) {
            setIsLoading(true);
            try {
                const file = files[0];

                // Use preview format if available, otherwise use the original
                let fileUrl;
                if (file.formats && file.formats.length > 0) {
                    const filePreview = file.formats.find(f => f.format === "preview");
                    fileUrl = filePreview ? filePreview.url : file.url;
                } else {
                    fileUrl = file.url;
                }

                // Show a temporary preview while uploading
                setPreviewLogo(fileUrl);

                // Send the selected file information to your API
                const response = await axios.post(`/company/${companyId}/logo/flmngr`, {
                    logoUrl: fileUrl,
                    filename: file.name
                });

                // Handle the API response
                if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
                    // Set the form value to the filePath received from the API
                    setValue('logo', response.data.data.filePath);

                    // Update preview with the server file path
                    setPreviewLogo(getServerFile(response.data.data.filePath));
                }

                // Upload to Flmngr server if needed (for external files)
                if (file.isExternal) {
                    Flmngr.upload({
                        filesOrLinks: [file],
                        dirUploads: "/company_logos",
                        onFinish: () => {
                            // Uploads completed
                        },
                    });
                }
            } catch (error) {
                // If there's an error, clear the preview
                if (!logo) {
                    setPreviewLogo(null);
                } else {
                    setPreviewLogo(getServerFile(logo));
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Remove logo
    const handleRemoveLogo = async () => {
        if (!companyId) {
            setValue('logo', null);
            setPreviewLogo(null);
            return;
        }

        setIsLoading(true);
        try {
            // Call your API to delete the logo
            await axios.delete(`/company/${companyId}/logo`);

            // Update form state
            setValue('logo', null);
            setPreviewLogo(null);
        } catch (error) {
            // Handle error silently
        } finally {
            setIsLoading(false);
        }
    };

    // Open Flmngr file manager
    const openFlmngr = () => {
        if (isLoading) return;

        Flmngr.open({
            // Server API configuration
            apiKey: "FLMNFLMN",
            urlFileManager: FLMNGR_SERVER.urlFileManager,
            urlFiles: FLMNGR_SERVER.urlFiles,

            // UI configuration
            isShowStockImages: false,
            defaultConfig: {
                dir: "/company_logos"
            },

            // Image processing
            imageFormats: [
                {
                    id: "preview",
                    title: "Preview",
                    suffix: "-preview",
                    maxWidth: 250,
                    maxHeight: 250,
                },
            ],
            createImageFormats: ["preview"],

            // File constraints
            acceptExtensions: ["png", "jpeg", "jpg", "webp"],
            isMultiple: false,

            // Callback
            onFinish: handleSelectLogo,
        });
    };

    // Load existing logo on mount if needed
    useEffect(() => {
        if (companyId && !logo) {
            setIsLoading(true);
            fetchExistingLogo().then(existingLogo => {
                if (existingLogo) {
                    setValue('logo', existingLogo);
                    setPreviewLogo(getServerFile(existingLogo));
                }
                setIsLoading(false);
            });
        }
    }, [companyId, setValue, logo]);

    return (
        <Root>
            <Typography variant="h6" className="mb-16">
                لوگو و عکس پس‌زمینه شرکت
            </Typography>

            <div className="companyLogoContainer">
                <Paper className="logoUploadArea">
                    <Typography variant="subtitle1" className="mb-8">
                        لوگوی شرکت
                    </Typography>

                    <Controller
                        name="logo"
                        control={control}
                        render={({field}) => (
                            <>
                                <div
                                    className={`logoPreviewContainer ${isLoading ? 'opacity-50' : ''}`}
                                    onClick={!isLoading ? openFlmngr : undefined}
                                    onKeyDown={(e) => {
                                        if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                                            openFlmngr();
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="آپلود لوگو"
                                >
                                    {isLoading && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
                                            <FuseSvgIcon
                                                size={32}
                                                color="primary"
                                                className="animate-spin"
                                            >
                                                heroicons-outline:refresh
                                            </FuseSvgIcon>
                                        </div>
                                    )}

                                    {previewLogo ? (
                                        <img
                                            src={previewLogo}
                                            alt="لوگوی شرکت"
                                            className="logoPreview"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <FuseSvgIcon
                                                size={64}
                                                color="action"
                                            >
                                                heroicons-outline:photograph
                                            </FuseSvgIcon>
                                            <Typography variant="body2" className="uploadInstructions mt-16">
                                                برای آپلود لوگوی شرکت کلیک کنید
                                            </Typography>
                                            <Typography variant="caption" className="mt-8" color="textSecondary">
                                                فرمت‌های پشتیبانی شده: PNG، JPG، JPEG، WEBP
                                            </Typography>
                                        </div>
                                    )}
                                </div>

                                <div className="logoButtons">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={openFlmngr}
                                        startIcon={
                                            <FuseSvgIcon>{isLoading ? 'heroicons-outline:refresh' : 'heroicons-outline:upload'}</FuseSvgIcon>}
                                        disabled={isLoading}
                                        className={isLoading ? 'animate-pulse' : ''}
                                    >
                                        {previewLogo ? 'تغییر لوگو' : 'آپلود لوگو'}
                                    </Button>

                                    {previewLogo && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleRemoveLogo}
                                            startIcon={<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>}
                                            disabled={isLoading}
                                        >
                                            حذف لوگو
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    />
                </Paper>
            </div>
        </Root>
    );
}

export default CompanyMainImagesTab;