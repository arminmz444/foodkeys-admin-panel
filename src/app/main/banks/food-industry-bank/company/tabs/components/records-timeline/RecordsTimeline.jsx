// import React, { useState, useEffect } from 'react';
// import { 
//   Avatar, 
//   Box, 
//   CircularProgress, 
//   Paper, 
//   Typography, 
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import { 
//   Timeline, 
//   TimelineConnector, 
//   TimelineContent, 
//   TimelineDot, 
//   TimelineItem, 
//   TimelineOppositeContent, 
//   TimelineSeparator 
// } from '@mui/lab';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { motion } from 'framer-motion';
// import EditorJSComponent from 'app/shared-components/editor-js/EditorJSComponent';
// import { getServerFile } from 'src/utils/string-utils';

// // Styles (RTL and modern design)
// const useStyles = makeStyles((theme) => ({
//   container: {
//     direction: 'rtl',
//     padding: theme.spacing(2),
//   },
//   editorContainer: {
//     marginBottom: theme.spacing(3),
//     padding: theme.spacing(2),
//     background: theme.palette.background.paper,
//     borderRadius: theme.shape.borderRadius,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     borderRadius: '10px',
//     marginBottom: theme.spacing(2),
//     maxWidth: '90%',
//   },
//   timelineContent: {
//     padding: theme.spacing(1),
//   },
//   readMore: {
//     fontWeight: 'bold',
//     color: theme.palette.primary.main,
//     cursor: 'pointer',
//     display: 'inline-block',
//     marginTop: theme.spacing(1),
//   },
//   avatar: {
//     width: theme.spacing(6),
//     height: theme.spacing(6),
//   },
//   spinnerContainer: {
//     textAlign: 'center',
//     padding: theme.spacing(2),
//   },
//   noRecords: {
//     textAlign: 'center',
//     padding: theme.spacing(4),
//     color: theme.palette.text.secondary,
//   }
// }));

// // Helper function to convert EditorJS data to plain text
// const getPlainTextFromEditorJS = (content) => {
//   if (typeof content === 'string') {
//     return content;
//   }
//   if (content && content.blocks && Array.isArray(content.blocks)) {
//     return content.blocks
//       .map((block) => {
//         // Strip HTML tags if any
//         const tmp = document.createElement('div');
//         tmp.innerHTML = block.data.text || '';
//         return tmp.textContent || tmp.innerText || '';
//       })
//       .join(' ');
//   }
//   return '';
// };

// // Render EditorJS blocks
// const renderBlock = (block, index) => {
//   switch (block.type) {
//     case 'paragraph':
//       return (
//         <Typography
//           key={index}
//           variant="body1"
//           component="p"
//           style={{ marginBottom: 8 }}
//           dangerouslySetInnerHTML={{ __html: block.data.text }}
//         />
//       );
//     case 'header':
//       const HeaderTag = `h${block.data.level}`;
//       return (
//         <Typography
//           key={index}
//           variant={`h${block.data.level}`}
//           component={HeaderTag}
//           style={{ marginBottom: 8 }}
//           dangerouslySetInnerHTML={{ __html: block.data.text }}
//         />
//       );
//     case 'list':
//       return (
//         <Box key={index} component="ul" sx={{ pl: 2, mb: 1 }}>
//           {block.data.items.map((item, i) => (
//             <li key={i}>
//               <Typography variant="body1" dangerouslySetInnerHTML={{ __html: item }} />
//             </li>
//           ))}
//         </Box>
//       );
//     case 'image':
//       return (
//         <Box key={index} sx={{ mb: 2 }}>
//           <img
//             src={block.data.file.url}
//             alt={block.data.caption || 'Image'}
//             style={{ maxWidth: '100%', borderRadius: 4 }}
//           />
//           {block.data.caption && <Typography variant="caption">{block.data.caption}</Typography>}
//         </Box>
//       );
//     case 'attaches':
//       return (
//         <Box key={index} sx={{ mb: 2 }}>
//           <a href={block.data.file.url} target="_blank" rel="noopener noreferrer">
//             {block.data.title || block.data.file.name}
//           </a>
//         </Box>
//       );
//     default:
//       return (
//         <Typography key={index} variant="body1" component="p">
//           {JSON.stringify(block.data)}
//         </Typography>
//       );
//   }
// };

// // Render EditorJS content
// const renderEditorContent = (content) => {
//   if (typeof content === 'string') {
//     return <Typography variant="body1">{content}</Typography>;
//   }
//   if (content && content.blocks && Array.isArray(content.blocks)) {
//     return content.blocks.map((block, index) => renderBlock(block, index));
//   }
//   return null;
// };

// // Component for each record card with "read more" functionality and framer-motion animations
// const RecordCard = ({ 
//   record, 
//   truncateLength = 200, 
//   onEdit, 
//   onDelete,
//   currentUserRoles = [] 
// }) => {
//   const classes = useStyles();
//   const [expanded, setExpanded] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const menuOpen = Boolean(anchorEl);
  
//   // Convert the comment to EditorJS format if it's a string
//   const commentData = typeof record.comment === 'string' 
//     ? { blocks: [{ type: 'paragraph', data: { text: record.comment } }] } 
//     : record.comment;
  
//   const plainText = getPlainTextFromEditorJS(commentData);
//   const needsTruncate = plainText && plainText.length > truncateLength;

//   // Check if the current user has permission to edit/delete this comment
//   const hasEditPermission = () => {
//     // Check if the current user is the author or has admin role
//     if (!record.authorizedRoles || record.authorizedRoles.length === 0) {
//       return true; // Default to true if no roles specified
//     }
    
//     // Check if current user's roles intersect with authorized roles
//     return currentUserRoles.some(role => record.authorizedRoles.includes(role));
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleEdit = () => {
//     handleMenuClose();
//     if (onEdit) onEdit(record);
//   };

//   const handleDelete = () => {
//     handleMenuClose();
//     if (onDelete) onDelete(record.id);
//   };

//   const displayedContent = () => {
//     if (!needsTruncate || expanded) {
//       return renderEditorContent(commentData);
//     } else {
//       const truncated = plainText.substring(0, truncateLength) + '...';
//       return <Typography variant="body1">{truncated}</Typography>;
//     }
//   };

//   return (
//     <TimelineItem>
//       <TimelineOppositeContent>
//         <Typography variant="body2" color="textSecondary">
//           {record.createdAtStr || new Date(record.createdAt).toLocaleString('fa-IR')}
//         </Typography>
//       </TimelineOppositeContent>
//       <TimelineSeparator>
//         <TimelineDot>
//           <Avatar
//             alt={`${record.firstName || ''} ${record.lastName || ''}`}
//             src={getServerFile(record.avatar) || '/assets/images/avatars/profile.jpg'}
//             className={classes.avatar}
//           />
//         </TimelineDot>
//         <TimelineConnector />
//       </TimelineSeparator>
//       <TimelineContent className={classes.timelineContent}>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Paper elevation={3} className={classes.paper}>
//             <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//               <Box display="flex" flexDirection="column">
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <Typography variant="subtitle1" component="h2" style={{ fontWeight: 'bold', marginRight: 8 }}>
//                     {record.firstName || ''} {record.lastName || ''} {/* Use employee name if available */}
//                     {record.employeeName && `(${record.employeeName})`}
//                   </Typography>
//                   {(record.roleStr || record.employeeRole) && (
//                     <Typography variant="caption" color="textSecondary">
//                       ({record.roleStr || record.employeeRole})
//                     </Typography>
//                   )}
//                 </Box>
//               </Box>
              
//               {hasEditPermission() && (
//                 <>
//                   <IconButton 
//                     size="small" 
//                     onClick={handleMenuClick}
//                     aria-controls={menuOpen ? "record-menu" : undefined}
//                     aria-haspopup="true"
//                     aria-expanded={menuOpen ? "true" : undefined}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                   <Menu
//                     id="record-menu"
//                     anchorEl={anchorEl}
//                     open={menuOpen}
//                     onClose={handleMenuClose}
//                     MenuListProps={{
//                       'aria-labelledby': 'record-menu-button',
//                     }}
//                   >
//                     <MenuItem onClick={handleEdit}>
//                       <EditIcon fontSize="small" sx={{ mr: 1 }} />
//                       ویرایش
//                     </MenuItem>
//                     <MenuItem onClick={handleDelete}>
//                       <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
//                       حذف
//                     </MenuItem>
//                   </Menu>
//                 </>
//               )}
//             </Box>
            
//             <Box mt={2}>
//               {displayedContent()}
//               {needsTruncate && !expanded && (
//                 <motion.span
//                   whileHover={{ scale: 1.05 }}
//                   className={classes.readMore}
//                   onClick={() => setExpanded(true)}
//                 >
//                   خواندن بیشتر
//                 </motion.span>
//               )}
//               {needsTruncate && expanded && (
//                 <motion.span
//                   whileHover={{ scale: 1.05 }}
//                   className={classes.readMore}
//                   onClick={() => setExpanded(false)}
//                 >
//                   نمایش کمتر
//                 </motion.span>
//               )}
//             </Box>
//           </Paper>
//         </motion.div>
//       </TimelineContent>
//     </TimelineItem>
//   );
// };

// // Main RecordsTimeline component
// const RecordsTimeline = ({ 
//   records = [], 
//   loading = false,
//   hasMore = false,
//   onLoadMore,
//   onAddComment,
//   onEditComment,
//   onDeleteComment,
//   editorComponent = null, 
//   classes: propClasses = {},
//   currentUserRoles = [],
//   entityType,
//   entityId
// }) => {
//   const classes = useStyles();
//   const [editingComment, setEditingComment] = useState(null);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [commentToDelete, setCommentToDelete] = useState(null);
//   const [editorLoading, setEditorLoading] = useState(false);

//   const handleEdit = (comment) => {
//     setEditingComment(comment);
//     setEditDialogOpen(true);
//   };

//   const handleDelete = (commentId) => {
//     setCommentToDelete(commentId);
//     setDeleteDialogOpen(true);
//   };

//   const handleSaveEdit = async (editorData) => {
//     setEditorLoading(true);
//     try {
//       if (onEditComment) {
//         await onEditComment({
//           id: editingComment.id, 
//           commentData: {
//             ...editingComment,
//             comment: editorData
//           }
//         });
//       }
//       setEditDialogOpen(false);
//     } catch (error) {
//       console.error("Error updating comment:", error);
//     } finally {
//       setEditorLoading(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       if (onDeleteComment && commentToDelete) {
//         await onDeleteComment(commentToDelete);
//       }
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     } finally {
//       setDeleteDialogOpen(false);
//       setCommentToDelete(null);
//     }
//   };

//   return (
//     <Box className={`${classes.container} ${propClasses.container || ''}`}>
//       {editorComponent && (
//         <div className={`${classes.editorContainer} ${propClasses.editorContainer || ''}`}>
//           {editorComponent}
//         </div>
//       )}
      
//       {records.length === 0 && !loading ? (
//         <Typography variant="body1" className={classes.noRecords}>
//           هیچ رکوردی یافت نشد. با استفاده از ادیتور بالا، اولین نظر را ثبت کنید.
//         </Typography>
//       ) : (
//         <InfiniteScroll
//           dataLength={records.length}
//           next={onLoadMore}
//           hasMore={hasMore}
//           loader={
//             <Box className={classes.spinnerContainer}>
//               <CircularProgress />
//             </Box>
//           }
//           endMessage={
//             <Typography align="center" variant="body2" color="textSecondary">
//               رکورد دیگری برای نمایش وجود ندارد
//             </Typography>
//           }
//         >
//           <Timeline align="alternate">
//             {records.map((record) => (
//               <RecordCard 
//                 key={record.id} 
//                 record={record}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 currentUserRoles={currentUserRoles}
//               />
//             ))}
//           </Timeline>
//         </InfiniteScroll>
//       )}

//       {/* Edit Comment Dialog */}
//       <Dialog
//         open={editDialogOpen}
//         onClose={() => setEditDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>ویرایش نظر</DialogTitle>
//         <DialogContent>
//           {editingComment && (
//             <EditorJSComponent
//               initialData={typeof editingComment.comment === 'string' 
//                 ? { blocks: [{ type: 'paragraph', data: { text: editingComment.comment } }] }
//                 : editingComment.comment
//               }
//               onSave={handleSaveEdit}
//               loading={editorLoading}
//               buttonText="ذخیره تغییرات"
//             />
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)} color="primary">
//             انصراف
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>تایید حذف</DialogTitle>
//         <DialogContent>
//           <Typography variant="body1">
//             آیا از حذف این نظر اطمینان دارید؟ این عملیات قابل بازگشت نیست.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
//             انصراف
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             حذف
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RecordsTimeline;

import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Box, 
  CircularProgress, 
  Paper, 
  Typography, 
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  Timeline, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot, 
  TimelineItem, 
  TimelineOppositeContent, 
  TimelineSeparator 
} from '@mui/lab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion } from 'framer-motion';
import EditorJSComponent from 'app/shared-components/editor-js/EditorJSComponent';
import { getServerFile } from 'src/utils/string-utils';
import Output from 'editorjs-react-renderer'; // Import editorjs-react-renderer

// Styles (RTL and modern design)
const useStyles = makeStyles((theme) => ({
  container: {
    direction: 'rtl',
    padding: theme.spacing(2),
  },
  editorContainer: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: '10px',
    marginBottom: theme.spacing(2),
    maxWidth: '90%',
  },
  timelineContent: {
    padding: theme.spacing(1),
  },
  readMore: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    display: 'inline-block',
    marginTop: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  spinnerContainer: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  noRecords: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  editorOutput: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: 4,
      marginBottom: theme.spacing(1),
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(2),
      fontWeight: 'bold',
      direction: 'rtl',
    },
    '& ul, & ol': {
      paddingRight: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    '& p': {
      marginBottom: theme.spacing(1),
      direction: 'rtl',
    },
    '& blockquote': {
      borderRight: `3px solid ${theme.palette.primary.main}`,
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(1),
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '& table': {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: theme.spacing(2),
      '& th, & td': {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
        textAlign: 'right',
      },
      '& th': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    direction: 'rtl',
    textAlign: 'right',
  }
}));

// Helper function to get plain text from EditorJS data for truncation
const getPlainTextFromEditorJS = (content) => {
  if (typeof content === 'string') {
    try {
      // Try to parse it as JSON
      const parsed = JSON.parse(content);
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return parsed.blocks
          .map((block) => {
            switch (block.type) {
              case 'paragraph':
                return block.data.text || '';
              case 'header':
                return block.data.text || '';
              case 'list':
                return (block.data.items || []).join(' ');
              default:
                return '';
            }
          })
          .join(' ');
      }
      return content;
    } catch (e) {
      // If parsing fails, treat as plain text
      return content;
    }
  }
  
  if (content && content.blocks && Array.isArray(content.blocks)) {
    return content.blocks
      .map((block) => {
        switch (block.type) {
          case 'paragraph':
            return block.data.text || '';
          case 'header':
            return block.data.text || '';
          case 'list':
            return (block.data.items || []).join(' ');
          default:
            return '';
        }
      })
      .join(' ');
  }
  return '';
};

// Custom configuration for editorjs-react-renderer
const rendererConfig = {
  image: {
    className: 'editor-img',
    actionsClassNames: {
      stretched: 'img-fullwidth',
      withBorder: 'img-with-border',
      withBackground: 'img-with-background',
    }
  },
  paragraph: {
    className: 'editor-paragraph',
    actionsClassNames: {
      alignment: 'text-align-{alignment}'
    }
  },
  header: {
    className: 'editor-header',
  },
  list: {
    className: 'editor-list',
  },
  table: {
    className: 'editor-table',
  }
};

// Component for each record card with EditorJS renderer
const RecordCard = ({ 
  record, 
  truncateLength = 200, 
  onEdit, 
  onDelete,
  currentUserRoles = [] 
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  
  // Parse comment data if it's a string
  const getCommentData = () => {
    if (!record.comment) return null;
    
    if (typeof record.comment === 'string') {
      try {
        return JSON.parse(record.comment);
      } catch (e) {
        // If parsing fails, return a simple EditorJS structure with text
        return {
          blocks: [
            {
              type: 'paragraph',
              data: { text: record.comment }
            }
          ]
        };
      }
    }
    return record.comment;
  };
  
  const commentData = getCommentData();
  const plainText = getPlainTextFromEditorJS(commentData);
  const needsTruncate = plainText && plainText.length > truncateLength;

  // Check if the current user has permission to edit/delete this comment
  const hasEditPermission = () => {
    // Check if the current user is the author or has admin role
    if (!record.authorizedRoles || record.authorizedRoles.length === 0) {
      return true; // Default to true if no roles specified
    }
    
    // Check if current user's roles intersect with authorized roles
    return currentUserRoles.some(role => record.authorizedRoles.includes(role));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(record);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(record.id);
  };

  // Create a truncated version of the data for EditorJS renderer
  const getTruncatedData = () => {
    if (!commentData || !commentData.blocks || !Array.isArray(commentData.blocks)) {
      return { blocks: [] };
    }
    
    if (!needsTruncate || expanded) {
      return commentData;
    }
    
    // For truncation, either take just the first block or truncate the text
    let truncatedBlocks = [];
    let characterCount = 0;
    
    for (const block of commentData.blocks) {
      if (characterCount >= truncateLength) break;
      
      if (block.type === 'paragraph') {
        const text = block.data.text || '';
        if (characterCount + text.length > truncateLength) {
          // Truncate this paragraph
          truncatedBlocks.push({
            ...block,
            data: {
              ...block.data,
              text: text.substring(0, truncateLength - characterCount) + '...'
            }
          });
          break;
        } else {
          truncatedBlocks.push(block);
          characterCount += text.length;
        }
      } else {
        // For non-paragraph blocks, just include them until we hit the limit
        truncatedBlocks.push(block);
        // Estimate the character count for non-text blocks
        characterCount += 50;
      }
    }
    
    return {
      ...commentData,
      blocks: truncatedBlocks
    };
  };

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant="body2" color="textSecondary">
          {record.createdAtStr || new Date(record.createdAt).toLocaleString('fa-IR')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>
          <Avatar
            alt={`${record.firstName || ''} ${record.lastName || ''}`}
            src={getServerFile(record.avatar) || '/assets/images/avatars/profile.jpg'}
            className={classes.avatar}
          />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent className={classes.timelineContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper elevation={3} className={classes.paper}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" component="h2" style={{ fontWeight: 'bold', marginRight: 8 }}>
                    {record.firstName || ''} {record.lastName || ''} 
                    {record.employeeName && `(${record.employeeName})`}
                  </Typography>
                  {(record.roleStr || record.employeeRole) && (
                    <Typography variant="caption" color="textSecondary">
                      ({record.roleStr || record.employeeRole})
                    </Typography>
                  )}
                </Box>
              </Box>
              
              {hasEditPermission() && (
                <>
                  <IconButton 
                    size="small" 
                    onClick={handleMenuClick}
                    aria-controls={menuOpen ? "record-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="record-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'record-menu-button',
                    }}
                  >
                    <MenuItem onClick={handleEdit}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      ویرایش
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                      حذف
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
            
            <Box mt={2} className={classes.editorOutput}>
              {commentData && commentData.blocks && (
                <Output data={getTruncatedData()} config={rendererConfig} />
              )}
              
              {needsTruncate && !expanded && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={classes.readMore}
                  onClick={() => setExpanded(true)}
                >
                  خواندن بیشتر
                </motion.span>
              )}
              {needsTruncate && expanded && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={classes.readMore}
                  onClick={() => setExpanded(false)}
                >
                  نمایش کمتر
                </motion.span>
              )}
            </Box>
          </Paper>
        </motion.div>
      </TimelineContent>
    </TimelineItem>
  );
};

// Main RecordsTimeline component
const RecordsTimeline = ({ 
  records = [], 
  loading = false,
  hasMore = false,
  onLoadMore,
  onAddComment,
  onEditComment,
  onDeleteComment,
  editorComponent = null, 
  classes: propClasses = {},
  currentUserRoles = [],
  entityType,
  entityId
}) => {
  const classes = useStyles();
  const [editingComment, setEditingComment] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editorLoading, setEditorLoading] = useState(false);

  // Parse comment data from string if needed
  const parseCommentData = (comment) => {
    if (typeof comment === 'string') {
      try {
        return JSON.parse(comment);
      } catch (e) {
        // If parsing fails, return minimal valid structure
        return { 
          blocks: [{ 
            type: 'paragraph', 
            data: { text: comment } 
          }] 
        };
      }
    }
    return comment;
  };

  const handleEdit = (comment) => {
    // Parse the comment data if it's a string
    if (comment.comment && typeof comment.comment === 'string') {
      comment.comment = parseCommentData(comment.comment);
    }
    
    setEditingComment(comment);
    setEditDialogOpen(true);
  };

  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (editorData) => {
    setEditorLoading(true);
    try {
      if (onEditComment) {
        await onEditComment({
          id: editingComment.id, 
          commentData: {
            ...editingComment,
            comment: editorData
          }
        });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setEditorLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (onDeleteComment && commentToDelete) {
        await onDeleteComment(commentToDelete);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <Box className={`${classes.container} ${propClasses.container || ''}`}>
      {editorComponent && (
        <div className={`${classes.editorContainer} ${propClasses.editorContainer || ''}`}>
          {editorComponent}
        </div>
      )}
      
      {records.length === 0 && !loading ? (
        <Typography variant="body1" className={classes.noRecords}>
          هیچ رکوردی یافت نشد. با استفاده از ادیتور بالا، اولین نظر را ثبت کنید.
        </Typography>
      ) : (
        <InfiniteScroll
          dataLength={records.length}
          next={onLoadMore}
          hasMore={hasMore}
          loader={
            <Box className={classes.spinnerContainer}>
              <CircularProgress />
            </Box>
          }
          endMessage={
            <Typography align="center" variant="body2" color="textSecondary">
              رکورد دیگری برای نمایش وجود ندارد
            </Typography>
          }
        >
          <Timeline align="alternate">
            {records.map((record) => (
              <RecordCard 
                key={record.id} 
                record={record}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUserRoles={currentUserRoles}
              />
            ))}
          </Timeline>
        </InfiniteScroll>
      )}

      {/* Edit Comment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ویرایش نظر</DialogTitle>
        <DialogContent>
          {editingComment && (
            <EditorJSComponent
              initialData={editingComment.comment}
              onSave={handleSaveEdit}
              loading={editorLoading}
              buttonText="ذخیره تغییرات"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            انصراف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            آیا از حذف این نظر اطمینان دارید؟ این عملیات قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            انصراف
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecordsTimeline;