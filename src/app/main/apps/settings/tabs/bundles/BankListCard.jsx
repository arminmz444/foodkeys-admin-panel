import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

function BankListCard({
	subCategoryId,
	title,
	desc,
	updatedDate,
	updatedTime,
	activeCount,
	variant,
}) {
	const [expanded, setExpanded] = useState(false)
	const toggleExpand = () => {
		setExpanded(!expanded)
	}
	const MAX_DESC_LENGTH = 100
	const isDescriptionLong = desc && desc.length > MAX_DESC_LENGTH
	const truncatedDescription = isDescriptionLong ? `${desc.substring(0, MAX_DESC_LENGTH)}...` : desc
	const showMoreButton = isDescriptionLong
	return (
		<Card 
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            sx={{ 
                minHeight: 220, 
                background: variant === 'primary' ? 'linear-gradient(135deg, #4F46E5 0%, #7E3AF2 100%)' : 'white',
                color: variant === 'primary' ? 'white' : 'inherit'
            }}
        >
            <div className="p-24 flex flex-col h-full">
                <div className="mb-16">
                    <Typography variant="h6" height="100px" className="font-bold mb-32">
                        {title}
                    </Typography>

                    <Typography variant="body2" className="line-clamp-2">
                        {truncatedDescription || 'توضیحات ثبت نشده است'}
						{showMoreButton && (
							<Button
								onClick={toggleExpand}
								className="self-start mt-3 text-blue-600 font-medium hover:text-blue-800 transition-colors"
								endIcon={expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
							>
								{expanded ? "نمایش کمتر" : "نمایش بیشتر"}
							</Button>
						)}
                    </Typography>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center gap-8 mb-8">
                        <MdOutlineAccessTimeFilled size={16} />
                        <Typography variant="caption">
                            اخرین بروزرسانی : {updatedTime} - {updatedDate}
                        </Typography>
                    </div>

                    <div className="flex items-center gap-8 mb-16">
                        <RiVerifiedBadgeFill size={16} className="text-green-500" />
                        <Typography variant="caption">
                            تعداد پلن‌های فعال : {activeCount}
                        </Typography>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            component={Link}
                            to={`/apps/settings/bundle/${subCategoryId}`}
                            variant="contained"
                            color={variant === 'primary' ? 'secondary' : 'primary'}
                            endIcon={<IoIosArrowRoundBack />}
                            size="small"
                        >
                            مشاهده لیست
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
		// <Card className="flex flex-col justify-between text-start h-384 shadow p-20 w-full sm:w-[calc(50%-3.2rem)]">
		// 	<div className="flex flex-col items-start gap-10">
		// 		<span
		// 			className={`w-20 h-20 ${variant === "food" ? "bg-orange-400" : variant === "farm" ? "bg-green-500" : variant === "service" ? "bg-blue-400" : "bg-black"} rounded-full animate-pulse`}
		// 		/>
		// 		<Typography className="text-xl font-800">{title}</Typography>
		// 		<Typography variant="caption" className="text-gray-600">
		// 			{desc}
		// 		</Typography>
		// 	</div>
		// 	<div>
		// 		<div className="flex gap-5 ">
		// 			<MdOutlineAccessTimeFilled size={20} />
		// 			<Typography variant="caption">
		// 				اخرین بروزرسانی : {updatedTime} - {updatedDate}
		// 			</Typography>
		// 		</div>
		// 		<div className="flex gap-5 text-green-500">
		// 			<RiVerifiedBadgeFill size={20} />
		// 			<Typography variant="caption">
		// 				تعداد پلن‌های فعال : {activeCount}
		// 			</Typography>
		// 		</div>
		// 	</div>
		// 	<div className="w-full flex flex-col items-end gap-16">
		// 		<div
		// 			// eslint-disable-next-line no-nested-ternary
		// 			className={`w-full ${variant === "food" ? "bg-orange-400" : variant === "farm" ? "bg-green-500" : variant === "service" ? "bg-blue-400" : "bg-black"} h-1`}
		// 		/>
		// 		<Button
		// 			className="font-400 group self-end "
		// 			variant="contained"
		// 			color="primary"
		// 			to={`/apps/settings/bundle/${subCategoryId}`}
		// 			// to={`/apps/academy/courses/${course.id}/${course.slug}`}
		// 			component={Link}
		// 		>
		// 			مشاهده لیست
		// 			<IoIosArrowRoundBack
		// 				size={30}
		// 				className="group-hover:-translate-x-3 transition-all"
		// 			/>
		// 		</Button>
		// 	</div>
		// </Card>
	);
}

export default BankListCard;
