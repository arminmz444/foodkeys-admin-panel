import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { useForm } from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai";
import z from "zod";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function SubmitFormModal({ 
    children,
    title = 'فرم ثبت اطلاعات',
    open = false,
    setOpen,
    onClose,
    onSubmit,
    buttonProps = {}, 
    buttonIcon = () => <AiFillPlusCircle size={20} />,
    buttonTitle = 'ثبت',
    buttonVariant = 'outlined',
    buttonColor = 'secondary',
    buttonClassName = 'flex gap-5 place-self-end mb-28',
    cancelButtonTitle = 'لغو',
    submitButtonTitle = 'ثبت',
    cancelButtonProps = {},
    submitButtonProps = {},
    cancelButtonIcon = () => <AiFillPlusCircle size={20} />,
    submitButtonIcon = () => <AiFillPlusCircle size={20} />,
    cancelButtonVariant = 'outlined',
    submitButtonVariant = 'contained',
    cancelButtonColor = 'secondary',
    submitButtonColor = 'primary',
    cancelButtonClassName = 'flex gap-5 place-self-end mb-28',
    submitButtonClassName = 'flex gap-5 place-self-end mb-28',
    modalProps = {}, }) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [value, setValue] = React.useState(null);
	const [duration, setDuration] = React.useState(null);
	const [term, setTerm] = React.useState(null);


    const handleSubmit = (event) => {
        if (onSubmit) onSubmit(event);
        setOpen(false);
      };

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        if (onClose) onClose();
        setOpen(false);
      };

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
	const handleTermChange = (event) => {
		setTerm(event.target.value);
	};
	return (
		<>
			<Button
				variant={buttonVariant}
				color={buttonColor}
				className={buttonClassName}
				onClick={handleOpen}
				{...buttonProps}
			>
				{buttonIcon || <AiFillPlusCircle size={20} />}
				{buttonTitle}
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
				fullScreen={fullScreen}
				{...modalProps}
			>
				{/* <DialogTitle variant="h5" className="font-800">
					{title}
				</DialogTitle> */}
				<DialogContent>
					<DialogContentText>
						{children}
					</DialogContentText>
				</DialogContent>
				{/* <DialogActions>
					<Button onClick={handleClose}>{cancelButtonTitle}</Button>
					<Button variant="contained" color="secondary" onClick={handleSubmit}>
						{submitButtonTitle}
					</Button>
				</DialogActions> */}
			</Dialog>
		</>
	);
}

export default SubmitFormModal;
