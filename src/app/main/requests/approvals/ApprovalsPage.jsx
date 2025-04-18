import { useState } from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { RefreshCw, Filter } from 'lucide-react';
import ApprovalModal from './components/ApprovalModal';

const mockApprovals = [
  {
    id: '1',
    title: 'Approve by department master & root',
    applicant: 'Super Admin',
    createdAt: '2025-03-18 23:28:08',
    status: 'Pending',
    type: 'Sample ask-for-leave approval'
  },
  {
    id: '2',
    title: 'Approved by Department owner & Super admin',
    applicant: 'Example salesperson',
    createdAt: '2024-04-13 15:56:06',
    status: 'Pending',
    type: 'Sample new order approval'
  },
  {
    id: '3',
    title: 'Approve by department master & root',
    applicant: 'Example salesperson',
    createdAt: '2024-04-07 09:14:24',
    status: 'Approved',
    type: 'Sample ask-for-leave approval'
  }
];

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const getFilteredApprovals = () => {
    switch (activeTab) {
      case 0:
        return mockApprovals.filter(a => a.status === 'Pending');
      case 1:
        return mockApprovals.filter(a => a.status !== 'Pending');
      default:
        return mockApprovals;
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'error'
    };
    return (
      <Chip
        label={status}
        color={colors[status]}
        size="small"
      />
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5">درخواست‌های تاییدی من</Typography>
        <div className="flex gap-2">
          <IconButton>
            <RefreshCw className="w-5 h-5" />
          </IconButton>
          <IconButton>
            <Filter className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} className="mb-4">
        <Tab label="درحال انتظار" />
        <Tab label="تایید شده" />
        <Tab label="همه" />
      </Tabs>

      <div className="space-y-4">
        {getFilteredApprovals().map((approval) => (
          <Paper key={approval.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" className="mb-2">
                  {approval.title}
                </Typography>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Typography variant="body2" color="text.secondary">
                      Applicant:
                    </Typography>
                    <Typography variant="body2">
                      {approval.applicant}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Typography variant="body2" color="text.secondary">
                      Created at:
                    </Typography>
                    <Typography variant="body2">
                      {approval.createdAt}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    {getStatusChip(approval.status)}
                  </div>
                </div>
              </div>
              <Typography variant="body2" color="text.secondary">
                {approval.type}
              </Typography>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="text"
                color="primary"
                onClick={() => setSelectedApproval(approval.id)}
              >
                جزئیات
              </Button>
            </div>
          </Paper>
        ))}
      </div>

      <ApprovalModal
        open={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
      />
    </div>
  );
}