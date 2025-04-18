import { useForm } from "react-hook-form";

function MapForm({ onSubmit }) {
	const { register, handleSubmit } = useForm();

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input {...register("name")} placeholder="Location Name" required />
			<input
				{...register("lat")}
				placeholder="Latitude"
				type="number"
				step="any"
				required
			/>
			<input
				{...register("lng")}
				placeholder="Longitude"
				type="number"
				step="any"
				required
			/>
			<button type="submit">Save Location</button>
		</form>
	);
}
export default MapForm;
