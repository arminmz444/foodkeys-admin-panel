import { apiService as api, API_BASE_URL } from "app/store/apiService";

export const addTagTypes = [
  "profile_photos_videos",
  "profile_timeline",
  "profile_about",
  "user_info",
];
const ProfileApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getProfilePhotosVideos: build.query({
        query: () => ({ url: `/mock-api/profile/photos-videos` }),
        providesTags: ["profile_photos_videos"],
      }),
      getProfileTimeline: build.query({
        query: () => ({ url: `/mock-api/profile/timeline` }),
        providesTags: ["profile_timeline"],
      }),
      getProfileAbout: build.query({
        query: () => ({ url: `/mock-api/profile/about` }),
        providesTags: ["profile_about"],
      }),
      getUserInfo: build.query({
        query: () => ({ url: `/user/me` }),
        providesTags: ["user_info"],
      }),
    }),
    overrideExisting: false,
  });
export default ProfileApi;
export const {
  useGetProfilePhotosVideosQuery,
  useGetProfileTimelineQuery,
  useGetProfileAboutQuery,
  useGetUserInfoQuery,
} = ProfileApi;
