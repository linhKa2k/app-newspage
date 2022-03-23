import { instance } from "../../../commons/axios/axiosConfig";

const getuser = () => {
  return instance.get("user/getprofile").then((response) => {
    return response.data;
  });
};

const userService = {
    getuser
};

export default userService;