import FuseLoading from "@fuse/core/FuseLoading";
import ReactEmailGalleryComponent from "app/shared-components/react-email-gallery-component/react-email-gallery-component.jsx";
import MediaPlayer from "app/shared-components/media-player/MediaPlayer.jsx";
import Gallery from "app/shared-components/media-player/Gallery/Gallery.jsx";
import MediaPlayerList from "app/shared-components/media-player/MediaPlayerList.jsx";
import CustomDataGrid from "app/shared-components/data-grid/CustomDataGrid.jsx";
import CustomPersianDataTable from "app/shared-components/custom-persian-data-table/CustomPersianDataTable.jsx";
import MRTTransferList from "app/shared-components/data-table/mrt-transfer-list/MRTTransferList.jsx";
import DynamicFieldGenerator from "app/shared-components/dynamic-field-generator/DynamicFieldGenerator.jsx";
import DynamicFormGenerator from "app/shared-components/dynamic-field-generator/DynamicFormGenerator.jsx";
import CustomSpreadsheet from "app/shared-components/custom-spreadsheet/CustomSpreadsheet.jsx";
import axios from "axios";
import { useGetAnalyticsDashboardWidgetsQuery } from "./AnalyticsDashboardApi";
import SimpleSelect from "app/shared-components/custom-select/simple-select/SimpleSelect.jsx";
import FormBuilder from "app/shared-components/form-builder/FormBuilder.jsx";
import FormBuilderV2 from "app/shared-components/form-builder-v2";
import AnnouncementDialog from "app/shared-components/announcement/AnnouncementDialog";
import CustomModalNotion from "app/shared-components/custom-modals/CustomModalNotion";
import CustomMarks from "app/shared-components/custom-slider/CustomMarks"
import MusicPlayer from "app/shared-components/music-player/MusicPlayer"
// import CustomWhiteBoard from "app/shared-components/custom-whiteboard/CustomWhiteBoard"
import ClaudeSampleDynamicFormGenerator from "app/shared-components/dynamic-field-generator/samples/ClaudeSampleDynamicFormGenerator"
import GPTSampleDynamicFormGenerator from "app/shared-components/dynamic-field-generator/samples/GPTSampleDynamicFormGenerator"
import ServiceForm from "app/shared-components/temp/ServiceForm";
import SubmitFormDrawer from "app/shared-components/custom-drawers/SubmitFormDrawer";
import CustomWhiteBoard2 from "app/shared-components/custom-whiteboard/CustomWhiteBoard2";
// import ToolpadTest from "app/shared-components/toolpad/ToolpadTest";
import ApprovalsPage from "../../requests/approvals/ApprovalsPage";
import CustomBottomNavigationMenu from "app/shared-components/custom-bottom-navigation-menu/CustomBottomNavigationMenu";
import EnhancedGrapesJSEditor from "app/shared-components/enhanced-grapes-js/EnhancedGrapesJSEditor";
import TransferList from "../../documentation/material-ui-components/components/transfer-list/TransferList";
import { z } from "zod";
const container = {
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const handleCreate = async (values) => {
  try {
    await createService(values).unwrap();
    return true;
  } catch (error) {
    console.error('Error creating service:', error);
    return false;
  }
};

const formProps = {
  zodSchema: z.object({
    name: z
      .string({ 
        invalid_type_error: 'فرمت داده ورودی اشتباه است',
        required_error: 'این فیلد الزامی است' 
      })
      .min(1, { message: 'این فیلد الزامی است' })
      .uniforms({
        label: 'نام خدمت',
        placeholder: 'نام خدمت را وارد کنید'
      }),
    description: z
      .string({ 
        invalid_type_error: 'فرمت داده ورودی اشتباه است',
        required_error: 'این فیلد الزامی است'
      })
      .min(1, { message: 'این فیلد الزامی است' })
      .max(500, { message: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد' })
      .uniforms({
        label: 'توضیحات',
        placeholder: 'توضیحات خدمت را وارد کنید'
      }),
    banner: z
      .string()
      .optional()
      .uniforms({
        label: 'تصویر شاخص',
        placeholder: 'تصویر شاخص را انتخاب کنید'
      }),
    attachments: z
      .array(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          content: z.string(),
          size: z.number()
        })
      )
      .optional()
      .uniforms({
        label: 'فایل‌های پیوست'
      })
  }),
  formHeaderTitle: 'ثبت خدمت جدید',
  defaultValues: {
    name: '',
    description: '',
    banner: '',
    attachments: []
  },
  formValidationStruct: 'ZOD_SCHEMA',
  formGenerationType: 'MANUAL',
  hideSubmitField: false,
  formFieldsInputTypes: ['name', 'description', 'banner', 'attachments'],
  onCreate: handleCreate
};
/**
 * The analytics dashboard app.
 */
function AnalyticsDashboardApp() {
  const { isLoading } = useGetAnalyticsDashboardWidgetsQuery();

  if (isLoading) {
    return <FuseLoading />;
  }

  const userLatitude = 40.7128;
  const userLongitude = -74.006;

  async function loadOptions(search, loadedOptions, { page }) {
    let url = `/employees/?pageNumber=${page}&pid=${search}`;
    url = `/employees/?pageNumber=${page}&flname=${search}`;
    const response = await axios.get(url).catch((error) => {
      console.log(error);
    });
    const responseJSON = await response?.data;
    const tmp = responseJSON.data.map((e) => {
      return {
        employeeId: e.id,
        value: e.personnelId,
        label: `${e.personnelId} : ${e.firstName} ${e.lastName}`,
      };
    });
    return {
      options: tmp,
      hasMore:
        responseJSON.pagination.pageNumber < responseJSON.pagination.totalPages,
      additional: {
        page: page + 1,
      },
    };
  }

  return (
    // <GrapesEditor />
    <>
      <TransferList />  
      {/* <MediaPlayer mediaId="technology-clean-app-presentation-mockup-promo" /> */}
      {/* <ReactEmailGalleryComponent />
      <Gallery />
      <MediaPlayerList />
      <CustomDataGrid />
      <CustomPersianDataTable />
      <DynamicFieldGenerator />
      <DynamicFormGenerator />
      <SimpleSelect />
      <AnnouncementDialog /> */}
      {/* <MRTEditModalDataTable /> */}
      {/* <MRTTransferList /> */}
      {/* <CustomSelect */}
      {/*	name="employeePersonnelId" */}
      {/*	id="employeePersonnelId" */}
      {/*	isDisabled={false} */}
      {/*	errors={false} */}
      {/*	touched={false} */}
      {/*	// setFieldValue={setFieldValue} */}
      {/*	// setFieldTouched={setFieldTouched} */}
      {/*	// value={selectInputValue} */}
      {/*	// onChange={setSelectInputValue} */}
      {/*	// searchByPersonnelId */}
      {/*	loadOptions={loadOptions} */}
      {/*	// searchOption={employeeSearchOption} */}
      {/*	// setSearchOption={setEmployeeSearchOption} */}
      {/*	noOptionsMessage="کارمندی پیدا نشد" */}
      {/*	loadingMessage="در حال جستجو ..." */}
      {/*	// checkBoxes={[ */}
      {/*	// 	{ label: 'کد پرسنلی', value: 1 }, */}
      {/*	// 	{ label: 'نام', value: 2 } */}
      {/*	// ]} */}
      {/* /> */}
      {/* <CustomSpreadsheet
        toolbarButtons={[
          {
            label: "Custom Action",
            onClick: () => alert("Custom Action Triggered"),
          },
        ]}
        fetchData={null}
      /> */}
      <FormBuilder />
      <FormBuilderV2 />
      {/* <CustomJoditEditor /> */}
      {/* <EditorJSComponent /> */}
      {/* <CustomTimeline /> */}
      <CustomModalNotion />
      <CustomMarks />
      <MusicPlayer />
      {/* <GPTSampleDynamicFormGenerator /> */}
      <ServiceForm />
      <SubmitFormDrawer />
      {/* <ClaudeSampleDynamicFormGenerator /> */}
      {/* <CustomWhiteBoard2 /> */}
      <ApprovalsPage />
      <CustomBottomNavigationMenu />
      <EnhancedGrapesJSEditor />
      {/* <EnhancedDynamicFormGenerator formProps={formProps} /> */}
      {/* <MonacoJsonEditor /> */}
      
      {/*<MiniAppFrame name="armo" src="https://foodkeys-website-dev.liara.run/view/labs/details?id=25"><MusicPlayer /></MiniAppFrame>*/}
        {/* <ToolpadTest /> */}
      {/* <Invoice /> */}

      {/*	const fetchSpreadsheetData = async () => { */}
      {/*	const response = await fetch('/api/data-endpoint'); */}
      {/*	const jsonData = await response.json(); */}
      {/*	// Transform jsonData to the format required by react-spreadsheet */}
      {/*	return jsonData.map((row) => row.map((cell) => ({ value: cell }))); */}
      {/* }; */}
      {/* <NodeEditor /> */}
      {/* <Map /> */}
      {/* <DataTable /> */}
      {/* <MonacoJsonEditor /> */}
      {/* <MapView */}
      {/*	defaultLat={userLatitude} */}
      {/*	defaultLng={userLongitude} */}
      {/* /> */}
    </>
    // <FusePageSimple
    // 	header={<AnalyticsDashboardAppHeader />}
    // 	content={
    // 		<motion.div
    // 			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 w-full p-24 md:p-32"
    // 			variants={container}
    // 			initial="hidden"
    // 			animate="show"
    // 		>
    // 			<motion.div
    // 				variants={item}
    // 				className="sm:col-span-2 lg:col-span-3"
    // 			>
    // 				<VisitorsOverviewWidget />
    // 			</motion.div>
    //
    // 			<motion.div
    // 				variants={item}
    // 				className="sm:col-span-2 lg:col-span-1 "
    // 			>
    // 				<ConversionsWidget />
    // 			</motion.div>
    //
    // 			<motion.div
    // 				variants={item}
    // 				className="sm:col-span-2 lg:col-span-1 "
    // 			>
    // 				<ImpressionsWidget />
    // 			</motion.div>
    //
    // 			<motion.div
    // 				variants={item}
    // 				className="sm:col-span-2 lg:col-span-1 "
    // 			>
    // 				<VisitsWidget />
    // 			</motion.div>
    //
    // 			<motion.div
    // 				variants={item}
    // 				className="sm:col-span-2 lg:col-span-3"
    // 			>
    // 				<VisitorsVsPageViewsWidget />
    // 			</motion.div>
    //
    // 			<div className="w-full mt-16 sm:col-span-3">
    // 				<Typography className="text-2xl font-semibold tracking-tight leading-6">
    // 					Your Audience
    // 				</Typography>
    // 				<Typography
    // 					className="font-medium tracking-tight"
    // 					color="text.secondary"
    // 				>
    // 					Demographic properties of your users
    // 				</Typography>
    // 			</div>
    //
    // 			<div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-32 w-full">
    // 				<motion.div variants={item}>
    // 					<NewVsReturningWidget />
    // 				</motion.div>
    // 				<motion.div variants={item}>
    // 					<GenderWidget />
    // 				</motion.div>
    // 				<motion.div variants={item}>
    // 					<AgeWidget />
    // 				</motion.div>
    // 				<motion.div variants={item}>
    // 					<LanguageWidget />
    // 				</motion.div>
    // 			</div>
    // 		</motion.div>
    // 	}
    // />
    // <div>
    // 	<h1>My Leaflet Map</h1>
    // 	<MapView
    // 		defaultLat={userLatitude}
    // 		defaultLng={userLongitude}
    // 	/>
    // </div>
  );
}

export default AnalyticsDashboardApp;
