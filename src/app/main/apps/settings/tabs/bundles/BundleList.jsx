// import FusePageSimple from "@fuse/core/FusePageSimple"
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon"
// import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery"
// import { CircularProgress, Skeleton, Step, StepContent, StepLabel, Alert } from "@mui/material"
// import Box from "@mui/material/Box"
// import Button from "@mui/material/Button"
// import ButtonGroup from "@mui/material/ButtonGroup"
// import Divider from "@mui/material/Divider"
// import Hidden from "@mui/material/Hidden"
// import IconButton from "@mui/material/IconButton"
// import Paper from "@mui/material/Paper"
// import Stepper from "@mui/material/Stepper"
// import { useTheme } from "@mui/material/styles"
// import Typography from "@mui/material/Typography"
// import { useEffect, useRef, useState } from "react"
// import { IoMdTime } from "react-icons/io"
// import { RiVerifiedBadgeFill } from "react-icons/ri"
// import { Link, useParams } from "react-router-dom"
// import SwipeableViews from "react-swipeable-views"
// import Error404Page from "src/app/main/404/Error404Page"
// import AddBundle from "./AddBundle"
// import BundleCard from "./BundleCard"
// import axios from "axios"
// import styled from "styled-components"

// const ContentWrapper = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 24px;
// `

// const BundleCardContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   margin-top: 24px;
// `

// const PaginationInfo = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 16px 0;
//   font-weight: 500;
// `

// const LoadingContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 200px;
//   width: 100%;
// `

// const StyledPaper = styled(Paper)`
//   width: 100%;
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 24px;
//   border-radius: 16px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

//   @media (min-width: 768px) {
//     padding: 32px;
//   }
// `

// function BundleList() {
//   const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"))
//   const theme = useTheme()
//   const pageLayout = useRef(null)
//   const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile)
//   const [currentPage, setCurrentPage] = useState(1)
//   const routeParams = useParams()
//   const { subCategoryId } = routeParams

//   const [subCategoryInfo, setSubCategoryInfo] = useState(null)
//   const [bundleDetails, setBundleDetails] = useState(null)
//   const [loadingInfo, setLoadingInfo] = useState(false)
//   const [loadingDetails, setLoadingDetails] = useState(false)
//   const [error, setError] = useState(null)
//   const [totalPages, setTotalPages] = useState(0)

//   useEffect(() => {
//     setLeftSidebarOpen(!isMobile)
//   }, [isMobile])

//   useEffect(() => {
//     const fetchSubCategoryInfo = async () => {
//       if (!subCategoryId || Number.isNaN(Number(subCategoryId))) {
//         return
//       }

//       try {
//         setLoadingInfo(true)
//         setError(null)

//         const response = await axios.get(`/bundle/subcategory/${subCategoryId}/info`)

//         if (response.data?.status === "SUCCESS" && response.data?.data) {
//           setSubCategoryInfo(response.data.data)
//         } else {
//           setError("خطا در دریافت اطلاعات زیرشاخه")
//         }
//       } catch (err) {
//         console.error("Error fetching subcategory info:", err)
//         setError("خطا در دریافت اطلاعات زیرشاخه")
//       } finally {
//         setLoadingInfo(false)
//       }
//     }

//     fetchSubCategoryInfo()
//   }, [subCategoryId])

//   useEffect(() => {
//     const fetchBundleDetails = async () => {
//       if (!subCategoryId || Number.isNaN(Number(subCategoryId))) {
//         return
//       }

//       try {
//         setLoadingDetails(true)
//         setError(null)

//         const response = await axios.get(`/bundle/subcategory/${subCategoryId}`, {
//           params: {
//             pageNumber: currentPage,
//             pageSize: 1,
//           },
//         })

//         if (response.data?.status === "SUCCESS") {
//           setBundleDetails(response.data.data?.[0] || null)

//           if (response.data.pagination) {
//             setTotalPages(response.data.pagination.totalPages || 0)
//           }
//         } else {
//           setError("خطا در دریافت جزئیات باندل")
//         }
//       } catch (err) {
//         console.error("Error fetching bundle details:", err)
//         setError("خطا در دریافت جزئیات باندل")
//       } finally {
//         setLoadingDetails(false)
//       }
//     }

//     fetchBundleDetails()
//   }, [subCategoryId, currentPage])

//   if (!subCategoryId || Number.isNaN(Number(subCategoryId))) {
//     return <Error404Page />
//   }

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1)
//     }
//   }

//   const handleBack = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1)
//     }
//   }

//   const handleStepChange = (index) => {
//     const newPage = index + 1
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage)
//     }
//   }

//   const handleBundleSelect = (bundleId) => {
//     if (subCategoryInfo?.bundles) {
//       const index = subCategoryInfo.bundles.findIndex((bundle) => bundle.id === bundleId)
//       if (index !== -1) {
//         setCurrentPage(index + 1)
//       }
//     }
//   }

//   const canGoBack = currentPage > 1
//   const canGoForward = currentPage < totalPages

//   const isLoading = loadingInfo || loadingDetails

//   return (
//     <FusePageSimple
//       content={
//         <ContentWrapper>
//           <Hidden lgUp>
//             <Paper className="flex sticky top-0 z-10 items-center w-full px-16 py-8 border-b-1 shadow-0" square>
//               <IconButton to="/apps/settings/bundle" component={Link}>
//                 <FuseSvgIcon>
//                   {theme.direction === "ltr" ? "heroicons-outline:arrow-sm-left" : "heroicons-outline:arrow-sm-right"}
//                 </FuseSvgIcon>
//               </IconButton>

//               <Typography className="text-13 font-medium tracking-tight mx-10">
//                 {loadingInfo ? (
//                   <CircularProgress size={20} />
//                 ) : (
//                   subCategoryInfo?.subCategoryTitle || "خطا در دریافت پلن"
//                 )}
//               </Typography>
//             </Paper>
//           </Hidden>

//           {error && (
//             <Alert severity="error" className="mb-16">
//               {error}
//             </Alert>
//           )}

//           <SwipeableViews
//             index={currentPage - 1}
//             enableMouseEvents
//             onChangeIndex={handleStepChange}
//             disabled={totalPages <= 1}
//             resistance
//           >
//             {Array.from({ length: totalPages }).map((_, index) => (
//               <div key={index} className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
//                 {loadingDetails ? (
//                   <LoadingContainer>
//                     <CircularProgress />
//                   </LoadingContainer>
//                 ) : bundleDetails ? (
//                   <StyledPaper>
//                     <div className="prose prose-sm dark:prose-invert w-full max-w-full" dir={theme.direction}>
//                       <Typography variant="h4" className="mb-24 font-bold text-center">
//                         {bundleDetails.title}
//                       </Typography>

//                       {/* <AddBundle /> */}

//                       <BundleCardContainer>
//                         <BundleCard
//                           amount={bundleDetails.price}
//                           isActive={bundleDetails.active}
//                           title={bundleDetails.title}
//                           duration={`${bundleDetails.duration} ماه`}
//                           description={bundleDetails.description}
//                           features={bundleDetails.features?.split(".")}
//                           updatedAt={bundleDetails.updatedAtStr}
//                         />
//                       </BundleCardContainer>
//                     </div>
//                   </StyledPaper>
//                 ) : (
//                   <Paper className="p-24 text-center">
//                     <Typography>اطلاعات باندل در دسترس نیست</Typography>
//                   </Paper>
//                 )}
//               </div>
//             ))}
//           </SwipeableViews>

//           {totalPages > 0 && (
//             <>
//               <PaginationInfo>
//                 صفحه {currentPage} از {totalPages}
//               </PaginationInfo>

//               <Hidden lgDown>
//                 <div className="flex justify-center w-full sticky bottom-0 p-16 pb-32 z-10">
//                   <ButtonGroup variant="contained" aria-label="pagination" className="rounded-full" color="secondary">
// 				  <Button
//                       className="min-h-56 rounded-full"
//                       size="large"
//                       startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>}
//                       onClick={handleNext}
//                       disabled={!canGoForward}
//                     >
//                       بعدی
//                     </Button>
// 					<Button
//                       className="pointer-events-none min-h-56"
//                       size="large"
//                     >{`${currentPage}/${totalPages}`}</Button>
// 					<Button
//                       className="min-h-56 rounded-full"
//                       size="large"
//                       endIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
//                       onClick={handleBack}
//                       disabled={!canGoBack}
//                     >
//                       قبلی
//                     </Button>
//                   </ButtonGroup>
//                 </div>
//               </Hidden>

//               <Hidden lgUp>
//                 <Box
//                   sx={{ backgroundColor: "background.paper" }}
//                   className="flex sticky bottom-0 z-10 items-center w-full p-16 border-t-1"
//                 >
//                   <IconButton onClick={() => setLeftSidebarOpen(true)} aria-label="open left sidebar" size="large">
//                     <FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
//                   </IconButton>

//                   <Typography className="mx-8">{`${currentPage}/${totalPages}`}</Typography>

// 				  <IconButton onClick={handleNext} disabled={!canGoForward}>
//                     <FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
//                   </IconButton>
//                   <IconButton onClick={handleBack} disabled={!canGoBack}>
//                     <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
//                   </IconButton>

//                 </Box>
//               </Hidden>
//             </>
//           )}
//         </ContentWrapper>
//       }
//       leftSidebarOpen={leftSidebarOpen}
//       leftSidebarOnClose={() => {
//         setLeftSidebarOpen(false)
//       }}
//       leftSidebarWidth={350}
//       leftSidebarContent={
//         <>
//           <div className="p-32">
//             <Button
//               to="/apps/settings/bundle"
//               component={Link}
//               className="mb-24"
//               color="secondary"
//               variant="text"
//               startIcon={
//                 <FuseSvgIcon size={20}>
//                   {theme.direction === "ltr" ? "heroicons-outline:arrow-sm-left" : "heroicons-outline:arrow-sm-right"}
//                 </FuseSvgIcon>
//               }
//             >
//               بازگشت به لیست بانک ها
//             </Button>
//             <div>
//               <Typography variant="h6" className="font-800">
//                 {subCategoryInfo?.subCategoryTitle || "در حال بارگذاری..."}
//               </Typography>

//               <div className="flex gap-5 ">
//                 <IoMdTime size={20} />
//                 <Typography variant="caption">اخرین بروزرسانی : {subCategoryInfo?.updatedAt || "نامشخص"}</Typography>
//               </div>

//               <div className="flex gap-5 text-green-500 mt-8">
//                 <RiVerifiedBadgeFill size={20} />
//                 <Typography variant="caption">تعداد پلن‌های فعال : {subCategoryInfo?.totalActive || 0}</Typography>
//               </div>
// 			  <div className="flex pt-32 justify-center"><AddBundle /></div>

//             </div>
//           </div>
//           <Divider />
//           {loadingInfo ? (
//             <div className="p-32">
//               <Skeleton variant="rectangular" height={400} />
//             </div>
//           ) : (
//             <Stepper classes={{ root: "p-32" }} activeStep={currentPage - 1} orientation="vertical" nonLinear>
//               {subCategoryInfo?.bundles?.map((bundle, index) => (
//                 <Step
//                   key={bundle.id}
//                   sx={{
//                     "& .MuiStepLabel-root, & .MuiStepContent-root": {
//                       cursor: "pointer!important",
//                     },
//                     "& .MuiStepContent-root": {
//                       color: "text.secondary",
//                       fontSize: 13,
//                     },
//                   }}
//                   onClick={() => handleBundleSelect(bundle.id)}
//                   expanded
//                 >
//                   <StepLabel
//                     className="font-medium"
//                     sx={{
//                       "& .MuiSvgIcon-root": {
//                         color: "background.default",
//                         "& .MuiStepIcon-text": {
//                           fill: (_theme) => _theme.palette.text.secondary,
//                         },
//                         "&.Mui-completed": {
//                           color: "secondary.main",
//                           "& .MuiStepIcon-text ": {
//                             fill: (_theme) => _theme.palette.secondary.contrastText,
//                           },
//                         },
//                         "&.Mui-active": {
//                           color: "secondary.main",
//                           "& .MuiStepIcon-text ": {
//                             fill: (_theme) => _theme.palette.secondary.contrastText,
//                           },
//                         },
//                       },
//                     }}
//                   >
//                     {bundle.title}
//                   </StepLabel>
//                   <StepContent>
//                     <div className="flex gap-5 text-green-500">
//                       <Typography
//                         variant="caption"
//                         className={bundle.status === "ACTIVE" ? "text-green-500" : "text-red-500"}
//                       >
//                         وضعیت: {bundle.status === "ACTIVE" ? "فعال" : "غیرفعال"}
//                       </Typography>
//                     </div>
//                   </StepContent>
//                 </Step>
//               ))}
//             </Stepper>
//           )}
//         </>
//       }
//       scroll="content"
//       ref={pageLayout}
//     />
//   )
// }

// export default BundleList

import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { CircularProgress, Skeleton, Step, StepContent, StepLabel, Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import Error404Page from "src/app/main/404/Error404Page";
import styled from "styled-components";
import BundleFilterForm from "./BundleFilterForm";
import BundleCard from "./BundleCard";
import AddBundle from "./AddBundle";
import {
  useGetSubCategoryInfoQuery,
  useGetBundlesOfSubCategoryQuery,
  useDeleteBundleMutation,
  useActivateOrDeactivateBundleMutation
} from "./store/bundleApi";
import { enqueueSnackbar } from "notistack";

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BundleCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
`;

const PaginationInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 24px;
`;

function BundleList() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [currentPage, setCurrentPage] = useState(1);
  const routeParams = useParams();
  const { subCategoryId } = routeParams;
  const [filterParams, setFilterParams] = useState({});
  const [selectedBundle, setSelectedBundle] = useState(null);

  // Redux Toolkit Query hooks
  const {
    data: subCategoryInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
    error: infoError
  } = useGetSubCategoryInfoQuery(subCategoryId, {
    skip: !subCategoryId || Number.isNaN(Number(subCategoryId))
  });

  const {
    data: bundlesData,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: detailsError
  } = useGetBundlesOfSubCategoryQuery({
    subCategoryId,
    pageNumber: currentPage,
    pageSize: 1,
    ...filterParams
  }, {
    skip: !subCategoryId || Number.isNaN(Number(subCategoryId))
  });

  const [deleteBundle] = useDeleteBundleMutation();
  const [activateOrDeactivateBundle] = useActivateOrDeactivateBundleMutation();

  const bundleDetails = bundlesData?.data?.[0] || null;
  const totalPages = bundlesData?.totalPages || 0;

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  if (!subCategoryId || Number.isNaN(Number(subCategoryId))) {
    return <Error404Page />;
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStepChange = (index) => {
    const newPage = index + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleBundleSelect = (bundleId) => {
    if (subCategoryInfo?.bundles) {
      const index = subCategoryInfo.bundles.findIndex((bundle) => bundle.id === bundleId);
      if (index !== -1) {
        setCurrentPage(index + 1);
      }
    }
  };

  const handleFilter = (filterData) => {
    setFilterParams(filterData);
    setCurrentPage(1);
  };

  const handleEditBundle = (bundle) => {
    setSelectedBundle(bundle);
  };

  const handleBundleEdited = () => {
    setSelectedBundle(null);
    enqueueSnackbar("پلن با موفقیت ویرایش شد", { variant: "success" });
  };

  const handleDeleteBundle = async (bundleId) => {
    try {
      await deleteBundle(bundleId).unwrap();
      enqueueSnackbar("پلن با موفقیت حذف شد", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("خطا در حذف پلن", { variant: "error" });
    }
  };

  const handleStatusChange = async (bundleId, newStatus) => {
    try {
      await activateOrDeactivateBundle({
        id: bundleId,
        status: newStatus
      }).unwrap();
      
      enqueueSnackbar(`پلن با موفقیت ${newStatus === 'ACTIVE' ? 'فعال' : 'غیرفعال'} شد`, {
        variant: "success"
      });
    } catch (err) {
      enqueueSnackbar("خطا در تغییر وضعیت پلن", { variant: "error" });
    }
  };

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const isLoading = isLoadingInfo || isLoadingDetails;
  const isError = isErrorInfo || isErrorDetails;
  const error = infoError || detailsError;

  return (
    <FusePageSimple
      content={
        <ContentWrapper>
          <Hidden lgUp>
            <Paper className="flex sticky top-0 z-10 items-center w-full px-16 py-8 border-b-1 shadow-0" square>
              <IconButton to="/apps/settings/bundle" component={Link}>
                <FuseSvgIcon>
                  {theme.direction === "ltr" ? "heroicons-outline:arrow-sm-left" : "heroicons-outline:arrow-sm-right"}
                </FuseSvgIcon>
              </IconButton>

              <Typography className="text-13 font-medium tracking-tight mx-10">
                {isLoadingInfo ? (
                  <CircularProgress size={20} />
                ) : (
                  subCategoryInfo?.subCategoryTitle || "خطا در دریافت پلن"
                )}
              </Typography>
            </Paper>
          </Hidden>

          {isError && (
            <Alert severity="error" className="mb-16">
              {error?.data?.message || "خطا در دریافت اطلاعات"}
            </Alert>
          )}

          <FilterContainer>
            <BundleFilterForm onFilter={handleFilter} />
          </FilterContainer>

          <SwipeableViews
            index={currentPage - 1}
            enableMouseEvents
            onChangeIndex={handleStepChange}
            disabled={totalPages <= 1}
            resistance
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <div key={index} className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                {isLoadingDetails ? (
                  <LoadingContainer>
                    <CircularProgress />
                  </LoadingContainer>
                ) : bundleDetails ? (
                  <StyledPaper>
                    <div className="prose prose-sm dark:prose-invert w-full max-w-full" dir={theme.direction}>
                      <Typography variant="h4" className="mb-24 font-bold text-center">
                        {bundleDetails.title}
                      </Typography>

                      <BundleCardContainer>
                        <BundleCard
                          amount={bundleDetails.price}
                          isActive={bundleDetails.active}
                          title={bundleDetails.title}
                          duration={`${bundleDetails.duration} ماه`}
                          description={bundleDetails.description}
                          features={bundleDetails.features?.split(".")}
                          updatedAt={bundleDetails.updatedAtStr}
                          onEdit={() => handleEditBundle(bundleDetails)}
                          onDelete={() => handleDeleteBundle(bundleDetails.id)}
                          onStatusChange={() => handleStatusChange(
                            bundleDetails.id,
                            bundleDetails.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                          )}
                        />
                        
                        {selectedBundle?.id === bundleDetails.id && (
                          <Box className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center bg-black bg-opacity-5 z-10 rounded-2xl">
                            <AddBundle
                              editData={selectedBundle}
                              onBundleEdited={handleBundleEdited}
                            />
                          </Box>
                        )}
                      </BundleCardContainer>
                    </div>
                  </StyledPaper>
                ) : (
                  <Paper className="p-24 text-center">
                    <Typography>اطلاعات باندل در دسترس نیست</Typography>
                  </Paper>
                )}
              </div>
            ))}
          </SwipeableViews>

          {totalPages > 0 && (
            <>
              <PaginationInfo>
                صفحه {currentPage} از {totalPages}
              </PaginationInfo>

              <Hidden lgDown>
                <div className="flex justify-center w-full sticky bottom-0 p-16 pb-32 z-10">
                  <ButtonGroup variant="contained" aria-label="pagination" className="rounded-full" color="secondary">
                    <Button
                      className="min-h-56 rounded-full"
                      size="large"
                      startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>}
                      onClick={handleNext}
                      disabled={!canGoForward}
                    >
                      بعدی
                    </Button>
                    <Button
                      className="pointer-events-none min-h-56"
                      size="large"
                    >{`${currentPage}/${totalPages}`}</Button>
                    <Button
                      className="min-h-56 rounded-full"
                      size="large"
                      endIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
                      onClick={handleBack}
                      disabled={!canGoBack}
                    >
                      قبلی
                    </Button>
                  </ButtonGroup>
                </div>
              </Hidden>

              <Hidden lgUp>
                <Box
                  sx={{ backgroundColor: "background.paper" }}
                  className="flex sticky bottom-0 z-10 items-center w-full p-16 border-t-1"
                >
                  <IconButton onClick={() => setLeftSidebarOpen(true)} aria-label="open left sidebar" size="large">
                    <FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
                  </IconButton>

                  <Typography className="mx-8">{`${currentPage}/${totalPages}`}</Typography>

                  <IconButton onClick={handleNext} disabled={!canGoForward}>
                    <FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
                  </IconButton>
                  <IconButton onClick={handleBack} disabled={!canGoBack}>
                    <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
                  </IconButton>
                </Box>
              </Hidden>
            </>
          )}
        </ContentWrapper>
      }
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarOnClose={() => {
        setLeftSidebarOpen(false);
      }}
      leftSidebarWidth={350}
      leftSidebarContent={
        <>
          <div className="p-32">
            <Button
              to="/apps/settings/bundle"
              component={Link}
              className="mb-24"
              color="secondary"
              variant="text"
              startIcon={
                <FuseSvgIcon size={20}>
                  {theme.direction === "ltr" ? "heroicons-outline:arrow-sm-left" : "heroicons-outline:arrow-sm-right"}
                </FuseSvgIcon>
              }
            >
              بازگشت به لیست بانک ها
            </Button>
            <div>
              <Typography variant="h6" className="font-800">
                {subCategoryInfo?.subCategoryTitle || "در حال بارگذاری..."}
              </Typography>

              <div className="flex gap-5 ">
                <IoMdTime size={20} />
                <Typography variant="caption">اخرین بروزرسانی : {subCategoryInfo?.updatedAt || "نامشخص"}</Typography>
              </div>

              <div className="flex gap-5 text-green-500 mt-8">
                <RiVerifiedBadgeFill size={20} />
                <Typography variant="caption">تعداد پلن‌های فعال : {subCategoryInfo?.totalActive || 0}</Typography>
              </div>
              <div className="flex pt-32 justify-center">
                <AddBundle 
                  // onBundleAdded={() => {}} 
                  subCategoryId={subCategoryId}
                />
              </div>
            </div>
          </div>
          <Divider />
          {isLoadingInfo ? (
            <div className="p-32">
              <Skeleton variant="rectangular" height={400} />
            </div>
          ) : (
            <Stepper classes={{ root: "p-32" }} activeStep={currentPage - 1} orientation="vertical" nonLinear>
              {subCategoryInfo?.bundles?.map((bundle, index) => (
                <Step
                  key={bundle.id}
                  sx={{
                    "& .MuiStepLabel-root, & .MuiStepContent-root": {
                      cursor: "pointer!important",
                    },
                    "& .MuiStepContent-root": {
                      color: "text.secondary",
                      fontSize: 13,
                    },
                  }}
                  onClick={() => handleBundleSelect(bundle.id)}
                  expanded
                >
                  <StepLabel
                    className="font-medium"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "background.default",
                        "& .MuiStepIcon-text": {
                          fill: (_theme) => _theme.palette.text.secondary,
                        },
                        "&.Mui-completed": {
                          color: "secondary.main",
                          "& .MuiStepIcon-text ": {
                            fill: (_theme) => _theme.palette.secondary.contrastText,
                          },
                        },
                        "&.Mui-active": {
                          color: "secondary.main",
                          "& .MuiStepIcon-text ": {
                            fill: (_theme) => _theme.palette.secondary.contrastText,
                          },
                        },
                      },
                    }}
                  >
                    {bundle.title}
                  </StepLabel>
                  <StepContent>
                    <div className="flex gap-5 text-green-500">
                      <Typography
                        variant="caption"
                        className={bundle.status === "ACTIVE" ? "text-green-500" : "text-red-500"}
                      >
                        وضعیت: {bundle.status === "ACTIVE" ? "فعال" : "غیرفعال"}
                      </Typography>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          )}
        </>
      }
      scroll="content"
      ref={pageLayout}
    />
  );
}

export default BundleList;