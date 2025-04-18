import { 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert
  } from '@mui/material';
  
  function ArchiveMetadata({ archive }) {
    if (!archive) {
      return (
        <Alert severity="warning">
          اطلاعات آرشیو در دسترس نیست.
        </Alert>
      );
    }
    
    const hasMetadata = archive.metadata && Object.keys(archive.metadata).length > 0;
    
    if (!hasMetadata) {
      return (
        <Alert severity="info">
          این آرشیو متادیتای اضافی ندارد.
        </Alert>
      );
    }
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>کلید</TableCell>
              <TableCell>مقدار</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(archive.metadata).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  export default ArchiveMetadata;