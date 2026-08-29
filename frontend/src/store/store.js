import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./candidate/authSlice";
import jobReducer from "./candidate/jobSlice";
import userReducer from "./candidate/userSlice";
import applicationReducer from "./candidate/applicationSlice";
import saveJobReducer from "./candidate/saveJobSlice";
import recommendedJobReducer from "./candidate/recommendedJobsSlice";
import categoryReducer from "./candidate/categorySlice";
import companyReducer from "./candidate/companySlice";
import chatReducer from "./candidate/chatSlice";

import employerReducer from "./employer/employerSlice";
import employerJobReducer from "./employer/employerJobSlice";
import employerApplicantReducer from "./employer/employerApplicantSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  user: userReducer,
  application: applicationReducer,
  saveJob: saveJobReducer,
  recommendedJobs: recommendedJobReducer,
  category: categoryReducer,
  company: companyReducer,
  chat: chatReducer,

  // Employer
  employer: employerReducer,
  employerJob: employerJobReducer,
  employerApplicant: employerApplicantReducer,
});

const rootPersistConfig = {
  key: "hireVia",
  storage,
  whitelist: ["auth"], // Only persist auth session, keep all job & application states 100% live & dynamic
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
