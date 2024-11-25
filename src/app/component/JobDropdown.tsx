import { useState, ReactNode } from "react";

interface JobDropdownProps {
  title: string;
  children: ReactNode;
}

const JobDropdown: React.FC<JobDropdownProps> = ({ title, children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="w-full">
      <div
        onClick={toggleDropdown}
        className="cursor-pointer text-[22px] px-32 font-bold bg-gray-0 border-b border-t border-gray-800 p-4 hover:bg-[#AC757533] focus:outline-none flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-2 transform transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isDropdownOpen
            ? "max-h-full opacity-100 visible scale-y-100 pl-20 ml-8 py-8"
            : "max-h-0 opacity-0 invisible scale-y-0"
        }`}
        style={{
          transformOrigin: "top",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default JobDropdown;
