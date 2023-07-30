import React from "react";
import { useField } from "remix-validated-form";

export const FormInput = ({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type={type}
        {...getInputProps({ id: name })}
      />
      {error && <div className="mt-1 text-red-500 ">{error}</div>}
    </div>
  );
};
