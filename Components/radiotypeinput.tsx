import React from 'react';

interface RadioOption {
  value: string;
  label?: string;
}

interface RadioInputProps {
  label: string;
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  register: any;
}

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  name,
  options,
  selectedValue,
  register,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium">{label}</label>
      <div className="flex items-center space-x-6">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              checked={selectedValue === option.value}
              className="form-radio h-5 w-5 text-teal-600"
            />
            <span className="ml-3">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
