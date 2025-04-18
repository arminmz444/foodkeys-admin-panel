import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Drawer, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Slide,
  IconButton,
  Button,
  Typography,
  Box,
  Paper,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DynamicFormGenerator from "app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx";

// Transition for dialogs
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Check if vaul dependency is available
let VaulDrawer = null;
try {
  // Dynamically import vaul if available
  VaulDrawer = require('@vaul/react').Drawer;
} catch (error) {
  // Vaul package is not available, will use MUI Drawer instead
  console.info("Vaul package not available, using MUI Drawer");
}

/**
 * GenericDrawer Component - A highly configurable drawer/modal component
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Type of container: 'drawer', 'modal', 'vaul' (if available)
 * @param {string} props.position - Position for drawer: 'left', 'right', 'top', 'bottom'
 * @param {string} props.size - Size: 'xs', 'sm', 'md', 'lg', 'xl', or a custom width value
 * @param {boolean} props.open - Whether the drawer/modal is open
 * @param {function} props.onClose - Function to call when closing
 * @param {string} props.title - Title to show in the header
 * @param {boolean} props.fullScreen - Whether modal should be fullscreen
 * @param {Object} props.schema - Zod schema or JSON schema for form validation
 * @param {string} props.schemaType - Type of schema: 'zod' or 'json'
 * @param {Object} props.defaultValues - Default values for the form
 * @param {function} props.onSubmit - Function to call when form is submitted
 * @param {boolean} props.hideSubmitButton - Whether to hide the submit button
 * @param {Object} props.formConfig - Additional form configuration
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {boolean} props.disableBackdropClick - Whether to disable closing on backdrop click
 * @param {boolean} props.disableEscapeKeyDown - Whether to disable closing on Escape key
 * @param {string} props.submitButtonText - Text for the submit button
 * @param {string} props.cancelButtonText - Text for the cancel button
 * @param {Object} props.customActions - Custom action buttons configuration
 * @param {Object} props.contentProps - Props for the content section
 * @param {Object} props.headerProps - Props for the header section
 * @param {Object} props.footerProps - Props for the footer section
 * @param {boolean} props.nestedMode - Whether this drawer can contain nested drawers
 * @param {function} props.beforeSubmit - Function to call before submission
 * @param {function} props.afterSubmit - Function to call after submission
 * @param {Object} props.styles - Custom styles for each part of the drawer
 * @param {string} props.formEngine - Form engine to use: 'react-hook-form', 'uniforms', 'default'
 * @param {Object} props.formFieldsInputTypes - Input types configuration for form fields
 */
const GenericDrawer = forwardRef((props, ref) => {
  const {
    type = 'drawer',
    position = 'right',
    size = 'md',
    open = false,
    onClose,
    title = '',
    fullScreen = false,
    schema = null,
    schemaType = 'zod',
    defaultValues = {},
    onSubmit,
    hideSubmitButton = false,
    formConfig = {},
    children,
    isLoading = false,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    submitButtonText = 'ثبت',
    cancelButtonText = 'انصراف',
    customActions = null,
    contentProps = {},
    headerProps = {},
    footerProps = {},
    nestedMode = false,
    beforeSubmit = null,
    afterSubmit = null,
    styles = {},
    formEngine = 'default',
    formFieldsInputTypes = {},
    formValidationStruct = schemaType === 'zod' ? 'ZOD_SCHEMA' : 'JSON_SCHEMA',
    formGenerationType = 'AUTO',
    loadConfig = null,
    loadConfigStrat = 'MANUAL',
    entityName = 'Entity',
    dataSourceName = 'MAIN_PG_CLUSTER',
    cachingDataSourceName = 'MAIN_REDIS_CLUSTER',
    searchingDataSourceName = 'MAIN_PG_CLUSTER',
    entityDiscoveryName = '',
    entityDiscoveryMethod = 'SIMPLE',
    depthLevel = 1,
    columnList = ['id', 'name'],
    initialFilterState = {
      defaultSorting: [{column: "id", direction: "ASC"}],
      defaultFilters: [],
      defaultGlobalFilter: "",
      defaultPagination: { pageNumber: 1, pageSize: 10 }
    }
});

export default GenericDrawer;,
    showNullValues = true,
    renderingComponent = 'MRT',
    renderingComponentFeatures = 'VIEW',
  } = props;
  
  const theme = useTheme();
  const fullScreenMedia = useMediaQuery(theme.breakpoints.down('md'));
  const [dynamicConfig, setDynamicConfig] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nestedDrawer, setNestedDrawer] = useState({ open: false, props: {} });
  
  // Size mapping for drawers and modals
  const sizeMap = {
    xs: { drawer: 250, dialog: 'xs' },
    sm: { drawer: 350, dialog: 'sm' },
    md: { drawer: 450, dialog: 'md' },
    lg: { drawer: 650, dialog: 'lg' },
    xl: { drawer: 850, dialog: 'xl' },
  };
  
  // Get actual size value based on type and size prop
  const getSize = () => {
    if (typeof size === 'number' || size.endsWith('px') || size.endsWith('%')) {
      return size;
    }
    return type === 'drawer' ? sizeMap[size]?.drawer : sizeMap[size]?.dialog;
  };
  
  // Setup form if schema is provided
  const form = useForm({
    resolver: schema && schemaType === 'zod' ? zodResolver(schema) : undefined,
    defaultValues: defaultValues || {},
    ...formConfig,
  });
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    reset: () => form.reset(defaultValues),
    setValue: (name, value) => form.setValue(name, value),
    setValues: (values) => {
      Object.entries(values).forEach(([key, value]) => {
        form.setValue(key, value);
      });
    },
    getValues: () => form.getValues(),
    openNestedDrawer: (nestedProps) => {
      setNestedDrawer({ open: true, props: nestedProps });
    },
    closeNestedDrawer: () => {
      setNestedDrawer({ open: false, props: {} });
    },
    submit: () => form.handleSubmit(handleFormSubmit)(),
    form
  }));
  
  // Load dynamic configuration if needed
  useEffect(() => {
    const fetchConfig = async () => {
      if (loadConfigStrat === 'AUTO' || (loadConfigStrat === 'MANUAL' && loadConfig)) {
        try {
          let config;
          
          if (loadConfigStrat === 'AUTO') {
            // Make API call to load configuration based on entity name
            const response = await fetch(`/data-source/${dataSourceName}/${entityName}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                entityName,
                entityDiscoveryName: entityDiscoveryName || entityName,
                entityDiscoveryMethod,
                depthLevel,
                columnList,
                initialState: initialFilterState,
                showNullValues,
                renderingComponent,
                renderingComponentFeatures,
                dataSourceName,
                cachingDataSourceName,
                searchingDataSourceName,
              }),
            });
            
            config = await response.json();
          } else if (loadConfig) {
            // Use provided loadConfig function
            config = await loadConfig();
          }
          
          if (config) {
            setDynamicConfig(config);
            
            // Update form default values if they exist in the config
            if (config.defaultValues) {
              form.reset(config.defaultValues);
            }
            
            // Update schema if it exists in the config
            if (config.schema) {
              // Here you would need to handle updating the schema
              // This would depend on how your form library handles schema changes
            }
          }
        } catch (error) {
          console.error('Failed to load configuration:', error);
        }
      }
    };
    
    if (open) {
      fetchConfig();
    }
  }, [open, loadConfigStrat, loadConfig, entityName, dataSourceName]);
  
  // Handle form submission
  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Call beforeSubmit hook if provided
      if (beforeSubmit) {
        const shouldContinue = await beforeSubmit(data);
        if (shouldContinue === false) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Call onSubmit function with form data
      const result = await onSubmit(data);
      
      // Call afterSubmit hook if provided
      if (afterSubmit) {
        await afterSubmit(result, data);
      }
      
      // Reset form and close drawer if submission was successful
      if (result !== false) {
        form.reset(defaultValues);
        onClose && onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle close with confirmation if form is dirty
  const handleClose = () => {
    if (form.formState.isDirty) {
      // Here you could add a confirmation dialog
      // For now, just closing without confirmation
      form.reset(defaultValues);
    }
    onClose && onClose();
  };
  
  // Create content for drawer/dialog
  const content = (
    <div className="flex flex-col h-full" style={styles.root}>
      {/* Header */}
      <div className="flex items-center justify-between px-24 py-16 border-b" style={styles.header} {...headerProps}>
        <Typography variant="h6">{dynamicConfig?.title || title}</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-24" style={styles.content} {...contentProps}>
        {schema || dynamicConfig?.schema ? (
          formEngine === 'uniforms' ? (
            <DynamicFormGenerator
              initialData={defaultValues}
              onSubmit={handleFormSubmit}
              formHeaderTitle={title}
              schema={schema || dynamicConfig?.schema}
              formValidationStruct={formValidationStruct}
              formFieldsInputTypes={formFieldsInputTypes}
              formGenerationType={formGenerationType}
              hideSubmitField={true} // We'll handle submission in the footer
              isSubmitting={isSubmitting}
            />
          ) : (
            <form id="generic-drawer-form" onSubmit={form.handleSubmit(handleFormSubmit)}>
              {children || (
                <Box className="space-y-16">
                  {/* Form fields would be generated here based on schema */}
                  {Object.entries(formFieldsInputTypes).map(([key, cfg], idx) => (
                    <Box key={key + idx} className={cfg.classes || ""} sx={cfg.styles || {}}>
                      {typeof cfg.renderCustomInput === "function"
                        ? cfg.renderCustomInput(key, cfg, form)
                        : `Field ${key} - Configure formFieldsInputTypes to customize`}
                    </Box>
                  ))}
                </Box>
              )}
            </form>
          )
        ) : (
          // If no schema is provided, just render children
          children
        )}
      </div>
      
      {/* Footer */}
      {!hideSubmitButton && (
        <div className="flex items-center justify-end px-24 py-16 border-t" style={styles.footer} {...footerProps}>
          {customActions || (
            <>
              <Button 
                onClick={handleClose} 
                className="mr-16" 
                disabled={isSubmitting}
              >
                {cancelButtonText}
              </Button>
              <Button 
                onClick={form.handleSubmit(handleFormSubmit)} 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
              >
                {submitButtonText}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
  
  // Render appropriate container based on type
  if (type === 'modal') {
    return (
      <Dialog
        open={open}
        onClose={disableBackdropClick ? undefined : handleClose}
        TransitionComponent={Transition}
        fullScreen={fullScreen || fullScreenMedia}
        fullWidth
        maxWidth={getSize()}
        disableEscapeKeyDown={disableEscapeKeyDown}
        {...(styles.dialog || {})}
      >
        {content}
        
        {/* Nested drawer/modal */}
        {nestedMode && nestedDrawer.open && (
          <GenericDrawer
            {...nestedDrawer.props}
            open={nestedDrawer.open}
            onClose={() => setNestedDrawer({ open: false, props: {} })}
            nestedMode={true}
          />
        )}
      </Dialog>
    );
  } else if (type === 'vaul' && VaulDrawer) {
    // Use Vaul drawer if available and requested
    return (
      <VaulDrawer.Root
        open={open}
        onClose={handleClose}
        direction={position}
        dismissible={!disableBackdropClick}
      >
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
          <VaulDrawer.Content
            className="bg-white flex flex-col rounded-t-[10px] h-full max-h-[96vh] mt-24 fixed bottom-0"
            style={{
              [position === 'left' ? 'left' : 'right']: 0,
              width: getSize(),
              ...styles.vaulContent
            }}
          >
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8 mt-4" />
            {content}
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
        
        {/* Nested drawer */}
        {nestedMode && nestedDrawer.open && (
          <GenericDrawer
            {...nestedDrawer.props}
            open={nestedDrawer.open}
            onClose={() => setNestedDrawer({ open: false, props: {} })}
            nestedMode={true}
          />
        )}
      </VaulDrawer.Root>
    );
  } else {
    // Default to MUI Drawer
    return (
      <Drawer
        anchor={position}
        open={open}
        onClose={disableBackdropClick ? undefined : handleClose}
        PaperProps={{
          style: {
            width: getSize(),
            ...styles.drawerPaper
          }
        }}
      >
        <Paper elevation={0} className="flex flex-col h-full">
          {content}
        </Paper>
        
        {/* Nested drawer */}
        {nestedMode && nestedDrawer.open && (
          <GenericDrawer
            {...nestedDrawer.props}
            open={nestedDrawer.open}
            onClose={() => setNestedDrawer({ open: false, props: {} })}
            nestedMode={true}
          />
        )}
      </Drawer>
    );
  }