import React from 'react';

interface PersonFieldGroupProps {
  name: string;
  address: string;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDelete: () => void;
  showDelete: boolean;
  nameError?: string;
  addressError?: string;
}

const TrashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export const PersonFieldGroup: React.FC<PersonFieldGroupProps> = ({
  name,
  address,
  onNameChange,
  onAddressChange,
  onDelete,
  showDelete,
  nameError,
  addressError,
}) => {
  return (
    <div className="relative p-4 border border-gray-200 rounded-lg bg-surface shadow-sm space-y-4">
      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1.5 bg-white text-error border border-gray-200 rounded-full hover:bg-red-50 transition-colors shadow-sm"
          title="刪除"
        >
          <TrashIcon />
        </button>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              nameError ? 'border-error ring-1 ring-error/50' : 'border-gray-300'
            }`}
            placeholder="請輸入姓名"
          />
          {nameError && <p className="mt-1 text-xs text-error">{nameError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">地址</label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
              addressError ? 'border-error ring-1 ring-error/50' : 'border-gray-300'
            }`}
            placeholder="請輸入通訊地址"
          />
          {addressError && <p className="mt-1 text-xs text-error">{addressError}</p>}
        </div>
      </div>
    </div>
  );
};
