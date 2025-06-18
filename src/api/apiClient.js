import { create } from "apisauce";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

// Use environment variable for API URL, fallback to development URL
const baseURL = import.meta.env.VITE_API_URL || 
  "http://angled-be-env-1.eba-myerswjv.us-east-2.elasticbeanstalk.com";

console.log("API Base URL:", baseURL); // Debug log

const apiClient = create({
  baseURL: baseURL,
  timeout: 10000, // 10 second timeout
});

apiClient.addRequestTransform((request) => {
  const authToken = store?.getState()?.auth?.token;
  if (!authToken) return;
  request.headers.authorization = "Bearer " + authToken;
});

apiClient?.addResponseTransform((response) => {
  // Handle response errors
  if (response.status === 401) {
    if (store?.getState()?.auth?.token) {
      //   store.dispatch(logout())
    }
  } else if (response.status === 403) {
    // toast.error('Restricted Route!!');
  }
});

function setAuthToken(token) {
  console.log(token, "this is tokendata");
  apiClient.setHeader("Authorization", `Bearer ${token}`);
}
function removeAuthToken() {
  apiClient.deleteHeader("Authorization"); // Remove the Authorization header
  console.log("Token removed from apiClient");
}

export { setAuthToken, removeAuthToken };
export default apiClient;
