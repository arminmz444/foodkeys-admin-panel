import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  InputAdornment,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { CiTextAlignJustify } from "react-icons/ci";
import { GrMoney } from "react-icons/gr";
import { IoMdAddCircle } from "react-icons/io";
import { MdOutlineTitle } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import z from "zod";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { formatISO } from "date-fns/formatISO";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const defaultValues = ({ id }) => {
  return {
    title: "",
    price: "",
    name: "",
    username: "",
    company: "",
    about: "",
    start: formatISO(new Date()),
    end: formatISO(new Date()),
    email: "",
    phone: "",
    country: "",
    language: "",
    description: "",
    color: "",
    isButtonRequired: "",
    buttonName: "",
    buttonLink: "",
    images: [],
  };
};
const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("توضیحات الزامی می‌باشد."),
  title: z.string().nonempty("عنوان الزامی می‌باشد."),
  price: z.string().nonempty("مبلغ الزامی می‌باشد."),
  color: z.string().nonempty("انتخاب رنگ پس زمینه الزامی می‌باشد."),
  start: z.string().nonempty("تاریخ شروع الزامیست."),
  end: z.string().nonempty("تاریخ پایان الزامیست."),
  bank: z.string().nonempty("انتخاب بانک الزامیست."),
  username: z.string().nonempty("Username is required"),
  company: z.string().nonempty("Company is required"),
  about: z.string().nonempty("About is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  phone: z.string().nonempty("Phone is required"),
  country: z.string().nonempty("Country is required"),
  language: z.string().nonempty("Language is required"),
});

const users = [
  { name: "امیرحسین نوری", phone: "09124631193" },
  { name: "آرمین مظفری", phone: "09144226139" },
];

function AddDiscount({ id, open, setOpen, handleClose, handleClickOpen }) {
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  React.useEffect(async () => {
    const fetchDiscount = async () => {
      setLoading(true);
      // axios.get('/bundle/')
      setLoading(false);
    };
    if (id) fetchDiscount();
  }, [id]);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [bundle, setBundle] = React.useState(null);
  const [term, setTerm] = React.useState(null);
  const { control, watch, reset, handleSubmit, formState } = useForm({
    defaultValues,
    mode: "all",
    resolver: zodResolver(schema),
  });

  const start = watch("start");
  const end = watch("end");
  const { isValid, dirtyFields, errors } = formState;

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const [isActive, setActive] = React.useState("فعال");

  const handleActiveChange = (event) => {
    setActive(event.target.value);
  };
  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };
  const handleBundleChange = (event) => {
    setBundle(event.target.value);
  };
  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className="w-1/2 sm:w-1/4 flex items-center gap-5 group text-sm sm:text-base"
        onClick={handleClickOpen}
      >
        تخفیف جدید
        <IoMdAddCircle
          size={20}
          className="group-hover:scale-110 transition-all group-active:scale-90"
        />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullScreen={fullScreen}
      >
        <DialogTitle variant="h5" className="font-800">
          مشخصات تخفیف جدید
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className="w-auto max-w-4xl"
            id="alert-dialog-slide-description"
          >
            <form className="w-full">
              <div className="flex flex-col gap-20 w-512 mt-10">
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="عنوان"
                      placeholder="عنوان تخفیف را بنویسید"
                      id="title"
                      error={!!errors.title}
                      helperText={errors?.title?.message}
                      variant="outlined"
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MdOutlineTitle size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <NumericFormat
                      id="price"
                      value={value}
                      onChange={handleChange}
                      customInput={TextField}
                      thousandSeparator
                      valueIsNumericString
                      suffix="تومان"
                      variant="outlined"
                      label="مبلغ"
                      required
                      placeholder="مبلغ تخفیف را بنویسید"
                      helperText={errors?.price?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GrMoney size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <div className="flex flex-column sm:flex-row w-full items-center gap-16">
                  <Controller
                    name="start"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        className="mt-8 mb-16 w-full"
                        value={new Date(value)}
                        onChange={(val) => {
                          onChange(val.toISOString());
                        }}
                        helperText={errors?.start?.message}
                        slotProps={{
                          textField: {
                            label: "تاریخ شروع",
                            variant: "outlined",
                          },
                        }}
                        maxDate={new Date(end)}
                      />
                    )}
                  />

                  <Controller
                    name="end"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        className="mt-8 mb-16 w-full"
                        value={new Date(value)}
                        onChange={(val) => {
                          onChange(val.toISOString());
                        }}
                        helperText={errors?.end?.message}
                        slotProps={{
                          textField: {
                            label: "تاریخ پایان",
                            variant: "outlined",
                          },
                        }}
                        minDate={new Date(start)}
                      />
                    )}
                  />
                </div>

                <div className="flex justify-center items-center w-full">
                  <Controller
                    control={control}
                    name="bank"
                    render={({ field }) => (
                      <FormControl
                        className="w-full"
                        sx={{ m: 1, minWidth: 80 }}
                      >
                        <InputLabel htmlFor="bank">
                          بانک مورد نظر را انتخاب کنید
                        </InputLabel>
                        <Select
                          id="bank"
                          value={duration}
                          onChange={handleDurationChange}
                          variant="outlined"
                          label="بانک مورد نظر را انتخاب کنید"
                          placeholder="بانک مورد نظر را انتخاب کنید"
                          helperText={errors?.bank?.message}
                        >
                          <ListSubheader>
                            بانک اطلاعات صنایع غذایی
                          </ListSubheader>
                          <MenuItem value={1}>تولیدکنندگان</MenuItem>
                          <MenuItem value={2}>ماشین آلات</MenuItem>
                          <MenuItem value={2}>همه بانک ها</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller
                    control={control}
                    name="bundle"
                    render={({ field }) => (
                      <FormControl
                        className="w-full"
                        sx={{ m: 1, minWidth: 80 }}
                      >
                        <InputLabel htmlFor="bundle">
                          پلن مورد نظر را انتخاب کنید
                        </InputLabel>
                        <Select
                          id="bundle"
                          value={bundle}
                          onChange={handleBundleChange}
                          variant="outlined"
                          label="پلن مورد نظر را انتخاب کنید"
                          placeholder="پلن مورد نظر را انتخاب کنید"
                        >
                          <MenuItem value={1}>پلن استاندارد</MenuItem>
                          <MenuItem value={2}>پلن پیشرفته</MenuItem>
                          <MenuItem value={3}>همه</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <Autocomplete
                  multiple
                  id="users"
                  options={users}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[{ name: "همه", phone: "" }]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="کاربران"
                      placeholder="کابران مورد نظر را انتخاب کنید"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextField
                      id="description"
                      label="توضیحات"
                      multiline
                      minRows={3}
                      helperText={errors?.description?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CiTextAlignJustify size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Typography>
                  زمان ایجاد و زمان بروزرسانی در ویرایش ذکر شود.
                </Typography>
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>لغو</Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddDiscount;
