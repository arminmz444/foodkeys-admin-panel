import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box,
  Paper,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
// import { useGetSmartTextVariablesQuery } from "../store/templatesApi"

function SmartTextModal({ open, onClose, onAddSmartText, type = "Email" }) {
  const [selectedProperty, setSelectedProperty] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("user")
  const [defaultValue, setDefaultValue] = useState("")
  const [previewText, setPreviewText] = useState("")
  
  // Fetch smart text variables from API (if needed)
  // const { data: smartTextVariablesData, isLoading } = useGetSmartTextVariablesQuery()
  
  // User entity properties
  const userProperties = [
    { key: "user_name", value: "{{user_name}}", description: "نام کاربر" },
    { key: "first_name", value: "{{first_name}}", description: "نام" },
    { key: "last_name", value: "{{last_name}}", description: "نام خانوادگی" },
    { key: "email", value: "{{email}}", description: "ایمیل" },
    { key: "username", value: "{{username}}", description: "نام کاربری" },
    { key: "phone", value: "{{phone}}", description: "تلفن همراه" },
    { key: "id", value: "{{id}}", description: "شناسه" },
    { key: "user_object_id", value: "{{user_object_id}}", description: "شناسه کاربر" },
    { key: "job_position", value: "{{job_position}}", description: "موقعیت شغلی" },
    { key: "profile_incomplete", value: "{{profile_incomplete}}", description: "وضعیت تکمیل پروفایل" },
    { key: "status", value: "{{status}}", description: "وضعیت" },
    { key: "is_active", value: "{{is_active}}", description: "وضعیت فعال بودن" },
    { key: "birth_date", value: "{{birth_date}}", description: "تاریخ تولد" },
    { key: "address", value: "{{address}}", description: "آدرس" },
    { key: "city", value: "{{city}}", description: "شهر" },
    { key: "province", value: "{{province}}", description: "استان" },
    { key: "postal_code", value: "{{postal_code}}", description: "کد پستی" },
    { key: "verified", value: "{{verified}}", description: "تایید شده" },
    { key: "last_login", value: "{{last_login}}", description: "آخرین ورود" },
    { key: "national_code", value: "{{national_code}}", description: "کد ملی" },
    { key: "credit", value: "{{credit}}", description: "اعتبار" }
  ]
  
  // Company entity properties
  const companyProperties = [
    { key: "company_name", value: "{{company_name}}", description: "نام شرکت" },
    { key: "company_name_en", value: "{{company_name_en}}", description: "نام انگلیسی شرکت" },
    { key: "ceo", value: "{{ceo}}", description: "مدیرعامل" },
    { key: "ceo_phone_number", value: "{{ceo_phone_number}}", description: "شماره تماس مدیرعامل" },
    { key: "owner", value: "{{owner}}", description: "مالک" },
    { key: "answer_name", value: "{{answer_name}}", description: "نام پاسخگو" },
    { key: "history", value: "{{history}}", description: "تاریخچه" },
    { key: "description", value: "{{description}}", description: "توضیحات" },
    { key: "advertising_slogan", value: "{{advertising_slogan}}", description: "شعار تبلیغاتی" },
    { key: "company_type", value: "{{company_type}}", description: "نوع شرکت" },
    { key: "employees_count", value: "{{employees_count}}", description: "تعداد کارکنان" },
    { key: "subject_of_activity", value: "{{subject_of_activity}}", description: "موضوع فعالیت" },
    { key: "establish_date", value: "{{establish_date}}", description: "تاریخ تاسیس" },
    { key: "record", value: "{{record}}", description: "شماره ثبت" },
    { key: "stakeholders", value: "{{stakeholders}}", description: "سهامداران" },
    { key: "product_titles", value: "{{product_titles}}", description: "عناوین محصولات" },
    { key: "key_words", value: "{{key_words}}", description: "کلمات کلیدی" },
    { key: "tags", value: "{{tags}}", description: "برچسب‌ها" }
  ]
  
  // System variables
  const systemProperties = type === "Email"
    ? [
        { key: "app_name", value: "{{app_name}}", description: "نام برنامه" },
        { key: "confirmation_url", value: "{{confirmation_url}}", description: "آدرس تایید" },
        { key: "created", value: "{{created}}", description: "تاریخ ایجاد" },
        { key: "otp", value: "{{otp}}", description: "رمز یکبار مصرف" },
      ]
    : [
        { key: "app_name", value: "{{app_name}}", description: "نام برنامه" },
        { key: "otp", value: "{{otp}}", description: "رمز یکبار مصرف" },
        { key: "created", value: "{{created}}", description: "تاریخ ایجاد" },
      ]

  // Update previewText when a property is selected
  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
    setPreviewText(`{{${property}}}`);
  };

  const handleInsert = () => {
    onAddSmartText(selectedProperty, defaultValue);
    // Reset the form state for the next use
    setSelectedProperty("");
    setDefaultValue("");
    setPreviewText("");
  }

  const handleClose = () => {
    // Reset form state on close
    setSelectedProperty("");
    setDefaultValue("");
    setPreviewText("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#4a90e2", color: "white" }}>
        {type === "Email" ? "متن هوشمند برای ایمیل" : "متن هوشمند برای پیامک"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            افزودن متن هوشمند:
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TextField 
              fullWidth 
              value={previewText} 
              variant="outlined" 
              disabled
              placeholder="متغیر انتخاب شده"
              InputProps={{
                sx: { 
                  bgcolor: selectedProperty ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
                  fontWeight: 'bold' 
                }
              }}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleInsert}
              disabled={!selectedProperty}
              sx={{ minWidth: 100 }}
            >
              درج متغیر
            </Button>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "#f0f8ff",
              borderRadius: 1,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>انتخاب دسته‌بندی</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedProperty("");
                    setPreviewText("");
                  }}
                  label="انتخاب دسته‌بندی"
                >
                  <MenuItem value="user">اطلاعات کاربر</MenuItem>
                  <MenuItem value="company">اطلاعات شرکت</MenuItem>
                  <MenuItem value="system">متغیرهای سیستمی</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              {selectedCategory === "user" && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">اطلاعات کاربر</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>ویژگی کاربر</InputLabel>
                      <Select
                        value={selectedProperty}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        label="ویژگی کاربر"
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          <em>-- یک ویژگی انتخاب کنید --</em>
                        </MenuItem>
                        {userProperties.map((prop) => (
                          <MenuItem key={prop.key} value={prop.key}>
                            {prop.description} ({prop.value})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              )}

              {selectedCategory === "company" && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">اطلاعات شرکت</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>ویژگی شرکت</InputLabel>
                      <Select
                        value={selectedProperty}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        label="ویژگی شرکت"
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          <em>-- یک ویژگی انتخاب کنید --</em>
                        </MenuItem>
                        {companyProperties.map((prop) => (
                          <MenuItem key={prop.key} value={prop.key}>
                            {prop.description} ({prop.value})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              )}

              {selectedCategory === "system" && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">متغیرهای سیستمی</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>متغیر سیستمی</InputLabel>
                      <Select
                        value={selectedProperty}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        label="متغیر سیستمی"
                        displayEmpty
                      >
                        <MenuItem disabled value="">
                          <em>-- یک متغیر انتخاب کنید --</em>
                        </MenuItem>
                        {systemProperties.map((prop) => (
                          <MenuItem key={prop.key} value={prop.key}>
                            {prop.description} ({prop.value})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 1 }}>
              مقدار پیش‌فرض (اختیاری)
            </Typography>
            <TextField
              fullWidth
              placeholder="مقدار پیش‌فرض در صورت خالی بودن متغیر"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          انصراف
        </Button>
        <Button 
          onClick={handleInsert} 
          variant="contained" 
          color="primary"
          disabled={!selectedProperty}
        >
          درج
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SmartTextModal