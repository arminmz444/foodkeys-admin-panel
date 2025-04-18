// TaskSchedulerPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import TaskTable from './TaskTable';
import NewTaskDialog from './NewTaskDialog';

export interface Task {
  id: number;
  name: string;
  description: string;
  scheduleTime: string;
  scriptType: 'groovy' | 'javascript';
  status: string;
  createdAt: string;
}

export default function TaskSchedulerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Placeholder for API call to fetch tasks
  useEffect(() => {
    // Mock data
    const fakeTasks = [
      {
        id: 1,
        name: 'Task One',
        description: 'First scheduled task',
        scheduleTime: '2025-03-02T10:00',
        scriptType: 'groovy',
        status: 'Scheduled',
        createdAt: '2025-03-01T09:00',
      },
      {
        id: 2,
        name: 'Task Two',
        description: 'Second scheduled task',
        scheduleTime: '2025-03-03T12:00',
        scriptType: 'javascript',
        status: 'Scheduled',
        createdAt: '2025-03-01T10:00',
      },
    ];
    setTasks(fakeTasks);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box className="p-4">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6">Task Scheduler</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>New Task</Button>
      </Box>
      <Box className="mb-4">
        <TextField
          label="Search Tasks"
          size="small"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>
      <Paper>
        <TaskTable tasks={filteredTasks} />
      </Paper>
      {openDialog && (
        <NewTaskDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onCreate={handleTaskCreated}
        />
      )}
    </Box>
  );
}
// TaskSchedulerPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import TaskTable from './TaskTable';
import NewTaskDialog from './NewTaskDialog';


function TaskSchedulerPage() {
  const [tasks, setTasks] = useState<>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Placeholder for API call to fetch tasks
  useEffect(() => {
    // Mock data
    const fakeTasks = [
      {
        id: 1,
        name: 'Task One',
        description: 'First scheduled task',
        scheduleTime: '2025-03-02T10:00',
        scriptType: 'groovy',
        status: 'Scheduled',
        createdAt: '2025-03-01T09:00',
      },
      {
        id: 2,
        name: 'Task Two',
        description: 'Second scheduled task',
        scheduleTime: '2025-03-03T12:00',
        scriptType: 'javascript',
        status: 'Scheduled',
        createdAt: '2025-03-01T10:00',
      },
    ];
    setTasks(fakeTasks);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box className="p-4">
      <Box className="flex items-center justify-between mb-4">
        <Typography variant="h6">Task Scheduler</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>New Task</Button>
      </Box>
      <Box className="mb-4">
        <TextField
          label="Search Tasks"
          size="small"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>
      <Paper>
        <TaskTable tasks={filteredTasks} />
      </Paper>
      {openDialog && (
        <NewTaskDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onCreate={handleTaskCreated}
        />
      )}
    </Box>
  );
}

export default TaskSchedulerPage;