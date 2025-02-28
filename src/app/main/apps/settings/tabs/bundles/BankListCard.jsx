import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function BankListCard({
	title,
	desc,
	updatedDate,
	updatedTime,
	activeCount,
	variant,
}) {
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
					className={`w-full ${variant === "food" ? "bg-orange-400" : variant === "farm" ? "bg-green-500" : variant === "service" ? "bg-blue-400" : "bg-black"} h-1`}
				/>
				<Button
					className="font-400 group self-end "
					variant="contained"
					color="primary"
					to={`/apps/settings/bundle-setting/food/1`}
					// to={`/apps/academy/courses/${course.id}/${course.slug}`}
					component={Link}
				>
					مشاهده لیست
					<IoIosArrowRoundBack
						size={30}
						className="group-hover:-translate-x-3 transition-all"
					/>
				</Button>
			</div>
		</Card>
	);
}

export default BankListCard;
