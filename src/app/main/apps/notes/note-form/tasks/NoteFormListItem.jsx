import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The note form payments item.
 */
function NoteFormListItem(props) {
	const { onListItemChange, item, onListItemRemove } = props;

	function handleChange(event) {
		onListItemChange(
			_.setIn(
				item,
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			)
		);
	}

	if (!item) {
		return null;
	}

	return (
		<ListItem
			className="p-0"
			key={item.id}
			dense
		>
			<Checkbox
				className="p-0"
				checked={item.completed}
				tabIndex={-1}
				disableRipple
				name="completed"
				onChange={handleChange}
				color="default"
			/>
			<Input
				className={clsx('flex flex-1 mx-8', item.completed && 'line-through opacity-50')}
				name="content"
				value={item.content}
				onChange={handleChange}
				disableUnderline
			/>
			<IconButton
				className="w-32 h-32 mx-4 p-0"
				aria-label="Delete"
				onClick={() => onListItemRemove(item.id)}
				size="large"
			>
				<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
			</IconButton>
		</ListItem>
	);
}

export default NoteFormListItem;
