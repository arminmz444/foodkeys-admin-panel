import CompanyRequestItem from './CompanyRequestItem';

export default function CompanyRequestList({ requests }) {
  return (
    <div className="space-y-4">
      {requests.map(req => (
        <CompanyRequestItem key={req.id} request={req} />
      ))}
    </div>
  );
}
