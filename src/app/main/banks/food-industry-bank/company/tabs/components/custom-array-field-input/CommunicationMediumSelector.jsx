// CommunicationArraySelector.tsx
import React from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  IconButton,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import clsx from "clsx";
import { COMMUNICATION_TYPES } from "./communicationMediumZodSchema"; // or wherever you keep them

/**
 * A generic field array for adding communications like phone, email, website, etc.
 * Each item has: mediumType (select), value (string), label (optional).
 * If `secondInput===true`, it also shows a second text input for "label" or "description".
 */
function CommunicationArraySelector({
  name,
  label,
  className,
  secondInput = false,
  secondInputLabel,
  secondInputName = "label",
  secondInputPlaceholder,
  addButtonText = "افزودن",
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  });

  const arrErrors = errors?.[name]; // the array-level errors in formState

  return (
    <div className={clsx("flex flex-col w-full", className)}>
      {label && <div className="font-semibold mb-8">{label}</div>}

      {Array.isArray(arrErrors) && arrErrors.length > 0 && (
        // If the array or any item is invalid
        <FormHelperText error>
          {/* We only show a generic message or you can map them: */}
          لطفاً موارد این فهرست را بررسی کنید
        </FormHelperText>
      )}

      {fields.map((field, index) => {
        // For each item in the array, we have mediumType, value, label
        // We'll define the form controls with <Controller>:
        const itemErrors = (arrErrors && arrErrors[index]) || {};
        return (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row items-center gap-16 mb-12 border p-16 rounded-md"
          >
            {/* MediumType SELECT */}
            <Controller
              control={control}
              name={`${name}.${index}.mediumType`}
              render={({ field: ctrlField }) => (
                <TextField
                  {...ctrlField}
                  select
                  label="نوع"
                  fullWidth
                  error={!!itemErrors?.mediumType}
                  helperText={
                    itemErrors?.mediumType?.message
                      ? String(itemErrors.mediumType.message)
                      : ""
                  }
                >
                  {COMMUNICATION_TYPES.map((opt) => (
                    <MenuItem key={opt.type} value={opt.type}>
                      {opt.name} {/* Persian name */}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* Value INPUT */}
            <Controller
              control={control}
              name={`${name}.${index}.value`}
              render={({ field: ctrlField }) => (
                <TextField
                  {...ctrlField}
                  label="مقدار"
                  fullWidth
                  error={!!itemErrors?.value}
                  helperText={
                    itemErrors?.value?.message
                      ? String(itemErrors.value.message)
                      : ""
                  }
                />
              )}
            />

            {/* If secondInput is true, show label or description */}
            {secondInput && (
              <Controller
                control={control}
                name={`${name}.${index}.${secondInputName}`}
                render={({ field: ctrlField }) => (
                  <TextField
                    {...ctrlField}
                    label={secondInputLabel || "برچسب"}
                    placeholder={secondInputPlaceholder}
                    fullWidth
                    error={!!itemErrors?.[secondInputName]}
                    helperText={
                      itemErrors?.[secondInputName]?.message
                        ? String(itemErrors[secondInputName].message)
                        : ""
                    }
                  />
                )}
              />
            )}

            {/* Remove button */}
            <IconButton onClick={() => remove(index)} color="error">
              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
            </IconButton>
          </div>
        );
      })}

      <Button
        variant="outlined"
        onClick={() => append({ mediumType: "", value: "", label: "" })}
        startIcon={<FuseSvgIcon>heroicons-solid:plus-circle</FuseSvgIcon>}
      >
        {addButtonText}
      </Button>
    </div>
  );
}

export default CommunicationArraySelector;
