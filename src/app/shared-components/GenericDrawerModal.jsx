// GenericDrawerModal.tsx
import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Drawer,
	Button,
	Typography
} from '@mui/material';

import DynamicFormGenerator from 'app/shared-components/dynamic-field-generator/DynamicFormGenerator';

export type DrawerModalType = 'drawer' | 'modal';

interface GenericDrawerModalProps {
	open: boolean;
	onClose: () => void;

	// 'drawer' or 'modal'
	variant?: DrawerModalType;

	title?: string;
	zodSchema?: any; // If using zod
	jsonSchema?: any; // If using JSON schema
	formEngine?: 'UNIFORMS' | 'DEFAULT';
	initialValues?: any;
	hideSubmitButton?: boolean;
	// Optional callback when user submits the form
	onSubmit?: (values: any) => void;

	// If you need a place for advanced filter logic, pass down props
	// filterConfig?: ...
	// onFilterChange?: ...
}

const GenericDrawerModal: React.FC<GenericDrawerModalProps> = (props) => {
	const {
		open,
		onClose,
		variant = 'drawer',
		title = 'Form',
		zodSchema,
		jsonSchema,
		formEngine = 'UNIFORMS',
		initialValues,
		hideSubmitButton = false,
		onSubmit
	} = props;

	// "Unified" form submission
	const handleFormSubmit = async (formData: any) => {
		if (onSubmit) {
			await onSubmit(formData);
		}
		onClose();
	};

	// If variant === 'modal', render as <Dialog>, else as <Drawer>.
	if (variant === 'modal') {
		return (
			<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					{formEngine === 'UNIFORMS' ? (
						<DynamicFormGenerator
							schema={zodSchema || jsonSchema}
							formValidationStruct={zodSchema ? 'ZOD_SCHEMA' : 'JSON_SCHEMA'}
							formHeaderTitle={title}
							initialData={initialValues || {}}
							onSubmit={handleFormSubmit}
							hideSubmitField={hideSubmitButton}
							setCreateDialogOpen={onClose}
						/>
					) : (
						<Typography>Default form engine not yet implemented.</Typography>
					)}
				</DialogContent>
				{!hideSubmitButton && (
					<DialogActions>
						<Button variant="outlined" onClick={onClose}>
							انصراف
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								// If using uniforms, the <DynamicFormGenerator> has its own
								// internal submit. You can expose an “externalRef” or
								// “submitRef” if you want to trigger it from outside.
								// Alternatively, show/hide the button inside <DynamicFormGenerator>.
							}}
						>
							ثبت
						</Button>
					</DialogActions>
				)}
			</Dialog>
		);
	}

	// Otherwise, Drawer mode:
	return (
		<Drawer open={open} onClose={onClose} anchor="right">
			<div style={{ width: 'min(90vw, 480px)', padding: '16px' }}>
				<Typography variant="h6" gutterBottom>
					{title}
				</Typography>
				{formEngine === 'UNIFORMS' ? (
					<DynamicFormGenerator
						schema={zodSchema || jsonSchema}
						formValidationStruct={zodSchema ? 'ZOD_SCHEMA' : 'JSON_SCHEMA'}
						formHeaderTitle={title}
						initialData={initialValues || {}}
						onSubmit={handleFormSubmit}
						hideSubmitField={hideSubmitButton}
						setCreateDialogOpen={onClose}
					/>
				) : (
					<Typography>Default form engine not yet implemented.</Typography>
				)}
				{!hideSubmitButton && (
					<div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
						<Button variant="outlined" onClick={onClose} style={{ marginRight: '8px' }}>
							انصراف
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								// same note about form submission if using uniforms
							}}
						>
							ثبت
						</Button>
					</div>
				)}
			</div>
		</Drawer>
	);
};

export default GenericDrawerModal;
