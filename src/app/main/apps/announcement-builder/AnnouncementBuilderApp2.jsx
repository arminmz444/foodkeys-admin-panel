import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ----------------------------------------------------
// A reusable MUI+Tailwind modal for preview
// ----------------------------------------------------
const AnnouncementModal = ({
  open,
  onClose,
  type,
  title,
  description,
  simpleButtonText = "Close",
  dynamicFormValues = {},
  stepperPages = [],
  currentStepIndex = 0,
  onNextStep,
  onPrevStep,
  totalSteps,
  // For demonstration: we can treat "onSubmit" as a callback if needed
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className:
          "relative rounded-lg p-6 w-full max-w-md " +
          "bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100",
      }}
      BackdropProps={{
        className: "bg-black bg-opacity-50 backdrop-blur-sm",
      }}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <CloseIcon />
      </IconButton>

      {/* Title */}
      <DialogTitle className="flex flex-col items-center text-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        <Typography variant="h6" className="font-semibold">
          {title || "Untitled"}
        </Typography>
      </DialogTitle>

      <DialogContent className="space-y-4 pt-4 pb-2">
        {/* Description */}
        <Typography variant="body2" className="leading-relaxed">
          {description || "No description provided."}
        </Typography>

        {/* If the type is "form", show the dynamic form data */}
        {type === "form" && (
          <div className="space-y-2">
            {Object.entries(dynamicFormValues).map(([key, val]) => (
              <div key={key}>
                <Typography variant="subtitle2" className="font-semibold">
                  {key}:
                </Typography>
                <Typography variant="body2">{String(val)}</Typography>
              </div>
            ))}
          </div>
        )}

        {/* If the type is "stepper", show the current step's info */}
        {type === "stepper" && stepperPages.length > 0 && (
          <div>
            <Typography variant="body2" className="leading-relaxed font-semibold mb-2">
              Page {currentStepIndex + 1} of {totalSteps}
            </Typography>
            <Typography variant="body2" className="leading-relaxed">
              {stepperPages[currentStepIndex]?.description || ""}
            </Typography>
          </div>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions className="flex flex-col space-y-2 mt-2">
        {/* Simple or form type just shows a single close/submit button */}
        {type === "simple" || type === "form" ? (
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            className="px-6 py-2 rounded-md"
          >
            {simpleButtonText}
          </Button>
        ) : null}

        {/* Stepper type: show pagination controls */}
        {type === "stepper" && (
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              variant="outlined"
            >
              Previous
            </Button>
            <Button
              onClick={onNextStep}
              disabled={currentStepIndex === totalSteps - 1}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

// ----------------------------------------------------
// A small helper to parse a Zod schema from user input
// ----------------------------------------------------
function parseZodSchema(schemaString) {
  try {
    // Attempt to parse the JSON input into a Zod schema
    const parsed = JSON.parse(schemaString);
    // We'll assume the parsed object is a "shape" for z.object()
    // e.g. { name: "string", age: "number" }
    // So we convert each field to the correct Zod type
    const shape = {};
    for (const [key, type] of Object.entries(parsed)) {
      switch (type) {
        case "string":
          shape[key] = z.string();
          break;
        case "number":
          shape[key] = z.number();
          break;
        case "boolean":
          shape[key] = z.boolean();
          break;
        default:
          shape[key] = z.any(); // fallback
          break;
      }
    }
    return z.object(shape);
  } catch (error) {
    // If invalid, return a default empty object
    return z.object({});
  }
}

// ----------------------------------------------------
// Main Page Component
// ----------------------------------------------------
const AnnouncementBuilderApp = () => {
  // --------------------------------------------------
  // Mocked announcements from "backend"
  // --------------------------------------------------
  const mockedAnnouncements = [
    {
      id: 1,
      type: "simple",
      title: "Welcome Announcement",
      description: "Welcome to our platform! Enjoy your stay.",
      simpleButtonText: "Got it!",
      stepperPages: [],
      formSchema: "",
      dynamicFormValues: {},
    },
    {
      id: 2,
      type: "form",
      title: "User Registration",
      description: "Please fill out the form below.",
      formSchema: JSON.stringify({ name: "string", age: "number" }, null, 2),
      dynamicFormValues: { name: "John Doe", age: 30 },
      stepperPages: [],
    },
    {
      id: 3,
      type: "stepper",
      title: "Onboarding Steps",
      description: "Follow these steps to get started.",
      stepperPages: [
        { title: "Step 1", description: "Agree to terms" },
        { title: "Step 2", description: "Complete your profile" },
      ],
      formSchema: "",
      dynamicFormValues: {},
    },
    {
      id: 4,
      type: "simple",
      title: "Maintenance Notice",
      description: "We will have scheduled maintenance tonight.",
      simpleButtonText: "Close",
      stepperPages: [],
      formSchema: "",
      dynamicFormValues: {},
    },
  ];

  // --------------------------------------------------
  // Main announcement state
  // --------------------------------------------------
  const [openPreview, setOpenPreview] = useState(true);

  const [announcementData, setAnnouncementData] = useState({
    type: "simple",
    title: "",
    description: "",
    simpleButtonText: "Close",
    formSchema: "", // user input for the schema
    dynamicFormValues: {}, // store the actual data from the dynamic form
    stepperPages: [
      { title: "Page 1", description: "" },
    ],
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --------------------------------------------------
  // For the "form" type, we handle dynamic form with RHF
  // We'll rebuild the form whenever the user changes the schema
  // --------------------------------------------------
  const [zodSchema, setZodSchema] = useState(z.object({})); // default empty
  const formMethods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: announcementData.dynamicFormValues,
  });

  // Whenever form values change, update announcementData.dynamicFormValues
  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      setAnnouncementData((prev) => ({
        ...prev,
        dynamicFormValues: values,
      }));
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  // Re-parse the schema and update the resolver
  useEffect(() => {
    if (announcementData.type === "form") {
      const parsedSchema = parseZodSchema(announcementData.formSchema);
      setZodSchema(parsedSchema);
    } else {
      // Reset to an empty schema if not form type
      setZodSchema(z.object({}));
    }
  }, [announcementData.type, announcementData.formSchema]);

  // Update react-hook-form default values if announcement data changes
  useEffect(() => {
    if (announcementData.type === "form") {
      formMethods.reset(announcementData.dynamicFormValues);
    }
  }, [announcementData.dynamicFormValues, announcementData.type, formMethods]);

  // --------------------------------------------------
  // Handlers for stepper
  // --------------------------------------------------
  const handleNextStep = () => {
    if (currentStepIndex < announcementData.stepperPages.length - 1) {
      setCurrentStepIndex((idx) => idx + 1);
    }
  };
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((idx) => idx - 1);
    }
  };
  const handleAddPage = () => {
    setAnnouncementData((prev) => ({
      ...prev,
      stepperPages: [
        ...prev.stepperPages,
        { title: `Page ${prev.stepperPages.length + 1}`, description: "" },
      ],
    }));
  };

  // When user changes the current step in the stepper
  const handleChangeStep = (newStepIndex) => {
    setCurrentStepIndex(newStepIndex);
  };

  // --------------------------------------------------
  // Handler: When user selects an announcement from the grid
  // --------------------------------------------------
  const loadAnnouncement = (item) => {
    setAnnouncementData({
      ...item,
      // fallback if any fields are missing
      stepperPages: item.stepperPages || [],
      dynamicFormValues: item.dynamicFormValues || {},
    });
    setCurrentStepIndex(0);
    setOpenPreview(true);
  };

  // --------------------------------------------------
  // Handler: "Save" or "Submit" the announcement
  // For now, just log to console
  // --------------------------------------------------
  const handleSave = () => {
    console.log("Announcement data submitted:", announcementData);
    alert("Announcement configuration logged to console.");
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div
      className="
        w-full min-h-screen
        flex flex-col
        bg-gradient-to-r from-[#7575ff] to-[#b8c4f9]
        p-4
      "
    >
      <Typography variant="h4" className="text-white font-bold mb-4">
        Announcement Builder
      </Typography>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Modal Preview */}
        <div className="flex-1">
          <AnnouncementModal
            open={openPreview}
            onClose={() => setOpenPreview(false)}
            type={announcementData.type}
            title={announcementData.title}
            description={announcementData.description}
            simpleButtonText={announcementData.simpleButtonText}
            dynamicFormValues={announcementData.dynamicFormValues}
            stepperPages={announcementData.stepperPages}
            currentStepIndex={currentStepIndex}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            totalSteps={announcementData.stepperPages.length}
          />
        </div>

        {/* Right: Form Configuration */}
        <div className="flex-1 bg-white p-4 rounded-md shadow space-y-4">
          <Typography variant="h6" className="font-semibold">
            Configure Your Announcement
          </Typography>

          {/* Type Selector */}
          <TextField
            select
            fullWidth
            label="Announcement Type"
            value={announcementData.type}
            onChange={(e) =>
              setAnnouncementData((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <MenuItem value="simple">Simple</MenuItem>
            <MenuItem value="form">Form</MenuItem>
            <MenuItem value="stepper">Stepper</MenuItem>
          </TextField>

          {/* Title */}
          <TextField
            label="Title"
            fullWidth
            value={announcementData.title}
            onChange={(e) =>
              setAnnouncementData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={announcementData.description}
            onChange={(e) =>
              setAnnouncementData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          {/* SIMPLE type: Show button text input */}
          {announcementData.type === "simple" && (
            <TextField
              label="Button Text"
              fullWidth
              value={announcementData.simpleButtonText}
              onChange={(e) =>
                setAnnouncementData((prev) => ({
                  ...prev,
                  simpleButtonText: e.target.value,
                }))
              }
            />
          )}

          {/* FORM type: Show a text area for Zod schema + dynamic form preview */}
          {announcementData.type === "form" && (
            <div className="space-y-2">
              <Typography variant="subtitle1" className="font-semibold">
                Zod Schema (JSON)
              </Typography>
              <TextField
                label="Schema"
                multiline
                rows={5}
                fullWidth
                value={announcementData.formSchema}
                onChange={(e) =>
                  setAnnouncementData((prev) => ({
                    ...prev,
                    formSchema: e.target.value,
                  }))
                }
              />

              <Typography variant="subtitle1" className="font-semibold mt-4">
                Dynamic Form Fields
              </Typography>
              <FormProvider {...formMethods}>
                <form className="space-y-2">
                  {Object.keys(zodSchema.shape).length === 0 && (
                    <Typography variant="body2">
                      No valid schema fields to display.
                    </Typography>
                  )}
                  {Object.entries(zodSchema.shape).map(([key, schema]) => {
                    // We'll just handle string, number, boolean for the example
                    // In a real app, you'd check the schema type more robustly
                    const fieldType = schema._def?.typeName;

                    if (fieldType === "ZodString") {
                      return (
                        <TextField
                          key={key}
                          label={key}
                          fullWidth
                          {...formMethods.register(key)}
                        />
                      );
                    } else if (fieldType === "ZodNumber") {
                      return (
                        <TextField
                          key={key}
                          label={key}
                          type="number"
                          fullWidth
                          {...formMethods.register(key, { valueAsNumber: true })}
                        />
                      );
                    } else if (fieldType === "ZodBoolean") {
                      return (
                        <FormControlLabel
                          key={key}
                          control={<Checkbox {...formMethods.register(key)} />}
                          label={key}
                        />
                      );
                    } else {
                      // fallback
                      return (
                        <TextField
                          key={key}
                          label={key}
                          fullWidth
                          {...formMethods.register(key)}
                        />
                      );
                    }
                  })}
                </form>
              </FormProvider>
            </div>
          )}

          {/* STEPPER type: Show pages, plus add page button, plus "current page" fields */}
          {announcementData.type === "stepper" && (
            <div className="space-y-4">
              {/* Step pagination */}
              <div className="flex items-center space-x-2">
                {announcementData.stepperPages.map((page, index) => (
                  <Button
                    key={index}
                    variant={index === currentStepIndex ? "contained" : "outlined"}
                    onClick={() => handleChangeStep(index)}
                  >
                    {index + 1}
                  </Button>
                ))}

                {/* Plus button to add a new page */}
                <IconButton
                  color="primary"
                  onClick={handleAddPage}
                  className="!ml-2"
                >
                  <AddIcon />
                </IconButton>
              </div>

              {/* Current page's fields */}
              {announcementData.stepperPages[currentStepIndex] && (
                <div className="space-y-2">
                  <TextField
                    label="Page Title"
                    fullWidth
                    value={announcementData.stepperPages[currentStepIndex].title}
                    onChange={(e) => {
                      const updated = [...announcementData.stepperPages];
                      updated[currentStepIndex].title = e.target.value;
                      setAnnouncementData((prev) => ({
                        ...prev,
                        stepperPages: updated,
                      }));
                    }}
                  />
                  <TextField
                    label="Page Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={
                      announcementData.stepperPages[currentStepIndex].description
                    }
                    onChange={(e) => {
                      const updated = [...announcementData.stepperPages];
                      updated[currentStepIndex].description = e.target.value;
                      setAnnouncementData((prev) => ({
                        ...prev,
                        stepperPages: updated,
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Save/Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="!mt-4"
          >
            Save Announcement
          </Button>
        </div>
      </div>

      {/* Saved Announcements Grid */}
      <div className="mt-8">
        <Typography variant="h6" className="text-white font-semibold mb-4">
          Saved Announcements
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockedAnnouncements.map((item) => (
            <div
              key={item.id}
              onClick={() => loadAnnouncement(item)}
              className="
                bg-white rounded-md shadow p-4 cursor-pointer
                transition-transform transform hover:scale-105
              "
            >
              <Typography variant="subtitle1" className="font-semibold">
                {item.title}
              </Typography>
              <Typography variant="body2" className="truncate">
                {item.description}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Type: {item.type}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBuilderApp;
