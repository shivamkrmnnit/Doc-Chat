import React, { useEffect, useState, useRef } from 'react';
import {
  ChevronRightIcon,
  FileTextIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  Loader2Icon,
  XIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { FileUploadButton } from './FileUploadButton';
import { FolderUploadButton } from './FolderUploadButton';
import {getDocuments} from '../api/services/documentService';
import { toast } from 'react-toastify';
import {
  uploadToServer as uploadHandler,
  handleDeleteDocument as deleteHandler,
} from '../utils/documentHandlers';
const allowedExtensions = ['pdf', 'doc', 'docx', 'pptx'];

export const Sidebar = ({
  uploadedItems,
  isUploading,
  addUploadedItems,
  onRemoveItem,
  isOpen,
  onClose,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const files = uploadedItems.filter(item => item.type === 'file').slice(0, 10);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await getDocuments(token);
        const docs = res.data.data.documents.map(doc => ({
          id: doc.id,
          name: doc.originalName,
          type: 'file',
          fileUrl: doc.uploadPath,
        }));
        addUploadedItems(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    fetchDocuments();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`fixed lg:relative top-0 left-0 h-full w-[300px] max-w-[80vw] bg-[#111111]
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Close Button */}
        <div className="lg:hidden absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-[#242723] p-1.5"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-4 flex items-center">
          <img className="w-6 h-6" alt="DOC-Chat Logo" src="/images/docChatIcon-purple.png" />
          <div className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
            DOC-Chat
          </div>
        </div>

        {/* Upload Section */}
        <div className="px-4 py-3 space-y-3">
          <FileUploadButton
            accept=".pdf,.doc,.docx,.pptx"
            handleUpload={(files) => uploadHandler(files, addUploadedItems)}
            disabled={isUploading}
            className="cursor-pointer w-full h-[50px] justify-between bg-[#2c2c2c] hover:bg-[#383838] text-white border-none"
          >
            <span className="text-sm font-medium">Upload File</span>
            <PlusCircleIcon className="h-4 w-4" />
          </FileUploadButton>

          <FolderUploadButton
            handleUpload={(files) => uploadHandler(files, addUploadedItems)}
            disabled={isUploading}
            className="cursor-pointer w-full h-[50px] justify-between bg-[#2c2c2c] hover:bg-[#383838] text-white border-none"
          >
            <span className="text-sm font-medium">Upload Folder</span>
            <PlusCircleIcon className="h-4 w-4" />
          </FolderUploadButton>
        </div>

        {/* Uploaded Files */}
        <div className="flex-1 px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-[#222]">
          {files.length > 0 && (
            <div className="mb-5">
              <h3 className="text-white text-sm font-semibold mb-3">
                Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map(file => (
                  <div key={file.id} className="group relative">
                    <Button
                      variant="outline"
                      className="cursor-pointer w-full h-[45px] bg-[#1d1d1d] hover:bg-[#2a2a2a] text-white border border-[#444] rounded-xl justify-between transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center min-w-0">
                        <FileTextIcon className="h-4 w-4 mr-3 flex-shrink-0 text-purple-300" />
                        <span className="text-sm font-medium truncate bg-gradient-to-r from-white to-[#a3a3a3] bg-clip-text text-transparent">
                          {file.name}
                        </span>
                      </div>
                      <ChevronRightIcon className="h-3 w-3 flex-shrink-0 text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHandler(file.id, file.name, onRemoveItem)}
                      className="cursor-pointer absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-600 p-1"
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadedItems.length === 0 && !isUploading && (
            <div className="text-center py-8">
              <p className="text-[#757575] text-xs">
                No files or folders uploaded yet.
                <br />
                Use the upload area above to get started.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 relative" ref={dropdownRef}>
          <Button
            variant="outline"
            className=" cursor-pointer w-full h-[50px] bg-[#2c302a] hover:bg-[#363b35] text-[#cbcbcb] border-none rounded-lg justify-between"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-3" />
              <span className="text-sm font-semibold">User Profile</span>
            </div>
            <SettingsIcon className="h-4 w-4" />
          </Button>

          {showDropdown && (
            <div className="absolute bottom-[70px] left-0 w-full bg-[#1d1d1d] border border-[#333] rounded-md text-white shadow-lg z-50">
              <button
                className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-[#2c2c2c]"
                onClick={() => {
                  setShowDropdown(false);
                  window.location.href = '/profile';
                }}
              >
                Profile
              </button>
              <button
                className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-[#2c2c2c]"
                onClick={() => {
                  localStorage.removeItem('token');

                  // window.location.href = '/login';
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 1500);
                  toast.success('Logout successful!');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
