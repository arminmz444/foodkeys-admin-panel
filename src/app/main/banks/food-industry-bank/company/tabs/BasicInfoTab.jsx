import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@mui/base";

/**
 * The basic info tab.
 */
function BasicInfoTab() {
  const methods = useFormContext();
  const { control, formState, watch } = methods;
  const { errors } = formState;
  const [subcategories, setSubcategories] = useState(methods.getValues("subcategories") || []);
  const [companyTypeOptions, setCompanyTypeOptions] = useState(methods.getValues("companyTypeOptions") || []);
  const [subCategory, setSubCategory] = useState(0);
  const [companyType, setCompanyType] = useState(0);
  const [hasFetchedSubCategories, setHasFetchedSubCategories] = useState(false);
  const [hasFetchedCompanyTypes, setHasFetchedCompanyTypes] = useState(false);
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`/category/1/subcategory`);
        if (response.data.status === "SUCCESS") {
          setSubcategories(response.data.data);
          methods.setValue("subcategories", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    if((!subcategories || subcategories.length === 0) && !hasFetchedSubCategories) {
      fetchSubCategories();
      setHasFetchedSubCategories(true);
    }
  }, []);
  useEffect(() => {
    const fetchCompanyTypes = async () => {
      const response = await axios.get(`/client/panel/company/fetch/type`);
      if (response.data.status === "SUCCESS") {
        setCompanyTypeOptions(response.data.data);
        methods.setValue("companyTypeOptions", response.data.data);
      }
    };
    if((!companyTypeOptions || companyTypeOptions.length === 0) && !hasFetchedCompanyTypes) {
      fetchCompanyTypes();
      setHasFetchedCompanyTypes(true);
    }
  }, []);
  
  const watchedSubCategory = watch("subCategory");
  const watchedCompanyType = watch("companyType");
  useEffect(() => {
    if (watchedSubCategory) setSubCategory(watchedSubCategory.value);
    // if (subcategories && subcategories.length) setSubCategory(subCategoryWatch[0].value);
    if (watchedCompanyType) setCompanyType(watchedCompanyType.value);
  }, [watchedSubCategory, watchedCompanyType]);
  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <div>
      <Controller
        name="subCategory"
        control={control}
        render={({ field }) => (
          <FormControl className="mt-8 mb-16 w-full">
            <InputLabel id="subCategorySelect">دسته بندی</InputLabel>
            <Select
              // options={subcategories.map((subcategory) => ({
              //   value: subcategory.value,
              //   label: subcategory.name,
              // }))}
              labelId="subCategorySelect"
              id="subCategorySelect"
              value={subCategory}
              label="زیرشاخه"
              getOptionLabel={(option) => option.name}
              onChange={(e) => handleChange(e, setSubCategory)}
              fullWidth
              required
            >
              {subcategories && subcategories.length ? (
                subcategories.map((cat, catIndex) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={0}>دسته بندی</MenuItem>
              )}
            </Select>
          </FormControl>
          // <TextField
          // 	{...field}
          // 	className="mt-8 mb-16 sm:mx-4"
          // 	error={!!errors.category}
          // 	required
          // 	helperText={errors?.category?.message}
          // 	label="دسته بندی"
          // 	id="category"
          // 	variant="outlined"
          // 	fullWidth
          // />
        )}
      />
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.companyName}
              required
              helperText={errors?.companyName?.message}
              label="نام شرکت"
              autoFocus
              id="companyName"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="companyNameEn"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.companyNameEn}
              required
              helperText={errors?.companyNameEn?.message}
              label="نام شرکت به انگلیسی"
              id="companyNameEn"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="mainBrand"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.mainBrand}
              required
              helperText={errors?.mainBrand?.message}
              label="نام تجاری (برند) اصلی"
              id="mainBrand"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="mainBrandEn"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.mainBrandEn}
              required
              helperText={errors?.mainBrandEn?.message}
              label="نام تجاری (برند) اصلی به انگلیسی"
              id="mainBrandEn"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>


      <Controller
        name="companyType"
        control={control}
        render={({ field }) => (
          <FormControl className="mt-8 mb-16 w-full">
            <InputLabel id="companyTypeSelectLabel">نوع شرکت</InputLabel>
            <Select
              labelId="companyTypeSelectLabel"
              id="companyTypeSelect"
              value={companyType}
              label="نوع شرکت"
              getOptionLabel={(option) => option.name}
              onChange={(e) => handleChange(e, setCompanyType)}
              fullWidth
              required
            >
              {companyTypeOptions && companyTypeOptions.length ? (
                companyTypeOptions.map((cotype, catIndex) => (
                  <MenuItem key={cotype.value} value={cotype.value}>
                    {cotype.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={0}>نوع شرکت</MenuItem>
              )}
            </Select>
          </FormControl>
        )}
      />
      
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="establishDateStr"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.establishmentDate}
              helperText={errors?.establishmentDate?.message || "(مثال: 1389)"}
              label="تاریخ تأسیس"
              id="establishDateStr"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="activityType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.activityType}
              helperText={
                errors?.activityType?.message ||
                "(مثال : تولیدکننده، واردکننده، فروشنده، پرورش دهنده)"
              }
              label="نوع فعالیت"
              id="activityType"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="activityCapacity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.activityCapacity}
              helperText={errors?.activityCapacity?.message}
              label="ظرفیت فعالیت"
              id="activityCapacity"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <Controller
        name="subjectOfActivity"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 sm:mx-4"
            error={!!errors.subjectOfActivity}
            helperText={errors?.subjectOfActivity?.message}
            label="موضوع فعالیت"
            id="subjectOfActivity"
            variant="outlined"
            fullWidth
            multiline
          />
        )}
      />
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="landArea"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.landArea}
              helperText={errors?.landArea?.message}
              label="متراژ زمین"
              id="landArea"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="buildingArea"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.buildingArea}
              helperText={errors?.buildingArea?.message}
              label="متراژ بنا"
              id="buildingArea"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <div className="flex sm:flex-row flex-col -mx-4">
        <Controller
          name="ceo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.ceoName}
              helperText={errors?.ceoName?.message}
              label="نام و نام خانوادگی مدیرعامل"
              id="ceoName"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="ceoPhoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              className="mt-8 mb-16 sm:mx-4"
              error={!!errors.ceoPhoneNumber}
              helperText={
                errors?.ceoPhoneNumber?.message || "(مثال: 09123456789)"
              }
              label="تلفن همراه مدیر عامل"
              id="ceoPhoneNumber"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <Controller
        name="stakeholders"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 sm:mx-4"
            error={!!errors.stakeholders}
            helperText={errors?.stakeholders?.message}
            label="نام مالک یا سهامداران"
            id="stakeholders"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="productTitles"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="productTitles"
            label="عنوان محصولات (یا خدمات)"
            type="text"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="companyKeyWords"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="چندین کلمه کلیدی را انتخاب کنید"
                label="کلمات کلیدی"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name="companyTags"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            freeSolo
            options={[]}
            value={value}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="چندین برچسب را انتخاب کنید"
                label="برچسب ها"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />
    </div>
    // <Grid
    // 	container
    // 	rowSpacing={1}
    // 	columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    // 	className="pt-8 px-32"
    // >
    // 	<Controller
    // 		name="category"
    // 		control={control}
    // 		render={({ field }) => (
    // 			<FormControl className="mt-8 mb-16 w-full">
    // 				<InputLabel id="categorySelect">دسته بندی</InputLabel>
    // 				<Select
    // 					labelId="categorySelect"
    // 					id="categorySelect1"
    // 					value={AGRICULTURE_INDUSTRY_CATEGORIES}
    // 					label="دسته بندی"
    // 					onChange={handleChange}
    // 					fullWidth
    // 					required
    // 				>
    // 					{AGRICULTURE_INDUSTRY_CATEGORIES.map((cat, catIndex) => (
    // 						<MenuItem
    // 							key={cat}
    // 							value={catIndex}
    // 						>
    // 							{cat}
    // 						</MenuItem>
    // 					))}
    // 				</Select>
    // 			</FormControl>
    // 			// <TextField
    // 			// 	{...field}
    // 			// 	className="mt-8 mb-16 sm:mx-4"
    // 			// 	error={!!errors.category}
    // 			// 	required
    // 			// 	helperText={errors?.category?.message}
    // 			// 	label="دسته بندی"
    // 			// 	id="category"
    // 			// 	variant="outlined"
    // 			// 	fullWidth
    // 			// />
    // 		)}
    // 	/>
    // 	<Grid xs={6}>
    // 		<Controller
    // 			name="companyName"
    // 			control={control}
    // 			render={({ field }) => (
    // 				<TextField
    // 					{...field}
    // 					className="mt-8 mb-16 me-4"
    // 					required
    // 					label="نام شرکت"
    // 					autoFocus
    // 					id="companyName"
    // 					variant="outlined"
    // 					fullWidth
    // 					error={!!errors.companyName}
    // 					helperText={errors?.companyName?.message}
    // 				/>
    // 			)}
    // 		/>
    // 	</Grid>
    // 	<Grid xs={6}>
    // 		<Controller
    // 			name="companyNameEn"
    // 			control={control}
    // 			render={({ field }) => (
    // 				<TextField
    // 					{...field}
    // 					className="mt-8 mb-16 ms-4"
    // 					required
    // 					label="نام شرکت به انگلیسی"
    // 					autoFocus
    // 					id="companyNameEn"
    // 					variant="outlined"
    // 					fullWidth
    // 					error={!!errors.companyNameEn}
    // 					helperText={errors?.companyNameEn?.message}
    // 				/>
    // 			)}
    // 		/>
    // 	</Grid>
    //
    // 	<Controller
    // 		name="description"
    // 		control={control}
    // 		render={({ field }) => (
    // 			<TextField
    // 				{...field}
    // 				className="mt-8 mb-16"
    // 				id="description"
    // 				label="Description"
    // 				type="text"
    // 				multiline
    // 				rows={5}
    // 				variant="outlined"
    // 				fullWidth
    // 			/>
    // 		)}
    // 	/>
    //
    // 	<Controller
    // 		name="categories"
    // 		control={control}
    // 		defaultValue={[]}
    // 		render={({ field: { onChange, value } }) => (
    // 			<Autocomplete
    // 				className="mt-8 mb-16"
    // 				multiple
    // 				freeSolo
    // 				options={[]}
    // 				value={value}
    // 				onChange={(event, newValue) => {
    // 					onChange(newValue);
    // 				}}
    // 				renderInput={(params) => (
    // 					<TextField
    // 						{...params}
    // 						placeholder="Select multiple categories"
    // 						label="CategoriesOutlet"
    // 						variant="outlined"
    // 						InputLabelProps={{
    // 							shrink: true
    // 						}}
    // 					/>
    // 				)}
    // 			/>
    // 		)}
    // 	/>
    //
    // 	<Controller
    // 		name="tags"
    // 		control={control}
    // 		defaultValue={[]}
    // 		render={({ field: { onChange, value } }) => (
    // 			<Autocomplete
    // 				className="mt-8 mb-16"
    // 				multiple
    // 				freeSolo
    // 				options={[]}
    // 				value={value}
    // 				onChange={(event, newValue) => {
    // 					onChange(newValue);
    // 				}}
    // 				renderInput={(params) => (
    // 					<TextField
    // 						{...params}
    // 						placeholder="Select multiple tags"
    // 						label="Tags"
    // 						variant="outlined"
    // 						InputLabelProps={{
    // 							shrink: true
    // 						}}
    // 					/>
    // 				)}
    // 			/>
    // 		)}
    // 	/>
    // </Grid>
  );
}

export default BasicInfoTab;
