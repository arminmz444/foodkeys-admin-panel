// // src/components/ErrorBoundary.js
// import React, { Component } from 'react';
// import { Box, Typography, Paper, Button, Alert } from '@mui/material';
// import { Refresh as RefreshIcon } from '@mui/icons-material';

// class CustomErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       hasError: false,
//       error: null,
//       errorInfo: null
//     };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Log the error to an error reporting service
//     console.error('Error caught by ErrorBoundary:', error, errorInfo);
//     this.setState({ errorInfo });
//   }

//   handleReset = () => {
//     this.setState({ 
//       hasError: false,
//       error: null,
//       errorInfo: null
//     });
//   }

//   render() {
//     const { hasError, error, errorInfo } = this.state;
//     const { children, fallback } = this.props;

//     if (hasError) {
//       // Custom fallback UI or default error message
//       if (fallback) {
//         return fallback;
//       }

//       return (
//         <Paper sx={{ p: 3, m: 2 }}>
//           <Alert severity="error" sx={{ mb: 2 }}>
//             Something went wrong
//           </Alert>
          
//           <Typography variant="h6" gutterBottom>
//             An error occurred in this component
//           </Typography>
          
//           {error && (
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle1" color="error">
//                 {error.toString()}
//               </Typography>
//             </Box>
//           )}
          
//           {process.env.NODE_ENV !== 'production' && errorInfo && (
//             <Box sx={{ mt: 2, mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Component Stack:
//               </Typography>
//               <pre style={{ 
//                 overflow: 'auto', 
//                 padding: '10px', 
//                 backgroundColor: '#f5f5f5',
//                 borderRadius: '4px',
//                 fontSize: '0.875rem'
//               }}>
//                 {errorInfo.componentStack}
//               </pre>
//             </Box>
//           )}
          
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={this.handleReset}
//             startIcon={<RefreshIcon />}
//           >
//             Try Again
//           </Button>
//         </Paper>
//       );
//     }

//     // If no error occurred, render children normally
//     return children;
//   }
// }

// export default CustomErrorBoundary;