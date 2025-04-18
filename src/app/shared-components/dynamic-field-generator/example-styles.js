import { makeStyles, createStyles } from '@mui/styles';

const rootStyle = (theme, type) => ({
	position: 'relative',
	padding: theme.spacing(1),
	direction: 'rtl', // ✅ Ensure RTL layout globally

	'& $fullScreenButton': {
		top: 7,
		position: 'absolute',
		zIndex: 999,
		left: 10, // ✅ Swap right -> left in RTL
	},

	'& $ctr': {
		position: 'relative',
		display: type === 'fullscreen' ? 'block' : 'flex',

		'& $sourceCtr': {
			position: 'relative',
			flex: 21,
			width: '55%',
			display: 'flex',
			flexDirection: 'column',
			marginLeft: theme.spacing(1), // ✅ Swap marginRight -> marginLeft

			'& > div:first-child': {
				position: 'relative',
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: theme.spacing(1),

				'& > div:first-child': {
					position: 'relative',
					flex: 21,
					marginLeft: 5, // ✅ Swap marginRight -> marginLeft
				},
				'& > div:nth-child(2)': {
					position: 'relative',
					flex: 21,
					marginRight: 5, // ✅ Swap marginLeft -> marginRight
				},
			},

			'& > div:nth-child(2)': {
				position: 'relative',
				display: 'flex',

				'& > div:first-child': {
					position: 'relative',
					flex: 21,
					marginLeft: 5, // ✅ Swap marginRight -> marginLeft
				},
				'& > div:nth-child(2)': {
					position: 'relative',
					flex: 21,
					marginRight: 5, // ✅ Swap marginLeft -> marginRight
				},
			},
		},

		'& $display': {
			position: 'relative',
			flex: 13,
			maxWidth: '40vw',
		},
	},

	'& label, & .MuiFormLabel-root': {
		textAlign: 'right', // ✅ Ensure labels align right
		direction: 'rtl',
	},

	'& input, & textarea, & .MuiInputBase-input': {
		textAlign: 'right', // ✅ Ensure input text aligns right
		direction: 'rtl',
	},
});

export default makeStyles((theme) =>
	createStyles({
		root: {
			...rootStyle(theme, 'normal'),
		},
		sourceCtr: {},
		display: {},
		ctr: {},
		fullScreenButton: {},
		fullScreenRoot: {
			...rootStyle(theme, 'fullscreen'),
		},
	})
);
