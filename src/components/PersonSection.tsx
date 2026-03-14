import React from 'react';
import { PersonFieldGroup } from './PersonFieldGroup';

export interface PersonData {
  name: string;
  address: string;
}

export interface PersonSectionErrors {
  [index: number]: {
    name?: string;
    address?: string;
  };
}

interface PersonSectionProps {
  title: string;
  persons: PersonData[];
  onPersonsChange: (persons: PersonData[]) => void;
  minCount: number;
  errors?: PersonSectionErrors;
}

export const PersonSection: React.FC<PersonSectionProps> = ({
  title,
  persons,
  onPersonsChange,
  minCount,
  errors = {},
}) => {
  const handleAdd = () => {
    onPersonsChange([...persons, { name: '', address: '' }]);
  };

  const handleDelete = (index: number) => {
    const newPersons = persons.filter((_, i) => i !== index);
    onPersonsChange(newPersons);
  };

  const handleUpdate = (index: number, field: keyof PersonData, value: string) => {
    const newPersons = [...persons];
    newPersons[index] = { ...newPersons[index], [field]: value };
    onPersonsChange(newPersons);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary border-b border-primary/20 pb-2">
        {title}
      </h2>

      <div className="space-y-6">
        {persons.map((person, index) => (
          <PersonFieldGroup
            key={index}
            name={person.name}
            address={person.address}
            onNameChange={(val) => handleUpdate(index, 'name', val)}
            onAddressChange={(val) => handleUpdate(index, 'address', val)}
            onDelete={() => handleDelete(index)}
            showDelete={persons.length > minCount}
            nameError={errors[index]?.name}
            addressError={errors[index]?.address}
          />
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-text-muted hover:border-primary/40 hover:text-primary transition-all flex justify-center items-center gap-2 group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">+</span>
        新增{title.replace('區塊', '')}
      </button>
    </div>
  );
};
