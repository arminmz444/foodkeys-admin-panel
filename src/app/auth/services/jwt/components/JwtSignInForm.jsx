import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {z} from 'zod';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import useJwtAuth from '../useJwtAuth';
import {useDispatch} from "react-redux";
import {showMessage} from "@fuse/core/FuseMessage/fuseMessageSlice.js";

/**
 * Form Validation Schema
 */
const schema = z.object({
    username: z.string().nonempty('نام کاربری خود را وارد کنید.'),
    password: z
        .string()
        .min(1, 'رمزعبور خود را وارد کنید.')
        // .nonempty('رمزعبور خود را وارد کنید.')
});
const defaultValues = {
    username: '',
    password: '',
    remember: true
};

function JwtSignInForm() {
    const {signIn} = useJwtAuth();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const {control, formState, handleSubmit, setValue, setError} = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: zodResolver(schema)
    });
    const {isValid, dirtyFields, errors} = formState;
    // useEffect(() => {
        // setValue('username', '', {shouldDirty: true, shouldValidate: true}); // default: admin@fusetheme.com
        // setValue('password', '', {shouldDirty: true, shouldValidate: true}); // default: admin
    // }, [setValue]);

    async function onSubmit(formData) {
        setLoading(true);
        try {
            const {username, password} = formData;
            const response = await signIn({username, password});
            console.log(response)
            if (response?.code === "ERR_BAD_REQUEST") throw new Error("Error signing in");
            // dispatch(showMessage({message: 'ورود موفقیت‌آمیز بود', variant: 'success'}));
        } catch (error) {
            const errorData = error.response?.data || [];
            errorData.forEach((err) =>
                setError(err.type, {type: 'manual', message: err.message})
            );
            dispatch(
                showMessage({
                    message: 'خطا در ورود: لطفاً از صحت نام کاربری و رمزعبور خود اطمینان حاصل کنید و مجدداً تلاش کنید.',
                    variant: 'error',
                    anchorOrigin: {vertical: 'top', horizontal: 'center'},
                    autoHideDuration: 3000,
                })
            );
        } finally {
            setLoading(false);
        }
    }

    // function onSubmit(formData) {
    // 	setLoading(true);
    // 	const { username, password } = formData;
    // 	signIn({
    // 		username,
    // 		password
    // 	}).catch((error) => {
    // 		const errorData = error.response.data;
    // 		errorData.forEach((err) => {
    // 			setError(err.type, {
    // 				type: 'manual',
    // 				message: err.message
    // 			});
    // 		});
    // 		dispatch(
    // 			showMessage({
    // 				message: 'خطا در ورود: لطفاً مجدداً تلاش کنید.',
    // 				variant: 'error',
    // 				anchorOrigin: { vertical: 'top', horizontal: 'center' },
    // 				autoHideDuration: 3000,
    // 			})
    // 		);
    // 	});
    // }

    return (
        <form
            name="loginForm"
            noValidate
            className="mt-32 flex w-full flex-col justify-center"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                name="username"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        className="mb-24"
                        label="شماره تلفن"
                        autoFocus
                        error={!!errors.username}
                        helperText={errors?.username?.message}
                        variant="outlined"
                        required
                        fullWidth
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        className="mb-24"
                        label="رمزعبور"
                        type="password"
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                        variant="outlined"
                        required
                        fullWidth
                    />
                )}
            />

            <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
                <Alert
                    icon={false}
                    severity="error"
                    className="mt-24 px-16 text-13 leading-relaxed"
                >
                    در صورت فراموشی رمزعبور خود، از دکمه روبرو برای ارسال درخواست تغییر رمز به بخش مربوطه ارسال شود
                </Alert>
                {/* <Button */}
                {/*	variant="contained" */}
                {/*	color="secondary" */}
                {/*	className=" mt-16 w-full" */}
                {/*	aria-label="Sign in" */}
                {/*	disabled={_.isEmpty(dirtyFields) || !isValid} */}
                {/*	type="submit" */}
                {/*	size="large" */}
                {/* > */}
                {/*	Sign in */}
                {/* </Button> */}
                {/* <Controller */}
                {/*	name="remember" */}
                {/*	control={control} */}
                {/*	render={({ field }) => ( */}
                {/*		<FormControl> */}
                {/*			<FormControlLabel */}
                {/*				label="Remember me" */}
                {/*				control={ */}
                {/*					<Checkbox */}
                {/*						size="small" */}
                {/*						{...field} */}
                {/*					/> */}
                {/*				} */}
                {/*			/> */}
                {/*		</FormControl> */}
                {/*	)} */}
                {/* /> */}
            </div>

            <LoadingButton
                loading={loading}
                variant="contained"
                color="secondary"
                className="mt-16 w-full bg-[#129974]"
                aria-label="Sign in"
                disabled={loading || _.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
            >ورود</LoadingButton>
        </form>
    );
}

export default JwtSignInForm;
