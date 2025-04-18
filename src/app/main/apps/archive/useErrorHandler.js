// useErrorHandler.js
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export function useErrorHandler() {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState(null);
  
  const handleError = (err, fallbackMessage = 'خطای ناشناخته رخ داده است') => {
    const errorMessage = err?.data?.message || err?.message || fallbackMessage;
    setError(errorMessage);
    enqueueSnackbar(errorMessage, { variant: 'error' });
    return errorMessage;
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return { error, handleError, clearError };
}

export default useErrorHandler;