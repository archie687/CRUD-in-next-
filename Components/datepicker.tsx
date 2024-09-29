import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  name: string;
  dateValue: Date | null;
  handleDateChange: (date: Date | null) => void;
  label?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  dateValue,
  handleDateChange,
  label,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium">
        {label}
      </label>
      <DatePicker
        id={name}
        selected={dateValue}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
};

export default DateInput;
