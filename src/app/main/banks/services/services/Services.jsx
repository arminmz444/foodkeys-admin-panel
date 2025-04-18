import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "@mui/material/Button";
import ServiceItem from "../components/ServiceItem";
import NewServiceItem from "../components/NewServiceItem";
import ServiceFilterDrawer from "../components/ServiceFilterDrawer";
import { useGetServicesQuery } from "../ServicesBankApi";
import { Input } from "@mui/material";

function Services() {
  const { data: responseData, isLoading } = useGetServicesQuery({
    pageSize: 12,
    pageNumber: 1,
  });
  const apiServices = responseData?.data || [];

  const [draftServices, setDraftServices] = useState(() => {
    return JSON.parse(localStorage.getItem("draftServices")) || [];
  });

  const [allServices, setAllServices] = useState([]);
  useEffect(() => {
    setAllServices([...apiServices, ...draftServices]);
  }, [apiServices, draftServices]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(allServices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAllServices(items);

    const finalOrdering = items
      .slice()
      .reverse()
      .map((item, index) => ({
        name: item.name || "بدون نام",
        order: index + 1,
      }));
    localStorage.setItem("finalOrdering", JSON.stringify(finalOrdering));
  };

  const handleDraftCreated = () => {
    const drafts = JSON.parse(localStorage.getItem("draftServices")) || [];
    setDraftServices(drafts);
  };

  const handleRemoveDraft = (draftId) => {
    const drafts = JSON.parse(localStorage.getItem("draftServices")) || [];
    const updated = drafts.filter((draft) => draft.id !== draftId);
    localStorage.setItem("draftServices", JSON.stringify(updated));
    setDraftServices(updated);
  };

  const handleClearDrafts = () => {
    localStorage.removeItem("draftServices");
    setDraftServices([]);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const handleOpenFilter = () => setFilterOpen(true);
  const handleCloseFilter = () => setFilterOpen(false);
  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
  };

  const containerVariants = { show: { transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col items-center container p-8 sm:p-16">
	  <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
      >
        <Typography variant="h4" className="mt-8 mb-32 text-center font-extrabold">
          سرویس‌های ثبت‌شده در بانک خدمات
        </Typography>
      </motion.div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex flex-1 items-center space-x-2 space-x-reverse me-4">
          <Input
            type="text"
            placeholder="جستجوی سرویس "
            className="flex-1 p-2 border-t-0 border-l-0 border-r-0 border border-gray-300 rounded me-4"
          />
          <Button variant="contained" color="primary" onClick={handleOpenFilter}>
            فیلترها
          </Button>
        </div>
        {draftServices.length > 0 && (
          <Button variant="outlined" color="error" onClick={handleClearDrafts} className="mt-4 ms-4 sm:mt-0">
            پاک کردن پیش‌نویس‌ها
          </Button>
        )}
      </div>

      <ServiceFilterDrawer
        open={filterOpen}
        onClose={handleCloseFilter}
        onApplyFilters={handleApplyFilters}
        subcategoryOptions={[]} 
      />

    
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="services" direction="horizontal">
          {(provided) => (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {allServices.map((service, index) => (
                <Draggable key={service.id} draggableId={service.id.toString()} index={index}>
                  {(providedDraggable) => (
                    <motion.div
                      variants={itemVariants}
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      className="min-h-80"
                    >
                      <ServiceItem service={service} onRemoveDraft={handleRemoveDraft} />
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <Draggable key="new-service" draggableId="new-service" index={allServices.length}>
                {(providedDraggable) => (
                  <motion.div
                    variants={itemVariants}
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                    className="min-w-full sm:min-w-224 min-h-360"
                  >
                    <NewServiceItem onDraftCreated={handleDraftCreated} />
                  </motion.div>
                )}
              </Draggable>
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Services;
