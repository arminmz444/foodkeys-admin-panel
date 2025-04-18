import { connectField } from 'uniforms';

function ImageField({ onChange, value }) {
	return (
		<div className="ImageField">
			<label htmlFor="image-field-file-input">
				<div>آپلود عکس</div>
				<img
					alt=""
					style={{ cursor: 'pointer', width: '300', height: '250px' }}
					src={value || 'https://picsum.photos/150?grayscale'}
				/>
			</label>
			<input
				accept="image/*"
				id="image-field-file-input"
				onChange={({ target: { files } }) => {
					if (files && files[0]) {
						onChange(URL.createObjectURL(files[0]));
					}
				}}
				style={{ display: 'none' }}
				type="file"
			/>
		</div>
	);
}

export default connectField(ImageField);
