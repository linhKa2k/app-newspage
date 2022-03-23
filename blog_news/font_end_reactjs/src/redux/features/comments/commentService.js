import { instance } from "../../../commons/axios/axiosConfig";

const postCreateComment = async (idpost, content) => {
  return await instance.post("/comment/creatcomment", { id_post: idpost, content }).then((response) => {
    return response.data;
  });
};
const getComment = async (id, page) => {
  return await instance.get(`/comment/getcomment/${id}/${3}/${page}`).then((response) => {
    return response.data;
  });
};
const commentService = {
  postCreateComment,
  getComment
};

export default commentService;