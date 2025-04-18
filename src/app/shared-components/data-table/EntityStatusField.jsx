import clsx from 'clsx';

/**
 * The EntityStatusField component.
 */
function EntityStatusField(props) {
	const { name, colorClsx } = props;
	return (
		<div
			className={clsx(
				'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
				colorClsx
			)}
		>
			{name}
		</div>
	);
}

export default EntityStatusField;
