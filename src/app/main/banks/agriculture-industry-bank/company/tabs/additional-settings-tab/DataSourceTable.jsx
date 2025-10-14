import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Drawer,
  Tabs,
  Tab,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { Filter } from 'lucide-react';


const dataSources = [
  { id: 1, displayName: 'Main', name: 'main' },
  { id: 2, displayName: 'External MySQL', name: 'sample2' },
  { id: 3, displayName: 'External PostgreSQL', name: 'dvdrental' },
  { id: 4, displayName: 'External MariaDB', name: 'sample-mariadb' },
  { id: 5, displayName: 'Mock REST API', name: 'mock-api' },
];

const generalActions = [
  { displayName: 'Add new', type: 'Action on new records', allow: true, dataScope: 'All records' },
  { displayName: 'View', type: 'Action on existing records', allow: true, dataScope: 'All records' },
  { displayName: 'Edit', type: 'Action on existing records', allow: true, dataScope: 'All records' },
  { displayName: 'Delete', type: 'Action on existing records', allow: true, dataScope: 'All records' },
  { displayName: 'Export', type: 'Action on existing records', allow: false, dataScope: 'All records' },
  { displayName: 'Import', type: 'Action on new records', allow: false, dataScope: 'All records' },
  { displayName: 'Template print', type: 'Action on existing records', allow: false, dataScope: 'All records' },
];

const collections = [
  { displayName: 'Ask for leave', name: 'ask_for_leave', policy: 'General' },
  { displayName: 'Comments', name: 'comments', policy: 'General' },
  { displayName: 'Company', name: 'company', policy: 'General' },
  { displayName: 'Contact', name: 'contact', policy: 'General' },
  { displayName: 'Departments', name: 'departments', policy: 'General' },
  { displayName: 'Interactions', name: 'interaction', policy: 'General' },
  { displayName: 'Lead', name: 'lead', policy: 'General' },
  { displayName: 'Note', name: 'note', policy: 'General' },
  { displayName: 'Order', name: 'order', policy: 'General' },
  { displayName: 'Order details', name: 'order_details', policy: 'General' },
  { displayName: 'Product', name: 'product', policy: 'General' },
  { displayName: 'Product category', name: 'product_category', policy: 'General' },
  { displayName: 'Roles', name: 'roles', policy: 'General' },
];

export default function DataSourcesTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [configureOpen, setConfigureOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleConfigureClick = () => {
    setConfigureOpen(true);
  };

  const handleClose = () => {
    setConfigureOpen(false);
  };

  return (
    <div className="p-6">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Display name</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>{source.displayName}</TableCell>
              <TableCell>{source.name}</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleConfigureClick}
                >
                  Configure
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4 items-center gap-4">
        <span>1</span>
        <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
          <MenuItem value={50}>50 / page</MenuItem>
          <MenuItem value={100}>100 / page</MenuItem>
        </Select>
      </div>

      <Drawer
        anchor="right"
        open={configureOpen}
        onClose={handleClose}
        PaperProps={{
          sx: { width: '600px' }
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Configure permissions</h2>
            <Button onClick={handleClose}>×</Button>
          </div>

          <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
            <Tab label="General action permissions" />
            <Tab label="Action permissions" />
          </Tabs>

          <div className="mt-6">
            {selectedTab === 0 && (
              <div>
                <div className="grid grid-cols-4 gap-4 mb-4 font-medium">
                  <div>Action display name</div>
                  <div>Action type</div>
                  <div>Allow</div>
                  <div>Data scope</div>
                </div>
                {generalActions.map((action, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 py-2 items-center">
                    <div>{action.displayName}</div>
                    <div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        action.type === 'Action on new records' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {action.type}
                      </span>
                    </div>
                    <div>
                      <Checkbox checked={action.allow} />
                    </div>
                    <div>
                      <Select
                        value={action.dataScope}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="All records">All records</MenuItem>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 1 && (
              <div>
                <div className="flex justify-between mb-4">
                  <Button
                    startIcon={<Filter className="w-4 h-4" />}
                    variant="outlined"
                    size="small"
                  >
                    Filter
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 font-medium">
                  <div>Collection display name</div>
                  <div>Collection name</div>
                  <div>Permission policy</div>
                  <div>Actions</div>
                </div>

                {collections.map((collection, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 py-2 items-center">
                    <div>{collection.displayName}</div>
                    <div>{collection.name}</div>
                    <div>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">
                        {collection.policy}
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}