import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * @param {boolean} open - Controls whether the modal is open or closed
 * @param {function} onClose - Callback fired when user clicks close or outside
 * @param {function} onAccept - Callback fired when user clicks the accept button
 * @param {ReactNode} icon - An optional icon or logo to display at the top (e.g., butterfly)
 * @param {string} title - Title text for the modal
 * @param {string} description - Main description text
 * @param {Array} checkboxes - Array of objects: [{ label: string, checked: boolean, onChange: function }, ...]
 * @param {string} acceptButtonText - Text for the accept/submit button
 */
const AnnouncementModal = ({
  open,
  onClose,
  onAccept,
  icon,
  title,
  description,
  checkboxes = [],
  acceptButtonText = 'I Accept'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className:
          // Tailwind classes for styling the modal container
          'relative rounded-lg p-6 w-full max-w-md ' +
          'bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100'
      }}
      BackdropProps={{
        className: 'bg-black bg-opacity-50 backdrop-blur-sm'
      }}
    >
      {/* Close Button (top-right) */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <CloseIcon />
      </IconButton>

      {/* Modal Content */}
      <DialogTitle
        className="flex flex-col items-center text-center mb-2 border-b border-gray-200 dark:border-gray-700 pb-4"
      >
        {icon && <div className="mb-2">{icon}</div>}

        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent className="space-y-4 pt-4 pb-2">
        <Typography variant="body2" className="leading-relaxed">
          {description}
        </Typography>

        {/* Render checkboxes if provided */}
        {checkboxes.map((item, idx) => (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox
                checked={item.checked}
                onChange={item.onChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" className="text-sm">
                {item.label}
              </Typography>
            }
            className="!items-start" // ensures label text can wrap if long
          />
        ))}
      </DialogContent>

      <DialogActions className="flex justify-center mt-2">
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
          className="px-6 py-2 rounded-md"
        >
          {acceptButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementModal;
