// MiniappTable.tsx
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/CloudUpload';

function MiniappsTable({ miniapps }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Forced Version</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {miniapps.map(app => (
            <TableRow key={app.id}>
              <TableCell>{app.name}</TableCell>
              <TableCell>{app.version}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell>{app.forcedVersion || 'None'}</TableCell>
              <TableCell>{app.updatedAt}</TableCell>
              <TableCell align="center">
                <IconButton size="small" onClick={() => alert('Edit Miniapp settings')}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => alert('Upload new version')}>
                  <UploadIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MiniappsTable;