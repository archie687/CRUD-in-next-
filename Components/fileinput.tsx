import React from "react";

interface FileInputProps {
  name: string;
  label?: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreviews: string[];
  handleImageDelete: (index: number) => void;
  handleImageClick: (preview: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  handleImageChange,
  imagePreviews,
  handleImageDelete,
  handleImageClick,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        multiple
        id={name}
        accept="image/*"
        onChange={handleImageChange}
        className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="mt-4 flex gap-4 flex-wrap">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative inline-block m-1">
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="max-w-[100px] max-h-[100px] object-cover cursor-pointer"
              onClick={() => handleImageClick(preview)}
            />
            <button
              type="button"
              onClick={() => handleImageDelete(index)}
              className="absolute top-0 right-0 bg-white text-black border border-blue-500 rounded-full cursor-pointer px-2 py-1 text-xs"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileInput;
