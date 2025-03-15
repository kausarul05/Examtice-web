import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


export const userSlice = createSlice({
    name: "user",
    initialState: {
        questionData:[],
        user: Cookies.get("user_data") != undefined ? Cookies.get("user_data") : null,
        exam: null,
        is_authanticated: !!Cookies.get("token"),
        isTestStart: false,
        testSpentTime: "",
        isExam: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.is_authanticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.is_authanticated = false;
        },
        profile: (state, action) => {
            state.profile = action.payload.profile;
        },
        examData: (state, action) => {
            state.examData = action.payload.examData;
        },
        questionData:(state, action) => {
            state.questionData = action.payload;
        },
        isTestStart: (state, action) =>{
            state.isTestStart = action.payload;
        },
        setIsExam: (state, action) => {
            state.isExam = action.payload;
        }
    }
});
export const { login, logout, profile, examData, questionData, isTestStart, setIsExam } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const userProfile = (state) => state;
export const userAuth = (state) => state.user.is_authanticated;
export const examDataTest = (state) => state.user.examData;
export const questionAllData = (state) => state.user.questionData;
export const testStart = (state) => state.user.isTestStart;
export const getIsExam = (state) => state.user.isExam;

export default userSlice.reducer;