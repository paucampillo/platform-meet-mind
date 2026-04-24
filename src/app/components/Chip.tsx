interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        selected
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
