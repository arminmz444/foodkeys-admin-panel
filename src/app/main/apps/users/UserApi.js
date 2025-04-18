// import { createSelector } from "@reduxjs/toolkit";
// import { apiService as api } from "app/store/apiService";
// import FuseUtils from "@fuse/utils";
// import { selectSearchText } from "./usersAppSlice.js";

// export const addTagTypes = [
//   "User",
//   "contacts_tag",
//   "contacts_tags",
//   "countries",
// ];
// const ContactsApi = api
//   .enhanceEndpoints({
//     addTagTypes,
//   })
//   .injectEndpoints({
//     endpoints: (build) => ({
//       getUsersList: build.query({
//         query: () => ({ url: `/user` }),
//         providesTags: (result) =>
//           result && result.data && Array.isArray(result.data)
//             ? [
//                 ...result.data.map(({ id }) => ({ type: "Subscription", id })),
//                 { type: "Subscription", id: "LIST" },
//               ]
//             : [{ type: "Subscription", id: "LIST" }],
//         keepUnusedDataFor: 3600,
//         transformResponse: (response) => {
//           const data = { data: response?.data };

//           if (response && response.pagination) {
//             data.totalPages = response.pagination.totalPages;
//             data.totalElements = response.pagination.totalElements;
//             data.pageSize = response.pagination.pageSize;
//             data.pageIndex = response.pagination.pageIndex;
//           }

//           return data;
//         },
//       }),
//       getUsersItem: build.query({
//         query: (userId) => ({ url: `/user/${userId}` }),
//         transformResponse: (response) => response?.data,
//         providesTags: (result, error, id) => [{ type: "User", id }],
//       }),
//       updateUser: build.mutation({
//         query: ({ id, ...body }) => ({
//           url: `/user/${id}`,
//           method: "PUT",
//           body,
//         }),
//         transformResponse: (response) => response?.data,
//         invalidatesTags: (result, error, { id }) => [
//           { type: "User", id },
//         ],
//       }),
//       deleteUser: build.mutation({
//         query: (id) => ({
//           url: `/user/${id}`,
//           method: "DELETE",
//         }),
//         transformResponse: (response) => response?.data,
//         invalidatesTags: (result, error, { id }) => [
//           { type: "User", id },
//         ],
//       }),
//       getContactsList: build.query({
//         query: () => ({ url: `/mock-api/contacts` }),
//         providesTags: ["contacts"],
//       }),
//       createContactsItem: build.mutation({
//         query: (queryArg) => ({
//           url: `/mock-api/contacts`,
//           method: "POST",
//           data: queryArg.contact,
//         }),
//         invalidatesTags: ["contacts"],
//       }),
//       getContactsItem: build.query({
//         query: (contactId) => ({ url: `/mock-api/contacts/${contactId}` }),
//         providesTags: ["contacts_item"],
//       }),
//       updateContactsItem: build.mutation({
//         query: (contact) => ({
//           url: `/mock-api/contacts/${contact.id}`,
//           method: "PUT",
//           data: contact,
//         }),
//         invalidatesTags: ["contacts_item", "contacts"],
//       }),
//       deleteContactsItem: build.mutation({
//         query: (contactId) => ({
//           url: `/mock-api/contacts/${contactId}`,
//           method: "DELETE",
//         }),
//         invalidatesTags: ["contacts"],
//       }),
//       getContactsTag: build.query({
//         query: (tagId) => ({ url: `/mock-api/contacts/tags/${tagId}` }),
//         providesTags: ["contacts_tag"],
//       }),
//       updateContactsTag: build.mutation({
//         query: (tag) => ({
//           url: `/mock-api/contacts/tags/${tag.id}`,
//           method: "PUT",
//           body: tag,
//         }),
//         invalidatesTags: ["contacts_tags"],
//       }),
//       deleteContactsTag: build.mutation({
//         query: (tagId) => ({
//           url: `/mock-api/contacts/tags/${tagId}`,
//           method: "DELETE",
//         }),
//         invalidatesTags: ["contacts_tags"],
//       }),
//       getContactsTags: build.query({
//         query: () => ({ url: `/mock-api/contacts/tags` }),
//         providesTags: ["contacts_tags"],
//       }),
//       getContactsAccessibility: build.query({
//         query: () => ({ url: `/mock-api/contacts/accessibility` }),
//         providesTags: ["contacts_accessibility"],
//       }),
//       getContactsCountries: build.query({
//         query: () => ({ url: `/mock-api/countries` }),
//         providesTags: ["countries"],
//       }),
//       createContactsTag: build.mutation({
//         query: (queryArg) => ({
//           url: `/mock-api/contacts/tags`,
//           method: "POST",
//           body: queryArg.tag,
//         }),
//         invalidatesTags: ["contacts_tags"],
//       }),
//     }),
//     overrideExisting: false,
//   });
// export default ContactsApi;
// export const {
//   useUpdateUserMutation,	
//   useDeleteUserMutation,
//   useGetUsersListQuery,
//   useGetUsersItemQuery,
//   useGetContactsItemQuery,
//   // useUpdateContactsItemMutation,
//   // useDeleteContactsItemMutation,
//   // useGetContactsListQuery,
//   // useCreateContactsItemMutation,
//   useGetContactsTagQuery,
//   useGetContactsCountriesQuery,
//   // useUpdateContactsTagMutation,
//   // useDeleteContactsTagMutation,
//   // useGetContactsTagsQuery,
//   // useGetContactsAccessibilityQuery,
//   // useCreateContactsTagMutation,
// } = ContactsApi;
// /**
//  * Select filtered contacts
//  */
// export const selectFilteredContactList = (contacts) =>
//   createSelector([selectSearchText], (searchText) => {
//     if (!contacts) {
//       return [];
//     }

//     if (searchText.length === 0) {
//       return contacts;
//     }

//     return FuseUtils.filterArrayByString(contacts, searchText);
//   });
// /**
//  * Select grouped contacts
//  */
// export const selectGroupedFilteredContacts = (contacts) =>
//   createSelector([selectFilteredContactList(contacts)], (contacts) => {
//     if (!contacts) {
//       return [];
//     }

//     const sortedContacts = [...contacts]?.sort((a, b) =>
//       a?.firstName?.localeCompare(b.firstName, "es", { sensitivity: "base" })
//     );
//     const groupedObject = sortedContacts?.reduce((r, e) => {
//       // get first letter of name of current element
//       console.log(e)
//       const group = e.firstName[0];

//       // if there is no property in accumulator with this letter create it
//       if (!r[group]) r[group] = { group, children: [e] };
//       // if there is push current element to children array for that letter
//       else {
//         r[group]?.children?.push(e);
//       }

//       // return accumulator
//       return r;
//     }, {});
//     return groupedObject;
//   });

import { createSelector } from "@reduxjs/toolkit";
import { apiService as api } from "app/store/apiService";
import FuseUtils from "@fuse/utils";
import { selectSearchText } from "./usersAppSlice.js";

export const addTagTypes = [
  "User",
  "users",
  "roles",
  "accesses",
  "user_roles",
  "user_accesses",
  "role_accesses",
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
                { type: "users", id: "LIST" },
              ]
            : [{ type: "users", id: "LIST" }],
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
          body: userData,
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: [{ type: "users", id: "LIST" }],
      }),
      updateUser: build.mutation({
        query: ({ id, ...body }) => ({
          url: `/user/${id}`,
          method: "PUT",
          body,
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: (result, error, { id }) => [
          { type: "User", id },
          { type: "users", id: "LIST" },
        ],
      }),
      deleteUser: build.mutation({
        query: (id) => ({
          url: `/user/${id}`,
          method: "DELETE",
        }),
        transformResponse: (response) => response?.data,
        invalidatesTags: [{ type: "users", id: "LIST" }],
      }),
      // Roles endpoints
      getRolesList: build.query({
        query: () => ({ url: `/role` }),
        providesTags: ["roles"],
      }),
      getUserRoles: build.query({
        query: (userId) => ({ url: `/user/${userId}/role` }),
        providesTags: (result, error, id) => [{ type: "user_roles", id }],
      }),
      addRoleToUser: build.mutation({
        query: ({userId, roleId}) => ({
          url: `/user/${userId}/role`,
          method: "POST",
          body: { id: roleId },
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "user_roles", id: userId },
        ],
      }),
      removeRoleFromUser: build.mutation({
        query: ({userId, roleId}) => ({
          url: `/user/${userId}/role/${roleId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "user_roles", id: userId },
        ],
      }),
      // Accesses endpoints
      getAccessesList: build.query({
        query: () => ({ url: `/access` }),
        providesTags: ["accesses"],
      }),
      getUserAccesses: build.query({
        query: (userId) => ({ url: `/user/${userId}/access` }),
        providesTags: (result, error, id) => [{ type: "user_accesses", id }],
      }),
      updateUserAccesses: build.mutation({
        query: ({userId, accesses}) => ({
          url: `/user/${userId}/access`,
          method: "PUT",
          body: accesses,
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "user_accesses", id: userId },
        ],
      }),
      addAccessToUser: build.mutation({
        query: ({userId, accessId}) => ({
          url: `/user/${userId}/access`,
          method: "POST",
          body: { id: accessId },
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "user_accesses", id: userId },
        ],
      }),
      removeAccessFromUser: build.mutation({
        query: ({userId, accessId}) => ({
          url: `/user/${userId}/access/${accessId}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, { userId }) => [
          { type: "User", id: userId },
          { type: "user_accesses", id: userId },
        ],
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