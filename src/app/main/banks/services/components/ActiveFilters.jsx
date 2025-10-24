import { Chip, Box } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  // Service status options
  const serviceStatusOptions = [
    { value: 0, label: 'در انتظار تایید' },
    { value: 1, label: 'تایید شده' },
    { value: 2, label: 'رد شده' },
    { value: 3, label: 'آرشیو شده' },
    { value: 4, label: 'حذف شده' },
    { value: 5, label: 'ویرایش شده' },
    { value: 6, label: 'منتشر شده' },
    { value: 7, label: 'بازبینی' },
    { value: 8, label: 'ثبت اولیه' }
  ];

  const getFilterLabel = (key, value) => {
    const labels = {
      name: 'نام سرویس',
      description: 'توضیحات',
      subCategoryId: 'زیر شاخه',
      ranking: 'رتبه',
      rankingAll: 'رتبه کل',
      keyWords: 'کلمات کلیدی',
      tags: 'تگ‌ها',
      status: 'وضعیت',
      visit: 'تعداد بازدید'
    };
    return labels[key] || key;
  };

  const getFilterValue = (key, value) => {
    if (key === 'status') {
      const status = serviceStatusOptions.find(option => option.value === value);
      return status ? status.label : value;
    }
    if (key === 'subCategoryId' && typeof value === 'string') {
      // If it's a subcategory ID, we might want to show the name instead
      return value;
    }
    return value;
  };

  const activeFilters = Object.entries(filters).filter(([_key, value]) => 
    value !== '' && value !== null && value !== undefined
  );

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">فیلترهای فعال:</span>
        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-800 underline"
          >
            پاک کردن همه
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <Chip
            key={key}
            label={`${getFilterLabel(key, value)}: ${getFilterValue(key, value)}`}
            onDelete={() => onRemoveFilter(key)}
            deleteIcon={<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>}
            variant="outlined"
            size="small"
            className="text-xs"
          />
        ))}
      </div>
    </Box>
  );
}

export default ActiveFilters;
