import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CompanyHeader from "./CompanyHeader";
import BasicInfoTab from "./tabs/BasicInfoTab";
import ProductsAndServicesTab from "./tabs/ProductsAndServicesTab.jsx";
import CompanyGalleryTab from "./tabs/CompanyGalleryTab";
import { useGetFoodIndustryCompanyDetailsQuery } from "../FoodIndustryBankApi";
import CompanyModel from "./models/CompanyModel";
import HistoryTab from "@/app/main/banks/food-industry-bank/company/tabs/HistoryTab";
import ContactInfoTab from "@/app/main/banks/food-industry-bank/company/tabs/ContactInfoTab";
import ManagementDescTab from "@/app/main/banks/food-industry-bank/company/tabs/ManagementDescTab";
import CompanyMainImagesTab from "@/app/main/banks/food-industry-bank/company/tabs/CompanyMainImagesTab";
import RegistrarTab from "@/app/main/banks/food-industry-bank/company/tabs/RegistrarTab.jsx";
import MapTab from "./tabs/MapTab";
// import MapTab from "@/app/main/banks/food-industry-bank/company/tabs/MapTab.jsx";
/**
 * Form Validation Schema
 */
const schema = z.object({
  name: z
    .string()
    .nonempty("You must enter a company name")
    .min(5, "The company name must be at least 5 characters"),
});

/**
 * The Company page.
 */
function Company() {
  const isMobile = useThemeMediaQuery((_theme) =>
    _theme.breakpoints.down("lg")
  );
  const routeParams = useParams();
  const { companyId } = routeParams;
  const {
    data: company,
    isLoading,
    isError,
  } = useGetFoodIndustryCompanyDetailsQuery(companyId, {
    skip: !companyId || companyId === "new",
  });
  console.log(JSON.stringify(company));
  const [tabValue, setTabValue] = useState(0);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: zodResolver(schema),
  });
  const { reset, watch } = methods;
  const form = watch();
  useEffect(() => {
    if (companyId === "new") {
      reset(CompanyModel({}));
    }
  }, [companyId, reset]);
  useEffect(() => {
    if (company) {
      reset({ ...company });
    }
  }, [company, reset]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  if (isLoading) {
    return <FuseLoading />;
  }

  /**
   * Show Message if the requested companies is not exists
   */
  if (isError && companyId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          شرکتی با این شناسه پیدا نشد
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/banks/food-industry-bank/company/list"
          color="inherit"
        >
          برگشت به لیست شرکت‌ها
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while company data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (company &&
      routeParams.companyId !== String(company.id) &&
      routeParams.companyId !== "new")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CompanyHeader />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="معرفی شرکت" />
              <Tab className="h-64" label="تاریخچه" />
              <Tab className="h-64" label="محصولات یا خدمات" />
              <Tab className="h-64" label="اطلاعات تماس" />
              <Tab className="h-64" label="گالری" />
              <Tab className="h-64" label="توضیحات مدیریت" />
              <Tab className="h-64" label="لوگو و عکس پس‌زمینه" />
              <Tab className="h-64" label="مکان روی نقشه" />
              <Tab className="h-64" label="ثبت‌کننده" />
              {/* <Tab */}
              {/*	className="h-64" */}
              {/*	label="Product Images" */}
              {/* /> */}
              {/* <Tab */}
              {/*	className="h-64" */}
              {/*	label="Pricing" */}
              {/* /> */}
              {/* <Tab */}
              {/*	className="h-64" */}
              {/*	label="Inventory" */}
              {/* /> */}
              {/* <Tab */}
              {/*	className="h-64" */}
              {/*	label="Shipping" */}
              {/* /> */}
            </Tabs>
            <div
              className={
                tabValue === 7
                  ? "p-16 sm:p-24 w-full"
                  : "p-16 sm:p-24 max-w-3xl"
              }
            >
              <div className={tabValue !== 0 ? "hidden" : ""}>
                <BasicInfoTab />
              </div>

              <div className={tabValue !== 1 ? "hidden" : ""}>
                <HistoryTab />
              </div>

              <div className={tabValue !== 2 ? "hidden" : ""}>
                <ProductsAndServicesTab />
              </div>

              <div className={tabValue !== 3 ? "hidden" : ""}>
                <ContactInfoTab />
              </div>

              <div className={tabValue !== 4 ? "hidden" : ""}>
                <CompanyGalleryTab />
              </div>

              <div className={tabValue !== 5 ? "hidden" : ""}>
                <ManagementDescTab />
              </div>
              <div className={tabValue !== 6 ? "hidden" : ""}>
                <CompanyMainImagesTab />
              </div>
              <div className={tabValue !== 7 ? "hidden" : ""}>
                <MapTab tabValue={tabValue} />
              </div>
              <div className={tabValue !== 8 ? "hidden" : ""}>
                <RegistrarTab />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Company;
