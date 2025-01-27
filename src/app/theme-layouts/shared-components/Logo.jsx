import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
	"& > .logo-icon": {
		transition: theme.transitions.create(["width", "height"], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
	"& > .badge": {
		transition: theme.transitions.create("opacity", {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut,
		}),
	},
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex items-center">
			<img
				className="logo-icon h-32 w-32"
				src="assets/images/logo/logo.svg"
				alt="logo"
			/>
			<div className="flex space-x-6 px-8 items-center">
				<div>
					<span className="react-text text-11 font-semibold">
						پنل مدیریت سایت مرجع
					</span>
					<span className="react-text text-10 font-semibold ms-3">(سام)</span>
				</div>
				<div></div>
			</div>
		</Root>
	);
}

export default Logo;
