import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

// This component demonstrates a custom Producer Details page
// that can be created with GrapesJS and rendered in the NextJS app

function ProducerDetailsCustom({ producer }) {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      
      // Simulate fetching products
      setProducts([
        { id: 1, name: 'محصول 1', price: '100,000 تومان', category: 'الکترونیک' },
        { id: 2, name: 'محصول 2', price: '200,000 تومان', category: 'لوازم خانگی' },
        { id: 3, name: 'محصول 3', price: '150,000 تومان', category: 'الکترونیک' },
      ]);
    }, 1000);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={producer.logo || '/placeholder.svg?height=200&width=400'}
              alt={producer.name}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {producer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {producer.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="نوع شرکت" secondary={producer.type} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText primary="آدرس" secondary={producer.address} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary="تلفن" secondary={producer.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="ایمیل" secondary={producer.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText primary="تاریخ تاسیس" secondary={producer.foundedDate} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="اطلاعات کلی" />
              <Tab label="محصولات" />
              <Tab label="تاریخچه" />
            </Tabs>
            
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  درباره {producer.name}
                </Typography>
                <Typography paragraph>
                  {producer.about || 'اطلاعاتی در مورد این تولیدکننده وجود ندارد.'}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  مجوزها و گواهینامه‌ها
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {producer.certificates?.map((cert, index) => (
                    <Chip key={index} label={cert} color="primary" variant="outlined" />
                  )) || (
                    <Typography variant="body2" color="text.secondary">
                      گواهینامه‌ای ثبت نشده است.
                    </Typography>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  اطلاعات تماس
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            مدیر عامل
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {producer.ceo || 'نامشخص'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">
                            شماره تماس مستقیم
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {producer.directPhone || 'نامشخص'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  محصولات {producer.name}
                </Typography>
                
                {products.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    محصولی یافت نشد.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="subtitle1">
                                {product.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              دسته‌بندی: {product.category}
                            </Typography>
                            <Typography variant="body1">
                              {product.price}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary">
                    مشاهده همه محصولات
                  </Button>
                </Box>
              </Box>
            )}
            
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  تاریخچه {producer.name}
                </Typography>
                <Typography paragraph>
                  اطلاعات تاریخچه این تولیدکننده در دسترس نیست.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProducerDetailsCustom;
