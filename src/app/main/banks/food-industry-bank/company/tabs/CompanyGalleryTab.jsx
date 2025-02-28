// CompanyGalleryTab.tsx
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Document, Page } from "react-pdf"; // from "react-pdf"
import { Button, Typography, IconButton } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
// For building the final server file URL
import { getServerFile } from "@/utils/string-utils";

// Example subcomponent that handles a single file type “section”
function FileSection({ title, fieldName, fileServiceType }) {
  const { watch, setValue } = useFormContext();
  // Suppose your form data has an object like { gallerySections: { [fieldName]: [files...] } }
  // or you store each section in e.g. watch(fieldName).
  const files = watch(fieldName) || [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [editIndex, setEditIndex] = useState(-1);

  // Build slides for Lightbox
  const slides = files.map((f) => {
    const isImage = f.contentType?.startsWith("image/");
    const isVideo = f.contentType?.startsWith("video/");
    const isPdf = f.contentType === "application/pdf";
    // For Lightbox, we can pass { type: 'image', src: ...} or we can do a custom video handle
    return {
      src: getServerFile(f.filePath),
      type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "unknown",
      metadata: f.metadata,
    };
  });

  // We define a function to open the “edit form” for metadata
  function handleEdit(index) {
    setEditIndex(index);
  }

  // Save metadata changes back to the form
  function handleSaveMetadata(index, newMetadata) {
    const newFiles = [...files];
    newFiles[index] = {
      ...newFiles[index],
      metadata: newMetadata,
    };
    setValue(fieldName, newFiles);
    setEditIndex(-1);
  }

  // A quick function to add a new file
  async function handleAddFile() {
    // Show a small form or dialog for metadata + file upload
    // For brevity, we just demonstrate:
    // 1) pick file via input
    // 2) upload to /temp
    // 3) push to array
  }

  return (
    <div className="border-b pb-24 mb-24">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold mb-12">
          {title}
        </Typography>
        <Button variant="outlined" onClick={handleAddFile}>
          آپلود فایل جدید
        </Button>
      </div>

      {/* PhotoAlbum or a custom grid */}
      <div className="mb-16">
        <PhotoAlbum
          photos={slides.map((s, i) => ({
            src: s.src,
            width: 800,
            height: 600,
            key: i,
          }))}
          layout="rows"
          onClick={({ index }) => setLightboxIndex(index)}
        />
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides.map((s, i) => ({
          src: s.src,
          // A custom render function to show PDF or video
          // yet-another-lightbox allows "render" or "type" => "image" or "video"
        }))}
        // Example custom toolbar button to edit
        render={{
          buttonNext: undefined,
          // You can override or add a custom UI:
          toolbar: ({ index }) => {
            return (
              <IconButton
                onClick={() => {
                  setLightboxIndex(-1);
                  setEditIndex(index);
                }}
              >
                <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
              </IconButton>
            );
          },
        }}
      />

      {/* If a file is being edited, show the edit form inline */}
      {editIndex >= 0 && (
        <EditMetadataForm
          file={files[editIndex]}
          onSave={(meta) => handleSaveMetadata(editIndex, meta)}
          onCancel={() => setEditIndex(-1)}
        />
      )}
      {/* Also show “edit” buttons under each thumbnail if you wish: */}
      <div className="flex gap-8 flex-wrap">
        {files.map((f, i) => (
          <div key={i} className="relative">
            <img
              src={getServerFile(f.filePath, "/assets/images/placeholder.png")}
              alt=""
              className="w-128 h-128 object-cover"
            />
            <IconButton
              className="absolute top-4 right-4 bg-white"
              onClick={() => handleEdit(i)}
            >
              <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}

// A small sample “EditMetadataForm”
function EditMetadataForm({ file, onSave, onCancel }) {
  const [meta, setMeta] = useState(
    file.metadata || { title: "", description: "" }
  );

  function handleSubmit() {
    onSave(meta);
  }

  return (
    <div className="border rounded p-16 my-16">
      <Typography className="font-bold mb-12">ویرایش متادیتا</Typography>
      <label className="block mb-8">عنوان</label>
      <input
        className="border p-8 w-full mb-8"
        value={meta.title}
        onChange={(e) => setMeta({ ...meta, title: e.target.value })}
      />
      <label className="block mb-8">توضیحات</label>
      <textarea
        className="border p-8 w-full mb-8"
        value={meta.description}
        onChange={(e) => setMeta({ ...meta, description: e.target.value })}
      />
      <div className="flex gap-8">
        <Button variant="contained" onClick={handleSubmit}>
          ذخیره
        </Button>
        <Button variant="text" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
}

// The main Gallery Tab that uses multiple sections
function CompanyGalleryTab() {
  return (
    <div className="w-full">
      <FileSection
        title="لوگو شرکت"
        fieldName="companyLogoFiles"
        fileServiceType="COMPANY_LOGO"
      />
      <FileSection
        title="تصویر پس زمینه"
        fieldName="companyBackgroundImages"
        fileServiceType="COMPANY_BACKGROUND_IMAGE"
      />
      <FileSection
        title="گواهی ها"
        fieldName="companyCertificates"
        fileServiceType="COMPANY_CERTIFICATE"
      />
      <FileSection
        title="اسناد"
        fieldName="companyDocuments"
        fileServiceType="COMPANY_DOCUMENT"
      />
      <FileSection
        title="تصاویر گالری محصول"
        fieldName="companyGalleryProduct"
        fileServiceType="COMPANY_GALLERY_PRODUCT"
      />
      {/* ...and so on for the other sections you mentioned */}
    </div>
  );
}

export default CompanyGalleryTab;
