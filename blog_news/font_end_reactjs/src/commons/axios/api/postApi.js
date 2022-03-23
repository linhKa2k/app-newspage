import { instance } from "../axiosConfig";
const creatPost = async (content, title, category, description,imagepost) => {
  return await instance.post("post/creatpost", {
    content,
    title,
    category, 
    description,
    imagepost,
  }).then((response) => {
    return response.data;
  });
};
const getpostbyid = async (id, iduser) => {
  return await instance.get(`/getpostbyid/${id}?iduser=${iduser}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const postLike = async (idpost) => {
  return await instance.post(`/likepost/like/${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const getPostPending = async (categoryid) => {
  return await instance.get(`/censor/getpostpending?idcategory=${categoryid}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const postapprovePost = async (idpost) => {
  return await instance.post(`/censor/approvepost?idpost=${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const getpostbycategory = async (id) => {
  return await instance.get(`/postbycategory/${id}/1`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const postincreaseviews = async (idpost) => {
  return await instance.post(`/postincreaseviews?idpost=${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const readingnoti = async (idnoti) => {
  return await instance.post(`/user/readingnoti/${idnoti}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getpostsearch = async (value, page) => {
  return await instance.get(`/searchblog/?value=${value}&page=${page}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getPostTopView = async (value, page) => {
  return await instance.get(`/getposttopview`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const getrelatedpost = async (idcategory, idpost) => {
  return await instance.get(`/getrelatedpost/${idcategory}?idpost=${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};
const updatepost = async (contentnew, titlenew, idcategorynew, descriptionnew, avatarpostnew, idpost) => {
  return await instance.post(`/post/updatepost?idpost=${idpost}`,{
    contentnew,
    titlenew,
    idcategorynew, 
    descriptionnew,
    avatarpostnew,
  }).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const unapprovePost = async (msg, idpost) => {
  return await instance.post(`/censor/unapprovePost?idpost=${idpost}`,{
    msg
  }).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getPostpendingbyuser = async () => {
  return await instance.get(`/user/getPostpendingbyuser`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const deletepostunapprove = async (idpost) => {
  return await instance.post(`/user/deletepostunapprove/${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const forgotPassword = async (email) => {
  return await instance.post(`/auth/forgotpassword`,
  {
    email
  }).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const checkCodeForgotPassword = async (email, code) => {
  return await instance.post(`/auth/checkcodeforgotpassword`,
  {
    email,
    code
  }).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};


const getPostbyposter = async (idposter) => {
  return await instance.get(`/getPostbyposter/${idposter}`,
  {
    idposter
  }).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
}





const postApi = {
    creatPost,
    getpostbyid,
    getpostbycategory,
    postincreaseviews,
    postLike,
    getPostPending,
    postapprovePost,
    readingnoti,
    getpostsearch,
    getPostTopView,
    updatepost,
    getrelatedpost,
    unapprovePost,
    getPostpendingbyuser,
    deletepostunapprove,
    forgotPassword,
    checkCodeForgotPassword,
    getPostbyposter
};

export default postApi;