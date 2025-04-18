import { Button, InputAdornment, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomDialog from "./components/CustomDialog";
import CustomForm from "./components/CustomForm";
import CustomArrayFieldSelector from "./components/custom-array-field-input/CustomArrayFieldSelector";
import CommunicationMediumArraySelector from "./components/custom-array-field-input/CommunicationMediumSelector";
import axios from "axios";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { BiMinus, BiTrash } from "react-icons/bi";

function ContactInfoTab(props) {
  const [emails, setEmails] = useState([])
  const methods = useFormContext();
  const { control, formState, watch } = methods;
  const { errors } = formState;
  const [emailCount, setEmailCount] = useState(0);
  const [officeTels, setOfficeTels] = useState([]);
  const [officeFaxes, setOfficeFaxes] = useState([]);
  const [factoryTels, setFactoryTels] = useState([]);
  const [factoryFaxes, setFactoryFaxes] = useState([])
  // const [provinces, setProvinces] = useState([])
  // const [cities, setCities] = useState([])
  // const [contacts, setContacts] = useState([])
  // const [selectedProvince, setSelectedProvince] = useState();

  const watchedEmails = watch('emails', [])
  const watchedOfficeTels = watch('officeTels', []);
  const watchedOfficeFaxes = watch('officeFaxes', []);
  const watchedFactoryTels = watch('factoryTels', []);
  const watchedFactoryFaxes = watch('factoryFaxes', []);
  // const watchedContacts = watch('contacts', []);
  const watchedLocation = watch('location', {})


  useEffect(() => {
    if (watchedEmails && watchedEmails.length) {
      setEmails(watchedEmails);
    }
    if (watchedOfficeTels && watchedOfficeTels.length) {
      setOfficeTels(watchedOfficeTels.map((tel) => tel.telNumber));
    }
    if (watchedOfficeFaxes && watchedOfficeFaxes.length) {
      setOfficeFaxes(watchedOfficeFaxes.map((fax) => fax.telNumber));
    }
    if (watchedFactoryTels && watchedFactoryTels.length) {
      setFactoryTels(watchedFactoryTels.map((tel) => tel.telNumber));
    }
    if (watchedFactoryFaxes && watchedFactoryFaxes.length) {
      setFactoryFaxes(watchedFactoryFaxes.map((fax) => fax.telNumber));
    }
    // if (watchedContacts && watchedContacts) {
    //   setContacts(watchedContacts);
    
  }, [watchedEmails, watchedOfficeTels, watchedOfficeFaxes, watchedFactoryTels, watchedFactoryFaxes]);

  // useEffect(() => {
  //   const fetchProvinces = async () => {
  //     try {
  //       const response = await axios.get('/province');
  //       if (response.data.status === 'SUCCESS') {
  //         setProvinces(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching provinces:', error);
  //     }
  //   };
  //   fetchProvinces();
  // }, []);

  // useEffect(() => {
  //   if (selectedProvince) {
  //     const fetchCities = async () => {
  //       try {
  //         const response = await axios.get(
  //           `/province/${selectedProvince.value}/city`
  //         );
  //         if (response.data.status === 'SUCCESS') {
  //           setCities(response.data.data);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching cities:', error);
  //       }
  //     };
  //     fetchCities();
  //   }
  // }, [selectedProvince]);

  return (
    <div>
      <Typography variant="h5" color="WindowText" className="font-bold">
        اطلاعات تماس محل فعالیت
      </Typography>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="factoryState"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.factoryState}
              helperText={errors?.factoryState?.message}
              label="استان کارخانه"
              id="factoryState"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Controller
          name="factoryCity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.factoryCity}
              helperText={errors?.factoryCity?.message}
              label="شهر کارخانه"
              id="factoryCity"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="industrialCity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.industrialCity}
              helperText={errors?.industrialCity?.message}
              label="نام شهرک صنعتی"
              id="industrialCity"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="factoryPoBox"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.factoryPoBox}
              helperText={errors?.factoryPoBox?.message}
              label="کدپستی"
              id="factoryPoBox"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>

      <Controller
        name="factoryLocation"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="factoryLocation"
            label="آدرس کارخانه"
            type="text"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
          />
        )}
      />
       <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          تلفن ثابت کارخانه
        </label>
        {factoryTels.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2">
          
          <TextField
              label={`تلفن کارخانه ${index + 1}`}
              placeholder={`تلفن کارخانه ${index + 1}`}
							variant="outlined"
							fullWidth
							type=""
							className="me-10 mt-16"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={phone}
              onChange={(e) => {
                const newPhones = [...factoryTels];
                newPhones[index] = e.target.value;
                setFactoryTels(newPhones);
              }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
            <Button
              onClick={() =>
                setFactoryTels(factoryTels.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <BiMinus size={30} color="red" className="text-red-light" />
            </Button>
          </div>
        ))}
        {factoryTels.length < 3 && (
         <Button
				className="group inline-flex items-center mt-8 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => setFactoryTels([...factoryTels, ''])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{"افزودن شماره تلفن جدید"}</span>
			</Button>
        )}
      </div>

      <div className="flex flex-col space-y-2 mt-16">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          فکس ثابت کارخانه
        </label>
        {factoryFaxes.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2 mt-8">
          
          <TextField
              label={`فکس کارخانه ${index + 1}`}
              placeholder={`فکس کارخانه ${index + 1}`}
							variant="outlined"
							fullWidth
							type=""
							className="me-10"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={phone}
              onChange={(e) => {
                const newPhones = [...factoryFaxes];
                newPhones[index] = e.target.value;
                setFactoryFaxes(newPhones);
              }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
            <Button
              onClick={() =>
                setFactoryFaxes(factoryFaxes.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <BiMinus size={30} color="red" className="text-red-light" />
            </Button>
          </div>
        ))}
        {factoryFaxes.length < 3 && (
         <Button
				className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => setFactoryFaxes([...factoryFaxes, ''])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{"افزودن شماره فکس جدید"}</span>
			</Button>
        )}
      </div>
      {/* <Controller
        control={control}
        name="emails"
        render={({ field }) => (
          <CommunicationMediumArraySelector
            className="mt-32"
            {...field}
            value={field?.value}
            onChange={(val) => field.onChange(val)}
            addButtonText="افزودن راه ارتباطی جدید"
          />
        )}
      /> */}
{/* 
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          تلفن‌های ثابت کارخانه
        </label>
        {factoryTels.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2">
            <Input
              type="number"
              value={phone}
              placeholder={`تلفن کارخانه ${index + 1}`}
              onChange={(e) => {
                const newPhones = [...factoryTels];
                newPhones[index] = e.target.value;
                setFactoryTels(newPhones);
              }}
              className="flex-grow"
            />
            <ActionIcon
              onClick={() =>
                setFactoryTels(factoryTels.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <TrashIcon className="h-4 w-4 text-red-light" />
            </ActionIcon>
          </div>
        ))}
        {factoryTels.length < 3 && (
          <Button
            onClick={() => setFactoryTels([...factoryTels, ''])}
            variant="outline"
          >
            <PiPlusBold className="me-2 h-4 w-4" /> اضافه کردن تلفن جدید
          </Button>
        )}
      </div> */}

     
     
      {/* <Controller
					control={control}
					name={}
					render={({ field }) => (
						<TextField
							{...field}
							label={typeInputLabel}
							placeholder={typeInputPlaceholder}
							variant="outlined"
							fullWidth
							type={inputType}
							className="me-10"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={value}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/> */}
      {/* <Controller
        control={control}
        name="officeTels"
        render={({ field }) => (
          <CustomArrayFieldSelector
            className="mt-32"
            {...field}
            error={!!errors.phoneNumbers}
            helperText={errors?.phoneNumbers?.message}
            value={
              field.value || [
                { country: "", label: "تست", value: "09352388350" },
              ]
            }
            onChange={(val) => field.onChange(val)}
            inputName="officeTels"
            inputLabel="شماره تلفن‌های ثبت شده"
            inputPlaceholder="شماره تلفن‌های ثبت شده"
            haveTypeInput={false}
            buttonText="افزودن شماره تلفن جدید"
          />
        )}
      /> */}
      {/* <div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4"> */}
      {/*	<Typography>تعداد تلفن های ثبت شده: {phoneCount !== 0 ? phoneCount + 1 : phoneCount}</Typography> */}
      {/*	<div className="w-1/3"> */}
      {/*		<CustomDialog */}
      {/*			buttonText="افزودن شماره تلفن" */}
      {/*			title="افزودن شماره تماس های محل" */}
      {/*			setCount={setPhoneCount} */}
      {/*			form={ */}
      {/*				<CustomForm */}
      {/*					totalAmount={3} */}
      {/*					textLabel="شماره تلفن محل" */}
      {/*					textName="phoneNumber" */}
      {/*					textType="number" */}
      {/*					count={phoneCount} */}
      {/*					setCount={setPhoneCount} */}
      {/*				/> */}
      {/*			} */}
      {/*		/> */}
      {/*	</div> */}
      {/* </div> */}
      {/* <div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4"> */}
      {/*	<Typography>تعداد فکس های ثبت شده: {faxCount !== 0 ? faxCount + 1 : faxCount}</Typography> */}
      {/*	<div className="w-1/3"> */}
      {/*		<CustomDialog */}
      {/*			buttonText="افزودن فکس" */}
      {/*			title="افزودن فکس های محل" */}
      {/*			setCount={setFaxCount} */}
      {/*			form={ */}
      {/*				<CustomForm */}
      {/*					totalAmount={3} */}
      {/*					textLabel="شماره فکس محل" */}
      {/*					textName="fax" */}
      {/*					textType="number" */}
      {/*					count={faxCount} */}
      {/*					setCount={setFaxCount} */}
      {/*				/> */}
      {/*			} */}
      {/*		/> */}
      {/*	</div> */}
      {/* </div> */}
      {/* <div className="flex sm:flex-row flex-col -mx-4">
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
        /> */}
        {/* <Controller
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
      </div> */}
      <Typography variant="h5" color="WindowText" className="font-bold mt-48">
        اطلاعات تماس دفتر مرکزی
      </Typography>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="officeState"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.officeState}
              helperText={errors?.officeState?.message}
              label="استان محل دفتر مرکزی"
              id="officeState"
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
          name="officePoBox"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.officePoBox}
              helperText={errors?.officePoBox?.message}
              label="کدپستی دفتر مرکزی"
              id="officePoBox"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <Controller
        name="officeLocation"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="officeLocation"
            label="آدرس دفتر مرکزی"
            type="text"
            error={!!errors.officeLocation}
            helperText={errors?.officeLocation?.message}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
          />
        )}
      />
      {/* <div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
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
      </div> */}
      <div className="flex flex-col space-y-2 mt-8">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          تلفن ثابت اداره مرکزی
        </label>
        {officeTels.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2">
          
          <TextField
              label={`تلفن اداره مرکزی ${index + 1}`}
              placeholder={`تلفن اداره مرکزی ${index + 1}`}
							variant="outlined"
							fullWidth
							type=""
							className="me-10 mt-16"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={phone}
              onChange={(e) => {
                const newPhones = [...officeTels];
                newPhones[index] = e.target.value;
                setOfficeTels(newPhones);
              }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
            <Button
              onClick={() =>
                setOfficeTels(officeTels.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <BiMinus size={30} color="red" className="text-red-light" />
            </Button>
          </div>
        ))}
        {officeTels.length < 3 && (
         <Button
				className="group inline-flex items-center mt-8 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => setOfficeTels([...officeTels, ''])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{"افزودن شماره تلفن جدید"}</span>
			</Button>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          شماره فکس‌های اداره مرکزی
        </label>
        {officeFaxes.map((phone, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2">
          
          <TextField
              label={`فکس اداره مرکزی ${index + 1}`}
              placeholder={`فکس اداره مرکزی ${index + 1}`}
							variant="outlined"
							fullWidth
							type=""
							className="me-10 mt-16"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={phone}
              onChange={(e) => {
                const newPhones = [...officeFaxes];
                newPhones[index] = e.target.value;
                setOfficeFaxes(newPhones);
              }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
            <Button
              onClick={() =>
                setOfficeFaxes(officeFaxes.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <BiMinus size={30} color="red" className="text-red-light" />
            </Button>
          </div>
        ))}
        {officeFaxes.length < 3 && (
         <Button
				className="group inline-flex items-center mt-8 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => setOfficeFaxes([...officeFaxes, ''])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{"افزودن شماره فکس جدید"}</span>
			</Button>
        )}
      </div>
      <div className="flex sm:flex-row flex-col mt-16 -mx-4">
        <Controller
          name="smsNumber"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.smsNumber}
              helperText={errors?.smsNumber?.message}
              label="سامانه پیام کوتاه"
              id="smsNumber"
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
      <Typography variant="h5" color="WindowText" className="font-bold mt-48">
        اطلاعات شبکه های اجتماعی و اینترنت{" "}
      </Typography>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="telegramId"
          control={control}
          render={({ field }) => (
            <TextField
              type="text"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.telegramId}
              helperText={errors?.telegramId?.message || "(مثال: 09123456789)"}
              label="آیدی تلگرام"
              id="telegramId"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="telegramPhoneNo"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.telegramPhoneNo}
              helperText={errors?.telegramPhoneNo?.message || "(مثال: 09123456789)"}
              label="شماره تلگرام"
              id="telegramPhoneNo"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="whatsAppId"
          control={control}
          render={({ field }) => (
            <TextField
              type="text"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.whatsAppId}
              helperText={errors?.whatsAppId?.message || "(مثال: 09123456789)"}
              label="شماره واتساپ"
              id="whatsAppId"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="whatsAppPhoneNo"
          control={control}
          render={({ field }) => (
            <TextField
              type="text"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.whatsAppPhoneNo}
              helperText={errors?.whatsAppPhoneNo?.message || "(مثال: 09123456789)"}
              label="شماره واتساپ"
              id="whatsAppPhoneNo"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="instagramId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.instagramId}
              helperText={errors?.instagramId?.message || "(مثال: @foodkeys)"}
              label="آی دی اینستاگرام"
              id="instagramId"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="linkedInId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.linkedInId}
              helperText={errors?.linkedInId?.message || "(مثال: foodkeys)"}
              label="آی دی لینکدین"
              id="linkedInId"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="skypeId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.skypeId}
              helperText={errors?.skypeId?.message || "(مثال: foodkeys)"}
              label="آی دی لینکدین"
              id="skypeId"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="eitaaPhoneNo"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.eitaaPhoneNo}
              helperText={errors?.eitaaPhoneNo?.message || "(مثال: 09123456789)"}
              label="شماره ایتا"
              id="eitaaPhoneNo"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="rubikaPhoneNo"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.rubikaPhoneNo}
              helperText={errors?.rubikaPhoneNo?.message || "(مثال: 09123456789)"}
              label="شماره روبیکا"
              id="rubikaPhoneNo"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      {/* <div className="flex flex-col sm:flex-row sm:gap-10 items-center my-4">
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
      </div> */}
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-gray-700 dark:text-gray-600">
          ایمیل ثبت شده
        </label>
        {emails?.map((email, index) => (
          <div key={index} className="flex items-center gap-2 space-x-2">
          
          <TextField
              label={`آدرس ایمیل ${index + 1}`}
              placeholder={`آدرس ایمیل ${index + 1}`}
							variant="outlined"
							fullWidth
							type=""
							className="me-10 mt-16"
							error={!!errors.label}
							helperText={errors?.label?.message}
							value={email}
              onChange={(e) => {
                const newEmails = [...emails];
                newEmails[index] = e.target.value;
                setEmails(newEmails);
              }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
            <Button
              onClick={() =>
                setEmails(emails.filter((_, i) => i !== index))
              }
              variant="flat"
              color="danger"
            >
              <BiMinus size={30} color="red" className="text-red-light" />
            </Button>
          </div>
        ))}
        {emails?.length < 3 && (
         <Button
				className="group inline-flex items-center mt-8 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => setEmails([...emails, ''])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{"افزودن ایمیل جدید"}</span>
			</Button>
        )}
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
