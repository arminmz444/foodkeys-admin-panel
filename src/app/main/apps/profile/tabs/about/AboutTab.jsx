import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseLoading from "@fuse/core/FuseLoading";
import { IoPersonCircleOutline } from "react-icons/io5";
import { LuMailOpen, LuPhoneOutgoing } from "react-icons/lu";
import { useGetProfileAboutQuery } from "../../ProfileApi";
import { FiEdit3 } from "react-icons/fi";

/**
 * The about tab.
 */

const info = {
	firstName: "آرمین",
	lastName: "مظفری",
	city: "ساری",
	provience: "مازندران",
	address: "ولنجک، خیابان دانشجو، پلاک25 ",
	emails: ["arminmz@gmail.com", "armo4@gmail.com"],
	phone: [
		{ number: "09123456789", tag: "کاری" },
		{ number: "02457896554", tag: "منزل" },
	],
};
function AboutTab() {
	const { data: profile, isLoading } = useGetProfileAboutQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const { general, work, contact, groups, friends } = profile;
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
			<div className="md:flex">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					<Card component={motion.div} variants={item} className="w-full mb-32">
						<div className="flex justify-between items-center px-32 pt-24">
							<Typography className="text-3xl font-semibold leading-tight">
								اطلاعات کلی
							</Typography>
							<Button
								variant="contained"
								color="secondary"
								startIcon={<FiEdit3 />}
							>
								ویرایش
							</Button>
						</div>

						<CardContent className="px-32 py-24">
							<div className="mb-24">
								<Typography className="flex items-center gap-2 font-semibold mb-4 text-15">
									<IoPersonCircleOutline size={25} />
									نام و نام خانوادگی
								</Typography>
								<Typography className="text-gray-600">{`${info.firstName} ${info.lastName}`}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="flex items-center font-semibold mb-4 text-15">
									<FuseSvgIcon className="mx-4" size={20}>
										heroicons-outline:location-marker
									</FuseSvgIcon>
									آدرس
								</Typography>
								<div className="flex items-center">
									<div className="flex flex-col">
										<Typography className="text-gray-600">{`${info.provience} . ${info.city}`}</Typography>
										<Typography className="text-gray-600">
											{info.address}
										</Typography>
									</div>
								</div>
							</div>
							<div className="mb-24">
								<Typography className="gap-2 flex items-center font-semibold mb-4 text-15">
									<LuMailOpen size={20} />
									ایمیل‌ها
								</Typography>

								{info.emails.map((email) => (
									<div className="flex items-center text-gray-600" key={email}>
										<Typography>{email}</Typography>
									</div>
								))}
							</div>
							<div className="mb-24">
								<Typography className="flex items-center gap-2 font-semibold mb-4 text-15">
									<LuPhoneOutgoing size={20} />
									شماره تماس
								</Typography>

								{info.phone.map((phone) => (
									<div
										className="flex items-center gap-8 text-gray-600"
										key={phone.number}
									>
										<Typography>{phone.number}</Typography>
										<Typography>.</Typography>
										<Typography>{phone.tag}</Typography>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* <Card component={motion.div} variants={item} className="w-full mb-32">
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">
								Work
							</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Occupation
								</Typography>
								<Typography>{work.occupation}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Skills
								</Typography>
								<Typography>{work.skills}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Jobs
								</Typography>
								<table>
									<tbody>
										{work.jobs.map((job) => (
											<tr key={job.company}>
												<td>
													<Typography>{job.company}</Typography>
												</td>
												<td className="px-16">
													<Typography color="text.secondary">
														{job.date}
													</Typography>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card> */}

					{/* <Card component={motion.div} variants={item} className="w-full mb-32">
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">
								Contact
							</Typography>
						</div>

						<CardContent className="px-32 py-24">
							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Address
								</Typography>
								<Typography>{contact.address}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Tel.
								</Typography>

								{contact.tel.map((tel) => (
									<div className="flex items-center" key={tel}>
										<Typography>{tel}</Typography>
									</div>
								))}
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Website
								</Typography>

								{contact.websites.map((website) => (
									<div className="flex items-center" key={website}>
										<Typography>{website}</Typography>
									</div>
								))}
							</div>

							<div className="mb-24">
								<Typography className="font-semibold mb-4 text-15">
									Emails
								</Typography>

								{contact.emails.map((email) => (
									<div className="flex items-center" key={email}>
										<Typography>{email}</Typography>
									</div>
								))}
							</div>
						</CardContent>
					</Card> */}
				</div>

				{/* <div className="flex flex-col md:w-320"> */}
				{/* <Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="flex items-center px-32 pt-24">
							<Typography className="flex flex-1 text-2xl font-semibold leading-tight">
								Friends
							</Typography>

							<Button
								className="-mx-8"
								size="small"
							>
								See 454 more
							</Button>
						</div>

						<CardContent className="flex flex-wrap px-32">
							{friends.map((friend) => (
								<Avatar
									key={friend.id}
									className="w-64 h-64 rounded-12 m-4"
									src={friend.avatar}
									alt={friend.name}
								/>
							))}
						</CardContent>
					</Card> */}

				{/* <Card
						component={motion.div}
						variants={item}
						className="w-full mb-32 rounded-16 shadow"
					>
						<div className="px-32 pt-24 flex items-center">
							<Typography className="flex flex-1 text-2xl font-semibold leading-tight">
								Joined Groups
							</Typography>
							<div className="-mx-8">
								<Button color="inherit" size="small">
									See 6 more
								</Button>
							</div>
						</div>
						<CardContent className="px-32">
							<List className="p-0">
								{groups.map((group) => (
									<ListItem key={group.id} className="px-0 space-x-8">
										<Avatar alt={group.name}>{group.name[0]}</Avatar>
										<ListItemText
											primary={
												<div className="flex">
													<Typography
														className="font-medium"
														color="secondary.main"
														paragraph={false}
													>
														{group.name}
													</Typography>

													<Typography
														className="mx-4 font-normal"
														paragraph={false}
													>
														{group.category}
													</Typography>
												</div>
											}
											secondary={group.members}
										/>
										<ListItemSecondaryAction>
											<IconButton size="large">
												<FuseSvgIcon>
													heroicons-outline:dots-vertical
												</FuseSvgIcon>
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card> */}
				{/* </div> */}
			</div>
		</motion.div>
	);
}

export default AboutTab;
