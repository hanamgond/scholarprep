import { useState } from 'react'; // 👈 This line was missing

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomDropdown({ label, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <button
        type="button"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || `All ${label}s`}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <li className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer" onClick={() => handleSelect('')}>
            All {label}s
          </li>
          {options.map((option) => (
            <li
              key={option}
              className="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
