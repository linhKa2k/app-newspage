import { instance } from "../axiosConfig";
const uploadimgpost = async (file,width, height) => {
  let formData = new FormData();
  formData.append("image", file);
  if(height === undefined || height === null){
    return await instance.post(`post/uploadimage?w=${width}`, formData).then((response) => {
      return response.data;
    });
  }else{
    return await instance.post(`post/uploadimage?w=${width}&h=${height}`, formData).then((response) => {
      return response.data;
    });
  }
};
const uploadimguser = async (file,width, height) => {
  let formData = new FormData();
  formData.append("imageuser", file);
    return await instance.post(`user/uploadimguser?w=${width}&h=${height}`, formData).then((response) => {
      return response.data;
    });
};

const uploadService = {
    uploadimgpost,
    uploadimguser
};

export default uploadService;