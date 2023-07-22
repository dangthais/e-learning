import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { loginApi } from "../services/authentication/auth";
import { bannerApi } from "../services/banners";
import { blogApi } from "../services/blogs";
import { courseApi } from "../services/courses";
import { searchApi } from "../services/search";
import { userApi } from "../services/users";
import { videosApi } from "../services/videos";

import commentReducer from '../redux/features/comment/commentSlice';
import courseReducer from "../redux/features/course/courseSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    commentState: commentReducer,
    courseState: courseReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      loginApi.middleware,
      bannerApi.middleware,
      courseApi.middleware,
      videosApi.middleware,
      blogApi.middleware,
      searchApi.middleware,
    )
});
setupListeners(store.dispatch);