import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Button, 
  Typography, 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  InputAdornment 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon, 
  Add as AddIcon 
} from '@mui/icons-material';
import { 
  setSearchText, 
  resetSearchText, 
  selectSearchText 
} from './store/archiveTaskSlice';

function ArchiveTaskHeader({ entityType, entityId, onCreateTaskClick }) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        {entityType && entityId 
          ? `وظایف آرشیو برای ${entityType} #${entityId}` 
          : 'وظایف آرشیو'}
      </Typography>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-16">
        <Paper className="flex items-center w-full sm:max-w-256 px-8 rounded-full border-1">
          <TextField
            placeholder="جستجو در وظایف آرشیو"
            className="flex flex-1"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => dispatch(resetSearchText())}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true
            }}
            variant="standard"
            value={searchText}
            onChange={(ev) => dispatch(setSearchText(ev.target.value))}
          />
        </Paper>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreateTaskClick}
        >
          ایجاد وظیفه آرشیو جدید
        </Button>
      </div>
    </div>
  );
}

export default ArchiveTaskHeader;