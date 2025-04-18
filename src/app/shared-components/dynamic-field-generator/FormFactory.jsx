import React, { useState } from 'react';
import EnhancedDynamicFormGenerator from './EnhancedDynamicFormGenerator';
import SubmitFormModal from '../custom-modals/SubmitFormModal';
import SubmitFormDrawer from '../custom-drawers/SubmitFormDrawer';
import { z } from 'zod';
import _ from 'lodash';
import FuseMessage from '@fuse/core/FuseMessage';

/**
 * Form Factory - Creates dynamic forms with customizable presentation and layout
 * 
 * @param {Object} props Component properties
 * @param {Object} props.zodSchema Zod schema for validation
 * @param {Object} props.jsonSchema JSON schema for validation
 * @param {String} props.formValidationStruct Schema type ('ZOD_SCHEMA' or 'JSON_SCHEMA')
 * @param {Object} props.defaultValues Default form values
 * @param {String} props.formHeaderTitle Form title
 * @param {String} props.formEngine Form engine to use ('UNIFORMS')
 * @param {String} props.formGenerationType Form generation type ('AUTO' or 'MANUAL')
 * @param {Boolean} props.hideSubmitField Whether to hide the submit button
 * @param {Object} props.formFieldsInputTypes Custom field configurations
 * @param {Function} props.onCreate Form submission handler
 * @param {String} props.presentationType Form presentation type ('MODAL' or 'DRAWER')
 * @param {String} props.buttonLabel Label for the trigger button
 * @param {String} props.dialogTitle Title for the modal/drawer
 * @param {Object} props.layoutConfig Layout configuration for the form
 * @param {Object} props.modalProps Additional props for modal
 * @param {Object} props.drawerProps Additional props for drawer
 * @param {Object} props.customComponents Custom component overrides
 */
function FormFactory({
  // Schema & validation
  zodSchema,
  jsonSchema,
  formValidationStruct = 'ZOD_SCHEMA',
  
  // Form data & configuration
  defaultValues = {},
  formHeaderTitle,
  formEngine = 'UNIFORMS',
  formGenerationType = 'MANUAL',
  hideSubmitField = false,
  formFieldsInputTypes = null,
  
  // Event handlers
  onCreate,
  
  // Presentation options
  presentationType = 'MODAL', // 'MODAL' or 'DRAWER'
  buttonLabel = 'ثبت',
  dialogTitle,
  
  // Layout configuration
  layoutConfig = {
    type: 'single-column',
    spacing: 2,
    containerPadding: 2,
    fieldGap: 2,
  },
  
  // Additional props
  modalProps = {},
  drawerProps = {},
  customComponents = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = async (values) => {
    if (onCreate) {
      const success = await onCreate(_.clone(values));
      if (success) {
        setIsOpen(false);
        FuseMessage.showSuccess('اطلاعات با موفقیت ثبت شد');
        
      }
    }
  };

  // Determine which schema to use
  const schema = formValidationStruct === 'ZOD_SCHEMA' ? zodSchema : jsonSchema;
  
  // Form content for either presentation type
  const formContent = (
    <EnhancedDynamicFormGenerator
      initialData={defaultValues}
      schema={schema}
      formHeaderTitle={formHeaderTitle}
      formValidationStruct={formValidationStruct}
      formFieldsInputTypes={formFieldsInputTypes}
      formGenerationType={formGenerationType}
      hideSubmitField={hideSubmitField}
      onSubmit={handleSubmit}
      setCreateDialogOpen={setIsOpen}
      layoutConfig={layoutConfig}
      customComponents={customComponents}
    />
  );
  return (
    <>
      {presentationType === 'DRAWER' ? (
        <SubmitFormDrawer
          title={dialogTitle || formHeaderTitle}
          open={isOpen}
          setOpen={setIsOpen}
          buttonTitle={buttonLabel}
        {...drawerProps}
        >
        {formContent}
      </SubmitFormDrawer>
    ) : (
      <SubmitFormModal
        title={dialogTitle || formHeaderTitle}
        open={isOpen}
        setOpen={setIsOpen}
        onSubmit={handleSubmit}
        buttonTitle={buttonLabel}
        {...modalProps}
      >
        {formContent}
      </SubmitFormModal>
    )}
    </>
  );
}


export default FormFactory;