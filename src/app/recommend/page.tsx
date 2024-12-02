"use client";
import { useState, useEffect } from "react";

export default function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      // Start loading immediately when a file is selected
      setLoading(true);
      setProgress(0);
      setUploadComplete(false); // Reset the completion status
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile?.name}" uploaded successfully!`);
      setUploadComplete(true); // Mark the upload as complete
    } else {
      alert("Please select a file before uploading.");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setLoading(false);
    setUploadComplete(false); // Reset everything
  };

  useEffect(() => {
    if (loading) {
      const uploadInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(uploadInterval);
            setLoading(false);
            setUploadComplete(true);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500); // Simulate the upload process with a 500ms interval
    }
  }, [loading]);

  // Determine file type logo
  const getFileTypeLogo = (file: File) => {
    if (file.name.endsWith(".pdf")) {
      return "https://www.bing.com/images/blob?bcid=r.v34qS.88kHbg"; // PDF logo
    }
    if (file.name.endsWith(".docx")) {
      return "https://th.bing.com/th/id/R.8e70cda231e4e7e91e974e7378d965c9?rik=cIQimYS0vLIpaQ&pid=ImgRaw&r=0"; // DOCX logo
    }
    return "https://th.bing.com/th/id/R.2cf435025c4a8328cd9aab77f4594ddd?rik=3lSdm0WPdqFu9g&pid=ImgRaw&r=0"; // Default logo
  };

  // Truncate long file names
  const getFileName = (fileName: string) => {
    return fileName.length > 20 ? `${fileName.slice(0, 20)}...` : fileName;
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full bg-[#AC75754D] flex items-center">
        {/* Image on the left */}
        <img
          src="https://s3-alpha-sig.figma.com/img/a0ab/e5fe/345d5d52c45b67eaf372a11eb40f719e?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AgYvQpbwg~6R6RTJNssXXCIM-mB4j~NvfN9GmDOfKGe64sdpHaXrhC06OgSjjdK4spTULU6W4~5RFqKGW0oCgtB6Emcr163nwXpuLQQafk6xkiL-w2Yz4JHC41MXHYyLUis0k~624OrNfilDfEVFz9CDrAItjpFxdorU9aFF8pmrxskAsBzF6vr3UsBLj22rJFjNSYE1Nw2MJVj96PrySoauXsgtkBPL0hSkSyGZoF2qy4-RWPP4rOH43Q5Y3D86ugNPD549C7U3O~GUf2BRe8u48ZMMng3RViYNHv~~wrosWtsV9mcvRcoFZYk0lnxQdnrrI2OQZM5A8P8w2XZkNQ__"
          alt="Workplace Illustration"
          className="ml-48 h-40 w-40"
        />

        {/* Text Content on the right */}
        <div className="ml-20">
          <h1 className="ml-40 text-[22px] font-bold text-gray-800">
            Find a workplace that works for you
          </h1>
          <p className="ml-40 mt-2 text-gray-500 font-bold w-[500px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vehicula, orci non bibendum finibus, nisl velit dapibus lectus, nec
            euismod sapien tortor a ligula.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#0B1344] mt-20 mb-4 w-[500px]">
          Find Your Perfect Job Match with Your CV
        </h1>
      </div>

      <div className="bg-white p-6 rounded-md border-2 border-[#00000066] w-[30%] py-10">
        <div className="flex flex-col items-center justify-center w-full rounded-md px-6 py-10 bg-gray-100 text-center relative">
          {/* Center Image Icon */}
          <div className="mb-6">
            <img
              src="https://s3-alpha-sig.figma.com/img/0bcf/8148/c932c7cc8222649a49891efd7248eade?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fY1CH6X8SZIztU32uR6rUD1sEWIJkcSpy8m79ZZPeqBGHyo28xDXx304i7uR8mTTpBF7KUuY87VaJ3F1UtB9Ubu-OE5F5QfdQNRBxMhYXaXpoM8QN4J97hiVyeGd04uH8YSAPrN95yZ~GWZBHxvc~We-wpzZfZBTadfGXKfyLi2hXiDQirmIOBsf6qHk~Rmtzqb7HBW9qzu-qENx2XcdQJAOJbyiIbRMLjellzxveghinzCzsgjrAeaAd8tr2m43zlI97Jr4Wbk8KIc~mBotgFwc7Y9uMsi37B1K78EFSo9UzCjNjnUWUJb5WOc8XB0R2R6B0ozCa0NgQIjuQRmPew__"
              alt="Upload Icon"
              className="h-20 w-20"
            />
          </div>

          <label
            htmlFor="file-upload"
            className="block text-gray-700 text-[20px] font-[600]"
          >
            Drag & drop files or{" "}
            <span className="text-[#AC7575] underline cursor-pointer">
              Browse
            </span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {selectedFile && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border-2 border-[#00000066]">
            <div className="flex items-center space-x-4">
              {/* File Logo and Details */}
              <img
                src={getFileTypeLogo(selectedFile)}
                alt="File Logo"
                className="h-12 w-12"
              />
              <div className="flex flex-col flex-grow">
                <span className="text-lg font-semibold text-gray-700">
                  {getFileName(selectedFile.name)}
                </span>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1">{`${progress}%`}</span>
                  </div>
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#AC7575] h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Remove Button */}
              <button
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Find Button (always visible) */}
      <button
        onClick={handleUpload}
        className="mt-6 px-32 py-3 bg-[#AC7575] text-white font-medium text-[22px] py-2 rounded-full hover:bg-[#934b4b] transition duration-200"
      >
        Find
      </button>
    </div>
  );
}
