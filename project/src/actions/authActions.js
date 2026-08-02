import { authApi } from "../api/authApi";

export const loginAction = (payload) => authApi.login(payload);
export const registerAction = (payload) => authApi.register(payload);
export const getProfileAction = () => authApi.getProfile();
export const updateProfileAction = (payload) => authApi.updateProfile(payload);
