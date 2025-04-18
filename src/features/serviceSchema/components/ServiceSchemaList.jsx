// src/features/serviceSchemas/components/ServiceSchemaList.jsx
import { useNavigate } from 'react-router-dom';
import { useGetServiceSchemasQuery } from '../ServiceSchemaApi';

function ServiceSchemaList() {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useGetServiceSchemasQuery();

	if (isLoading) return <div>Loading service schemas...</div>;

	if (isError) return <div>Error loading service schemas</div>;

	return (
		<div>
			<h1>Service Schemas</h1>
			<button onClick={() => navigate('/service-schemas/new')}>Create New Schema</button>
			<ul>
				{data?.map((schema) => (
					<li key={schema.id}>
						{schema.name} - {schema.displayName}
						<button onClick={() => navigate(`/service-schemas/edit/${schema.id}`)}>Edit</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default ServiceSchemaList;
