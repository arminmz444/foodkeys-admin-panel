<!-- 036d8862-4cba-44e2-959e-0829f85bd98f f0440068-8e95-4508-bfe6-0e199f07836b -->
# Enable Filtering and Global Search in GenericCrudTable

## Overview

Refactor filtering and search functionality to provide generic defaults in `GenericCrudTable.jsx` while allowing per-table customization.

## Implementation Steps

### 1. Add Default Filter Transformation to GenericCrudTable

**File: `src/app/shared-components/data-table/GenericCrudTable.jsx`**

- Add a default `transformColumnFilters` utility function before the component (around line 111):
  ```javascript
  const defaultTransformColumnFilters = (columnFilters) => {
    return columnFilters.map(filter => {
      const { id, value } = filter;
      if (Array.isArray(value)) {
        if (value.length === 2 && typeof value[0] === 'number') {
          return `${id}:BETWEEN:${value[0]},${value[1]}`;
        } else {
          return `${id}:IN:${value.join(',')}`;
        }
      } else if (typeof value === 'boolean') {
        return `${id}:EQUALS:${value}`;
      } else if (value && value.includes('%')) {
        return `${id}:LIKE:${value}`;
      } else {
        return `${id}:EQUALS:${value}`;
      }
    });
  };
  ```

- Add new props to component signature (line 112):
  - `transformColumnFilters` - optional custom filter transformer
  - `globalFilterColumns` - optional array of column keys to search

### 2. Update Filter State Management

**File: `src/app/shared-components/data-table/GenericCrudTable.jsx`**

- Modify the `useListQueryHook` call (lines 188-197) to use transformed filters:
  ```javascript
  const transformedFilters = useMemo(() => {
    const transformer = transformColumnFilters || defaultTransformColumnFilters;
    return transformer(columnFilters);
  }, [columnFilters, transformColumnFilters]);
  ```

- Pass `transformedFilters` to the query instead of raw `columnFilters`

### 3. Fix Global Filter State Update

**File: `src/app/shared-components/data-table/GenericCrudTable.jsx`**

- Update the `onGlobalFilterChange` handler in defaults (around line 662) to properly call `setGlobalFilter`
- Ensure the global filter value is passed to backend via the `search` parameter (already in place at line 191)

### 4. Add Customizable Global Search Columns

**File: `src/app/shared-components/data-table/GenericCrudTable.jsx`**

- If `globalFilterColumns` prop is provided, modify the query to include it as a parameter
- Update the query structure in `useListQueryHook` call to support column-specific search

### 5. Update SubCategoryTable Implementation

**File: `src/app/main/category/sub-category/SubCategoryTable.jsx`**

- Remove the local `handleCustomFilter` function (lines 237-254) since it will use the default
- Remove the `onColumnFiltersChange` prop (lines 642-645) from `GenericCrudTable`
- Keep the filter UI settings:
  ```javascript
  enableFilters
  enableGlobalFilter
  enableColumnFilters
  enableFacetedValues
  columnFilterDisplayMode="popover"
  ```

- Verify `initialState` has correct filter configuration (lines 646-654)

### 6. Update Backend Query Parameters (if needed)

**File: `src/app/main/category/sub-category/SubCategoriesApi.js`**

- Verify the query string construction (line 36) properly handles:
  - `search` parameter for global filter
  - `filter` parameter for column filters (already stringified)
  - Ensure empty filters don't break the URL

### 7. Test and Verify

- Global search sends query to backend via `search` parameter
- Column filters are transformed to `columnId:OPERATOR:value` format
- Both features work together correctly
- Filter state persists correctly during pagination
- Empty/cleared filters work properly

## Key Changes Summary

1. **GenericCrudTable.jsx**: Add default filter transformer, accept override props, fix filter state management
2. **SubCategoryTable.jsx**: Remove custom filter logic, rely on defaults
3. **SubCategoriesApi.js**: Verify query parameter handling

## Notes

- The global filter already has debouncing (500ms) implemented
- Filter UI components are already in place via Material React Table
- Backend expects filters as array of `columnId:OPERATOR:value` strings
- Global search is sent via the `search` query parameter

### To-dos

- [ ] Add defaultTransformColumnFilters utility function to GenericCrudTable.jsx
- [ ] Add transformColumnFilters and globalFilterColumns props to GenericCrudTable component signature
- [ ] Create useMemo for transformed filters and update useListQueryHook to use them
- [ ] Verify and fix global filter state management and backend integration
- [ ] Remove custom handleCustomFilter and onColumnFiltersChange from SubCategoryTable.jsx
- [ ] Verify SubCategoriesApi.js query parameter construction handles filters correctly
- [ ] Test global search, column filters, and their interaction