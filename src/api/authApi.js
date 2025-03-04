import apiClient from "./apiClient";

export const login = async (credentials) => {
  const response = await apiClient.post("auth/login", credentials);
  return response.data;
};

//token handling
// send token in every api call
// other api call
// user details show
// logout
