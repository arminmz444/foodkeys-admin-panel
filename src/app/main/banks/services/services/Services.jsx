import { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import _ from '@lodash';
import ServiceItem from '../components/ServiceItem';
import NewServiceItem from '../components/NewServiceItem';
import ServiceFilterDrawer from '../components/ServiceFilterDrawer';
import ActiveFilters from '../components/ActiveFilters';
import { useGetServicesQuery, useGetServiceSubcategoryOptionsQuery } from '../ServicesBankApi';

function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filterParams, setFilterParams] = useState({});

  const { data: subcategoryOptionsData } = useGetServiceSubcategoryOptionsQuery();
  const subcategoryOptions = subcategoryOptionsData?.data || [];
  const { data: responseData, isLoading } = useGetServicesQuery({
    pageSize: 999,
    pageNumber: 1,
    search: debouncedSearchQuery,
    filters: filterParams,
  });

  // Debug log to see the current search state
  // console.log('Current search states:', { searchQuery, debouncedSearchQuery });
  const apiServices = responseData?.data || [];

  const [draftServices, setDraftServices] = useState(() => {
    // eslint-disable-next-line no-undef
    return JSON.parse(localStorage.getItem('draftServices')) || [];
  });

  const [allServices, setAllServices] = useState([]);
  useEffect(() => {
    // Put draft services first, then API services
    setAllServices([...draftServices, ...apiServices]);
  }, [apiServices, draftServices]);

  // Debounced search effect
  useEffect(() => {
    const debouncedSearch = _.debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 500);

    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

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
        name: item.name || 'بدون نام',
        order: index + 1,
      }));
    // eslint-disable-next-line no-undef
    localStorage.setItem('finalOrdering', JSON.stringify(finalOrdering));
  };

  const handleDraftCreated = () => {
    // eslint-disable-next-line no-undef
    const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
    setDraftServices(drafts);
  };

  const handleRemoveDraft = (draftId) => {
    // eslint-disable-next-line no-undef
    const drafts = JSON.parse(localStorage.getItem('draftServices')) || [];
    const updated = drafts.filter((draft) => draft.id !== draftId);
    // eslint-disable-next-line no-undef
    localStorage.setItem('draftServices', JSON.stringify(updated));
    setDraftServices(updated);
  };

  const handleClearDrafts = () => {
    // eslint-disable-next-line no-undef
    localStorage.removeItem('draftServices');
    setDraftServices([]);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const handleOpenFilter = () => setFilterOpen(true);
  const handleCloseFilter = () => setFilterOpen(false);
  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filterParams };
    delete newFilters[filterKey];
    setFilterParams(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilterParams({});
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
            placeholder='جستجوی سرویس '
            value={searchQuery}
            onChange={handleSearchChange}
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

      <ActiveFilters
        filters={filterParams}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      <ServiceFilterDrawer
        open={filterOpen}
        onClose={handleCloseFilter}
        onApplyFilters={handleApplyFilters}
        subcategoryOptions={subcategoryOptions || []} 
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
              {/* NewServiceItem as first item */}
              <Draggable key="new-service" draggableId="new-service" index={0}>
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
              
              {/* All services starting from index 1 */}
              {allServices.map((service, index) => (
                <Draggable key={service.id} draggableId={service.id.toString()} index={index + 1}>
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
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Services;
