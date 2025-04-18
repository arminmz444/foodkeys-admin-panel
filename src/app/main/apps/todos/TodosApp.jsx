import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { useAppDispatch } from "app/store/hooks";
import TodosModal from "./components/TodosModal";
import React, { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

const defaultTodos = [
  {
    id: 1,
    text: "Conduct user interviews for new dashboard design",
    completed: false,
  },
  {
    id: 2,
    text: "Create wireframes for mobile navigation",
    completed: false,
  },
  {
    id: 3,
    text: "Review accessibility guidelines for forms",
    completed: false,
  },
  {
    id: 4,
    text: "Complete usability testing report",
    completed: true,
  },
  {
    id: 5,
    text: "Update user persona documentation",
    completed: true,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TodosApp() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false)
  
  return (
    <div>
    <Button
				variant="outlined"
				color="error"
				className="items-center text-center"
				onClick={() => setOpen(true)}
			>
				{<AiFillPlusCircle size={20} />}
				{"باز کردن todos"}
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpen(false)}
				aria-describedby="alert-dialog-slide-description"
				fullScreen={false}
			>
				{/* <DialogTitle variant="h5" className="font-800">
					{title}
				</DialogTitle> */}
				<DialogContent>
					<DialogContentText>
						<TodosModal defaultItems={defaultTodos} />
					</DialogContentText>
				</DialogContent>
			</Dialog>

    </div>
  );
}
