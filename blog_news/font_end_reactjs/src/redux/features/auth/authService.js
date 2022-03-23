import { instance } from "../../../commons/axios/axiosConfig";

const register = (name, email, password) => {
  return instance.post("auth/register", {
    name,
    email,
    password,
  }).then((response) => {
    return response.data;
  });
};

const rftoken = () => {
  return instance.post("auth/generationToken")
    .then((response) => {
      return response.data;
    });
};
const logout = () => {
  return instance.post("auth/logout")
    .then((response) => {
      return response.data;
    });
};


const login = (email, password) => {
  return instance.post("auth/login", {
    email,
    password,
  }, { withCredentials: true, credentials: 'include' })
    .then((response) => {
      return response.data;
    });
};

const verifiCode = (code, email) => {
  return instance.post("auth/verificationcodes", {
    code,
    email,
  }).then((response) => {
    return response.data;
  });
}

const renderOtp = (email) => {
  return instance.post("auth/resendcode", {
    email,
  }).then((response) => {
    return response.data;
  });
}

const authService = {
  register,
  login,
  verifiCode,
  renderOtp,
  rftoken,
  logout
};

export default authService;