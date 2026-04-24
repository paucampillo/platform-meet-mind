interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            value === option
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
