import React from "react";
import {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { IEmployee } from "../Types/employee.type";

interface InputProps {
  label?: string;
  name: keyof IEmployee; 
  type?: "text" | "textarea";
  register?: UseFormRegister<IEmployee>; 
  placeholder?: string;
  errors: FieldErrors<IEmployee>; 
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  register,
  placeholder,
  errors,
  rows = 4,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name as string} className="mb-2 text-sm font-medium">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name as string}
          {...(register ? register(name) : {})} 
          placeholder={placeholder}
          rows={rows}
          className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      ) : (
        <input
          id={name as string}
          type={type}
          {...(register ? register(name) : {})} 
          placeholder={placeholder}
          className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}

      {errors[name] && (
        <span className="text-red-600">{(errors[name] as any)?.message}</span> 
      )}
    </div>
  );
};

export default Input;
