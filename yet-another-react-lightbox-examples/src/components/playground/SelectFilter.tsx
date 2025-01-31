import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import Filter from "./Filter";

export type CommonSelectProps<T> = {
  label: React.ReactNode;
  options: T[];
};

export type SingleSelectProps<T> = CommonSelectProps<T> & {
  multiple?: false;
  value: T | undefined;
  onChange: (value: T) => void;
};

export type MultipleSelectProps<T> = CommonSelectProps<T> & {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
};

export type SelectFilterProps<T> =
  | SingleSelectProps<T>
  | MultipleSelectProps<T>;

export default function SelectFilter<T extends string = string>({
  label,
  multiple,
  options,
  value,
  onChange,
}: SelectFilterProps<T>) {
  return (
    <Filter>
      <TextField
        select
        fullWidth
        size="small"
        variant="standard"
        label={label}
        value={value}
        onChange={(event) => {
          onChange(event.target.value as T & T[]);
        }}
        {...(multiple ? { SelectProps: { multiple: true } } : null)}
      >
        {options.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              {option === "" ? <>&nbsp;</> : option}
            </MenuItem>
          );
        })}
      </TextField>
    </Filter>
  );
}
