// src/app/components/ServiceFilterDrawer.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Drawer from "@mui/material/Drawer";
import { TextField, Button, MenuItem, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const filterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  subCategoryId: z.string().optional(),
  ranking: z.preprocess((a) => Number(a), z.number().min(0).optional()),
});

function SubCategoryFilterDrawer({ open, onClose, onApplyFilters, subcategoryOptions }) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
      description: "",
      subCategoryId: "",
      ranking: "",
    },
  });

  const onSubmit = (data) => {
    onApplyFilters(data);
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
          <TextField
            select
            fullWidth
            label="زیر شاخه"
            {...register("subCategoryId")}
            variant="outlined"
          >
            <MenuItem value="">-- انتخاب کنید --</MenuItem>
            {subcategoryOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="رتبه (عدد)"
            {...register("ranking")}
            variant="outlined"
            type="number"
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

export default SubCategoryFilterDrawer;
