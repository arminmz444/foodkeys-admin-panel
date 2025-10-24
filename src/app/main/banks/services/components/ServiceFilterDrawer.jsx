// src/app/components/ServiceFilterDrawer.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Drawer from "@mui/material/Drawer";
import { TextField, Button, MenuItem, IconButton, FormControl, InputLabel, Select, FormHelperText } from "@mui/material";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const filterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  subCategoryId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  ranking: z.union([z.number(), z.null(), z.undefined()]).optional(),
  rankingAll: z.union([z.number(), z.null(), z.undefined()]).optional(),
  keyWords: z.string().optional(),
  tags: z.string().optional(),
  status: z.union([z.number(), z.null(), z.undefined()]).optional(),
  visit: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

// Service status options
const serviceStatusOptions = [
  { value: 0, label: 'در انتظار تایید' },
  { value: 1, label: 'تایید شده' },
  { value: 2, label: 'رد شده' },
  { value: 3, label: 'آرشیو شده' },
  { value: 4, label: 'حذف شده' },
  { value: 5, label: 'ویرایش شده' },
  { value: 6, label: 'منتشر شده' },
  { value: 7, label: 'بازبینی' },
  { value: 8, label: 'ثبت اولیه' }
];

function ServiceFilterDrawer({ open, onClose, onApplyFilters, subcategoryOptions }) {
  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
      description: "",
      subCategoryId: null,
      ranking: null,
      rankingAll: null,
      keyWords: "",
      tags: "",
      status: null,
      visit: null,
    },
  });

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    console.log('Subcategory options:', subcategoryOptions);
    
    // Filter out null/undefined/empty values, but keep 0 for status
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          return false;
        }
        // For status field, 0 is a valid value (در انتظار تایید)
        if (key === 'status') {
          return true;
        }
        // For other numeric fields, exclude 0
        return value !== 0;
      })
    );
    
    console.log('Filtered data:', filteredData);
    onApplyFilters(filteredData);
    onClose();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="w-400 p-4">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6">فیلترها</Typography>
          <IconButton onClick={onClose}>
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField fullWidth label="نام سرویس" {...register("name")} variant="outlined" />
          <TextField fullWidth label="توضیحات" {...register("description")} variant="outlined" />
          <Controller
            name="subCategoryId"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="زیر شاخه"
                {...field}
                variant="outlined"
              >
                <MenuItem value={null}>-- انتخاب کنید --</MenuItem>
                {subcategoryOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="ranking"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="رتبه (عدد)"
                {...field}
                variant="outlined"
                type="number"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          />
          <Controller
            name="rankingAll"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="رتبه کل (عدد)"
                {...field}
                variant="outlined"
                type="number"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          />
          <TextField fullWidth label="کلمات کلیدی" {...register("keyWords")} variant="outlined" />
          <TextField fullWidth label="تگ‌ها" {...register("tags")} variant="outlined" />
          
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>وضعیت</InputLabel>
                <Select
                  {...field}
                  label="وضعیت"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                >
                  <MenuItem value="">-- انتخاب کنید --</MenuItem>
                  {serviceStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          
          <Controller
            name="visit"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="تعداد بازدید"
                {...field}
                variant="outlined"
                type="number"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          />
          <div className="flex items-center justify-between mt-4">
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              پاک کردن
            </Button>
            <Button variant="contained" color="primary" type="submit">
              اعمال فیلترها
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default ServiceFilterDrawer;
