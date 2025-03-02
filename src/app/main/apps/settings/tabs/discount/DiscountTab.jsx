import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { BiSolidDiscount } from "react-icons/bi";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FiCopy } from "react-icons/fi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Alert from "@mui/material/Alert";
import { ListItemIcon } from "@material-ui/core";
import { Menu } from "@mui/material";
import { BiDotsVerticalRounded, BiTimer } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import {
  MdDeleteForever,
  MdEdit,
  MdPublishedWithChanges,
} from "react-icons/md";
import Fade from "@mui/material/Fade";
import { IoMdAddCircle } from "react-icons/io";
import AddDiscount from "./AddDiscount";
import { useDispatch } from "react-redux";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/fuseDialogSlice.js";

const discountList = [
  {
    title: "تخفیف برای عید قربان",
    discountCode: "#1jki298j28",
    isActive: true,
    startDate: "1403/02/01",
    endDate: "1403/03/01",
    amount: 500000,
  },
  {
    title: "تخفیف برای عید فطر",
    discountCode: "#1jki287j28",
    isActive: false,
    startDate: "1403/02/01",
    endDate: "1403/03/01",
    amount: 100000,
  },
  {
    title: "تخفیف برای عید غدیر",
    discountCode: "#1jyu287j28",
    isActive: false,
    startDate: "1403/02/01",
    endDate: "1403/03/01",
    amount: 200000,
  },
  {
    title: "تخفیف برای عید غدیر",
    discountCode: "#1nyu287j28",
    isActive: true,
    startDate: "1403/02/01",
    endDate: "1403/03/01",
    amount: 200000,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DiscountTab() {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [isCopied, setCopied] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [isOpen, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-center gap-10 mb-24">
        <TextField
          className="w-full"
          label="جستجو"
          placeholder="تخفیف مورد نظر را جستجو کنید"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
              </InputAdornment>
            ),
          }}
        />
        <AddDiscount open={open} setOpen={setOpen} handleClickOpen={handleClickOpen} />
      </div>
      <Divider />
      {discountList?.length === 0 && (
        <Typography className="text-center my-32" color="textSecondary">
          تخفیفی یافت نشد.
        </Typography>
      )}
      <List>
        {discountList?.map((discount) => (
          <ListItem
            divider
            key={discount.discountCode}
            disablePadding
            className="py-12 flex flex-col items-start sm:items-center  sm:flex-row space-y-16 sm:space-y-0"
          >
            <div className="flex flex-1 items-center">
              <span
                className={`w-10 h-10 ml-5 rounded-full ${discount.isActive ? "bg-green-500" : "bg-red-400"} animate-pulse`}
              />
              <ListItemAvatar>
                <BiSolidDiscount size={30} />
                {/* <Avatar src={discount.avatar} alt={`Avatar °${member.name}`} /> */}
              </ListItemAvatar>
              <div>
                <Typography>{discount.title}</Typography>
                <span className="flex items-center gap-5">
                  <Typography color="GrayText">
                    {discount.discountCode}
                  </Typography>
                  <div>
                    <CopyToClipboard
                      onCopy={() => setCopied(discount.discountCode)}
                      text={discount.discountCode}
                    >
                      <FiCopy />
                    </CopyToClipboard>

                    {/* {isCopied ? (
											<Alert
												variant="outlined"
												severity="success"
												className="absolute top-0"
											>
												This is an outlined success Alert.
											</Alert>
										) : null} */}
                  </div>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button size="small" onClick={() => setOpen(true)}>
                <MdEdit size={20} />
              </Button>
              {/* <div>
								<Button
									id="fade-button"
									aria-controls={open ? "fade-menu" : undefined}
									aria-haspopup="true"
									aria-expanded={open ? "true" : undefined}
									onClick={handleMenuOpen}
									size="small"
								>
									<BiDotsVerticalRounded size={20} />
								</Button>
								<Menu
									id="fade-menu"
									MenuListProps={{
										"aria-labelledby": "fade-button",
									}}
									anchorEl={anchorEl}
									open={open}
									onClose={handleMenuClose}
									TransitionComponent={Fade}
								>
									<MenuItem onClick={handleMenuClose}>
										<ListItemIcon>
											<FiEdit2 size={15} />
										</ListItemIcon>
										<ListItemText>ویرایش</ListItemText>
									</MenuItem>

									<MenuItem
										onClick={handleClose}
										className="bg-red-300 hover:bg-red-200 transition-all"
									>
										{" "}
										<ListItemIcon>
											<MdDeleteForever color="white" size={20} />
										</ListItemIcon>
										<ListItemText className="text-white">حذف</ListItemText>
									</MenuItem>
								</Menu>
							</div> */}
              <IconButton
                color="error"
                onClick={() =>
                  dispatch(
                    openDialog({
                      children: (
                        <>
                          <DialogTitle>حذف</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              آیا از حذف این ردیف مطمئن هستید؟
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => dispatch(closeDialog())}>
                              لغو
                            </Button>
                            <Button
                              onClick={() => {
                                dispatch(closeDialog());
                              }}
                              color="error"
                              variant="contained"
                            >
                              حذف
                            </Button>
                          </DialogActions>
                        </>
                      ),
                    })
                  )
                }
              >
                <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
              </IconButton>
              {/* <Dialog
								open={isOpen}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleClose}
								aria-describedby="alert-dialog-slide-description"
								fullScreen={fullScreen}
							>
								<DialogTitle variant="h5" className="font-800">
									حذف شود؟{" "}
								</DialogTitle>

								<DialogActions>
									<Button onClick={handleClose}>خیر</Button>
									<Button
										variant="contained"
										color="error"
										onClick={handleClose}
									>
										بله
									</Button>
								</DialogActions>
							</Dialog> */}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default DiscountTab;
