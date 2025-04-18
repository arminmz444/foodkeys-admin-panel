import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { Card, Step, StepContent, StepLabel } from "@mui/material";
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
import { IoIosArrowRoundBack, IoMdTime } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import Error404Page from "src/app/main/404/Error404Page";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import BundleCard from "./WebsiteConfigCard";

function WebsiteConfigListCard({
  title,
  desc,
  updatedDate,
  updatedTime,
  activeCount,
  variant,
}) {
  const bankBundles = [
    {
      title: "بانک تولیدکنندگان",
      updatedAt: "1403/05/22 - 22:15",
      bundles: {
        list: [
          {
            title: "پلن تست رایگان",
            duration: "2 ماه",
            isActive: true,
            price: "0",
          },
          {
            title: "پلن عادی",
            duration: "3 ماه",
            isActive: true,
            price: "3000000",
          },
          {
            title: "پلن پیشرفته",
            duration: "3 ماه",
            isActive: false,
            price: "6500000",
          },
        ],
        totalActive: 5,
      },
      order: 1,
    },
    {
      title: "بانک ماشین آلات",
      updatedAt: "1403/05/22 - 22:15",
      bundles: {
        list: [
          {
            title: "پلن تست رایگان",
            duration: "2 ماه",
            isActive: true,
            price: "6500000",
          },
        ],
        totalActive: 2,
      },
      order: 2,
    },
    {
      title: "بانک ملزومات بسته‌بندی",
      updatedAt: "1403/05/22 - 22:15",
      bundles: {
        list: [
          {
            title: "پلن تست رایگان",
            duration: "2 ماه",
            isActive: true,
            price: 6500000,
          },
        ],
        totalActive: 3,
      },
      order: 3,
    },
  ];

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [currentStep, setCurrentStep] = useState(0);
  const routeParams = useParams();
  const { courseId } = routeParams;
  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  // const currentStep = 0;

  // const currentStep = course?.progress?.currentStep || 0;

  function updateBank(index) {
    return bankBundles[index];
  }

  function updateCurrentStep(index) {
    if (bankBundles && (index > bankBundles.length || index < 0)) {
      return;
    }

    setCurrentStep(index);
  }

  function handleNext() {
    // setCurrentStep(currentStep + 1);
    updateCurrentStep(currentStep + 1);
  }

  function handleBack() {
    // setCurrentStep(currentStep - 1);
    updateCurrentStep(currentStep - 1);
  }

  function handleStepChange(index) {
    console.log(index);
    setCurrentStep(index + 1);
  }

  const activeStep = currentStep !== 0 ? currentStep : 1;

  // if (isLoading) {
  // 	return <FuseLoading />;
  // }

  if (!bankBundles) {
    return <Error404Page />;
  }

  return (
    <Card className="flex flex-col justify-between text-start h-384 shadow p-20 w-full sm:w-[calc(50%-3.2rem)]">
      <div className="flex flex-col items-start gap-10">
        <span
          className={`w-20 h-20 ${variant === "food" ? "bg-orange-400" : variant === "farm" ? "bg-green-500" : variant === "service" ? "bg-blue-400" : "bg-black"} rounded-full animate-pulse`}
        />
        <Typography className="text-xl font-800">{title}</Typography>
        <Typography variant="caption" className="text-gray-600">
          {desc}
        </Typography>
      </div>
      <div>
        <div className="flex gap-5 ">
          <MdOutlineAccessTimeFilled size={20} />
          <Typography variant="caption">
            اخرین بروزرسانی : {updatedTime} - {updatedDate}
          </Typography>
        </div>
        <div className="flex gap-5 text-green-500">
          <RiVerifiedBadgeFill size={20} />
          <Typography variant="caption">
            تعداد پلن‌های فعال : {activeCount}
          </Typography>
        </div>
      </div>
      <div className="w-full flex flex-col items-end gap-16">
        <div
          // eslint-disable-next-line no-nested-ternary
          className={`w-full ${variant === "food" ? "bg-orange-400" : variant === "farm" ? "bg-green-500" : variant === "service" ? "bg-blue-400" : "bg-black"} h-1`}>
          {/* {category} */}
        </div>
        <Button
          className="font-400 group self-end "
          variant="contained"
          color="primary"
          to={`/apps/settings/website-config/food/1`}
          // to={`/apps/academy/courses/${course.id}/${course.slug}`}
          component={Link}
        >
          تغییر تنظیمات
          <IoIosArrowRoundBack
            size={30}
            className="group-hover:-translate-x-3 transition-all"
          />
        </Button>
      </div>
    </Card>
  );
}

export default WebsiteConfigListCard;
