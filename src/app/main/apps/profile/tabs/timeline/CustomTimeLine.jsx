import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { FiEdit3 } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { HiDocumentCheck } from "react-icons/hi2";

import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";

export default function CustomTimeLine() {
	const container = {
		show: {
			transition: {
				staggerChildren: 0.04,
			},
		},
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 },
	};
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<Card
				component={motion.div}
				variants={item}
				className="flex flex-col w-full px-32 pt-24"
			>
				<Timeline position="alternate">
					<TimelineItem>
						<TimelineOppositeContent
							sx={{ m: "auto 0" }}
							align="right"
							variant="body2"
							color="text.secondary"
						>
							9:30 ب.ظ
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot color="warning">
								<FiEdit3 size={25} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ py: "12px", px: 2 }}>
							<Typography variant="h6" component="span">
								ویرایش بانک صنایع غذایی
							</Typography>
							<Typography className="text-grey-600">
								شرکت مهرام در بانک تولیدکنندگان
							</Typography>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem>
						<TimelineOppositeContent
							sx={{ m: "auto 0" }}
							variant="body2"
							color="text.secondary"
						>
							10:00 ب.ظ
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot className="bg-red-300">
								<MdDelete size={25} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ py: "12px", px: 2 }}>
							<Typography variant="h6" component="span">
								حذف بانک صنایع غذایی
							</Typography>
							<Typography className="text-gray-600">
								شرکت شیرین عسل در بانک تولیدکنندگان
							</Typography>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem>
						<TimelineOppositeContent
							sx={{ m: "auto 0" }}
							variant="body2"
							color="text.secondary"
						>
							10:00 ب.ظ
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot color="secondary">
								<FaEye size={25} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ py: "12px", px: 2 }}>
							<Typography variant="h6" component="span">
								بازدید بانک صنایع غذایی
							</Typography>
							<Typography className="text-gray-600">
								شرکت شیرین عسل در بانک تولیدکنندگان
							</Typography>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem>
						<TimelineOppositeContent
							sx={{ m: "auto 0" }}
							variant="body2"
							color="text.secondary"
						>
							10:00 ب.ظ
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot color="success">
								<HiDocumentCheck size={25} />
							</TimelineDot>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent sx={{ py: "12px", px: 2 }}>
							<Typography variant="h6" component="span">
								ثبت بانک صنایع غذایی
							</Typography>
							<Typography className="text-gray-600">
								شرکت شیرین عسل در بانک تولیدکنندگان
							</Typography>
						</TimelineContent>
					</TimelineItem>
				</Timeline>
			</Card>
		</motion.div>
	);
}
