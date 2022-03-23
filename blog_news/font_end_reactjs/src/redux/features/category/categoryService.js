import { instance } from "../../../commons/axios/axiosConfig";

const getListCategory = () => {
  return instance.get("/getcategory").then((response) => {
    return response.data;
  });
};

const categoryService = {
    getListCategory
};

export default categoryService;