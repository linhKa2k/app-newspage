import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import '../css/postwaiting.css';
import { Formik, Form, Field, useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import { checkImage } from '../commons/validate/checkImage.js';
import { valid } from '../commons/validate/validateForm';
import uploadService from '../commons/axios/api/uploadService';
import { RiBallPenLine } from "react-icons/ri";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import postApi from '../commons/axios/api/postApi';
import userApi from '../commons/axios/api/userApi';
import moment from 'moment';
import { Overlay } from 'react-portal-overlay';
import { DialogContainer, dialog } from 'react-dialogify';
function CreatePost(props) {
  let history = useHistory();
  const { isLogin } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.user);
  const { dataUser } = useSelector((state) => state.user);
  const [listpost, setListpost] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [showmodel, setShowmodel] = useState(false);
  const [showmodeldel, setShowmodeldel] = useState(false);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState('');
  const [idpost, setIdpost] = useState('');


  var localeData = moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s trước",
        s: 'vài giây',
        ss: '%d seconds',
        m: "1 phút",
        mm: "%d phút",
        h: "1 giờ",
        hh: "%d giờ",
        d: "1 ngày",
        dd: "%d ngày",
        M: "1 tháng",
        MM: "%d tháng",
        y: "1 năm",
        yy: "%d năm"
    }
});

  useEffect(async () => {
    window.scrollTo(0, 0);
    setIsloading(true)
    if (isLogin === false) {
      history.replace('/home')
      return;
    }
    if (isSuccess === false) return;
    if (!dataUser) return;
    
    await postApi.getPostpendingbyuser().then(res => {
      setListpost(res.data)
      setIsloading(false)
    })
  }, [dataUser,isLogin])

  const deletePostunApprove = async () => {
    setLoad(true)
    await postApi.deletepostunapprove(idpost).then(result => {
      if(result.message === 'Đã hủy yêu cầu duyệt bài'){
        listpost.splice(index, 1);
        toast.success(result.message, {
          theme: "dark"
      });
      setLoad(false)
      setShowmodel(false)
      setIndex('')
      setIdpost('')
      }else if(result.message === 'Đã xóa bài viết'){
        listpost.splice(index, 1);
        toast.success(result.message, {
          theme: "dark"
      });
      setLoad(false)
      setShowmodeldel(false)
      setIndex('')
      setIdpost('')
      }
      else{
        toast.error('có lỗi sảy ra, vui lòng thử lại', {
          theme: "dark"
      });
      setLoad(false)
      setShowmodel(false)
      setIndex('')
      setIdpost('')
      }
    })
  }

  const updatepostpending = async (idpost) => {
    
      await userApi.updatetpostpending(idpost).then(res => {
        if(res.message === 'ok'){
          history.push(`/updatepost/${idpost}`)
        }
      })
  }

  return (
    <>
    <ToastContainer/>
    <Overlay className='overlay-profile'
        open={showmodel}
        closeOnEsc={true}
      >
        <div className='ask-del-post-waiting'>
            <div className='title-model-post-waiting'>
              <h2>Hủy yêu cầu đăng bài</h2>
            </div>
            <p>Bạn có chắc chắn muốn hủy yêu cầu duyệt bài viết này</p>
            <div className='option-btn-model-post-waiting'>
                <button onClick={() => {setShowmodel(false)}}>hủy</button>
                <button onClick={()=> {deletePostunApprove()}}>đồng ý</button>
            </div>
        </div>
      </Overlay>
      <Overlay className='overlay-profile'
        open={load}
        closeOnEsc={true}
      >
        <div className="loading-post-browsing"></div>
      </Overlay>

      <Overlay className='overlay-profile'
        open={showmodeldel}
        closeOnEsc={true}
      >
        <div className='ask-del-post-waiting'>
            <div className='title-model-post-waiting'>
              <h2>Xóa bài viết</h2>
            </div>
            <p>Bài viết sau khi xóa sẽ không thể khôi phục lại, bạn có chắc chắn muốn xóa bài viết này ?</p>
            <div className='option-btn-model-post-waiting'>
                <button onClick={() => {setShowmodeldel(false)}}>hủy</button>
                <button onClick={()=> {deletePostunApprove()}}>đồng ý</button>
            </div>
        </div>
      </Overlay>

    <div className='post-waiting-container'>
      <h2 className='title-post-waiting'>Bài viết đang chờ</h2>
      <div className='list-post-waiting'>
      {isloading ? <div className="loading-post-browsing"></div> : <>
      {listpost.length === 0 ? <p className='no-post-waiting'>Không có bài viết nào đang chờ</p> : <>
        {listpost.map((post, index) => (
          <div className='post-waiting-item' key={index}>
          <div className='img-post-waiting-item'>
            <img src={post.imagepost}></img>
          </div>
          <div className='infor-post-waiting'>
            <h3>{post.title}</h3>
            {(post.censor === null && post.is_detroy === false) ? <p>Trạng thái: đang chờ duyệt</p> : null}
            {(post.is_detroy === true && post.is_available === 'Pending' ) ? <p>Trạng thái: Yêu cầu duyệt bị từ chối</p> : null}
            <p>thời gian yêu cầu : {moment(post.updatedAt).fromNow()}</p>
          </div>
          <div className='option-post-waiting'>
          {(post.is_detroy === true && post.is_available === 'Pending' ) ?<><button onClick={() => {setIdpost(post._id); setIndex(index); setShowmodeldel(true)}}>xóa bài viết</button> <button onClick={() => {updatepostpending(post._id)}}>Chỉnh sửa bài viết</button></> : <> <button onClick={() => {setIdpost(post._id); setIndex(index); setShowmodel(true)}}>hủy yêu cầu</button>  <button onClick={() => {updatepostpending(post._id)}}>Chỉnh sửa bài viết</button></>}
            
          </div>
        </div>
        ))}
      </>}</>}
        

      </div>
    </div>
    </>

  );
}


export default CreatePost;