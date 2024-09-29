import React from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Controller, Control, UseFormWatch } from "react-hook-form";
import { IEmployee } from "../Types/employee.type"; // Ensure the path is correct based on your folder structure

interface CountryRegionDropdownProps {
  name: keyof IEmployee; // Name must match one of IEmployee fields
  type: "dropdown" | "region"; // Type to determine country or region dropdown
  control: Control<IEmployee>; // Control from react-hook-form for handling form state
  watch: UseFormWatch<IEmployee>; // Watch function from react-hook-form to observe form state changes
  label?: string; // Optional label for the dropdown
}

const CountryRegionDropdown: React.FC<CountryRegionDropdownProps> = ({
  name,
  type,
  control,
  watch,
  label,
}) => {
  const countryValue = watch ? watch("country") : ""; // Watch for country value for region dropdown
  const isRegion = type === "region"; // Check if the dropdown is for a region
  const DropdownComponent: React.ElementType = isRegion
    ? RegionDropdown
    : CountryDropdown; // Select the appropriate dropdown component

  return (
    <div className="mb-4">
      {label && ( // Conditionally render the label if it exists
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Controller
        name={name} // Assign form field name
        control={control} // Connect to form control
        render={({ field }) => (
          <DropdownComponent
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
            country={
              isRegion
                ? typeof countryValue === "string"
                  ? countryValue
                  : ""
                : undefined
            }
            onChange={(val: string) => field.onChange(val)}
            classes="w-full px-4 py-3 mt-[3px] border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        )}
      />
    </div>
  );
};

export default CountryRegionDropdown;
