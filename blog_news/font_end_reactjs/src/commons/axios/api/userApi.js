import { instance } from "../axiosConfig";
const updateProfile = async (name,avatar,phoneNumber,password) => {
    return await instance.post("user/updateprofile", {
        name,
        avatar,
        phoneNumber,
        password
    }).then((response) => {
      return response.data;
    });
  };

  const getpostbyuser = async (page) => {
    return await instance.get(`user/getpostbyuser/${page}`).then((response) => {
      return response.data;
    }).catch(err => {
      return err.response;
    })
  };
  const deletepost = async (id) => {
    return await instance.post(`post/deletepost?idpost=${id}`).then((response) => {
      return response.data;
    }).catch(err => {
      return err.response;
    })
  };

  const changePassword = async (password, newpassword) => {
    return await instance.post(`user/changepassword`, {
      password,
      newpassword
    }).then((response) => {
      return response.data;
    }).catch(err => {
      return err.response;
    })
  };

  const updatetpostpending = async (idpost) => {
    return await instance.post(`user/updatetpostpending`, {
      idpost
    }).then((response) => {
      return response.data;
    }).catch(err => {
      return err.response;
    })
  };

const userApi = {
    updateProfile,
    getpostbyuser,
    deletepost,
    changePassword,
    updatetpostpending
};

export default userApi;