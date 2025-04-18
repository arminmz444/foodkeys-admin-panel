import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AiFillPlusCircle } from 'react-icons/ai';

/**
 * Customizable Drawer component for form presentation
 * 
 * @param {Object} props Component properties
 * @param {React.ReactNode} props.children Content to display inside drawer
 * @param {string} props.title Drawer title
 * @param {boolean} props.open Whether drawer is open
 * @param {function} props.setOpen Function to update open state
 * @param {function} props.onClose Function called when drawer is closed
 * @param {string} props.anchor Drawer position ('left', 'right', 'top', 'bottom')
 * @param {Object} props.buttonProps Props for trigger button
 * @param {function} props.buttonIcon Function to render button icon
 * @param {string} props.buttonTitle Button label
 * @param {string} props.buttonVariant Button variant ('text', 'outlined', 'contained')
 * @param {string} props.buttonColor Button color ('primary', 'secondary', etc.)
 * @param {string} props.buttonClassName CSS classes for button
 * @param {Object} props.drawerProps Additional props for Drawer component
 */
function SubmitFormDrawer({
  children,
  title = 'فرم ثبت اطلاعات',
  open = false,
  setOpen,
  onClose,
  anchor = 'right',
  buttonProps = {}, 
  buttonIcon = () => <AiFillPlusCircle size={20} />,
  buttonTitle = 'ثبت',
  buttonVariant = 'outlined',
  buttonColor = 'secondary',
  buttonClassName = 'flex gap-5 place-self-end mb-28',
  drawerProps = {},
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const getDrawerWidth = () => {
    if (anchor === 'left' || anchor === 'right') {
      return isMobile ? '100%' : '450px';
    }
    return '100%';
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false);
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
        {buttonIcon()}
        {buttonTitle}
      </Button>
      
      <Drawer
        anchor={anchor}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: getDrawerWidth(),
            boxSizing: 'border-box',
            paddingBottom: 2
          },
        }}
        {...drawerProps}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <IconButton onClick={handleClose} aria-label="بستن">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
          {children}
        </Box>
      </Drawer>
    </>
  );
}

export default SubmitFormDrawer;