import { Typography } from "@mui/material";
import BankListCard from "./BankListCard";

function BundlePageTab() {
	const items = [
		{
			title: "بانک اطلاعات صنایع غذایی",
			desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
			updatedDate: "1403/04/20",
			updatedTime: "22:10",
			activeCount: 8,
			variant: "media",
		},
		{
			title: "بانک اطلاعات صنایع کشاورزی",
			desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
			updatedDate: "1403/04/20",
			updatedTime: "22:10",
			activeCount: 8,
			variant: "media",
		},
		{
			title: "بانک اطلاعات خدمات",
			desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
			updatedDate: "1403/04/20",
			updatedTime: "22:10",
			activeCount: 8,
			variant: "media",
		},
		{
			title: "بانک اطلاعات رسانه",
			desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
			updatedDate: "1403/04/20",
			updatedTime: "22:10",
			activeCount: 8,
			variant: "media",
		},
	];
	return (
		<div className="w-full max-w-4xl ">
			<Typography>بانک مورد نظر خود را انتخاب کنید.</Typography>
			<div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-32 w-full mt-40">
				{items.map((item, itemIndex) => (
					<BankListCard key={itemIndex} {...item} />
				))}
			</div>
		</div>
	);
}

export default BundlePageTab;
