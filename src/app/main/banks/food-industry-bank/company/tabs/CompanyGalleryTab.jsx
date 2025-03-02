import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Button, Typography, IconButton, FormHelperText } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import axios from 'axios';
import { Document, Page } from 'react-pdf'; // For PDF preview
import { getServerFile } from '@/utils/string-utils'; // Your helper function
import clsx from 'clsx';

// Helper: Upload file to temporary endpoint
async function uploadTempFile(file, fileServiceType) {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('fileServiceType', fileServiceType);
  try {
    const response = await axios.post('/file/temp', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Expected response.data contains: { tempId, filePath, fileExtension, fileName, fileServiceType, contentType }
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

// Inline metadata editor component
function EditMetadataForm({ file, onSave, onCancel }) {
  const [meta, setMeta] = useState(file.metadata || { title: '', description: '' });

  return (
    <div className="border rounded p-4 my-4 bg-gray-50">
      <Typography variant="subtitle1" className="font-bold mb-2">
        ویرایش اطلاعات فایل
      </Typography>
      <div className="mb-2">
        <label className="block mb-1">عنوان</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={meta.title}
          onChange={(e) => setMeta({ ...meta, title: e.target.value })}
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">توضیحات</label>
        <textarea
          className="border p-2 w-full rounded"
          value={meta.description}
          onChange={(e) => setMeta({ ...meta, description: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="contained" onClick={() => onSave(meta)}>
          ذخیره
        </Button>
        <Button variant="text" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
}

// Generic file section component
function FileSection({ title, fieldName, fileServiceType }) {
  const { watch, setValue, getValues } = useFormContext();
  const files = watch(fieldName) || [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [editIndex, setEditIndex] = useState(-1);

  // Build slides array for lightbox preview
  const slides = files.map((file) => {
    const isImage = file.contentType && file.contentType.startsWith('image/');
    const isVideo = file.contentType && file.contentType.startsWith('video/');
    const isPdf = file.contentType === 'application/pdf';
    return {
      src:
        file.uploadPending || !file.filePath
          ? file.previewUrl
          : getServerFile(file.filePath, '/assets/images/placeholders/image_placeholder.png'),
      isPdf,
      metadata: file.metadata,
    };
  });

  // Fully implemented handleAddFile using getValues to update latest array
  const handleAddFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    // Create a temporary file object with uploadPending flag
    const newItem = {
      tempId: null,
      filePath: null,
      contentType: file.type,
      uploadPending: true,
      previewUrl,
      metadata: {},
    };
    // Append new item to current files array using setValue's functional update
    setValue(fieldName, (prevFiles = []) => [...prevFiles, newItem]);

    try {
      const uploadResult = await uploadTempFile(file, fileServiceType);
      // Build updated item from the response
      const updatedItem = {
        ...newItem,
        tempId: uploadResult.id, // assuming id from response
        filePath: uploadResult.filePath,
        contentType: uploadResult.contentType,
        uploadPending: false,
      };
      // Get the current value and update the last item
      const currentFiles = getValues(fieldName);
      currentFiles[currentFiles.length - 1] = updatedItem;
      setValue(fieldName, currentFiles);
    } catch (error) {
      // Mark the file as having an upload error
      const updatedItem = {
        ...newItem,
        uploadPending: false,
        uploadError: true,
      };
      const currentFiles = getValues(fieldName);
      currentFiles[currentFiles.length - 1] = updatedItem;
      setValue(fieldName, currentFiles);
    }
  };

  // Save metadata changes
  const handleSaveMetadata = (index, newMetadata) => {
    const currentFiles = getValues(fieldName);
    currentFiles[index] = { ...currentFiles[index], metadata: newMetadata };
    setValue(fieldName, currentFiles);
    setEditIndex(-1);
  };

  return (
    <div className="mb-8">
      <Typography variant="h6" className="font-bold mb-4">
        {title}
      </Typography>
      <div className="flex items-center mb-4">
        <Button variant="outlined" component="label">
          آپلود فایل جدید
          <input
            type="file"
            hidden
            accept="image/*,video/*,application/pdf"
            onChange={handleAddFile}
          />
        </Button>
      </div>
      {files.length === 0 && (
        <FormHelperText>هیچ فایلی آپلود نشده است</FormHelperText>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {files.map((file, index) => {
          const isImage = file.contentType && file.contentType.startsWith('image/');
          const isVideo = file.contentType && file.contentType.startsWith('video/');
          const isPdf = file.contentType === 'application/pdf';
          const previewUrl =
            file.uploadPending || !file.filePath
              ? file.previewUrl
              : getServerFile(file.filePath, '/assets/images/placeholders/image_placeholder.png');
          return (
            <div key={index} className="relative border rounded overflow-hidden">
              {isPdf ? (
                <div className="p-2">
                  <Document file={file.filePath} error={<Typography color="error">خطا در نمایش PDF</Typography>}>
                    <Page pageNumber={1} width={150} />
                  </Document>
                </div>
              ) : (
                <img src={previewUrl} alt="gallery file" className="w-full h-40 object-cover" />
              )}
              {file.uploadPending && (
                <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
                  <Typography variant="caption" className="text-white">
                    در حال آپلود...
                  </Typography>
                </div>
              )}
              {file.uploadError && (
                <div className="absolute inset-0 bg-red-700 bg-opacity-50 flex items-center justify-center">
                  <Typography variant="caption" className="text-white">
                    خطا در آپلود
                  </Typography>
                </div>
              )}
              <IconButton
                className="absolute top-1 right-1 bg-white bg-opacity-80 hover:bg-opacity-100"
                onClick={() => setEditIndex(index)}
              >
                <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
              </IconButton>
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              />
            </div>
          );
        })}
      </div>
      <Button
        variant="text"
        onClick={() => setEditIndex(0)}
        className="mb-4"
      >
        ویرایش فایل‌های آپلود شده
      </Button>
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        render={{
          toolbar: ({ index }) => (
            <IconButton
              onClick={() => {
                setLightboxIndex(-1);
                setEditIndex(index);
              }}
            >
              <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
            </IconButton>
          )
        }}
      />
      {editIndex >= 0 && (
        <EditMetadataForm
          file={files[editIndex]}
          onSave={(meta) => handleSaveMetadata(editIndex, meta)}
          onCancel={() => setEditIndex(-1)}
        />
      )}
    </div>
  );
}

// Main CompanyGalleryTab: divides gallery into sections
function CompanyGalleryTab() {
  return (
    <div className="space-y-8">
      <FileSection title="لوگو شرکت" fieldName="companyLogoFiles" fileServiceType="COMPANY_LOGO" />
      <FileSection title="تصویر پس زمینه" fieldName="companyBackgroundImages" fileServiceType="COMPANY_BACKGROUND_IMAGE" />
      <FileSection title="گواهی‌ها" fieldName="companyCertificates" fileServiceType="COMPANY_CERTIFICATE" />
      <FileSection title="اسناد" fieldName="companyDocuments" fileServiceType="COMPANY_DOCUMENT" />
      <FileSection title="گالری محصولات" fieldName="companyGalleryProduct" fileServiceType="COMPANY_GALLERY_PRODUCT" />
      <FileSection title="گالری مخاطبین" fieldName="companyGalleryContact" fileServiceType="COMPANY_GALLERY_CONTACT" />
      <FileSection title="گالری کاتالوگ" fieldName="companyGalleryCatalog" fileServiceType="COMPANY_GALLERY_CATALOG" />
      <FileSection title="گالری اسلایدر" fieldName="companyGallerySlider" fileServiceType="COMPANY_GALLERY_SLIDER" />
      {/* Add additional sections as needed */}
    </div>
  );
}

export default CompanyGalleryTab;
