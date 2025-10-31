# Dashboard Statistics - Implementation Guide

## Overview
This dashboard has been transformed to display comprehensive statistics about companies, services, products, users, requests, visits, transactions, and geographic distribution using the `/api/v1/dashboard/widgets` API endpoint.

## API Configuration

### Endpoint
- **URL**: `/api/v1/dashboard/widgets`
- **Method**: GET
- **Query Parameters**: 
  - `startDate` (optional): Start date for data range (yyyy-MM-dd)
  - `endDate` (optional): End date for data range (yyyy-MM-dd)
  - `granularity` (optional): DAILY/WEEKLY/MONTHLY
  - `includeCache` (optional): boolean

### API Integration
- **File**: `ProjectDashboardApi.js`
- **Hook**: `useGetDashboardWidgetsQuery()`
- **Redux Toolkit Query**: Uses RTK Query for data fetching
- **No Caching**: Data is fetched fresh on each request

## Dashboard Structure

### Tabs

#### 1. خلاصه (Overview Tab)
**Path**: `tabs/overview/OverviewTab.jsx`

Displays general statistics across all entities:
- **CompaniesStatsWidget**: Total companies with pending, verified, denied counts
- **ServicesStatsWidget**: Total services count
- **ProductsStatsWidget**: Total products, outsourced vs non-outsourced
- **UsersStatsWidget**: Total users, active, verified/unverified counts
- **RequestsStatsWidget**: Pending, resolved, denied requests with average response time
- **VisitsStatsWidget**: Total visits, company visits, service visits
- **TransactionsStatsWidget**: Total transactions with success rate and breakdown

#### 2. شرکت‌ها (Companies Tab)
**Path**: `tabs/companies/CompaniesTab.jsx`

Detailed company statistics:
- **CompanyStatusWidget**: Breakdown of all company statuses (pending, verified, denied, archived, published, etc.)
- **CompanyStatusChartWidget**: Donut chart showing percentage distribution by status
- **TopVisitedCompaniesWidget**: Table of top visited companies with visit counts
- **CompanyTimeSeriesWidget**: Line chart showing trend of new companies over time

#### 3. خدمات (Services Tab)
**Path**: `tabs/services/ServicesTab.jsx`

Service-specific statistics:
- **ServiceStatsWidget**: Total services count
- **ServiceSubCategoryWidget**: Horizontal bar chart of services by subcategory
- **TopVisitedServicesWidget**: Table of top visited services
- **ServiceTimeSeriesWidget**: Line chart showing trend of new services

#### 4. پراکندگی جغرافیایی (Geographic Tab)
**Path**: `tabs/geographic/GeographicTab.jsx`

Location-based statistics:
- **CompaniesByProvinceWidget**: Pie chart of companies distribution by province
- **TopProvincesWidget**: List of top provinces with company and service counts
- **CompaniesByCityWidget**: Bar chart of top 10 cities by company count

## Widget Structure

All widgets follow this pattern:

```jsx
import { useGetDashboardWidgetsQuery } from '../../../ProjectDashboardApi';

function WidgetName() {
    const { data: stats, isLoading } = useGetDashboardWidgetsQuery();
    
    if (isLoading) {
        return <FuseLoading />;
    }
    
    if (!stats?.specificData) {
        return null;
    }
    
    // Render widget content
}
```

## Data Structure

The API returns data in this structure:

```javascript
{
    companyStats: {
        summary: { total, pending, verified, denied, ... },
        timeSeries: { labels: [], series: [] },
        byStatus: {},
        percentageByStatus: {},
        topVisited: { companies: [] }
    },
    serviceStats: {
        total,
        bySubCategory: {},
        timeSeries: {},
        topVisited: []
    },
    productStats: {
        total,
        outsourced,
        nonOutsourced,
        byCategoryType: {}
    },
    userStats: {
        total,
        active,
        verified,
        unverified,
        byRole: {}
    },
    requestStats: {
        totalPending,
        totalResolved,
        totalDenied,
        averageResponseTimeHours
    },
    visitStats: {
        totalVisits,
        totalCompanyVisits,
        totalServiceVisits
    },
    transactionStats: {
        totalCount,
        successfulCount,
        failedCount,
        pendingCount
    },
    geographicStats: {
        companiesByProvince: {},
        companiesByCity: {},
        topProvinces: []
    }
}
```

## Chart Libraries

### ReactApexChart
Used for all charts with these types:
- **Donut Chart**: Company status distribution
- **Pie Chart**: Geographic distribution
- **Area Chart**: Time series trends
- **Bar Chart**: Category breakdowns
- **Horizontal Bar**: Service subcategories

## Styling

- **Material-UI (MUI)**: All UI components
- **Tailwind CSS**: Layout and spacing
- **Framer Motion**: Page transitions and animations
- **Color Scheme**: 
  - Blue: Companies
  - Purple: Services
  - Green: Products
  - Orange: Users
  - Red: Requests
  - Indigo: Visits
  - Teal: Transactions

## Key Features

1. **Real-time Data**: No caching, always shows current data
2. **Responsive Design**: Works on all screen sizes
3. **Persian (Farsi) Support**: All labels in Persian
4. **Loading States**: Shows loading spinner during data fetch
5. **Empty States**: Shows message when no data available
6. **Interactive Charts**: Zoom, download, and tooltip features
7. **Smooth Animations**: Framer Motion for page transitions

## Future Enhancements

To add date range selection:
```jsx
// In ProjectDashboardApp.jsx
const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
const { data, isLoading } = useGetDashboardWidgetsQuery(dateRange);
```

To enable caching (when backend supports it):
```javascript
// In ProjectDashboardApi.js
getDashboardWidgets: build.query({
    query: (params) => ({ 
        url: `/api/v1/dashboard/widgets`,
        params: { ...params, includeCache: true }
    }),
    keepUnusedDataFor: 300, // 5 minutes
})
```

## Testing

Test the dashboard by:
1. Navigate to `/dashboards/project`
2. Verify all tabs load correctly
3. Check that data displays from your API
4. Ensure charts render properly
5. Test responsive design on mobile

## Troubleshooting

**No data showing?**
- Check browser console for API errors
- Verify JWT token is valid
- Confirm API endpoint is accessible
- Check network tab for API response

**Charts not rendering?**
- Ensure `react-apexcharts` is installed
- Check that data structure matches expected format
- Verify time series has labels and series data

**Loading forever?**
- Check API response time
- Verify Redux store is configured correctly
- Check for JavaScript errors in console

