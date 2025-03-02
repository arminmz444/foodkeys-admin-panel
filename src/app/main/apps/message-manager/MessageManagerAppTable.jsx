/* -----------------------------------------
 * MessageTable.tsx
 * -----------------------------------------
 */
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

function MessageTable({ messages }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Medium</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Recipients</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Created By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>{msg.medium}</TableCell>
              <TableCell>{msg.content}</TableCell>
              <TableCell>{msg.recipients}</TableCell>
              <TableCell>{msg.status}</TableCell>
              <TableCell>{msg.createdAt}</TableCell>
              <TableCell>{msg.createdBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MessageTable;