// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Typography,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Switch,
//   Button,
//   Alert,
//   Box,
//   Paper,
// } from "@mui/material";
// import { Add, ShoppingCart, Delete, Settings } from "@mui/icons-material";
// import SmsEditor from "./components/SmsEditor";
// import TestSmsPanel from "./components/TestSmsPanel";
// import CreateTemplateModal from "./components/CreateTemplateModal";
// import SmartTextModal from "./components/SmartTextModal";
// import RecipientListModal from "./components/RecipientListModal";
// import {
//   setSelectedSmsTemplate,
//   addSmsTemplate,
//   updateSmsTemplate,
// } from "./store/templatesSlice";

// function SmsTemplatesContent() {
//   const dispatch = useDispatch();
//   const templates = useSelector(
//     (state) => state.messagingApp.templates.smsTemplates
//   );
//   const systemTemplates = useSelector(
//     (state) => state.messagingApp.templates.systemSmsTemplates
//   );
//   const selectedTemplate = useSelector(
//     (state) => state.messagingApp.templates.selectedSmsTemplate
//   );

//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [smartTextModalOpen, setSmartTextModalOpen] = useState(false);
//   const [recipientModalOpen, setRecipientModalOpen] = useState(false);
//   const [templateEnabled, setTemplateEnabled] = useState(true);
//   const [charCount, setCharCount] = useState(66);
//   const [templateSaved, setTemplateSaved] = useState(true);

//   const handleCreateTemplate = (name) => {
//     const newTemplate = {
//       id: Date.now().toString(),
//       name,
//       subject: name,
//       body: "",
//       isSystem: false,
//     };
//     dispatch(addSmsTemplate(newTemplate));
//     dispatch(setSelectedSmsTemplate(newTemplate));
//     setCreateModalOpen(false);
//   };

//   const handleSaveTemplate = () => {
//     dispatch(updateSmsTemplate(selectedTemplate));
//     setTemplateSaved(true);
//   };

//   const handleAddSmartText = (property, defaultValue) => {
//     setSmartTextModalOpen(false);
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
//       {/* Sidebar */}
//       <Box
//         sx={{
//           width: 240,
//           backgroundColor: "#1e2738",
//           color: "white",
//           borderRight: "1px solid rgba(255, 255, 255, 0.1)",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "auto",
//         }}
//       >
//         <Box
//           sx={{
//             p: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "white" }}>
//             SMS Templates
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", p: 1, gap: 1 }}>
//           <IconButton
//             size="small"
//             sx={{ color: "white" }}
//             onClick={() => setCreateModalOpen(true)}
//           >
//             <Add />
//           </IconButton>
//           <IconButton size="small" sx={{ color: "white" }}>
//             <ShoppingCart />
//           </IconButton>
//           <IconButton size="small" sx={{ color: "white" }}>
//             <Delete />
//           </IconButton>
//           <IconButton size="small" sx={{ color: "white" }}>
//             <Settings />
//           </IconButton>
//         </Box>

//         <List component="nav" sx={{ mt: 2 }}>
//           <ListItem sx={{ color: "white", fontWeight: "bold" }}>
//             <ListItemText primary="SYSTEM TEMPLATES" />
//           </ListItem>

//           {systemTemplates.map((template) => (
//             <ListItem
//               key={template.id}
//               component="div"
//               selected={selectedTemplate?.id === template.id}
//               onClick={() => dispatch(setSelectedSmsTemplate(template))}
//               sx={{
//                 cursor: "pointer",
//                 backgroundColor:
//                   selectedTemplate?.id === template.id
//                     ? "rgba(66, 133, 244, 0.15)"
//                     : "transparent",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 32 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     backgroundColor: template.name.includes("OTP")
//                       ? "#4caf50"
//                       : "#f44336",
//                   }}
//                 />
//               </ListItemIcon>
//               <ListItemText
//                 primary={template.name}
//                 primaryTypographyProps={{
//                   sx: { color: "white", fontSize: "0.875rem" },
//                 }}
//               />
//             </ListItem>
//           ))}

//           <Divider
//             sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
//           />

//           <ListItem sx={{ color: "white", fontWeight: "bold" }}>
//             <ListItemText primary="CUSTOM TEMPLATES" />
//           </ListItem>

//           {templates.map((template) => (
//             <ListItem
//               key={template.id}
//               component="div"
//               selected={selectedTemplate?.id === template.id}
//               onClick={() => dispatch(setSelectedSmsTemplate(template))}
//               sx={{
//                 cursor: "pointer",
//                 backgroundColor:
//                   selectedTemplate?.id === template.id
//                     ? "rgba(66, 133, 244, 0.15)"
//                     : "transparent",
//                 "&:hover": {
//                   backgroundColor: "rgba(255, 255, 255, 0.05)",
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 32 }}>
//                 <Box
//                   sx={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     backgroundColor: "#4caf50",
//                   }}
//                 />
//               </ListItemIcon>
//               <ListItemText
//                 primary={template.name}
//                 primaryTypographyProps={{
//                   sx: { color: "white", fontSize: "0.875rem" },
//                 }}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Main Content */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "background.paper",
//           overflow: "auto",
//         }}
//       >
//         <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
//           {/* SMS Editor */}
//           <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2,
//                 mb: 3,
//                 backgroundColor: "#e6f7ff",
//                 borderRadius: 1,
//               }}
//             >
//               <Typography>
//                 A system SMS template is associated with an event occurring in
//                 the system. Select and enter the subject line and the text of
//                 the message. When the event occurs, Backendless delivers the SMS
//                 message to the corresponding user.
//               </Typography>
//             </Paper>

//             <SmsEditor
//               template={selectedTemplate}
//               onOpenSmartText={() => setSmartTextModalOpen(true)}
//               onCharCountChange={setCharCount}
//               onContentChange={() => setTemplateSaved(false)}
//             />

//             <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
//               {!templateSaved && (
//                 <Alert severity="warning" sx={{ mr: 2 }}>
//                   SMS Template is not saved
//                 </Alert>
//               )}
//               <Box sx={{ flex: 1 }} />
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
//                   onClick={handleSaveTemplate}
//                 >
//                   SAVE TEMPLATE
//                 </Button>
//                 <Button variant="outlined">GENERATE CODE</Button>
//               </Box>
//             </Box>

//             <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
//               <Switch
//                 checked={templateEnabled}
//                 onChange={(e) => setTemplateEnabled(e.target.checked)}
//                 color="primary"
//               />
//               <Typography sx={{ ml: 1 }}>SMS Template Enabled</Typography>
//               <IconButton size="small" sx={{ ml: 0.5 }}>
//                 <Settings fontSize="small" />
//               </IconButton>
//             </Box>

//             {selectedTemplate && (
//               <Paper
//                 elevation={0}
//                 sx={{
//                   mt: 3,
//                   p: 2,
//                   backgroundColor: "#e6f7ff",
//                   borderRadius: 1,
//                 }}
//               >
//                 <Typography variant="h6" sx={{ mb: 1 }}>
//                   Substitution variables:
//                 </Typography>
//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(2, 1fr)",
//                     gap: 1,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Box
//                       component="span"
//                       sx={{
//                         bgcolor: "rgba(0, 0, 0, 0.1)",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {"{phone_number}"}
//                     </Box>
//                     <Box component="span" sx={{ ml: 1 }}>
//                       - User's phone number
//                     </Box>
//                   </Box>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Box
//                       component="span"
//                       sx={{
//                         bgcolor: "rgba(0, 0, 0, 0.1)",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {"{otp_code}"}
//                     </Box>
//                     <Box component="span" sx={{ ml: 1 }}>
//                       - One-time password code
//                     </Box>
//                   </Box>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Box
//                       component="span"
//                       sx={{
//                         bgcolor: "rgba(0, 0, 0, 0.1)",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {"{user_object_id}"}
//                     </Box>
//                     <Box component="span" sx={{ ml: 1 }}>
//                       - User's objectId parameter name
//                     </Box>
//                   </Box>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Box
//                       component="span"
//                       sx={{
//                         bgcolor: "rgba(0, 0, 0, 0.1)",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {"{company_name}"}
//                     </Box>
//                     <Box component="span" sx={{ ml: 1 }}>
//                       - Company name
//                     </Box>
//                   </Box>
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <Box
//                       component="span"
//                       sx={{
//                         bgcolor: "rgba(0, 0, 0, 0.1)",
//                         px: 1,
//                         py: 0.5,
//                         borderRadius: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     >
//                       {"{app_name}"}
//                     </Box>
//                     <Box component="span" sx={{ ml: 1 }}>
//                       - Application name
//                     </Box>
//                   </Box>
//                 </Box>
//               </Paper>
//             )}
//           </Box>

//           {/* Test SMS Panel */}
//           <TestSmsPanel />
//         </Box>
//       </Box>

//       {/* Modals */}
//       <CreateTemplateModal
//         open={createModalOpen}
//         onClose={() => setCreateModalOpen(false)}
//         onCreate={handleCreateTemplate}
//         type="SMS"
//       />

//       <SmartTextModal
//         open={smartTextModalOpen}
//         onClose={() => setSmartTextModalOpen(false)}
//         onAddSmartText={handleAddSmartText}
//         type="SMS"
//       />

//       <RecipientListModal
//         open={recipientModalOpen}
//         onClose={() => setRecipientModalOpen(false)}
//         type="SMS"
//       />

//       {/* Floating Action Button */}
//       <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
//           onClick={() => setRecipientModalOpen(true)}
//         >
//           Manage Recipients
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default SmsTemplatesContent;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  Button,
  Alert,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Add, ShoppingCart, Delete, Settings } from "@mui/icons-material";
import SmsEditor from "./components/SmsEditor";
import TestSmsPanel from "./components/TestSmsPanel";
import CreateTemplateModal from "./components/CreateTemplateModal";
import SmartTextModal from "./components/SmartTextModal";
import RecipientListModal from "./components/RecipientListModal";
import {
  setSelectedSmsTemplate,
  addSmsTemplate,
  updateSmsTemplate,
  deleteSmsTemplate,
} from "./store/templatesSlice";
import { 
  useGetSmsTemplatesQuery,
  useUpdateSmsTemplateMutation,
  useDeleteSmsTemplateMutation 
} from "./api/templatesApi";
import FuseLoading from "@fuse/core/FuseLoading";

function SmsTemplatesContent() {
  const dispatch = useDispatch();
  
  // Use redux store and API data together
  const { data: apiTemplates, isLoading } = useGetSmsTemplatesQuery({ 
    pageNumber: 1,
    pageSize: 50,
    search: "",
  });
  
  const templates = useSelector(
    (state) => state.messagingApp.templates.smsTemplates
  );
  const systemTemplates = useSelector(
    (state) => state.messagingApp.templates.systemSmsTemplates
  );
  const selectedTemplate = useSelector(
    (state) => state.messagingApp.templates.selectedSmsTemplate
  );

  

  // Update templates in redux store when API data changes
  useEffect(() => {
    if (apiTemplates?.data) {
      // Update redux store with API data
      // (In a real implementation, you'd dispatch actions here)
    }
  }, [apiTemplates, dispatch]);

  const [updateSmsTemplateApi] = useUpdateSmsTemplateMutation();
  const [deleteSmsTemplateApi] = useDeleteSmsTemplateMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [smartTextModalOpen, setSmartTextModalOpen] = useState(false);
  const [recipientModalOpen, setRecipientModalOpen] = useState(false);
  const [templateEnabled, setTemplateEnabled] = useState(true);
  const [charCount, setCharCount] = useState(66);
  const [templateSaved, setTemplateSaved] = useState(true);

  if (isLoading)
    return <FuseLoading />

  const handleCreateTemplate = (newTemplate) => {
    dispatch(addSmsTemplate(newTemplate));
    dispatch(setSelectedSmsTemplate(newTemplate));
    setCreateModalOpen(false);
  };

  const handleSaveTemplate = async () => {
    // Update in store
    dispatch(updateSmsTemplate({
      ...selectedTemplate,
      enabled: templateEnabled
    }));
    
    // Update via API
    try {
      await updateSmsTemplateApi({
        id: selectedTemplate.id,
        ...selectedTemplate,
        enabled: templateEnabled
      }).unwrap();
      
      setTemplateSaved(true);
    } catch (error) {
      alert("خطا در ذخیره قالب: " + (error.data?.message || error.message || "خطای نامشخص"));
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm("آیا از حذف این قالب اطمینان دارید؟")) {
      try {
        // Delete via API
        await deleteSmsTemplateApi(id).unwrap();
        
        // Delete in store
        dispatch(deleteSmsTemplate(id));
      } catch (error) {
        alert("خطا در حذف قالب: " + (error.data?.message || error.message || "خطای نامشخص"));
      }
    }
  };

  const handleAddSmartText = (property, defaultValue) => {
    // Add smart text to the template
    setSmartTextModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: "#1e2738",
          color: "white",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            قالب‌های پیامک
          </Typography>
        </Box>
        <Box sx={{ display: "flex", p: 1, gap: 1 }}>
          <IconButton
            size="small"
            sx={{ color: "white" }}
            onClick={() => setCreateModalOpen(true)}
          >
            <Add />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <ShoppingCart />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <Delete />
          </IconButton>
          <IconButton size="small" sx={{ color: "white" }}>
            <Settings />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} sx={{ color: "white" }} />
          </Box>
        ) : (
          <List component="nav" sx={{ mt: 2 }}>
            <ListItem sx={{ color: "white", fontWeight: "bold" }}>
              <ListItemText primary="قالب‌های سیستمی" />
            </ListItem>

            {systemTemplates.map((template) => (
              <ListItem
                key={template.id}
                component="div"
                selected={selectedTemplate?.id === template.id}
                onClick={() => dispatch(setSelectedSmsTemplate(template))}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedTemplate?.id === template.id
                      ? "rgba(66, 133, 244, 0.15)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: template.name.includes("رمز") || template.name.includes("تایید")
                        ? "#4caf50"
                        : "#f44336",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  primaryTypographyProps={{
                    sx: { color: "white", fontSize: "0.875rem" },
                  }}
                />
              </ListItem>
            ))}

            <Divider
              sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            />

            <ListItem sx={{ color: "white", fontWeight: "bold" }}>
              <ListItemText primary="قالب‌های سفارشی" />
            </ListItem>

            {templates.map((template) => (
              <ListItem
                key={template.id}
                component="div"
                selected={selectedTemplate?.id === template.id}
                onClick={() => dispatch(setSelectedSmsTemplate(template))}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedTemplate?.id === template.id
                      ? "rgba(66, 133, 244, 0.15)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#4caf50",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  primaryTypographyProps={{
                    sx: { color: "white", fontSize: "0.875rem" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* SMS Editor */}
          <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#e6f7ff",
                borderRadius: 1,
              }}
            >
              <Typography>
                یک قالب پیامک سیستمی با یک رویداد در سیستم مرتبط است. موضوع و متن پیام را انتخاب و وارد کنید. هنگامی که رویداد رخ می‌دهد، سیستم پیام پیامک را به کاربر مربوطه ارسال می‌کند.
              </Typography>
            </Paper>

            <SmsEditor
              template={selectedTemplate}
              onOpenSmartText={() => setSmartTextModalOpen(true)}
              onCharCountChange={setCharCount}
              onContentChange={() => setTemplateSaved(false)}
            />

            <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
              {!templateSaved && (
                <Alert severity="warning" sx={{ mr: 2 }}>
                  قالب پیامک ذخیره نشده است
                </Alert>
              )}
              <Box sx={{ flex: 1 }} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                  onClick={handleSaveTemplate}
                >
                  ذخیره قالب
                </Button>
                <Button variant="outlined">تولید کد</Button>
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
              <Switch
                checked={templateEnabled}
                onChange={(e) => setTemplateEnabled(e.target.checked)}
                color="primary"
              />
              <Typography sx={{ ml: 1 }}>قالب پیامک فعال است</Typography>
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <Settings fontSize="small" />
              </IconButton>
            </Box>

            {selectedTemplate && (
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#e6f7ff",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  متغیرهای جایگزین:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {"{phone_number}"}
                    </Box>
                    <Box component="span" sx={{ mr: 1 }}>
                      - شماره تلفن کاربر
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {"{otp_code}"}
                    </Box>
                    <Box component="span" sx={{ mr: 1 }}>
                      - کد رمز یکبار مصرف
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {"{user_object_id}"}
                    </Box>
                    <Box component="span" sx={{ mr: 1 }}>
                      - شناسه کاربر
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {"{company_name}"}
                    </Box>
                    <Box component="span" sx={{ mr: 1 }}>
                      - نام شرکت
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.1)",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      {"{app_name}"}
                    </Box>
                    <Box component="span" sx={{ mr: 1 }}>
                      - نام برنامه
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>

          {/* Test SMS Panel */}
          <TestSmsPanel />
        </Box>
      </Box>

      {/* Modals */}
      <CreateTemplateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateTemplate}
        type="SMS"
      />

      <SmartTextModal
        open={smartTextModalOpen}
        onClose={() => setSmartTextModalOpen(false)}
        onAddSmartText={handleAddSmartText}
        type="SMS"
      />

      <RecipientListModal
        open={recipientModalOpen}
        onClose={() => setRecipientModalOpen(false)}
        type="SMS"
      />

      {/* Floating Action Button */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
          onClick={() => setRecipientModalOpen(true)}
        >
          مدیریت گیرندگان
        </Button>
      </Box>
    </Box>
  );
}

export default SmsTemplatesContent;