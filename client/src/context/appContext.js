import React, { useContext, useReducer, useEffect } from "react";

import reducer from "./reducer";

import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SETUP_SUCCESS,
  SETUP_FAIL,
  TOGGLE_SIDEBAR,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  USER_LOGOUT,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAIL,
  GET_JOBS,
  GET_JOBS_SUCCESS,
  EDIT_JOBS,
  DELETE_JOBS,
  EDIT_JOBS_BEGINS,
  EDIT_JOBS_SUCCESS,
  EDIT_JOBS_ERROR,
  SHOW_STATS,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  DELETE_JOBS_ERROR,
  GET_CURRENT_USER,
  GET_CURRENT_USER_SUCCESS,
} from "./action";
import axios from "axios";

// const token = localStorage.getItem("token");
// const user = localStorage.getItem("user");
// const userlocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  text: "",
  alertType: "",
  isEditing: false,

  //user
  user: null,
  userLoading: true,
  // token: token,
  userLocation: "",

  showSidebar: false,

  //job

  editJobId: "",
  jobLocation: "",
  company: "",
  position: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "declined"],
  status: "pending",

  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,

  //stats
  stats: {},
  monthlyApplications: [],

  //search
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //axios
  const axiosFetch = axios.create({
    baseURL: "api/v1/",
  });

  // request interceptors
  // axiosFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers["Authorization"] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );
  //response interceptors
  axiosFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error);
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  // const addUserToLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem("user", JSON.stringify(user));
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("location", location);
  // };

  // const removeUserFromLocalStorage = () => {
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("location");
  // };

  const setupUser = async ({ currentUser, endPoint, altertText }) => {
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );
      const { user, location } = data;
      dispatch({
        type: SETUP_SUCCESS,
        payload: { user, location, altertText },
      });
      // addUserToLocalStorage({ user,  location });
    } catch (error) {
      dispatch({
        type: SETUP_FAIL,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const logout = async () => {
    await axiosFetch.get("/auth/logout");
    dispatch({ type: USER_LOGOUT });
    // removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER });
    try {
      const { data } = await axiosFetch.patch("auth/updateUser", currentUser);
      const { user, location } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
      // addUserToLocalStorage({ user, location, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_FAIL,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  //JOB OPERATION
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB });
    try {
      const { company, jobLocation, position, jobType, status } = state;
      await axiosFetch.post("/jobs", {
        company,
        jobLocation,
        position,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_FAIL,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS });
    try {
      const { data } = await axiosFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      logout();
    }

    clearAlert();
  };

  const editJob = (id) => {
    console.log(`edit job ${id}`);
    dispatch({ type: EDIT_JOBS, payload: { id } });
  };

  const getEditJob = async () => {
    console.log("get edited Job");
    dispatch({ type: EDIT_JOBS_BEGINS });
    try {
      const { position, jobLocation, company, status, jobType } = state;
      await axiosFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOBS_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOBS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOBS });
    try {
      await axiosFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOBS_ERROR,
        payload: { msg: error.response.data.msg },
      });

      // logout();
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS });
    try {
      const { data } = await axiosFetch("/jobs/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logout();
    }
    clearAlert();
  };

  //CHANGE PAGE FUNCTIONALITY
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER });

    try {
      const { data } = await axiosFetch("/auth/getCurrentUser");
      const { user, location } = data;
      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
    } catch (error) {
      if (error.response.status === 401) return;
      logout();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        setupUser,
        logout,
        toggleSidebar,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        editJob,
        deleteJob,
        getEditJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider, initialState, useAppContext };
