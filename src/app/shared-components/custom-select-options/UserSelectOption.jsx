import { getServerFile } from "src/utils/string-utils";
import BadgeAvatar from "../badge-avatar/BadgeAvatar";

export default function UserSelectOption(props) {
    const { data, innerProps, innerRef, isFocused, isSelected } = props;
    const avatarUrl = data.avatar && getServerFile(data.avatar);
    const onlineBadgeClass = data.isOnline ? "bg-green-500" : "bg-gray-500";
  
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BadgeAvatar color="secondary" variant="dot" invisible={false} className="w-50 h-50 rounded-full object-cover ml-2" src={avatarUrl} alt={data.label}/>
            <div>
              <div className="font-medium text-lg mt-8 ms-8">{data.label}</div>
              {data.username && (
                <div className="text-md text-gray-500 ms-8">09352388350</div>
              )}
              {data.email && (
                <div className="text-md text-gray-500 ms-8">{data.email}</div>
              )}
            </div>
          </div>
        </div>
  
        <div className="mt-2 flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-2">
            {data.roles &&
              data.roles.length > 0 &&
              data.roles.map((role) => {
                const roleBadgeColor =
                  data.roles.length === 1 && role.value === "CONSUMER"
                    ? "bg-orange-400"
                    : "bg-blue-400";
                return (
                  <span
                    key={role.value}
                    className={`text-md mt-8 me-8 text-white p-8 rounded ${roleBadgeColor}`}
                  >
                    {role.label}
                  </span>
                );
              })}
  
            {data.companies && data.companies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.companies.map((company, index) => (
                  <span
                    key={index}
                    className="text-md mt-8 me-8 text-gray-700 border border-gray-300 p-8 rounded"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            )}
          </div>
  
          <Link to={`/users/${data.value}`} className="flex-shrink-0">
            <Button variant="outlined" size="medium" color="primary" className="px-8 py-1 rounded">
              پروفایل کاربر
            </Button>
          </Link>
        </div>
      </div>
    );
  }