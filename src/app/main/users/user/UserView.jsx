import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useNavigate, useParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/system/Box";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import { useGetUsersItemQuery, useGetContactsCountriesQuery, useGetContactsTagsQuery } from '../UserApi.js';
import { getServerFile } from '@/utils/string-utils.js';

/**
 * The contact view.
 */
function UserView() {
	const { data: countries } = useGetContactsCountriesQuery();
	const { data: tags } = useGetContactsTagsQuery();
	const routeParams = useParams();
	const { id: contactId } = routeParams;
	const {
		data: contact,
		isLoading,
		isError
	} = useGetUsersItemQuery(contactId, {
		skip: !contactId
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	function getCountryByIso(iso) {
		return countries?.find((country) => country.iso === iso);
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate("/apps/users");
			dispatch(showMessage({ message: "کاربر یافت نشد" }));
		}, 0);
		return null;
	}

	if (!contact) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: "background.default"
				}}
			>
				{contact.background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={contact.background}
						alt="user background"
					/>
				)}
			</Box>
			<div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
				<div className="w-full max-w-3xl">
					<div className="flex flex-auto items-end -mt-64">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: "solid",
								borderColor: "background.paper",
								backgroundColor: "background.default",
								color: "text.secondary"
							}}
							className="w-128 h-128 text-64 font-bold"
							src={getServerFile(contact.avatar?.filePath)}
							alt={`${contact.firstName} ${contact.lastName}`}
						>
							{contact.firstName.charAt(0)}
						</Avatar>
						<div className="flex items-center mr-auto mb-4">
							<Button
								className="me-4"
								variant="outlined"
								color="error"
								component={NavLinkAdapter}
								to="edit"
							>
								<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>

								<span className="mx-8">حذف</span>
							</Button>
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="edit"
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>

								<span className="mx-8">ویرایش</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">
						{`${contact.firstName} ${contact.lastName}`}
					</Typography>

					{/* <div className="flex flex-wrap items-center mt-8">
						{contact?.tags?.map((id) => (
							<Chip
								key={id}
								label={_.find(tags, { id })?.title}
								className="mr-12 mb-12"
								size="small"
							/>
						))}
					</div> */}

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						{contact.jobPosition && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="mr-10 leading-6">{contact.jobPosition}</div>
							</div>
						)}

						{contact.company && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:office-building</FuseSvgIcon>
								<div className="mr-10 leading-6">{contact.company}</div>
							</div>
						)}

						{contact?.emails?.length && contact.emails.some((item) => item.email?.length > 0) && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
								<div className="min-w-0 mr-10 space-y-4">
									{contact.emails.map(
										(item) =>
											item.email !== "" && (
												<div
													className="flex items-center leading-6"
													key={item.email}
												>
													<a
														className="hover:underline text-primary-500 rounded-6 px-8"
														href={`mailto: ${item.email}`}
														target="_blank"
														rel="noreferrer"
													>
														{item.email}
													</a>
													{item.label && (
														<Typography
															className="text-md truncate"
															color="text.secondary"
														>
															<span className="mx-8">&bull;</span>
															<span className="font-400">{item.label}</span>
														</Typography>
													)}
												</div>
											)
									)}
								</div>
							</div>
						)}

						{contact?.phoneNumbers &&
							contact?.phoneNumbers?.length &&
							contact.phoneNumbers.some((item) => item.phoneNumber?.length > 0) && (
								<div className="flex items-center">
									<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
									<div className="min-w-0 mr-10 space-y-4">
										{contact.phoneNumbers.map(
											(item, index) =>
												item.phoneNumber !== "" && (
													<div
														className="flex items-center leading-6"
														key={index}
													>
														<a
															href={`tel:${item.phoneNumber}`}
															className="ml-10 font-600 no-underline text-lg"
														>
															<Button
																variant="text"
																size="small"
															>
																{item.phoneNumber}
															</Button>
														</a>

														{item.label && (
															<Typography
																className="text-md truncate"
																color="text.secondary"
															>
																<span className="mx-8">&bull;</span>
																<span className="font-medium">{item.label}</span>
															</Typography>
														)}
													</div>
												)
										)}
									</div>
								</div>
							)}
						{/* 
						{contact.address && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{contact.address}</div>
							</div>
						)} */}

						{/* {contact.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">
									{format(new Date(contact.birthday), "MMMM d, y")}
								</div>
							</div>
						)} */}

						{contact.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
								<div
									className="max-w-none mr-10 prose dark:prose-invert"
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{ __html: contact.notes }}
								/>
							</div>
						)}
						{contact.accessibility && (
							<div className="flex items-center">
								<Typography>دسترسی‌ها: </Typography>
								{contact.accessibility.map((acc, index) => (
									<div
										key={index}
										className="max-w-none mr-10 prose dark:prose-invert animate-pulse border-red-100"
									>
										<span className="px-10 py-5 bg-red-100 rounded-16 border-red-100 font-normal">
											{acc}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default UserView;
