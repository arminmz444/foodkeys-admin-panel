import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardHeader,
  CardContent,
  Chip
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useCompareArchivesQuery } from './store/archiveApi';
import ReactDiffViewer from 'react-diff-viewer-continued';

function ArchiveCompareDialog({ firstArchiveId, secondArchiveId, onClose, onShowSnackbar }) {
  const { data, isLoading, error } = useCompareArchivesQuery({ 
    archiveId1: firstArchiveId, 
    archiveId2: secondArchiveId 
  });
  
  const [expandedSections, setExpandedSections] = useState({});
  
  // Handle expand/collapse sections
  const handleToggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Initialize expanded sections based on differences
  useEffect(() => {
    if (data?.differences) {
      const initialExpanded = {};
      Object.keys(data.differences).forEach(key => {
        initialExpanded[key] = true;
      });
      setExpandedSections(initialExpanded);
    }
  }, [data]);
  
  // Format values for display
  const formatValue = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };
  
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        مقایسه آرشیوها
      </DialogTitle>
      
      <DialogContent dividers>
        {isLoading ? (
          <Box className="flex justify-center items-center p-32">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" className="text-center p-32">
            خطا در بارگذاری داده‌های مقایسه: {error.message || 'خطای ناشناخته'}
          </Typography>
        ) : (
          <Box>
            {/* Archive info */}
            <Grid container spacing={2} className="mb-24">
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardHeader
                    title="آرشیو اول"
                    subheader={data?.archive1?.name || data?.archive1?.id}
                  />
                  <CardContent>
                    <Box className="flex flex-col gap-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2">شناسه:</Typography>
                        <Typography variant="body2">{data?.archive1?.id || '-'}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">تاریخ ایجاد:</Typography>
                        <Typography variant="body2">{data?.archive1?.createdAt || '-'}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">نوع آرشیو:</Typography>
                        <Chip
                          label={data?.archive1?.archiveType || data?.archive1?.metadata?.archiveType || '-'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardHeader
                    title="آرشیو دوم"
                    subheader={data?.archive2?.name || data?.archive2?.id}
                  />
                  <CardContent>
                    <Box className="flex flex-col gap-2">
                      <Box className="flex justify-between">
                        <Typography variant="body2">شناسه:</Typography>
                        <Typography variant="body2">{data?.archive2?.id || '-'}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">تاریخ ایجاد:</Typography>
                        <Typography variant="body2">{data?.archive2?.createdAt || '-'}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="body2">نوع آرشیو:</Typography>
                        <Chip
                          label={data?.archive2?.archiveType || data?.archive2?.metadata?.archiveType || '-'}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Differences */}
            <Typography variant="h6" className="mb-16">تفاوت‌ها</Typography>
            
            {data?.differences && Object.keys(data?.differences).length > 0 ? (
              Object.entries(data.differences).map(([field, diff]) => (
                <Accordion
                  key={field}
                  expanded={expandedSections[field] || false}
                  onChange={() => handleToggleSection(field)}
                  className="mb-16"
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box className="flex justify-between items-center w-full">
                      <Typography className="font-medium">{field}</Typography>
                      <Box className="flex gap-4 items-center">
                        <Chip
                          label="تغییر یافته"
                          size="small"
                          color="warning"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ReactDiffViewer
                      oldValue={formatValue(diff.old)}
                      newValue={formatValue(diff.new)}
                      splitView={true}
                      leftTitle="آرشیو اول"
                      rightTitle="آرشیو دوم"
                      useDarkTheme={false}
                    />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Paper className="p-16 text-center">
                <Typography>
                  هیچ تفاوتی بین دو آرشیو یافت نشد!
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ArchiveCompareDialog;