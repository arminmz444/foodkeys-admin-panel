import React, { useState } from 'react';
import { Drawer, IconButton, Button } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';

const mockData = [
  {
    id: 1,
    title: 'Ticket assignee notification',
    content: 'You have been assigned a new ticket. Please address it as soon as possible.',
    datetime: '3 months ago',
    status: 'Unread'
  },
  {
    id: 2,
    title: 'Ticket assignee notification',
    content: 'You have been assigned a new ticket. Please address it as soon as possible.',
    datetime: '4 months ago',
    status: 'Unread'
  },
  {
    id: 3,
    title: 'Ticket assignee notification',
    content: 'You have been assigned a new ticket. Please address it as soon as possible.',
    datetime: '4 months ago',
    status: 'Read'
  }
];

export default function NotificationDrawer() {
  const [open, setOpen] = useState(false);

  // Toggle the drawer open/close
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Button variant="contained" onClick={handleToggle}>
        Show Messages
      </Button>

      <Drawer anchor="right" open={open} onClose={handleToggle}>
        <div className="w-96 h-full flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Messages</h2>
            <IconButton onClick={handleToggle}>
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>

          <div className="overflow-y-auto flex-1">
            {mockData.map((item) => (
              <div key={item.id} className="p-4 border-b">
                <p className="text-sm font-bold mb-1">{item.title}</p>
                <p className="text-sm text-gray-600">{item.content}</p>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">{item.datetime}</span>
                  <span
                    className={`text-xs font-medium ${
                      item.status === 'Unread' ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-2">
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => alert(`Viewing message #${item.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
