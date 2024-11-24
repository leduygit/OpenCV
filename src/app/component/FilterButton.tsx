import React, { useState } from "react";

interface FilterButtonProps {
  onFind: (selectedOptions: string[]) => void;
  label?: string;
  options?: string[];
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onFind,
  label = "Filter",
  options = [],
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleDropdown = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOptions(
      (prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((item) => item !== option) // Remove if already selected
          : [...prevSelected, option] // Add if not selected
    );
  };

  const handleFind = () => {
    onFind(selectedOptions);
    setShowOptions(false); // Close dropdown after finding
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        className="flex items-center bg-white border border-black text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
        onClick={toggleDropdown}
      >
        {label}
        {/* Arrow Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ml-2 transform ${
            showOptions ? "rotate-180" : "rotate-0"
          } transition-transform duration-300`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={showOptions ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {showOptions && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-80">
          <div>
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`flex items-center justify-between w-full cursor-pointer rounded-none ${
                  selectedOptions.includes(option)
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* Add padding inside the content container */}
                <div className="w-full px-4 py-2 flex justify-between items-center text-sm">
                  <span>{option}</span>
                  {selectedOptions.includes(option) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
            <div className="p-5 flex justify-between items-center border-t border-gray-300">
              <button
                className="text-black font-semibold py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none text-sm"
                onClick={handleFind}
              >
                Clear
              </button>
              <button
                className="bg-gray-900 text-white font-semibold py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none text-sm"
                onClick={handleFind}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
