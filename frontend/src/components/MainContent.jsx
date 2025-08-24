import React, { useState, useEffect, useRef } from "react";
import { MenuIcon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { FileUploadButton } from "./FileUploadButton";
import { askQuery } from "../api/services/queryService";
import { uploadDocuments } from "../api/services/documentService";

export const MainContent = ({ onToggleSidebar }) => {
  const [prompt, setPrompt] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const token = localStorage.getItem("token");

  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when a new message arrives
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [submittedPrompt, answer, loading]);

  const handleFileUpload = async (files) => {
    try {
      const res = await uploadDocuments(files, token);
      const uploaded = res.data.data.documents;

      const newFiles = Array.isArray(uploaded)
        ? uploaded.map((file) => ({
            id: file.id,
            name: file.originalName,
            type: "file",
            fileUrl: file.uploadPath,
          }))
        : [
            {
              id: uploaded.id,
              name: uploaded.originalName,
              type: "file",
              fileUrl: uploaded.uploadPath,
            },
          ];

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setSubmittedPrompt(prompt);
    setPrompt("");
    setHasSubmitted(true);
    setLoading(true);
    setAnswer("");

    try {
      const response = await askQuery(prompt, token); // prompt only
      setAnswer(response.query.answer);
      setMeta(response.metadata);
      console.log("meta", response.metadata);
    } catch (err) {
      console.error("Query error:", err);
      setAnswer("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative transition-all duration-300">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="lg:hidden absolute top-4 left-4 z-10 text-gray-600 hover:bg-gray-100 cursor-pointer"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {!hasSubmitted && (
        <>
          <img
            className="w-7 h-7 mb-3"
            alt="Negotio Icon"
            src="/images/docChatIcon-purple.png"
          />
          <h1 className="text-[15px] lg:text-[18px] font-medium text-center text-gray-800 mb-2 px-4 tracking-tight">
            How can we{" "}
            <span className="text-purple-600 font-semibold">assist</span> you
            today?
          </h1>
          <p className="text-[12px] lg:text-sm text-gray-600 text-center max-w-[420px] mb-5 leading-relaxed px-4 font-normal tracking-tight">
            Get expert guidance powered by AI agents specializing in Sales,
            Marketing, and Negotiation. Choose the right agent and start your
            conversation confidently.
          </p>
        </>
      )}

      {hasSubmitted && (
        <div
          ref={chatBoxRef}
          className="w-full max-w-[700px] px-4 mt-10 mx-auto space-y-10 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
        >
          {/* User Message (Right) */}
          <div className="w-full flex justify-end">
            <div className="flex items-start gap-3 flex-row-reverse">
              <img
                src="/images/user.png"
                alt="User"
                className="w-10 h-10 rounded-full border shadow-sm"
              />
              <div>
                <div className="bg-white border border-gray-200 text-left p-4 rounded-2xl shadow-sm max-w-[600px]">
                  <p className="text-gray-700 leading-relaxed">
                    {submittedPrompt}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right pr-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="w-full flex justify-start animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200" />
                <div>
                  <div className="bg-purple-100 p-4 rounded-2xl max-w-[600px] space-y-2">
                    <div className="h-4 bg-purple-200 rounded w-3/4" />
                    <div className="h-4 bg-purple-200 rounded w-1/2" />
                    <div className="h-4 bg-purple-200 rounded w-5/6" />
                  </div>
                  <p className="text-xs text-purple-300 mt-1 pl-1">
                    Generating...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Message (Left) */}
          {!loading && answer && (
            <div className="w-full flex justify-start overflow-x-hidden">
              <div className="flex items-start gap-3">
                <img
                  src="/images/docChatIcon-black.png"
                  alt="AI"
                  className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 shadow-sm"
                />
                <div>
                  <div className="bg-purple-50 border border-purple-200 text-left p-4 rounded-2xl text-purple-800 shadow-sm max-w-[600px]">
                    <p className="leading-relaxed">{answer}</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
                    {meta?.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex-shrink-0 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full border border-purple-300"
                      >
                        📄 {item.file_name} — Page {item.page_number}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-left text-purple-400 mt-1 pl-1">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-[600px] px-4 block fixed bottom-[30px] mt-0">
        <form onSubmit={handleSubmit}>
          <Card className="bg-[#f3f3f3] border border-[#e0e0e0] rounded-[28px] p-1 flex items-center space-x-2">
            {/* Upload Button */}
            <FileUploadButton
              handleUpload={handleFileUpload}
              accept=".pdf,.doc,.docx,.pptx"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-[24px] bg-[#424242] hover:bg-[#3a3a3a] flex items-center justify-center cursor-pointer"
            >
              <img
                className="w-[18px] h-[18px] lg:w-[24px] lg:h-[24px]"
                alt="Attachment"
                src="/images/attach-file.png"
              />
            </FileUploadButton>

            {/* Input */}
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent border-none shadow-none h-10 lg:h-12 px-3 text-base lg:text-lg text-[#424242] tracking-tight 
    placeholder:text-[#7a7a7a] focus:!outline-none focus:!ring-0 focus-visible:!outline-none"
              placeholder="Type your prompt here..."
              disabled={loading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-[24px] bg-[#9747ff] hover:bg-[#8a3ff0] flex items-center justify-center cursor-pointer"
              disabled={!prompt.trim() || loading}
            >
              <SendIcon className="w-[18px] h-[16px] lg:w-[22px] lg:h-[20px]" />
            </Button>
          </Card>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="mt-3 px-2 text-sm text-gray-600">
            <p className="font-medium mb-1">Uploaded Files:</p>
            <ul className="list-disc list-inside">
              {uploadedFiles.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
