import { Controller, useForm } from 'react-hook-form';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import _ from '@lodash';
import Box from '@mui/material/Box';
import { darken } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteScrumboardBoardListMutation, useUpdateScrumboardBoardListMutation } from '../../ScrumboardApi';
/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

/**
 * The board payments header component.
 */
function BoardListHeader(props) {
	const { boardId, list, cardIds, className, handleProps } = props;
	const [anchorEl, setAnchorEl] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [removeList] = useDeleteScrumboardBoardListMutation();
	const [updateList] = useUpdateScrumboardBoardListMutation();
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: list.title
		},
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields } = formState;
	useEffect(() => {
		if (!formOpen) {
			reset({
				title: list.title
			});
		}
	}, [formOpen, reset, list.title]);
	useEffect(() => {
		if (formOpen && anchorEl) {
			setAnchorEl(null);
		}
	}, [anchorEl, formOpen]);

	function handleMenuClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	function handleOpenForm(ev) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(newData) {
		updateList({ boardId, list: { id: list.id, ...newData } });
		handleCloseForm();
	}

	return (
		<div {...handleProps}>
			<div className={clsx('flex items-center justify-between h-48 sm:h-56 px-12', className)}>
				<div className="flex items-center min-w-0">
					{formOpen ? (
						<ClickAwayListener onClickAway={handleCloseForm}>
							<form
								className="flex w-full"
								onSubmit={handleSubmit(onSubmit)}
							>
								<Controller
									name="title"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											variant="outlined"
											margin="none"
											autoFocus
											size="small"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															type="submit"
															disabled={_.isEmpty(dirtyFields) || !isValid}
															size="large"
														>
															<FuseSvgIcon>heroicons-outline:check</FuseSvgIcon>
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									)}
								/>
							</form>
						</ClickAwayListener>
					) : (
						<Typography
							className="text-14 font-medium cursor-pointer"
							onClick={handleOpenForm}
						>
							{list.title}
						</Typography>
					)}
				</div>
				<div className="flex items-center">
					<Box
						className="flex items-center justify-center min-w-24 h-24 mx-4 text-sm font-semibold leading-24 rounded-full"
						sx={{
							backgroundColor: (theme) =>
								darken(theme.palette.background.default, theme.palette.mode === 'light' ? 0.1 : 0.3),
							color: 'text.secondary'
						}}
					>
						{cardIds.length}
					</Box>
					<IconButton
						aria-haspopup="true"
						onClick={handleMenuClick}
						size="small"
					>
						<FuseSvgIcon size={20}>heroicons-outline:dots-vertical</FuseSvgIcon>
					</IconButton>
					<Menu
						id="actions-menu"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
					>
						<MenuItem
							onClick={() => {
								removeList({
									boardId,
									listId: list.id
								});
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Remove List" />
						</MenuItem>
						<MenuItem onClick={handleOpenForm}>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Rename List" />
						</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	);
}

export default BoardListHeader;
