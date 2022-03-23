import { instance } from "../../../commons/axios/axiosConfig";

const getpostbycategory = async (idcategory, page) => {
  return await instance.get(`/postbycategory/${idcategory}/${page}`).then((response) => {
    return response.data;
  });
};
const getpostbycategoryService = {
    getpostbycategory,
};

export default getpostbycategoryService;