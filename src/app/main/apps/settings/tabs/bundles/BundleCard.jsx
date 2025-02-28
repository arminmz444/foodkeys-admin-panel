import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
	Button,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { BiDotsVerticalRounded, BiTimer } from "react-icons/bi";
import Fade from "@mui/material/Fade";
import { ContentCopy } from "@mui/icons-material";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md";

function BundleCard({ title, amount, isActive, updatedAt }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return (
		<Paper className="flex flex-col flex-auto p-16 sm:p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex items-start justify-between">
				<div className="text-lg font-medium tracking-tight leading-6 truncate">
					{title}
				</div>
				{/* <div className="ml-8 -mt-8 -mr-12">
					<IconButton
						aria-label="more"
						id="basic-button"
						aria-controls={open ? "long-menu" : undefined}
						aria-expanded={open ? "true" : undefined}
						aria-haspopup="true"
						onClick={handleClick}
					>
						<FuseSvgIcon size={20}>heroicons-solid:dots-vertical</FuseSvgIcon>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							<MenuItem onClick={handleClose}>ویرایش</MenuItem>
							<MenuItem onClick={handleClose}>حذف</MenuItem>
						</Menu>
					</IconButton>
				</div> */}
				<div>
					<Button
						id="fade-button"
						aria-controls={open ? "fade-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
					>
						<BiDotsVerticalRounded size={30} />
					</Button>
					<Menu
						id="fade-menu"
						MenuListProps={{
							"aria-labelledby": "fade-button",
						}}
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						TransitionComponent={Fade}
					>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<FiEdit2 size={15} />
							</ListItemIcon>
							<ListItemText>ویرایش</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<MdPublishedWithChanges size={15} />
							</ListItemIcon>
							<ListItemText>
								{isActive ? "غیرفعال کردن" : "فعال کردن"}
							</ListItemText>
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
				</div>
			</div>
			<div className="flex justify-between items-center mt-4">
				<div className="flex flex-col">
					<div className="text-2xl sm:text-6xl font-900 tracking-tight leading-tight">
						{numberWithCommas(amount)} <span className="text-xl">تومان</span>
					</div>
					<span className="flex items-center gap-5">
						<BiTimer size={20} />2 ماهه
					</span>
				</div>
				<div
					className={`flex animate-pulse flex-col justify-center text-base sm:text-xl items-center px-12 sm:px-20 sm:ml-32 ml-20 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"} text-white py-3 sm:py-5 font-600`}
				>
					{isActive ? "فعال" : "غیرفعال"}
				</div>
			</div>
		</Paper>
	);
}

export default BundleCard;
