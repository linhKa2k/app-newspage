import React, { useEffect, useState } from 'react';
import adminApi from '../../.././commons/axios/api/adminApi';
import { Formik, Form, Field } from 'formik';
import { Overlay } from 'react-portal-overlay';
import { BiX } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import '../../../css/postmanager.css';
function PostManager() {
  const [listcategory, setListcategory] = useState([]);
  const [listpost, setListpost] = useState([]);
  const [sort, setSort] = useState('-1');
  const [categoryfilter, setCategoryfilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setpage] = useState(2);
  const [loading, isloading] = useState(false);
  const [contentpost, setContentpost] = useState('');
  const [idpost, setIdpost] = useState('');
  const [showmodeldetail, setShowmodeldetail] = useState(false);
  const [hasmore, setHasmore] = useState(false);
  const [openmodeldel, setOpenmodeldel] = useState(false);
  const [index, setIndex] = useState('');


  useEffect(async () => {
    window.scrollTo(0, 0);
    isloading(true)
    setpage(2)
    setIdpost('')
    if (listcategory.length === 0) {
      await adminApi.getcategory(true).then(res => {
        setListcategory(res.listcategory)
      })
    }

    await adminApi.getpostbyfillter(1, categoryfilter, sort, search).then(result => {
      if (result.data.length < 6) {
        setHasmore(false)
      }
      else{
        setHasmore(true)

      }
      setListpost(result.data)
    })
    isloading(false)

  }, [search, sort, categoryfilter])

  const Categories = listcategory.map((category) => {
    const { _id, namecategory } = category;
    return (
      <option key={_id} value={_id}>{namecategory}</option>
    );
  });


  const fetchData = async () => {
    setpage(Number(page) + 1)
    await adminApi.getpostbyfillter(page, categoryfilter, sort, search).then(result => {
      if (result.data.length < 6) {
        setHasmore(false)
      }else{
        setHasmore(true)

      }
      let array = listpost.concat(result.data)
      setListpost(array)
    })
  }

  const deletePost = async () => {
      adminApi.deletepost(idpost).then(result => {
        if(result.message === 'Đã xóa bài viết'){
        listpost.splice(index, 1);
          toast.success(result.message,{
            theme: "dark"
          })
          setIdpost('')
          setIndex('')
          setOpenmodeldel(false)
        }
      })
  }
return (
  <div className='post-manager-container'>
    <ToastContainer/>
    <Overlay className='overlay-profile'
      open={showmodeldetail}
      closeOnEsc={true}
    >
      <div className='model-detail-post-manager'>
        <div className='post-detail-model-manager'>
          <div className="ql-editor" dangerouslySetInnerHTML={{
            __html: contentpost
          }}></div>
        </div>
        <div onClick={() => { setShowmodeldetail(false); setContentpost('') }} ><BiX className='close-model-post-detail' /></div>
      </div>
    </Overlay>
    <Overlay className='overlay-profile'
      open={openmodeldel}
      closeOnEsc={true}
    >
      <div className='model-ask-delete-post-manager'>
        <div className='title-del-post-manager'>
        <h2>Xóa bài viết</h2>
        </div>
        <p className='content-del-post-manager'>Bạn có chắc chắn muốn xóa bài viết này. Sau khi xóa bài viết tất cả người dùng sẽ không thể truy cập vào bái viết đó được nữa</p>
        <div className='option-del-post-manager'>
          <button onClick={() => {setOpenmodeldel(false); setIdpost('')}}>hủy</button>
          <button onClick={() => {deletePost()}}>đồng ý</button>
        </div>
      </div>
    </Overlay>
    <h2 className='name-cpn'>Quản lý bài viết</h2>
    <div className='search-post-manager'>
      <Formik
        enableReinitialize={true}
        initialValues={{ search: search }}
        onSubmit={values => {
          setSearch(values.search)
        }}
      >
        {({ values }) => (
          <Form id="create-course-form">
            <Field className="search-user-manager" name="search" autocomplete="off" type="text" placeholder="Tìm kiếm bài viết" />
          </Form>
        )}
      </Formik>

      <div className='filter-post-manager'>
        <p className='title-filter'>bộ lọc : </p>
        <select value={sort} onChange={event => { setSort(event.target.value) }} className="select-filter-time-post-manager">
          <option value="-1">mới nhất</option>
          <option value="1">cũ nhất</option>
        </select>
        <select value={categoryfilter} onChange={event => { console.log(event.target.value); setCategoryfilter(event.target.value) }} className="select-filter-post-manager">
          <option value="">Thể loại</option>
          {Categories}
        </select>
      </div>

      <InfiniteScroll className="list-post-manager"
        dataLength={listpost.length}
        next={fetchData}
        hasMore={hasmore}
        loader={<div className="loading-post-search"></div>}
        endMessage={<p></p>}

      >

        {loading ? <div className='loader-post-manager'></div> : <>
          {listpost.length === 0 ? <div className='no-post-manager'><p>Không có bài viết nào phù hợp</p></div> : <>
            {listpost.map((post, index) => (
              <div key={index} className='post-manager-item'>
                <div className='img-post-manager'>
                  <img src={post.imagepost}></img>
                </div>

                <p className='title-post-manager'>{post.title}</p>
                <p className='poster-postmanager'><b>Thể loại :</b> {post.category.namecategory}</p>
                {post.censor != null ? <p className='poster-postmanager'><b>người duyệt :</b> {post.censor.name}</p> : null }
                
                <p className='bro-postmanager'><b>Người đăng :</b> {post.poster.name}</p> 
                <p className='bro-postmanager'><b>Ngày đăng :</b> {moment(post.createAtpost).format('DD/MM/YYYY')}</p>
                <div className='option-post-manager-item'>
                  <button onClick={() => { setShowmodeldetail(true); setContentpost(post.content) }}>xem bài</button>
                  <button onClick={() => {setIdpost(post._id); setOpenmodeldel(true); setIndex(index)}}>Xóa</button>
                </div>
              </div>
            ))}

          </>}
        </>}
      </InfiniteScroll>
    </div>


  </div>
)
};

export default PostManager;