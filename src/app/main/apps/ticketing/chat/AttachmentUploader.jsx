import { IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useRef } from 'react';

function AttachmentUploader({ onFileSelected }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelected(file);
      // Reset the input so the same file can be selected again
      event.target.value = null;
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <IconButton
        type="button"
        size="large"
        onClick={handleButtonClick}
      >
        <FuseSvgIcon
          className="text-24"
          color="action"
        >
          heroicons-outline:paper-clip
        </FuseSvgIcon>
      </IconButton>
    </>
  );
}

export default AttachmentUploader;
