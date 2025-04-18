import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AnimatePresence, motion } from "framer-motion";
import { ColorPicker } from "@wellbees/color-picker-input";
import CloseIcon from "@mui/icons-material/Close";

/* ---------------------------------------
   OPTIONAL: If you have FuseExample
   --------------------------------------- */
// Example placeholders so the code compiles.
// If you have real FuseExample, ControlledAccordionsComponent, etc. import them.
function FuseExamplePlaceholder(props) {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <Typography>FuseExample جایگزین</Typography>
      <Typography variant="caption">این یک نمونه‌ی ساختگی است</Typography>
    </div>
  );
}

/* ---------------------------------------
   Helper: Shallow compare two objects
   --------------------------------------- */
function shallowEqual(objA, objB) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}

/* 
  Helper: parse a JSON string into a Zod schema.
  Example input: 
    {
      "نام": "string",
      "سن": "number",
      "مشترک": "boolean"
    }
*/
function parseZodSchema(schemaString) {
  try {
    const parsed = JSON.parse(schemaString);
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
          shape[key] = z.any();
          break;
      }
    }
    return z.object(shape);
  } catch {
    return z.object({});
  }
}

/**
 * AnnouncementPreview:
 * - Renders the "announcement modal" in a card on the left, showing exactly
 *   how the user will see it (including form fields, stepper pages, etc.).
 * - For "form" type, we embed the actual fields inside the preview, so
 *   you can later use them to collect user info.
 * - For "صفحه‌ساز" type, we show an iframe (with optional loading state).
 * - For "FuseExample" type, we attempt to render a placeholder FuseExample component.
 */
function AnnouncementPreview({
  type,
  title,
  description,
  simpleButtonText,
  color,
  stepperPages,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  totalSteps,
  formMethods,
  zodSchema,
  announcementData,
  onClose,
}) {
  const { register, formState, control } = formMethods;
  const [iframeLoading, setIframeLoading] = useState(false);


  const containerClasses =
    "relative w-full max-w-md rounded-md shadow-lg p-6 " +
    "flex flex-col gap-4";


  if (type === "صفحه‌ساز" || type === "FuseExample") {
    return (
      <div className={containerClasses} style={{ background: "#f9f9f9" }}>
        <IconButton onClick={onClose} className="!absolute top-2 left-2">
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="text-center font-bold">
          {title || "بدون عنوان"}
        </Typography>

        <Typography variant="body1" className="whitespace-pre-line">
          {description || "بدون توضیحات"}
        </Typography>

        {type === "صفحه‌ساز" && (
          <div className="flex flex-col items-center justify-center">
            {!announcementData.iframeSrc ? (
              <Typography className="text-gray-600 mt-4">
                آدرس آیفریم وارد نشده است
              </Typography>
            ) : (
              <>
                {iframeLoading && (
                  <Typography className="text-sm text-gray-500 mb-2">
                    در حال بارگذاری ...
                  </Typography>
                )}
                <iframe
                  src={announcementData.iframeSrc}
                  className="w-full h-[400px] border rounded"
                  title="صفحه‌ساز آیفریم"
                  onLoad={() => setIframeLoading(false)}
                  onBeforeUnload={() => setIframeLoading(true)}
                />
              </>
            )}
          </div>
        )}

        {type === "FuseExample" && (
          <div>
          
            <FuseExamplePlaceholder />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{
        background: color || "#7575ff",
        color: "#fff",
        minHeight: "350px",
      }}
    >
      <IconButton onClick={onClose} className="!absolute top-2 left-2 text-white">
        <CloseIcon />
      </IconButton>

      <Typography variant="h6" className="text-center font-bold">
        {title || "بدون عنوان"}
      </Typography>

      <Typography variant="body1" className="whitespace-pre-line">
        {description || "بدون توضیحات"}
      </Typography>

      {type === "form" && (
        <FormProvider {...formMethods}>
          <form className="space-y-4 mt-2">
            {Object.keys(zodSchema.shape).length === 0 && (
              <Typography>فرمی برای نمایش وجود ندارد.</Typography>
            )}
            {Object.entries(zodSchema.shape).map(([key, schemaDef]) => {
              const fieldType = schemaDef._def?.typeName;
              if (fieldType === "ZodString") {
                return (
                  <TextField
                    key={key}
                    label={key}
                    fullWidth
                    {...register(key)}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#fff" } }}
                    InputProps={{
                      style: {
                        backgroundColor: "#ffffff22",
                        color: "#fff",
                      },
                    }}
                  />
                );
              } else if (fieldType === "ZodNumber") {
                return (
                  <TextField
                    key={key}
                    label={key}
                    type="number"
                    fullWidth
                    {...register(key, { valueAsNumber: true })}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#fff" } }}
                    InputProps={{
                      style: {
                        backgroundColor: "#ffffff22",
                        color: "#fff",
                      },
                    }}
                  />
                );
              } else if (fieldType === "ZodBoolean") {
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        {...register(key)}
                        style={{ color: "#fff" }}
                      />
                    }
                    label={key}
                    style={{ marginRight: "0.5rem" }}
                  />
                );
              } else {
                // fallback
                return (
                  <TextField
                    key={key}
                    label={key}
                    fullWidth
                    {...register(key)}
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#fff" } }}
                    InputProps={{
                      style: {
                        backgroundColor: "#ffffff22",
                        color: "#fff",
                      },
                    }}
                  />
                );
              }
            })}
          </form>
        </FormProvider>
      )}

      {type === "stepper" && stepperPages?.length > 0 && (
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="subtitle2" className="font-bold mb-2">
                صفحه {currentStepIndex + 1} از {totalSteps}
              </Typography>
              <Typography variant="body2">
                {stepperPages[currentStepIndex]?.description || ""}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="mt-auto flex flex-col space-y-2">
        {type === "simple" && (
          <Button
            variant="contained"
            style={{ backgroundColor: "#ffffff22", color: "#fff" }}
          >
            {simpleButtonText || "بستن"}
          </Button>
        )}

        {type === "stepper" && (
          <div className="flex justify-between">
            <Button
              variant="outlined"
              style={{ color: "#fff", borderColor: "#fff" }}
              disabled={currentStepIndex === 0}
              onClick={onPrevStep}
            >
              قبلی
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#ffffff22", color: "#fff" }}
              disabled={currentStepIndex === totalSteps - 1}
              onClick={onNextStep}
            >
              بعدی
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


function AnnouncementBuilderApp() {
  const mockedAnnouncements = [
    {
      id: 1,
      type: "simple",
      title: "اعلان خوشامدگویی",
      description: "به سامانه ما خوش آمدید!",
      simpleButtonText: "باشه",
      color: "#7575ff",
    },
    {
      id: 2,
      type: "form",
      title: "فرم ثبت‌نام کاربر",
      description: "لطفاً اطلاعات زیر را وارد کنید.",
      formSchema: JSON.stringify(
        { نام: "string", سن: "number", مشترک: "boolean" },
        null,
        2
      ),
      dynamicFormValues: { نام: "علی", سن: 25, مشترک: true },
      color: "#7575ff",
    },
    {
      id: 3,
      type: "stepper",
      title: "راهنمای مرحله‌ای",
      description: "چند مرحله ساده برای آشنایی بیشتر",
      stepperPages: [
        { title: "مرحله ۱", description: "قوانین را مطالعه کنید." },
        { title: "مرحله ۲", description: "اطلاعات پروفایل را تکمیل کنید." },
      ],
      color: "#7575ff",
    },
    {
      id: 4,
      type: "simple",
      title: "اطلاعیه تعمیرات",
      description: "امشب تعمیرات دوره‌ای انجام می‌شود.",
      simpleButtonText: "بستن",
      color: "#7575ff",
    },
  ];

  const [announcementData, setAnnouncementData] = useState({
    type: "simple",
    title: "به شرکت میهن خوش آمدید",
    description: "برای بیشتر آشنا شدن با ما، روی گزینه ادامه بزنید",
    simpleButtonText: "بستن",
    color: "#7575ff",
    formSchema: "",
    dynamicFormValues: {},
    stepperPages: [{ title: "صفحه ۱", description: "" }],
    iframeSrc: "",
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [zodSchema, setZodSchema] = useState(z.object({}));
  const formMethods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: announcementData.dynamicFormValues,
  });

  useEffect(() => {
    if (announcementData.type === "form") {
      const parsed = parseZodSchema(announcementData.formSchema);
      setZodSchema(parsed);
    } else {
      setZodSchema(z.object({}));
    }
  }, [announcementData.type, announcementData.formSchema]);

  useEffect(() => {
    if (announcementData.type === "form") {
      formMethods.reset(announcementData.dynamicFormValues);
    }
  }, [announcementData.dynamicFormValues, announcementData.type, formMethods]);

  const watchedValues = useWatch({ control: formMethods.control });
  useEffect(() => {
    if (!shallowEqual(announcementData.dynamicFormValues, watchedValues)) {
      setAnnouncementData((prev) => ({
        ...prev,
        dynamicFormValues: watchedValues,
      }));
    }
  }, [watchedValues, announcementData.dynamicFormValues]);

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
        {
          title: `صفحه ${prev.stepperPages.length + 1}`,
          description: "",
        },
      ],
    }));
  };
  const handleChangeStep = (index) => {
    setCurrentStepIndex(index);
  };

  const loadAnnouncement = (item) => {
    setAnnouncementData({
      type: item.type || "simple",
      title: item.title || "",
      description: item.description || "",
      simpleButtonText: item.simpleButtonText || "بستن",
      color: item.color || "#7575ff",
      formSchema: item.formSchema || "",
      dynamicFormValues: item.dynamicFormValues || {},
      stepperPages: item.stepperPages || [],
      iframeSrc: item.iframeSrc || "",
    });
    setCurrentStepIndex(0);
  };

  const handleSave = () => {
    console.log("اعلان ذخیره شد:", announcementData);
    alert("پیکربندی اعلان در Console لاگ شد.");
  };

  return (
    <div
      dir="rtl"
      className="
        w-full min-h-screen
        bg-white
        p-6
        flex flex-col
        gap-8
      "
    >
      <Typography variant="h5" className="font-bold text-gray-800">
        سازنده اعلان
      </Typography>

      <div className="flex flex-col-reverse lg:flex-row-reverse gap-8">
        <div className="flex-1">
          <AnnouncementPreview
            type={announcementData.type}
            title={announcementData.title}
            description={announcementData.description}
            simpleButtonText={announcementData.simpleButtonText}
            color={announcementData.color}
            stepperPages={announcementData.stepperPages}
            currentStepIndex={currentStepIndex}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            totalSteps={announcementData.stepperPages.length}
            formMethods={formMethods}
            zodSchema={zodSchema}
            announcementData={announcementData}
            onClose={() => {}}
          />
        </div>

        <div
          className="
            flex-1
            bg-gray-50
            p-6
            rounded-md
            shadow
            space-y-6
          "
        >
          <Typography variant="h6" className="font-semibold text-gray-800">
            پیکربندی اعلان
          </Typography>

          <TextField
            select
            fullWidth
            label="نوع اعلان"
            value={announcementData.type}
            onChange={(e) =>
              setAnnouncementData((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <MenuItem value="simple">ساده</MenuItem>
            <MenuItem value="form">فرم</MenuItem>
            <MenuItem value="stepper">مرحله‌ای</MenuItem>
            <MenuItem value="صفحه‌ساز">صفحه‌ساز</MenuItem>
            <MenuItem value="FuseExample">FuseExample</MenuItem>
          </TextField>

          <TextField
            label="تیتر"
            fullWidth
            value={announcementData.title}
            onChange={(e) =>
              setAnnouncementData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <TextField
            label="توضیحات"
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

          <ColorPicker
            label="رنگ اعلان"
            value={announcementData.color}
            onChange={(newColor) =>
              setAnnouncementData((prev) => ({
                ...prev,
                color: newColor || "#7575ff",
              }))
            }
          />
          {announcementData.type === "simple" && (
            <TextField
              label="متن دکمه"
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

          {announcementData.type === "form" && (
            <div className="space-y-4">
              <TextField
                label="طرحواره (Zod)"
                multiline
                rows={4}
                fullWidth
                value={announcementData.formSchema}
                onChange={(e) =>
                  setAnnouncementData((prev) => ({
                    ...prev,
                    formSchema: e.target.value,
                  }))
                }
              />
              <Typography variant="body2" className="text-gray-500">
                فیلدهای فرم را در پیش‌نمایش اعلان مشاهده کنید.
              </Typography>
            </div>
          )}

          {announcementData.type === "stepper" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {announcementData.stepperPages.map((page, index) => (
                  <Button
                    key={index}
                    variant={
                      index === currentStepIndex ? "contained" : "outlined"
                    }
                    onClick={() => handleChangeStep(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <IconButton color="primary" onClick={handleAddPage}>
                  <AddIcon />
                </IconButton>
              </div>

              {announcementData.stepperPages[currentStepIndex] && (
                <div className="space-y-3">
                  <TextField
                    label="عنوان صفحه"
                    fullWidth
                    value={
                      announcementData.stepperPages[currentStepIndex].title
                    }
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
                    label="توضیحات صفحه"
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

          {announcementData.type === "صفحه‌ساز" && (
            <TextField
              label="آدرس آیفریم"
              fullWidth
              value={announcementData.iframeSrc}
              onChange={(e) =>
                setAnnouncementData((prev) => ({
                  ...prev,
                  iframeSrc: e.target.value,
                }))
              }
            />
          )}

          {announcementData.type === "FuseExample" && (
            <Typography variant="body2" className="text-gray-500">
              برای نمونه FuseExample، تغییری در اینجا لازم نیست.
            </Typography>
          )}

          <Button variant="contained" color="primary" onClick={handleSave}>
            ذخیره اعلان
          </Button>
        </div>
      </div>

      <div className="px-6 mt-16">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
          اعلان‌های ذخیره‌شده
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockedAnnouncements.map((item) => (
            <div
              key={item.id}
              onClick={() => loadAnnouncement(item)}
              className="
                bg-gray-100 rounded-md shadow p-4 cursor-pointer
                transition-transform transform hover:scale-105 m-6
              "
            >
              <Typography variant="subtitle1" className="font-semibold">
                {item.title}
              </Typography>
              <Typography variant="body2" className="truncate">
                {item.description}
              </Typography>
              <Typography variant="caption" className="text-gray-600 block mt-1">
                نوع: {item.type}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBuilderApp