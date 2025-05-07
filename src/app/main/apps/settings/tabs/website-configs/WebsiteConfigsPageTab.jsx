import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useGetConfigsQuery } from "./store/configManagementApi";
import WebsiteConfigListCard from "./WebsiteConfigListCard";

// || [
//     {
//       title: "بانک اطلاعات صنایع غذایی",
//       desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
//       updatedDate: "1403/04/20",
//       updatedTime: "22:10",
//       activeCount: 8,
//       variant: "media",
//     },
//     {
//       title: "بانک اطلاعات صنایع غذایی",
//       desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
//       updatedDate: "1403/04/20",
//       updatedTime: "22:10",
//       activeCount: 8,
//       variant: "media",
//     },
//     {
//       title: "بانک اطلاعات صنایع کشاورزی",
//       desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
//       updatedDate: "1403/04/20",
//       updatedTime: "22:10",
//       activeCount: 8,
//       variant: "media",
//     },
//     {
//       title: "بانک اطلاعات خدمات",
//       desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
//       updatedDate: "1403/04/20",
//       updatedTime: "22:10",
//       activeCount: 8,
//       variant: "media",
//     },
//     {
//       title: "بانک اطلاعات رسانه",
//       desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
//       updatedDate: "1403/04/20",
//       updatedTime: "22:10",
//       activeCount: 8,
//       variant: "media",
//     },
//   ];
function WebsiteConfigsPageTab() {
  const [configs, setConfigs] = useState([]);
  const [category, setCategory] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { data, error, isFetching } = useGetConfigsQuery({
    category: "MAIN_WEBSITE_CLIENT_CONFIG",
    pageNumber,
    pageSize,
  });
  const items = data && data.data && Array.isArray(data.data)
    ? data.data?.map((config) => ({
        title: config.displayName || config.name,
        desc: config.description || "توضیحات ثبت نشده است",
        updatedDate: config.updatedDate || "1403/04/20",
        updatedTime: config.updatedTime || "22:10",
        activeCount: config.activeCount ?? 0,
        variant: config.variant || "media",
      }))
    : [
        {
          title: "config.name",
          desc: "توضیحات ثبت نشده است",
          updatedDate: "1403/04/20",
          updatedTime: "22:10",
          activeCount: 0,
          variant: "media",
        },
      ];

  // useEffect(() => set, [data])

  console.log(isFetching)
  if (isFetching) return <div>در حال بارگذاری تنظیمات...</div>;
  if (error) return <div>خطا در دریافت تنظیمات.</div>;

  return (
    <div className="w-full max-w-4xl">
      <Typography>صفحه مورد نظر خود را انتخاب کنید.</Typography>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-32 w-full mt-40">
        {items?.map((item, index) => (
          <WebsiteConfigListCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default WebsiteConfigsPageTab;
