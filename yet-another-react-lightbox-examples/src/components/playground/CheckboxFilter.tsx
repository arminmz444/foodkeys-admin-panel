import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Filter from "./Filter";

export type CheckboxFilterProps = {
  label: React.ReactNode;
  checked?: boolean;
  onChange: (checked: boolean) => void;
};

export default function CheckboxFilter({
  label,
  checked,
  onChange,
}: CheckboxFilterProps) {
  return (
    <Filter>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            size="small"
            checked={checked}
            onChange={(_, checked) => onChange(checked)}
          />
        }
        sx={{ color: (theme) => theme.palette.text.secondary }}
      />
    </Filter>
  );
}
