import FusePageSimple from "@fuse/core/FusePageSimple";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import {
  useGetContactsCountriesQuery,
  useGetContactsTagsQuery,
  useGetUsersListQuery,
} from "./UserApi.js";
import UsersSidebarContent from "./UsersSidebarContent.jsx";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
  },
}));

/**
 * The UsersApp page.
 */
function UsersApp() {
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  useGetUsersListQuery();
  useGetContactsCountriesQuery();
  useGetContactsTagsQuery();
  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
  return (
    <Root
      header={<UsersHeader />}
      content={<UsersList />}
      ref={pageLayout}
      rightSidebarContent={<UsersSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default UsersApp;
