import { AddOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function CustomDialog({ buttonText, title, form, setCount }) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setCount(0);
	};
	const handleCloseSave = () => {
		setOpen(false);
	};

	return (
		<>
			<Button
				className="w-full"
				variant="outlined"
				color="success"
				onClick={handleClickOpen}
			>
				{buttonText}
				<AddOutlined />
			</Button>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							{title}
						</Typography>
						<Button
							autoFocus
							variant="contained"
							color="success"
							onClick={handleCloseSave}
						>
							ذخیره کردن
						</Button>
					</Toolbar>
				</AppBar>
				<List>{form}</List>
			</Dialog>
		</>
	);
}

export default CustomDialog;
