import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDeepCompareEffect } from "@fuse/hooks";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
	getProduct,
	newProduct,
	resetProduct,
	selectProduct,
} from "../store/productSlice";
import reducer from "../store";
import ProductHeader from "./ProductHeader";
import BasicInfoTab from "./tabs/BasicInfoTab";
import InventoryTab from "./tabs/InventoryTab";
import PricingTab from "./tabs/PricingTab";
import ProductImagesTab from "./tabs/ProductImagesTab";
import ShippingTab from "./tabs/ShippingTab";
import HistoryTab from "./tabs/HistoryTab";
import ContactInfoTab from "./tabs/ContactInfoTab";
import RegistrarTab from "./tabs/RegistrarTab";
import ManagementDescTab from "./tabs/ManagementDescTab";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup
		.string()
		.required("شما باید نام محصول را وارد کنید")
		.min(5, "نام محصول باید حداقل 5 کاراکتر باشد"),
});

function Product(props) {
	const dispatch = useDispatch();
	const product = useSelector(selectProduct);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noProduct, setNoProduct] = useState(false);
	const methods = useForm({
		mode: "onChange",
		defaultValues: {},
		resolver: yupResolver(schema),
	});
	const { reset, watch, control, onChange, formState } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateProductState() {
			const { productId } = routeParams;

			if (productId === "new") {
				/**
				 * Create New Product data
				 */
				dispatch(newProduct());
			} else {
				/**
				 * Get Product data
				 */
				dispatch(getProduct(productId)).then((action) => {
					/**
					 * If the requested product is not exist show message
					 */
					if (!action.payload) {
						setNoProduct(true);
					}
				});
			}
		}

		updateProductState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!product) {
			return;
		}
		/**
		 * Reset the form on product state changes
		 */
		reset(product);
	}, [product, reset]);

	useEffect(() => {
		return () => {
			/**
			 * Reset Product on component unload
			 */
			dispatch(resetProduct());
			setNoProduct(false);
		};
	}, [dispatch]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (noProduct) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="text.secondary" variant="h5">
					چنین محصولی وجود ندارد!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/products"
					color="inherit"
				>
					به صفحه محصولات بروید
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (
		_.isEmpty(form) ||
		(product &&
			routeParams.productId !== product.id &&
			routeParams.productId !== "new")
	) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
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
							<Tab className="h-64" label="لوگو و پس زمینه" />
							<Tab className="h-64" label="ثبت کننده" />
							{/* <Tab className="h-64" label="قیمت" />
							<Tab className="h-64" label="موجودی" />
							<Tab className="h-64" label="حمل و نقل" /> */}
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? "hidden" : ""}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 1 ? "hidden" : ""}>
								<HistoryTab />
							</div>
							{/* <div className={tabValue !== 1 ? "hidden" : ""}>
								<ProductImagesTab />
							</div> */}

							<div className={tabValue !== 2 ? "hidden" : ""}>
								<PricingTab />
							</div>

							<div className={tabValue !== 3 ? "hidden" : ""}>
								<ContactInfoTab />
							</div>
							{/* <div className={tabValue !== 3 ? "hidden" : ""}>
								<InventoryTab />
							</div> */}

							<div className={tabValue !== 4 ? "hidden" : ""}>
								<ShippingTab />
							</div>
							<div className={tabValue !== 5 ? "hidden" : ""}>
								<ManagementDescTab />
							</div>
							<div className={tabValue !== 7 ? "hidden" : ""}>
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

export default withReducer("eCommerceApp", reducer)(Product);
// import FuseLoading from '@fuse/core/FuseLoading';
// import FusePageCarded from '@fuse/core/FusePageCarded';
// import { useDeepCompareEffect } from '@fuse/hooks';
// import Button from '@mui/material/Button';
// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
// import Typography from '@mui/material/Typography';
// import withReducer from 'app/store/withReducer';
// import { motion } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useParams } from 'react-router-dom';
// import _ from '@lodash';
// import { FormProvider, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
// import { getProduct, newProduct, resetProduct, selectProduct } from '../store/productSlice';
// import reducer from '../store';
// import ProductHeader from './ProductHeader';
// import BasicInfoTab from './tabs/BasicInfoTab';
// import InventoryTab from './tabs/InventoryTab';
// import PricingTab from './tabs/PricingTab';
// import ProductImagesTab from './tabs/ProductImagesTab';
// import ShippingTab from './tabs/ShippingTab';

// /**
//  * Form Validation Schema
//  */
// const schema = yup.object().shape({
//   name: yup
//     .string()
//     .required('شما باید نام محصول را وارد کنید')
//     .min(5, 'نام محصول باید حداقل 5 کاراکتر باشد'),
// });

// function Product(props) {
//   const dispatch = useDispatch();
//   const product = useSelector(selectProduct);
//   const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

//   const routeParams = useParams();
//   const [tabValue, setTabValue] = useState(0);
//   const [noProduct, setNoProduct] = useState(false);
//   const methods = useForm({
//     mode: 'onChange',
//     defaultValues: {},
//     resolver: yupResolver(schema),
//   });
//   const { reset, watch, control, onChange, formState } = methods;
//   const form = watch();

//   useDeepCompareEffect(() => {
//     function updateProductState() {
//       const { productId } = routeParams;

//       if (productId === 'new') {
//         /**
//          * Create New Product data
//          */
//         dispatch(newProduct());
//       } else {
//         /**
//          * Get Product data
//          */
//         dispatch(getProduct(productId)).then((action) => {
//           /**
//            * If the requested product is not exist show message
//            */
//           if (!action.payload) {
//             setNoProduct(true);
//           }
//         });
//       }
//     }

//     updateProductState();
//   }, [dispatch, routeParams]);

//   useEffect(() => {
//     if (!product) {
//       return;
//     }
//     /**
//      * Reset the form on product state changes
//      */
//     reset(product);
//   }, [product, reset]);

//   useEffect(() => {
//     return () => {
//       /**
//        * Reset Product on component unload
//        */
//       dispatch(resetProduct());
//       setNoProduct(false);
//     };
//   }, [dispatch]);

//   /**
//    * Tab Change
//    */
//   function handleTabChange(event, value) {
//     setTabValue(value);
//   }

//   /**
//    * Show Message if the requested products is not exists
//    */
//   if (noProduct) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1, transition: { delay: 0.1 } }}
//         className="flex flex-col flex-1 items-center justify-center h-full"
//       >
//         <Typography color="text.secondary" variant="h5">
//         چنین محصولی وجود ندارد!
//         </Typography>
//         <Button
//           className="mt-24"
//           component={Link}
//           variant="outlined"
//           to="/apps/e-commerce/products"
//           color="inherit"
//         >
//          به صفحه محصولات بروید
//         </Button>
//       </motion.div>
//     );
//   }

//   /**
//    * Wait while product data is loading and form is setted
//    */
//   if (
//     _.isEmpty(form) ||
//     (product && routeParams.productId !== product.id && routeParams.productId !== 'new')
//   ) {
//     return <FuseLoading />;
//   }

//   return (
//     <FormProvider {...methods}>
//       <FusePageCarded
//         header={<ProductHeader />}
//         content={
//           <>
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               indicatorColor="secondary"
//               textColor="secondary"
//               variant="scrollable"
//               scrollButtons="auto"
//               classes={{ root: 'w-full h-64 border-b-1' }}
//             >
//               <Tab className="h-64" label="اطلاعات پایه" />
//               <Tab className="h-64" label="تصاویر محصول" />
//               <Tab className="h-64" label="قیمت" />
//               <Tab className="h-64" label="موجودی" />
//               <Tab className="h-64" label="حمل و نقل" />
//             </Tabs>
//             <div className="p-16 sm:p-24 max-w-3xl">
//               <div className={tabValue !== 0 ? 'hidden' : ''}>
//                 <BasicInfoTab />
//               </div>

//               <div className={tabValue !== 1 ? 'hidden' : ''}>
//                 <ProductImagesTab />
//               </div>

//               <div className={tabValue !== 2 ? 'hidden' : ''}>
//                 <PricingTab />
//               </div>

//               <div className={tabValue !== 3 ? 'hidden' : ''}>
//                 <InventoryTab />
//               </div>

//               <div className={tabValue !== 4 ? 'hidden' : ''}>
//                 <ShippingTab />
//               </div>
//             </div>
//           </>
//         }
//         scroll={isMobile ? 'normal' : 'content'}
//       />
//     </FormProvider>
//   );
// }

// export default withReducer('eCommerceApp', reducer)(Product);
