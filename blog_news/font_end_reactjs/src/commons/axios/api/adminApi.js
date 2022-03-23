import { instance } from "../axiosConfig";


const admingetuser = async (page, filter,namefilter) => {
  return await instance.get(`/admin/getlistuser/${page}?filter=${filter}&nameuser=${namefilter}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const addcensor = async (id) => {
  return await instance.post(`/admin/addcensor/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const removeCensor = async (id) => {
  return await instance.post(`/admin/removecensor/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const removeAccount = async (id) => {
  return await instance.post(`/admin/removeaccount/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const lockAccount = async (id) => {
  return await instance.post(`/admin/deleteuser/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const unlockaccount = async (id) => {
  return await instance.post(`/admin/unlockaccount/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const accountVerification = async (id) => {
  return await instance.post(`/admin/accountVerification/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getcategory = async (isavalible) => {
  return await instance.get(`/admin/getcategory/${isavalible}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const addCategory = async (namecategory) => {
  return await instance.post(`/admin/addCategory?nameCategory=${namecategory}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const updateCategory = async (namecategory, id) => {
  return await instance.post(`/admin/updateCategory/${namecategory}/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const removeCategory = async (id) => {
  return await instance.post(`/admin/removeCategory/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const unlockCategory = async (id) => {
  return await instance.post(`/admin/unlockCategory/${id}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getpostbyfillter = async (page, idcategory, sort, search) => {
  return await instance.get(`/admin/getpostbyfillter/${page}?s=${sort}&idcategory=${idcategory}&search=${search}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const getpostdeletedbyfillter = async (page, idcategory, sort, search) => {
  return await instance.get(`/admin/getpostdeletedbyfillter/${page}?s=${sort}&idcategory=${idcategory}&search=${search}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};


const deletepost = async (idpost) => {
  return await instance.post(`/post/deletepost?idpost=${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};

const restorePost = async (idpost) => {
  return await instance.post(`/post/restorePost?idpost=${idpost}`).then((response) => {
    return response.data;
  }).catch(err => {
    return err.response.data;
  })
};


const adminApi = {
    admingetuser,
    addcensor,
    lockAccount,
    removeCensor,
    removeAccount,
    unlockaccount,
    accountVerification,
    getcategory,
    addCategory,
    updateCategory,
    removeCategory,
    unlockCategory,
    getpostbyfillter,
    deletepost,
    getpostdeletedbyfillter,
    restorePost
};

export default adminApi;