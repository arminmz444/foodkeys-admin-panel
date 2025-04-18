import * as React from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

const Frame = styled('iframe')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  flexGrow: 1,
  height: 400,
  border: 0,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

/**
 * Enhanced MiniAppFrame component for MiniApps
 * Supports both direct src URLs and React content injection
 */
function MiniAppFrame(props) {
  const { children, name, src, ...other } = props;
  const title = `${name || 'MiniApp'} preview`;
  const frameRef = React.useRef(null);
  const [iframeLoaded, onLoad] = React.useReducer(() => true, false);
  const [error, setError] = React.useState(null);

  // Handle iframe load events
  React.useEffect(() => {
    const frameElement = frameRef.current;
    if (!frameElement) return;

    const handleLoad = () => {
      onLoad();
    };

    const handleError = (err) => {
      setError(`Failed to load: ${err.message || 'Unknown error'}`);
    };

    frameElement.addEventListener('load', handleLoad);
    frameElement.addEventListener('error', handleError);

    // When we hydrate the iframe then the load event is already dispatched
    // Check the readyState and "replay" the load event if needed
    const document = frameElement.contentDocument;
    if (document && document.readyState === 'complete' && !iframeLoaded) {
      onLoad();
    }

    return () => {
      frameElement.removeEventListener('load', handleLoad);
      frameElement.removeEventListener('error', handleError);
    };
  }, [iframeLoaded]);

  // Determine if we're using src mode or portal mode
  const useSrcMode = Boolean(src);

  // Handle portal content
  React.useEffect(() => {
    if (useSrcMode || !frameRef.current || !iframeLoaded) return;

    try {
      const document = frameRef.current.contentDocument;
      const head = document.head;
      
      // Add Tailwind CSS
      const tailwindLink = document.createElement('link');
      tailwindLink.rel = 'stylesheet';
      tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      head.appendChild(tailwindLink);

      // Add RTL support
      document.body.setAttribute('dir', 'rtl');
      
      // Add basic styling
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        body {
          margin: 0;
          padding: 16px;
          direction: rtl;
          font-family: "Vazir", "Roboto", "Helvetica", "Arial", sans-serif;
        }
      `;
      head.appendChild(styleElement);

    } catch (err) {
      console.error('Error configuring iframe:', err);
      setError('Failed to configure preview');
    }
  }, [iframeLoaded, useSrcMode]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          bgcolor: 'error.light',
          color: 'error.contrastText',
          p: 2,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
      {!iframeLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            zIndex: 1,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      {useSrcMode ? (
        <Frame
          ref={frameRef}
          title={title}
          src={src}
          onLoad={onLoad}
          {...other}
        />
      ) : (
        <Frame
          ref={frameRef}
          title={title}
          {...other}
        >
          {iframeLoaded && frameRef.current
            ? ReactDOM.createPortal(children, frameRef.current.contentDocument.body)
            : null}
        </Frame>
      )}
    </Box>
  );
}

export default React.memo(MiniAppFrame);