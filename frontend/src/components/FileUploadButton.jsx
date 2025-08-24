import React, { useRef } from 'react';
import { Button } from './ui/button';

const allowedExtensions = ['pdf', 'doc', 'docx', 'pptx'];

export const FileUploadButton = ({
  handleUpload,
  accept,
  multiple = true,
  disabled = false,
  children,
  className,
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter(file =>
        allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
      );
      if (validFiles.length > 0) {
        handleUpload(validFiles);
      }
    }
    event.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </>
  );
};