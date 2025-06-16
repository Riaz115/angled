import { create } from "apisauce";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
const baseURL =
  "http://angled-be-env-1.eba-myerswjv.us-east-2.elasticbeanstalk.com";
// const baseURL = "http://192.168.18.101:8000";
const apiClient = create({
  baseURL: baseURL,
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
