import { useState } from 'react';

import { AsyncPaginate } from 'react-select-async-paginate';

import { loadOptions } from './loadOptions';

function SimpleSelect() {
	const [value, onChange] = useState(null);

	return (
		<div>
			<h1>react-select-async-paginate</h1>
			<h2>Simple example</h2>

			<AsyncPaginate
				value={value}
				loadOptions={loadOptions}
				onChange={onChange}
			/>
		</div>
	);
}

export default SimpleSelect;
