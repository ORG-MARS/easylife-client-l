import axios, { AxiosError } from "axios";
import Uri from "jsuri";

axios.interceptors.response.use(
  res => res,
  (error: AxiosError) => {
    try {
      const { response } = error;
      
      const uri = new Uri(response.config.url.toString());

      function isAuthUrl() {
        return uri.path().includes('/api/auth');
      }

      function shouldAllowUnauthorizedUser() {
          return false;
        // return /^\/contract_signature_requested/.test(window.location.pathname);
      }
      if (
        response.status === 401 &&
        !isAuthUrl() &&
        !shouldAllowUnauthorizedUser()
      ) {
        return Promise.reject(error);
      }
    } finally {
      return Promise.reject(error);
    }
  }
);
