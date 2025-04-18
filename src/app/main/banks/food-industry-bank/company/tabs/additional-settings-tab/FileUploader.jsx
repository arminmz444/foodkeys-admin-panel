import React, { useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Checkbox, FormControlLabel } from '@mui/material';

const routes = [
  {
    id: 'dashboard',
    name: 'Dashboard'
  },
  {
    id: 'users',
    name: 'Users',
    children: [
      {
        id: 'users-list',
        name: 'Users',
        children: [
          {
            id: 'companies',
            name: 'Companies',
            children: [
              { id: 'all-companies', name: 'All Companies' },
              { id: 'trial', name: 'Trial →' },
              { id: 'user', name: 'User →' },
              { id: 'prospect', name: 'Prospect →' }
            ]
          }
        ]
      }
    ]
  }
];

export default function DesktopRoutes() {
  const [expanded, setExpanded] = useState(['users', 'users-list', 'companies']);
  const [checked, setChecked] = useState([
    'dashboard',
    'users',
    'users-list',
    'companies',
    'all-companies',
    'trial',
    'user',
    'prospect'
  ]);

  const handleToggle = (nodeId) => {
    setExpanded(expanded.includes(nodeId)
      ? expanded.filter(id => id !== nodeId)
      : [...expanded, nodeId]
    );
  };

  const renderTree = (node, level = 0) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={
        <div className="flex items-center justify-between py-1">
          <span className="flex-1">{node.name}</span>
          <Checkbox
            checked={checked.includes(node.id)}
            onChange={(e) => {
              setChecked(e.target.checked
                ? [...checked, node.id]
                : checked.filter(id => id !== node.id)
              );
            }}
            size="small"
          />
        </div>
      }
      className={`ml-${level * 4}`}
    >
      {node.children?.map(child => renderTree(child, level + 1))}
    </TreeItem>
  );

  return (
    <div className="p-6">
      <FormControlLabel
        control={
          <Checkbox
            checked={true}
            size="small"
          />
        }
        label="مسیرهای جدید به طور پیشفرض دسترسی دارند"
        className="mb-6"
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">نام مسیر</span>
        <span className="text-sm font-medium">دسترسی</span>
      </div>

      <TreeView
        defaultCollapseIcon={<ChevronDown className="w-4 h-4" />}
        defaultExpandIcon={<ChevronRight className="w-4 h-4" />}
        expanded={expanded}
        onNodeToggle={(_, nodeIds) => setExpanded(nodeIds)}
      >
        {routes.map(route => renderTree(route))}
      </TreeView>
    </div>
  );
}