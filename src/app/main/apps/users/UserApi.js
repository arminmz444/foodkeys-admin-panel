import { createSelector } from "@reduxjs/toolkit";
import { apiService as api } from "app/store/apiService";
import FuseUtils from "@fuse/utils";
import { selectSearchText } from "./usersAppSlice.js";

export const addTagTypes = [
  "User",
  "Role",
  "Access",
  "UserRole",
  "UserAccess",
  "RoleAccess",
];

const UserApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUsersList: build.query({
        query: (paginationParams) => ({ 
          url: `/user`,
          params: paginationParams
        }),
        providesTags: (result) =>
          result && result.data && Array.isArray(result.data)
            ? [
                ...result.data.map(({ id }) => ({ type: "User", id })),
                { type: "User", id: "LIST" },
              ]
            : [{ type: "User", id: "LIST" }],
        transformResponse: (response) => {
          const data = { data: response?.data };

          if (response && response.pagination) {
            data.totalPages = response.pagination.totalPages;
            data.totalElements = response.pagination.totalElements;
            data.pageSize = response.pagination.pageSize;
            data.pageIndex = response.pagination.pageIndex;
          }

          return data;
        },
      }),
      getUsersItem: build.query({
        query: (userId) => ({ url: `/user/${userId}` }),
        transformResponse: (response) => response?.data,
        providesTags: (result, error, id) => [{ type: "User", id }],
      }),
      createUser: build.mutation({
        query: (userData) => ({
          url: `/user`,
          method: "POST",
          data: userData,
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: [{ type: "User", id: "LIST" }],
      }),
      updateUser: build.mutation({
        query: ({ id, ...body }) => ({
          url: `/user/${id}`,
          method: "PUT",
          data: body,
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: (result, error, { id }) => [
          { type: "User", id },
          { type: "User", id: "LIST" },
        ],
      }),
      deleteUser: build.mutation({
        query: (id) => ({
          url: `/user/${id}`,
          method: "DELETE",
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: [{ type: "User", id: "LIST" }],
      }),
      // Roles endpoints
      getRolesList: build.query({
        query: () => ({ url: `/role` }),
        providesTags: ["Role"],
      }),
      getUserRoles: build.query({
        query: (userId) => ({ url: `/user/${userId}/role` }),
        providesTags: (result, error, id) => [{ type: "UserRole", id }],
      }),
      addRoleToUser: build.mutation({
        query: ({userId, roleId}) => ({
          url: `/user/${userId}/role`,
          method: "POST",
          data: { id: roleId },
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "UserRole", id: userId },
        ],
      }),
      removeRoleFromUser: build.mutation({
        query: ({userId, roleId}) => ({
          url: `/user/${userId}/role/${roleId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "UserRole", id: userId },
        ],
      }),
      // Accesses endpoints
      getAccessesList: build.query({
        query: () => ({ url: `/access` }),
        providesTags: ["Access"],
      }),
      getUserAccesses: build.query({
        query: (userId) => ({ url: `/user/${userId}/access` }),
        providesTags: (result, error, id) => [{ type: "UserAccess", id }],
      }),
      updateUserAccesses: build.mutation({
        query: ({userId, accesses}) => ({
          url: `/user/${userId}/access`,
          method: "PUT",
          data: accesses,
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "UserAccess", id: userId },
        ],
      }),
      addAccessToUser: build.mutation({
        query: ({userId, accessId}) => ({
          url: `/user/${userId}/access`,
          method: "POST",
          data: { id: accessId },
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "UserAccess", id: userId },
        ],
      }),
      removeAccessFromUser: build.mutation({
        query: ({userId, accessId}) => ({
          url: `/user/${userId}/access/${accessId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "UserAccess", id: userId },
        ],
      }),
      getProvinces: build.query({
        query: () => ({ url: `/province` }),
        transformResponse: (response) => response.data,
      }),
      getCities: build.query({
        query: (provinceId) => ({ url: `/province/${provinceId}/city` }),
        transformResponse: (response) => response.data,
      }),
    }),
    overrideExisting: false,
  });

export default UserApi;
export const {
  useGetUsersListQuery,
  useGetUsersItemQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesListQuery,
  useGetUserRolesQuery,
  useAddRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useGetAccessesListQuery,
  useGetUserAccessesQuery,
  useUpdateUserAccessesMutation,
  useAddAccessToUserMutation,
  useRemoveAccessFromUserMutation,
  useGetProvincesQuery,
  useGetCitiesQuery,
} = UserApi;

/**
 * Select filtered users
 */
export const selectFilteredUserList = (users) =>
  createSelector([selectSearchText], (searchText) => {
    if (!users) {
      return [];
    }

    if (searchText.length === 0) {
      return users;
    }

    return FuseUtils.filterArrayByString(users, searchText);
  });

/**
 * Select grouped users
 */
export const selectGroupedFilteredUsers = (users) =>
  createSelector([selectFilteredUserList(users)], (users) => {
    if (!users) {
      return [];
    }

    const sortedUsers = [...users]?.sort((a, b) =>
      a?.firstName?.localeCompare(b.firstName, "fa", { sensitivity: "base" })
    );
    
    const groupedObject = sortedUsers?.reduce((r, e) => {
      // get first letter of name of current element
      const group = e?.firstName?.[0] || "#";

      // if there is no property in accumulator with this letter create it
      if (!r[group]) r[group] = { group, children: [e] };
      // if there is push current element to children array for that letter
      else {
        r[group]?.children?.push(e);
      }

      // return accumulator
      return r;
    }, {});
    
    return groupedObject;
  });