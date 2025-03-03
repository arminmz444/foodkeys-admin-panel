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
      <MediaPlayer mediaId="technology-clean-app-presentation-mockup-promo" />
      <ReactEmailGalleryComponent />
      <Gallery />
      <MediaPlayerList />
      <CustomDataGrid />
      <CustomPersianDataTable />
      <DynamicFieldGenerator />
      <DynamicFormGenerator />
      <SimpleSelect />
      {/* <MRTEditModalDataTable /> */}
      <MRTTransferList />
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
      <CustomSpreadsheet
        toolbarButtons={[
          {
            label: "Custom Action",
            onClick: () => alert("Custom Action Triggered"),
          },
        ]}
        fetchData={null}
      />
      <FormBuilder />
      <FormBuilderV2 />
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
