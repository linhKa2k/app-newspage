import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../css/creatpost.css';
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
import { Overlay } from 'react-portal-overlay';
import { DialogContainer, dialog } from 'react-dialogify';
function CreatePost(props) {
  let history = useHistory();
  const dispatch = useDispatch();
  const [loadingpage, setLoadingpage] = useState(false);
  const [loadingimg, setLoadingimg] = useState(false);
  const [loadingimgcontent, setLoadingimgcontent] = useState(false);
  const listCategory = useSelector((state) => state.category.listCategory);
  const [messagepost, setMessagepost] = useState('');
  const [loadingpost, setLoadingpost] = useState(false)
  const [overlaycreatpost, setOverlaycreatpost] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [idcategory, setIdcategory] = useState('');
  const [avatarpost, setAvatarpost] = useState('');
  const { dataUser } = useSelector((state) => state.user);
  const { id } = useParams();
  const [content, setContent] = useState('');
  const quillRef = useRef(null)
  //toolbar react quill
  const modules = { toolbar: { container } }
  // select list category

  const Categories = listCategory.map((category) => {
    const { _id, namecategory } = category;
    return (
      <option key={_id} value={_id}>{namecategory}</option>
    );
  })

  useEffect(async () => {
      if(!dataUser) return;
    window.scrollTo(0, 0);
    setLoadingpage(true)
    await postApi.getpostbyid(id, dataUser._id).then(res => {
        if (res.post) {
            setContent(res.post.content)
            setTitle(res.post.title)
            setDescription(res.post.description)
            setAvatarpost(res.post.imagepost)
            setIdcategory(res.post.category._id)
            setLoadingpage(false)

        }
        else {
            history.replace('/404-not-found')
        }
    });
    }, [id, dataUser])

  const updatePost = async (values) => {
    setLoadingpost(true)
    const { tittle, description, idcategory, avatarpost, content } = values;
    await postApi.updatepost(content, tittle, idcategory, description, avatarpost ,id ).then(res => {
      setMessagepost(res.message)
      setLoadingpost(false)
    });
  };

  const handleChangeImage = useCallback(() => {
    // tạo element input
    const elementInput = document.createElement('input')
    elementInput.type = "file"
    elementInput.accept = ".png, .jpg, .jpeg"
    // elementInput.name = "image"
    // elementInput.enctype = "multipart/form-data"

    elementInput.click()
    elementInput.onchange = async () => {
      const files = elementInput.files;
      if (!files) toast.warn("vui lòng chọn file")
      const file = files[0];
      const checkimg = checkImage(file)
      if (checkimg) return toast.info(checkimg);
      const width = 800;
      const height = undefined;
      setLoadingimgcontent(true)
      const response = await uploadService.uploadimgpost(file, width, height);

      // const im = await uploadService.uploadimgpost(file, width, height);
      if (response) {
        setTimeout(() => {
          const quill = quillRef.current;
          const range = quill?.getEditor().getSelection()?.index;
          if (range !== undefined) {
            setLoadingimgcontent(false)
            quill?.getEditor().insertEmbed(range, 'image', `${response.urlimagepost}`);
            console.log(response.urlimagepost)
          }
        }, 1000)
      }
    }
  });

  const handleAvtImage = async (e, setFieldValue) => {
    const tg = e.target
    const file = tg.files[0]
    const checkimg = checkImage(file)
    if (checkimg) return toast.info(checkimg);
    const width = 600;
    const height = 350;
    setLoadingimg(true)
    const im = await uploadService.uploadimgpost(file, width, height);
    setTimeout(() => {
      setFieldValue('avatarpost', im.urlimagepost)
      setLoadingimg(false)
    }, 1000)

  }
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    let toolbar = quill.getEditor().getModule('toolbar')
    toolbar.addHandler('image', handleChangeImage)
  }, [handleChangeImage])


  return (
    <div className="creat-post-container">
        {loadingpage ? <div width="500px" height="500px" className="fp-loader" /> : <>
      <Overlay className='overlay-profile'
        open={loadingimgcontent}
        closeOnEsc={true}
      // onClose={() => setOpenmodeldelete(false)}
      >
        <div className='loading-img-post'></div>
      </Overlay>
      <Overlay className='overlay-profile'
        open={overlaycreatpost}
        closeOnEsc={true}
      // onClose={() => setOpenmodeldelete(false)}
      >
        {loadingpost ? <div className='loading-img-post'></div> :
          <div className='notifi-post'>
            <div className='title-notifi-post'>
            <h2>Thông báo</h2>
            </div>
            {/* <p>{messagepost}</p> */}
            <p className='msg-post'>{messagepost}</p>

            <button onClick={() => {history.push('/home'); setOverlaycreatpost(false)}} className='btn-success-post'>Đồng ý</button>
          </div>
        }
      </Overlay>
      <DialogContainer />
      <ToastContainer />
      <h2 className="creat-post-title"><FiChevronsRight /> Chỉnh sửa bài đăng <FiChevronsLeft /></h2>
      <div className="container-body">

        {(title === '' || description === '' || idcategory === '' || avatarpost === '' || content === '') ? null : 
        <Formik
          initialValues={{ tittle: title, description: description, idcategory: idcategory, avatarpost: avatarpost, content: content }}
          validationSchema={valid.postValid}
          onSubmit={values => {
            updatePost(values)
            setOverlaycreatpost(true)
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className='form-creat-post' enctype="multipart/form-data">
              <div className='input-creat-post-left'>
                <div className="field">
                  <div className="lable-item">
                    <p>Tiêu đề : </p>
                  </div>
                  <div className="input-field">
                    <Field maxLength="150" className="input-title-creatpost" name="tittle" autocomplete="off" />
                    <div className="notifi">

                      {errors.tittle && touched.tittle ? (
                        <p className='input-error'>{errors.tittle}</p>
                      ) : <p className='input-error'></p>}
                      <small className="text-length">{values.tittle.length}/150</small>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="lable-item">
                    <p>Mô tả bài viết : </p>
                  </div>
                  <div className="input-field">
                    <Field maxLength="350" as="textarea" rows="5" className="input-desc-creatpost" name="description" autocomplete="off" />
                    <div className="notifi">

                      {errors.description && touched.description ? (
                        <p className='input-error'>{errors.description}</p>
                      ) : <p className='input-error'></p>}
                      <small className="text-length">{values.description.length}/350</small>
                    </div>

                  </div>
                </div>
                <div className="field">
                  <div className="lable-item">
                    <p>Thể loại : </p>
                  </div>
                  <div className="input-field">
                    <Field component="select" className="input-desc-creatpost" name="idcategory" autocomplete="off" >
                      <option disabled value=""></option>
                      {Categories}
                    </Field>
                    <div className="notifi">

                      {errors.idcategory && touched.idcategory ? (
                        <p className='input-error'>{errors.idcategory}</p>
                      ) : <p className='input-error'></p>}
                      <br />
                    </div>

                  </div>
                </div>
                <div className="field">
                  {/* <div className="lable-item">
                    <p>Ảnh đại diện :  </p>
                  </div> */}
                  <div className="input-field">
                    <label for="file-upload" className='choose-image-post'>
                      Chọn ảnh đại diện
                    </label>
                    <input
                      id='file-upload'
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      name="avatarpost"
                      className='input-choose-img'
                      enctype="multipart/form-data"
                      onChange={(e) => handleAvtImage(e, setFieldValue)} />
                    {loadingimg ? <div className='loading-img-post'></div> :
                      <>
                        {values.avatarpost === '' ? null : <img className='img-avatar-post' src={values.avatarpost}></img>}
                      </>
                    }
                    <div className="notifi">
                      {errors.avatarpost && touched.avatarpost ? (
                        <p className='input-error'>{errors.avatarpost}</p>
                      ) : <p className='input-error'></p>}
                    </div>

                  </div>
                </div>

              </div>
              <div className='input-creat-post-right'>

                <div className="field-content">
                  <div className="lable-item">
                    <p>Nội dung bài viết : </p>
                  </div>
                  <div className="input-field-quill">
                    <Field name="content" >
                      {({ field }) => <ReactQuill
                        theme="snow"
                        className='react-quill-form'
                        // formats={formats}
                        placeholder="Nhập nội dung bài viết"
                        modules={modules} value={field.value}
                        onChange={field.onChange(field.name)}
                        ref={quillRef} />}
                    </Field>
                    <div className="notifi">

                      {errors.content && touched.content ? (
                        <p className='input-error'>{errors.content}</p>
                      ) : <p className='input-error'></p>}
                      <small className="text-length">{values.content.length}/20000</small>
                    </div>
                  </div>
                </div>
                <button className="btn-create-post" type="submit">Cập nhật bài viết<RiBallPenLine className="icon-creat-post" /></button>
              </div>

            </Form>
          )}
        </Formik>}
      </div></>}
    </div>

  );
}

let container = [
  [{ 'font': [] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction
  [{ 'align': [] }],

  ['clean', 'link', 'image', 'video']
]

export default CreatePost;