import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Button,
  Typography,
  Chip,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Select,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import { X } from 'lucide-react';

// interface ApprovalStep {
//   taskNode: string;
//   status: 'Submitted' | 'Approved' | 'Pending';
//   user: string;
//   timestamp: string;
//   comment?: string;
// }

// interface OrderItem {
//   id: number;
//   product: string;
//   quantity: number;
//   price: number;
// }

// interface ApprovalDetails {
//   company: string;
//   contact: string;
//   orderItems: OrderItem[];
//   subtotal: number;
//   discount: number;
//   tax: number;
//   adjustment: number;
//   grandTotal: number;
//   contracts: string[];
// }

const mockApprovalProcess = [
  {
    taskNode: 'Apply',
    status: 'Submitted',
    user: 'Example salesperson',
    timestamp: '2024-04-13 15:56:06'
  },
  {
    taskNode: 'Approved by Department owner & Super admin',
    status: 'Approved',
    user: 'Example sales manager',
    timestamp: '2025-02-13 21:32:53',
    comment: 'Good job!'
  },
  {
    taskNode: 'Final Approval',
    status: 'Pending',
    user: 'Super Admin',
    timestamp: '-'
  }
];

const mockApprovalDetails = {
  company: 'Leuschke-Ebert',
  contact: 'Adrienne Koelpin',
  orderItems: [
    { id: 1, product: 'Business license', quantity: 1, price: 15299 },
    { id: 2, product: 'P5+ plugin package', quantity: 1, price: 4999 }
  ],
  subtotal: 20298.00,
  discount: 100,
  tax: 0,
  adjustment: 0,
  grandTotal: 20298.00,
  contracts: ['contract1.pdf']
};

// interface ConfirmationDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onConfirm: (comment: string) => void;
//   title: string;
// }

function ConfirmationDialog({ open, onClose, onConfirm, title }) {
  const [comment, setComment] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {title}
        <Button onClick={onClose} size="small">
          <X className="w-5 h-5" />
        </Button>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Comment"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4"
        />
        <Typography variant="body2" color="text.secondary" className="mb-4">
          This operation can not be revoked. Please confirm before submitting.
        </Typography>
        <Box className="flex justify-end gap-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => onConfirm(comment)}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// interface ApprovalModalProps {
//   open: boolean;
//   onClose: () => void;
// }

export default function ApprovalModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState('approve');

  const handleApprove = () => {
    setConfirmAction('approve');
    setConfirmDialogOpen(true);
  };

  const handleReject = () => {
    setConfirmAction('reject');
    setConfirmDialogOpen(true);
  };

  const handleConfirm = (comment) => {
    console.log(`${confirmAction} with comment:`, comment);
    setConfirmDialogOpen(false);
    onClose();
  };

  const getStatusChip = (status) => {
    const colors = {
      Submitted: 'bg-cyan-100 text-cyan-800',
      Approved: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Approval" />
            <Tab label="Approval process" />
          </Tabs>
          <Button onClick={onClose} size="small">
            <X className="w-5 h-5" />
          </Button>
        </DialogTitle>
        <DialogContent>
          {activeTab === 0 && (
            <div>
              <Box className="flex gap-2 mb-6">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Box>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Company:
                  </Typography>
                  <Link href="#" color="primary">
                    {mockApprovalDetails.company}
                  </Link>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact:
                  </Typography>
                  <Link href="#" color="primary">
                    {mockApprovalDetails.contact}
                  </Link>
                </div>
              </div>

              <Typography variant="subtitle1" className="mb-4">
                Order items:
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockApprovalDetails.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        <Link href="#" color="primary">
                          {item.product}
                        </Link>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Subtotal:
                  </Typography>
                  <Typography>{mockApprovalDetails.subtotal.toFixed(2)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Discount:
                  </Typography>
                  <Typography>{mockApprovalDetails.discount}%</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tax:
                  </Typography>
                  <Typography>{mockApprovalDetails.tax}%</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    Adjustment:
                  </Typography>
                  <Typography>{mockApprovalDetails.adjustment.toFixed(2)}</Typography>
                </div>
              </div>

              <div className="mt-6">
                <Typography variant="subtitle2" color="text.secondary">
                  Contracts:
                </Typography>
                {mockApprovalDetails.contracts.map((contract) => (
                  <Link
                    key={contract}
                    href="#"
                    className="flex items-center gap-2 mt-2"
                    color="primary"
                  >
                    <img src="/pdf-icon.png" alt="PDF" className="w-8 h-8" />
                    {contract}
                  </Link>
                ))}
              </div>

              <div className="mt-6">
                <Typography variant="subtitle2" color="text.secondary">
                  Grand Total:
                </Typography>
                <Typography variant="h6">
                  {mockApprovalDetails.grandTotal.toFixed(2)}
                </Typography>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-6">
              {mockApprovalProcess.map((step, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
                  <Typography>{step.taskNode}</Typography>
                  {getStatusChip(step.status)}
                  <Typography>{step.user}</Typography>
                  <div>
                    <Typography>{step.timestamp}</Typography>
                    {step.comment && (
                      <Typography color="text.secondary" variant="body2">
                        Comment: {step.comment}
                      </Typography>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirm}
        title={confirmAction === 'approve' ? 'Approve' : 'Reject'}
      />
    </>
  );
}