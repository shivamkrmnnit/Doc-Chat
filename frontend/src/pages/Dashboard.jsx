import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MainContent } from '../components/MainContent';
import { useFileUpload } from '../hooks/useFileUpload';

export const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    uploadedItems,
    isUploading,
    uploadFiles,
    uploadFolder,
    removeItem,
    addUploadedItems,
  } = useFileUpload();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white overflow-hidden w-full max-w-[1728px] relative">
        
        <div className="absolute w-full h-full inset-0 overflow-hidden pointer-events-none">
          
          <div className="absolute w-[399px] h-[325px] top-[230px] right-[380px] rotate-[47.67deg] opacity-[0.32]">
            <div className="relative h-[325px]">
              <div className="absolute w-[399px] h-[285px] top-0 left-0 rounded-[199.42px/142.27px] blur-[100px] bg-[linear-gradient(180deg,rgba(9,9,9,0)_0%,rgba(111,0,255,1)_100%)]" />
              <div className="absolute w-48 h-[194px] top-[132px] left-[104px] blur-[100px] bg-[linear-gradient(180deg,rgba(24,75,255,0)_0%,rgba(255,255,255,0.69)_100%)]" />
            </div>
          </div>

          <div className="absolute w-[685px] h-[559px] top-[280px] right-[-100px] rotate-[18.50deg] opacity-[0.52]">
            <div className="relative h-[559px]">
              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(151,71,255,1)_100%)] absolute w-[685px] h-[489px] top-0 left-0 rounded-[342.5px/244.34px] blur-[100px]" />
              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.69)_100%)] absolute w-[329px] h-[333px] top-[226px] left-[178px] blur-[100px]" />
            </div>
          </div>

          <div className="absolute w-[685px] h-[559px] top-[400px] left-[-300px] rotate-[47.67deg] opacity-[0.52]">
            <div className="relative h-[559px]">
              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(151,71,255,1)_100%)] absolute w-[685px] h-[489px] top-0 left-0 rounded-[342.5px/244.34px] blur-[100px]" />
              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.69)_100%)] absolute w-[329px] h-[333px] top-[226px] left-[178px] blur-[100px]" />
            </div>
          </div>
        </div>

       
        <div className="flex h-screen relative z-10">
          
          <Sidebar
            uploadedItems={uploadedItems}
            isUploading={isUploading}
            addUploadedItems={addUploadedItems} 
            onRemoveItem={removeItem}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />

          
          <MainContent
            onUploadFiles={uploadFiles}
            onUploadFolder={uploadFolder}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
};
