// import { useState, useEffect } from "react";
// import Typography from "@mui/material/Typography";
// import { motion } from "framer-motion";
// import FuseLoading from "@fuse/core/FuseLoading";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Button from "@mui/material/Button";
// import ServiceItem from "../components/ServiceItem";
// import NewServiceItem from "../components/NewServiceItem";
// import ServiceFilterDrawer from "../components/ServiceFilterDrawer";
// import { useGetServicesSubCategoriesByCategoryIdQuery } from "../ServicesBankApi";
// import { Input } from "@mui/material";
// import SubCategoryItem from "../components/subcategory/SubCategoryItem";

// function SubCategories() {
//   const { data: responseData, isLoading } = useGetServicesSubCategoriesByCategoryIdQuery({
//     pageSize: 12,
//     pageNumber: 1,
//   });
//   const apiServices = responseData?.data || [];

//   const [draftServiceSubCategories, setDraftServices] = useState(() => {
//     return JSON.parse(localStorage.getItem("draftServiceSubCategories")) || [];
//   });

//   const [allServices, setAllServices] = useState([]);
//   useEffect(() => {
//     setAllServices([...apiServices, ...draftServiceSubCategories]);
//   }, [apiServices, draftServiceSubCategories]);

//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const items = Array.from(allServices);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setAllServices(items);

//     const finalOrdering = items
//       .slice()
//       .reverse()
//       .map((item, index) => ({
//         name: item.name || "بدون نام",
//         order: index + 1,
//       }));
//     localStorage.setItem("finalOrdering", JSON.stringify(finalOrdering));
//   };

//   const handleDraftCreated = () => {
//     const drafts = JSON.parse(localStorage.getItem("draftServiceSubCategories")) || [];
//     setDraftServices(drafts);
//   };

//   const handleRemoveDraft = (draftId) => {
//     const drafts = JSON.parse(localStorage.getItem("draftServiceSubCategories")) || [];
//     const updated = drafts.filter((draft) => draft.id !== draftId);
//     localStorage.setItem("draftServiceSubCategories", JSON.stringify(updated));
//     setDraftServices(updated);
//   };

//   const handleClearDrafts = () => {
//     localStorage.removeItem("draftServiceSubCategories");
//     setDraftServices([]);
//   };

//   const [filterOpen, setFilterOpen] = useState(false);
//   const [filterParams, setFilterParams] = useState({});
//   const handleOpenFilter = () => setFilterOpen(true);
//   const handleCloseFilter = () => setFilterOpen(false);
//   const handleApplyFilters = (filters) => {
//     setFilterParams(filters);
//   };

//   const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
//   const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

//   if (isLoading) {
//     return <FuseLoading />;
//   }

//   return (
//     <div className="flex flex-col items-center container p-8 sm:p-16">
// 	  <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1, transition: { delay: 0.1 } }}
//       >
//         <Typography variant="h4" className="mt-8 mb-32 text-center font-extrabold">
//           سرویس‌های ثبت‌شده در بانک خدمات
//         </Typography>
//       </motion.div>

//       <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-8">
//         <div className="flex flex-1 items-center space-x-2 space-x-reverse me-4">
//           <Input
//             type="text"
//             placeholder="جستجوی خدمت ارائه شده "
//             className="flex-1 p-2 border-t-0 border-l-0 border-r-0 border border-gray-300 rounded me-4"
//           />
//           <Button variant="contained" color="primary" onClick={handleOpenFilter}>
//             فیلترها
//           </Button>
//         </div>
//         {draftServiceSubCategories.length > 0 && (
//           <Button variant="outlined" color="error" onClick={handleClearDrafts} className="mt-4 ms-4 sm:mt-0">
//             پاک کردن پیش‌نویس‌ها
//           </Button>
//         )}
//       </div>

//       <ServiceFilterDrawer
//         open={filterOpen}
//         onClose={handleCloseFilter}
//         onApplyFilters={handleApplyFilters}
//         subcategoryOptions={[]} 
//       />

    
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="services" direction="horizontal">
//           {(provided) => (
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="show"
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//             >
//               {allServices.map((service, index) => (
//                 <Draggable key={service.subCategoryId} draggableId={service.subCategoryId.toString()} index={index}>
//                   {(providedDraggable) => (
//                     <motion.div
//                       variants={itemVariants}
//                       ref={providedDraggable.innerRef}
//                       {...providedDraggable.draggableProps}
//                       {...providedDraggable.dragHandleProps}
//                       className="min-h-80"
//                     >
//                       <SubCategoryItem service={service} onRemoveDraft={handleRemoveDraft} />
//                     </motion.div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//               <Draggable key="new-service" draggableId="new-service" index={allServices.length}>
//                 {(providedDraggable) => (
//                   <motion.div
//                     variants={itemVariants}
//                     ref={providedDraggable.innerRef}
//                     {...providedDraggable.draggableProps}
//                     {...providedDraggable.dragHandleProps}
//                     className="min-w-full sm:min-w-224 min-h-360"
//                   >
//                     <NewServiceItem onDraftCreated={handleDraftCreated} />
//                   </motion.div>
//                 )}
//               </Draggable>
//             </motion.div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// }

// export default SubCategories;

// src/app/main/banks/services/subcategories/Subcategories.jsx
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, TextField, InputAdornment, Paper, Alert, Snackbar } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ServiceFilterDrawer from "../components/ServiceFilterDrawer";
import SubcategoryCard from "../components/subcategory/SubCategoryCard";
import { useGetServicesSubCategoriesByCategoryIdQuery } from "../ServicesBankApi";

function Subcategories() {
  const { data: responseData, isLoading } = useGetServicesSubCategoriesByCategoryIdQuery({
    categoryId: 4,  // Service Bank category ID
    pageSize: 50,   // Get more to handle all subcategories
    pageNumber: 1,
  });
  // const [updateSubcategoryOrder] = useUpdateSubcategoryOrderMutation();
  const apiSubcategories = responseData?.data || [];
  
  const [subcategories, setSubcategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (apiSubcategories.length > 0) {
      // Sort by pageOrder initially
      const sortedSubcategories = [...apiSubcategories].sort((a, b) => 
        (a.subCategoryPageOrder || 0) - (b.subCategoryPageOrder || 0)
      );
      setSubcategories(sortedSubcategories);
    }
  }, [apiSubcategories]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(subcategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state immediately for better UX
    setSubcategories(items);
    
    // Prepare the reordering data
    const updates = items.map((item, index) => ({
      id: item.subCategoryId,
      pageOrder: index + 1,
    }));
    
    try {
      // Call API to update the order
      const response = {}//await updateSubcategoryOrder(updates).unwrap();
      
      if (response.status === 200) {
        showNotification("زیرشاخه‌ها با موفقیت مرتب‌سازی شدند", "success");
      } else {
        showNotification("خطا در مرتب‌سازی زیرشاخه‌ها", "error");
        // Revert to original order from API
        setSubcategories([...apiSubcategories].sort((a, b) => 
          (a.subCategoryPageOrder || 0) - (b.subCategoryPageOrder || 0)
        ));
      }
    } catch (error) {
      console.error("Failed to update subcategory order:", error);
      showNotification("خطا در ذخیره ترتیب جدید", "error");
      // Revert to original order from API
      setSubcategories([...apiSubcategories].sort((a, b) => 
        (a.subCategoryPageOrder || 0) - (b.subCategoryPageOrder || 0)
      ));
    }
  };

  const handleOpenFilter = () => setFilterOpen(true);
  const handleCloseFilter = () => setFilterOpen(false);
  
  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
    // Apply filters to subcategories
    let filtered = [...apiSubcategories];
    
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    setSubcategories(filtered);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    if (!e.target.value.trim()) {
      // If search is cleared, reset to all subcategories (with filters applied)
      handleApplyFilters(filterParams);
      return;
    }
    
    // Filter by search term
    const term = e.target.value.toLowerCase();
    const filtered = apiSubcategories.filter(
      item => 
        (item.subCategoryDisplayName && item.subCategoryDisplayName.toLowerCase().includes(term)) || 
        (item.subCategoryName && item.subCategoryName.toLowerCase().includes(term))
    );
    
    setSubcategories(filtered);
  };
  
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  const closeNotification = () => {
    setNotification({...notification, open: false});
  };

  const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) {
    return <FuseLoading />;
  }

  const filteredSubcategories = searchTerm.trim() 
    ? subcategories.filter(
        item => 
          (item.subCategoryDisplayName && item.subCategoryDisplayName.toLowerCase().includes(searchTerm.toLowerCase())) || 
          (item.subCategoryName && item.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : subcategories;

  return (
    <div className="flex flex-col p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="flex flex-col sm:flex-row items-center justify-between mb-8"
      >
        <Typography variant="h4" className="text-2xl font-bold">
          زیرشاخه‌های بانک خدمات
        </Typography>
        
        <div className="flex items-center mt-4 sm:mt-0">
          <Button 
            variant="contained" 
            color="secondary"
            className="ml-2"
            onClick={handleOpenFilter}
            startIcon={<FuseSvgIcon>heroicons-outline:filter</FuseSvgIcon>}
          >
            فیلترها
          </Button>
        </div>
      </motion.div>

      <Paper className="flex flex-col p-6 mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <Typography className="text-lg font-medium mb-4 sm:mb-0">
            مدیریت و مرتب‌سازی زیرشاخه‌ها
          </Typography>
          
          <TextField
            className="w-full sm:w-1/3"
            placeholder="جستجو در زیرشاخه‌ها..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <Typography variant="body2" color="textSecondary" className="mt-2 mb-4">
          برای تغییر ترتیب نمایش زیرشاخه‌ها، کارت‌ها را بکشید و جابجا کنید.
        </Typography>
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="subcategories" direction="horizontal">
          {(provided) => (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredSubcategories.map((subcategory, index) => (
                <Draggable
                  key={subcategory.subCategoryId.toString()}
                  draggableId={subcategory.subCategoryId.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-shadow ${snapshot.isDragging ? 'z-10' : ''}`}
                    >
                      <motion.div variants={itemVariants}>
                        <SubcategoryCard subcategory={subcategory} />
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredSubcategories.length === 0 && !isLoading && (
        <div className="flex justify-center items-center p-12">
          <Paper className="p-8 text-center" elevation={2}>
            <FuseSvgIcon size={48} color="disabled">heroicons-outline:folder-open</FuseSvgIcon>
            <Typography className="mt-4 text-lg font-medium">
              {searchTerm ? "هیچ زیرشاخه‌ای با این عبارت یافت نشد" : "هیچ زیرشاخه‌ای وجود ندارد"}
            </Typography>
            <Typography className="mt-2 text-sm" color="textSecondary">
              لطفاً عبارت جستجو را تغییر دهید یا فیلترها را بررسی کنید
            </Typography>
          </Paper>
        </div>
      )}

      <ServiceFilterDrawer
        open={filterOpen}
        onClose={handleCloseFilter}
        onApplyFilters={handleApplyFilters}
        subcategoryOptions={[]} 
      />
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Subcategories;