import React, { useRef } from 'react';
import { Button } from './ui/button';

const allowedExtensions = ['pdf', 'doc', 'docx', 'pptx'];

export const FolderUploadButton = ({
  handleUpload,
  disabled = false,
  children,
  className,
}) => {
  const folderInputRef = useRef(null);

  const handleClick = () => {
    folderInputRef.current?.click();
  };

  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file =>
      allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
    );

    if (validFiles.length > 0) {
      handleUpload(validFiles);
    }

    event.target.value = '';
  };

  return (
    <>
      <input
        ref={folderInputRef}
        type="file"
        style={{ display: 'none' }}
        multiple
        webkitdirectory=""
        onChange={handleFolderChange}
      />
      <Button
        variant="outline"
        className={className}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </>
  );
};