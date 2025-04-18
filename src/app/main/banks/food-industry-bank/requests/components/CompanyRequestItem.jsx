import { useState } from 'react';
import { Paper, Typography, Chip, Button, Collapse, Divider, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import CompanyRequestModal from './CompanyRequestModal';
import { getRequestStatusName, getRequestStatusColor } from '../mockData'; // Import from mock data

export default function CompanyRequestItem({ request }) {
  const [openInfo, setOpenInfo] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [description, setDescription] = useState("");

  const handleApprove = () => {
    setModalAction('approve');
  };

  const handleReject = () => {
    setModalAction('reject');
  };

  const statusAnimation = getRequestStatusColor(request.requestStatus) === 'warning' ? 'animate-pulse' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper className="p-6 bg-white shadow-lg rounded-lg w-full">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col">
            <Typography variant="h6" className="mb-2 text-xl font-bold text-gray-900">{request.company.companyName}</Typography>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>درخواست‌دهنده:</strong> {request.requester.name}</div>
              <div><strong>تاریخ درخواست:</strong> {new Date(request.requestDate).toLocaleString()}</div>
              <div>
                <strong>وضعیت درخواست:</strong>
                <Chip
                  label={getRequestStatusName(request.requestStatus)}
                  color={getRequestStatusColor(request.requestStatus)}
                  size="small"
                  className={`mt-2 ${statusAnimation}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col justify-end">
            <Button variant="outlined" color="primary" onClick={() => setOpenInfo(!openInfo)}>
              مشاهده جزئیات
            </Button>
            <div className="flex space-x-2 mt-4">
              <Button variant="contained" color="success" onClick={handleApprove} disabled={request.requestStatus !== 1}>
                تایید
              </Button>
              <Button variant="outlined" color="error" onClick={handleReject} disabled={request.requestStatus !== 1}>
                رد
              </Button>
            </div>
          </div>
        </div>

        <Collapse in={openInfo} className="mt-4">
          <Divider className="mb-2" />
          <div className="text-sm text-gray-700">
            <div><strong>توضیحات:</strong> {request.company.description}</div>
            <div><strong>مدیرعامل:</strong> {request.company.ceo} ({request.company.ceoPhoneNumber})</div>
            <div><strong>تاریخ تأسیس:</strong> {new Date(request.company.establishDate).toLocaleDateString()}</div>
            <div className="mt-2"><strong>محصولات:</strong> {request.company.products.join(", ")}</div>
            <div className="mt-2"><strong>تماس:</strong> {request.company.contacts.map(contact => <div key={contact.type}>{contact.value}</div>)}</div>
          </div>
        </Collapse>
      </Paper>

      {modalAction && (
        <CompanyRequestModal
          open
          action={modalAction}
          request={request}
          description={description}
          setDescription={setDescription}
          onClose={() => setModalAction(null)}
        />
      )}
    </motion.div>
  );
}
