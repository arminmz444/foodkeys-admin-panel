import React, { useCallback, useState } from 'react';
// import { Upload } from 'lucide-react';
import { Upload } from '@mui/icons-material';
import { FileUtils } from '../../../utils/file-utils';



export const FileUploader = ({
  onUploadComplete,
  maxSize = 100 * 1024 * 1024, // 100MB default
  acceptedTypes = ['*/*']
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${FileUtils.formatFileSize(maxSize)}`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise<FileMetadata>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      xhr.open('POST', '/api/files/upload');
      xhr.send(formData);
    });
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        setUploading(true);
        const metadata = await uploadFile(file);
        onUploadComplete(metadata);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    }
  }, [onUploadComplete]);

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const metadata = await uploadFile(file);
        onUploadComplete(metadata);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    }
  }, [onUploadComplete]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <input
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept={acceptedTypes.join(',')}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-blue-500 hover:text-blue-600"
      >
        Choose a file
      </label>
      <p className="text-gray-500 mt-2">or drag and drop here</p>
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress}% uploaded</p>
        </div>
      )}
    </div>
  );
};