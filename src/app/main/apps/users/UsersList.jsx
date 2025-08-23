import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import FuseLoading from "@fuse/core/FuseLoading";
import { useAppSelector } from "app/store/hooks";
import UserListItem from "./UserListItem";
import {
  selectFilteredUserList,
  selectGroupedFilteredUsers,
  useGetUsersListQuery,
} from "./UserApi";

/**
 * The UsersList component.
 */
function UsersList() {
  const { data, isLoading } = useGetUsersListQuery();
  const filteredData = useAppSelector(selectFilteredUserList(data?.data));
  const groupedFilteredUsers = useAppSelector(
    selectGroupedFilteredUsers(filteredData)
  );

  if (isLoading) {
    return <FuseLoading />;
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          کاربری وجود ندارد!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      {Object.entries(groupedFilteredUsers).map(([key, group]) => {
        return (
          <div key={key} className="relative">
            <Typography
              color="text.secondary"
              className="px-32 py-4 text-14 font-medium"
            >
              {key}
            </Typography>
            <Divider />
            <List className="w-full m-0 p-0">
              {group?.children?.map((item) => (
                <UserListItem key={item.id} user={item} />
              ))}
            </List>
          </div>
        );
      })}
    </motion.div>
  );
}

export default UsersList;