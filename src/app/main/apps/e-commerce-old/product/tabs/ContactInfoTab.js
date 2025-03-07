import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import CustomDialog from "./components/CustomDialog";
import CustomForm from "./components/CustomForm";

function ContactInfoTab(props) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const [phoneCount, setPhoneCount] = useState(0);
	const [faxCount, setFaxCount] = useState(0);
	const [phoneCountOffice, setPhoneCountOffice] = useState(0);
	const [faxCountOffice, setFaxCountOffice] = useState(0);
	const [emailCount, setEmailCount] = useState(0);

	return (
		<div>
			<Typography variant="h5" color="WindowText" className="font-bold">
				اطلاعات تماس محل فعالیت
			</Typography>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="province"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.province}
							helperText={errors?.province?.message}
							label="استان محل"
							id="province"
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					name="city"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.city}
							helperText={errors?.city?.message}
							label="شهر محل"
							id="city"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="industrialTown"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.industrialTown}
							helperText={errors?.industrialTown?.message}
							label="نام شهرک صنعتی"
							id="industrialTown"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="zipCode"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.zipCode}
							helperText={errors?.zipCode?.message}
							label="کدپستی"
							id="zipCode"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>

			<Controller
				name="address"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="address"
						label="آدرس"
						type="text"
						multiline
						rows={3}
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
				<Typography>
					تعداد تلفن های ثبت شده:{" "}
					{phoneCount !== 0 ? phoneCount + 1 : phoneCount}
				</Typography>
				<div className="w-1/3">
					<CustomDialog
						buttonText="افزودن شماره تلفن"
						title="افزودن شماره تماس های محل"
						setCount={setPhoneCount}
						form={
							<CustomForm
								totalAmount={3}
								textLabel="شماره تلفن محل"
								textName="phoneNumber"
								textType="number"
								count={phoneCount}
								setCount={setPhoneCount}
							/>
						}
					/>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
				<Typography>
					تعداد فکس های ثبت شده: {faxCount !== 0 ? faxCount + 1 : faxCount}
				</Typography>
				<div className="w-1/3">
					<CustomDialog
						buttonText="افزودن فکس"
						title="افزودن فکس های محل"
						setCount={setFaxCount}
						form={
							<CustomForm
								totalAmount={3}
								textLabel="شماره فکس محل"
								textName="fax"
								textType="number"
								count={faxCount}
								setCount={setFaxCount}
							/>
						}
					/>
				</div>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="companyMobile1"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.companyMobile1}
							helperText={
								errors?.companyMobile1?.message || "(مثال: 09123456789)"
							}
							label="شماره موبایل 1 شرکت"
							id="companyMobile1"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="phoneHolderPosition1"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.phoneHolderPosition1}
							helperText={errors?.phoneHolderPosition1?.message}
							label="سمت دارنده موبایل 1"
							id="phoneHolderPosition1"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="companyMobile2"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.companyMobile2}
							helperText={
								errors?.companyMobile2?.message || "(مثال: 09123456789)"
							}
							label="شماره موبایل 2 شرکت"
							id="companyMobile2"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="phoneHolderPosition2"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.phoneHolderPosition2}
							helperText={errors?.phoneHolderPosition2?.message}
							label="سمت دارنده موبایل 2"
							id="phoneHolderPosition2"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Typography variant="h5" color="WindowText" className="font-bold">
				اطلاعات تماس دفتر مرکزی
			</Typography>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="officeProvince"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.officeProvince}
							helperText={errors?.officeProvince?.message}
							label="استان محل دفتر مرکزی"
							id="officeProvince"
							variant="outlined"
							fullWidth
							required
						/>
					)}
				/>
				<Controller
					name="officeCity"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.officeCity}
							helperText={errors?.officeCity?.message}
							label="شهر دفتر مرکزی"
							id="officeCity"
							required
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="officeZipCode"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.officeZipCode}
							helperText={errors?.officeZipCode?.message}
							label="کدپستی دفتر مرکزی"
							id="officeZipCode"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Controller
				name="officeAddress"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="officeAddress"
						label="آدرس دفتر مرکزی"
						type="text"
						multiline
						rows={3}
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
				<Typography>
					تعداد تلفن های ثبت شده:{" "}
					{phoneCountOffice !== 0 ? phoneCountOffice + 1 : phoneCountOffice}
				</Typography>
				<div className="w-1/3">
					<CustomDialog
						buttonText="افزودن شماره تلفن"
						title="افزودن شماره تماس های دفتر مرکزی"
						form={
							<CustomForm
								totalAmount={3}
								textLabel="شماره تلفن دفتر مرکزی"
								textName="phoneNumberOffice"
								textType="number"
								count={phoneCountOffice}
								setCount={setPhoneCountOffice}
							/>
						}
						setCount={setPhoneCountOffice}
					/>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
				<Typography>
					تعداد فکس های ثبت شده:{" "}
					{faxCountOffice !== 0 ? faxCountOffice + 1 : faxCountOffice}
				</Typography>
				<div className="w-1/3">
					<CustomDialog
						buttonText="افزودن فکس"
						title="افزودن فکس های دفتر مرکزی"
						setCount={setFaxCountOffice}
						form={
							<CustomForm
								totalAmount={3}
								textLabel="شماره فکس دفتر مرکزی"
								textName="faxOffice"
								textType="number"
								count={faxCountOffice}
								setCount={setFaxCountOffice}
							/>
						}
					/>
				</div>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="sms"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.sms}
							helperText={errors?.sms?.message}
							label="سامانه پیام کوتاه"
							id="sms"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="specialLineNumber"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.specialLineNumber}
							helperText={errors?.specialLineNumber?.message}
							label="شماره خط ویژه"
							id="specialLineNumber"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Typography variant="h5" color="WindowText" className="font-bold">
				اطلاعات شبکه های اجتماعی و اینترنت{" "}
			</Typography>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="telegram"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.telegram}
							helperText={errors?.telegram?.message || "(مثال: 09123456789)"}
							label="شماره تلگرام"
							id="telegram"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="whatsapp"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.whatsapp}
							helperText={errors?.whatsapp?.message || "(مثال: 09123456789)"}
							label="شماره واتساپ"
							id="whatsapp"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="instagram"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.instagram}
							helperText={errors?.instagram?.message || "(مثال: @foodkeys)"}
							label="آی دی اینستاگرام"
							id="instagram"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="linkedin"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.linkedin}
							helperText={errors?.linkedin?.message || "(مثال: foodkeys)"}
							label="آی دی لینکدین"
							id="linkedin"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="eitaa"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.eitaa}
							helperText={errors?.eitaa?.message || "(مثال: 09123456789)"}
							label="شماره ایتا"
							id="eitaa"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="rubika"
					control={control}
					render={({ field }) => (
						<TextField
							type="number"
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.rubika}
							helperText={errors?.rubika?.message || "(مثال: 09123456789)"}
							label="شماره روبیکا"
							id="rubika"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
				<Typography>
					تعداد ایمیل های ثبت شده:{" "}
					{emailCount !== 0 ? emailCount + 1 : emailCount}
				</Typography>
				<div className="w-1/3">
					<CustomDialog
						buttonText="افزودن ایمیل"
						title="افزودن ایمیل ها"
						setCount={setEmailCount}
						form={
							<CustomForm
								totalAmount={3}
								textLabel="آدرس ایمیل"
								textName="email"
								textType="email"
								count={emailCount}
								setCount={setEmailCount}
							/>
						}
					/>
				</div>
			</div>
			<Controller
				name="website"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.website}
						helperText={errors?.website?.message || "(مثال: www.foodkeys.com)"}
						label="وبسایت"
						id="website"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default ContactInfoTab;
