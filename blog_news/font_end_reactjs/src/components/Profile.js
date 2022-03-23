import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../css/profile.css';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AiOutlineEye } from "react-icons/ai";
import { HiThumbUp } from "react-icons/hi";
import { BiEraser, BiXCircle, BiMessageRounded } from "react-icons/bi";
import { FiTrash, FiEdit } from "react-icons/fi";
import { AiOutlineCamera } from "react-icons/ai";
import { getuser } from '../redux/features/user/userSlice';
import uploadService from '../commons/axios/api/uploadService';
import { checkImage } from '../commons/validate/checkImage.js';
import { valid } from '../commons/validate/validateForm';
import { ToastContainer, toast } from 'react-toastify';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import userApi from '../commons/axios/api/userApi';
import { Overlay } from 'react-portal-overlay';

function Profile(props) {
    let history = useHistory();
    const dispatch = useDispatch();
    const { dataUser } = useSelector((state) => state.user);
    const [imageuser, setImageUser] = useState('')
    const { isLogin } = useSelector((state) => state.auth);
    const { isSuccess } = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const [openmodeldelete, setOpenmodeldelete] = useState(false);
    const [listpost, setListpost] = useState([]);
    const [page, setPage] = useState(2);
    const [idpost, setIdpost] = useState('');
    const [index, setIndex] = useState('');
    const [loadmore, setLoadmore] = useState(true);
    const [openchangepass, setOpenchangepass] = useState(false);
    const [loadimage, setLoadimage] = useState(false);
    const [loadpage, setLoadpage] = useState(false);

    useEffect(async () => {
        window.scrollTo(0, 0);
        setLoadpage(true)
        setLoadmore(true)
        if (isLogin === false) {
            history.replace('/home')
            return;
        }
        if (isSuccess === false) return;
        if (!dataUser) return;
        setPage(2)
            await userApi.getpostbyuser(1).then((res) => {
                if (res.data.length < 6) {
                    setLoadmore(false)
                }
                setListpost(res.data)
                setLoadpage(false)
            })
    }, [isLogin, dataUser])

    const chooseAvatar = async (e, setFieldValue) => {
        const tg = e.target
        const file = tg.files[0]
        const checkimg = checkImage(file)
        if (checkimg) return toast.info(checkimg, {
            theme: "dark"
        });
        setLoadimage(true)
        await uploadService.uploadimguser(file, 200, 200).then(res => {
            setTimeout(() => {
                setFieldValue('avatar', res.urlimageuser)
                setImageUser(res.urlimageuser)
                setLoadimage(false)
            }, 700);
        })
    }

    const deletepost = async () => {
        await userApi.deletepost(idpost).then(res => {
            listpost.splice(index, 1);
            setIdpost('')
            setIndex('')
            toast.success(res.message, {
                theme: "dark"
            });
        })
    }

    const updatepforile = async (values) => {
        const { name, phone, avatar, password } = values;
        await userApi.updateProfile(name, avatar, phone, password).then(res => {
            switch (res.message) {
                case 'Mật khẩu không chính xác':
                    toast.error(res.message, {
                        theme: "dark"
                    })
                    break;
                case 'Cập nhật trang cá nhân thành công':
                    dispatch(getuser())
                    setOpen(false)
                    toast.success(res.message, {
                        theme: "dark"
                    })
                    break;
            }
        })
    }

    const fetchData = async () => {
        setPage(Number(page) + 1)
        await userApi.getpostbyuser(page).then(res => {
            if (res.data.length < 6) {
                setLoadmore(false)
                return;
            }
            setListpost(listpost.concat(res.data))
        })
    }

    const changePassword = async (values) => {
        await userApi.changePassword(values.oldpassword, values.passwordnew).then(res => {
            switch (res.message) {
                case 'Mật khẩu không chính xác':
                    toast.error(res.message, {
                        theme: "dark"
                    })
                    break;
                case 'Đổi mật khẩu thành công':
                    setOpenchangepass(false)
                    toast.success(res.message, {
                        theme: "dark"
                    })
                    break;
            }
        })
    }
    return (
        <>
            {loadpage ? <div width="500px" height="500px" className="fp-loader" /> : <div className='body-container-profile'>
                <Overlay className='overlay-profile'
                    open={open}
                    closeOnEsc={true}
                    onClose={() => setOpen(false)}
                >
                    <div className='model-update-user'>
                        <h3 className='title-update-profile'>Cập nhật tài khoản</h3>
                        <div className='input-update-profile'>
                            <Formik
                                initialValues={{ name: dataUser.name, phone: dataUser.phoneNumber, avatar: imageuser, password: '' }}
                                validationSchema={valid.updateuser}
                                onSubmit={(values) => {
                                    updatepforile(values)
                                }}
                            >
                                {({ values, errors, touched, setFieldValue }) => (
                                    <Form className='form-update' >
                                        <div className='image-update-profile'>
                                            {loadimage ? <div className='load-image-user'></div> : <img src={imageuser}></img>}
                                            <label for="file-upload" class="custom-file-upload">
                                                <AiOutlineCamera className='ic-choose-image' />
                                            </label>
                                            <input id="file-upload"
                                                type="file"
                                                name='avatar'
                                                accept=".png, .jpg, .jpeg"
                                                enctype="multipart/form-data"
                                                className='display-input-file'
                                                onChange={(e) => chooseAvatar(e, setFieldValue)}
                                            />
                                        </div>
                                        {/* <div className='choose-img-avatar'>
                                        
                                    </div> */}
                                        <label className='lable-update-input'>Họ và tên : </label>
                                        <Field autocomplete="off" maxlength="40" className="input-profile-update" name="name" type="text" placeholder="Nhập họ và tên" />
                                        {errors.name && touched.name ? (
                                            <p className='input-error-update-profile'>{errors.name}</p>
                                        ) : <p className='input-error-update-profile'></p>}

                                        <label name="phone" className='lable-update-input'>Số điện thoại :</label>
                                        <Field autocomplete="off" className="input-profile-update" maxlength="10" name="phone" type="text" placeholder="Nhập số điện thoại"></Field>
                                        {errors.phone && touched.phone ? (
                                            <p className='input-error-update-profile'>{errors.phone}</p>
                                        ) : <p className='input-error-update-profile'></p>}

                                        <label name="phone" className='lable-update-input'>Xác nhận mật khẩu :</label>
                                        <Field autocomplete="off" className="input-profile-update" name="password" type="password" placeholder="Nhập Mật khẩu để xác nhận thay đổi tài khoản"></Field>
                                        {errors.password && touched.password ? (
                                            <p className='input-error-update-profile'>{errors.password}</p>
                                        ) : <p className='input-error-update-profile'></p>}
                                        <div className='option-btn-model-update'>
                                            <button type='button' className="btn-submit-update" onClick={() => setOpen(false)} >Hủy</button>
                                            <button className="btn-submit-update" type="submit">Hoàn tất</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Overlay>
                <Overlay className='overlay-profile'
                    open={openmodeldelete}
                    closeOnEsc={true}
                    onClose={() => setOpenmodeldelete(false)}
                >
                    <div className='model-delete-post'>
                        <h1>Thông báo</h1>
                        <p>Bạn có chắc chắn muốn xóa bài viết ?</p>
                        <div className='btn-delete-post'>
                            <button onClick={() => setOpenmodeldelete(false)}>Hủy bỏ</button>
                            <button onClick={() => { deletepost(); setOpenmodeldelete(false) }}>Đồng ý</button>
                        </div>
                    </div>
                </Overlay>

                <Overlay className='overlay-profile'
                    open={openchangepass}
                    closeOnEsc={true}
                    onClose={() => setOpenmodeldelete(false)}
                >
                    <div className='model-change-password-user'>
                        <h2 className='title-update-profile'>Đổi mật khẩu</h2>
                        <div className='input-update-profile'>
                            <Formik
                                initialValues={{ oldpassword: '', passwordnew: '' }}
                                validationSchema={valid.changePassword}
                                onSubmit={(values) => {
                                    changePassword(values)
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form className='form-update' >

                                        <label name="phone" className='lable-update-input'>Mật khẩu cũ :</label>
                                        <Field autocomplete="off" className="input-profile-update" name="oldpassword" type="password" placeholder="Nhập mật khẩu cũ"></Field>
                                        {errors.oldpassword && touched.oldpassword ? (
                                            <p className='input-error-update-profile'>{errors.oldpassword}</p>
                                        ) : <p className='input-error-update-profile'></p>}

                                        <label name="phone" className='lable-update-input'>Mật khẩu mới :</label>
                                        <Field autocomplete="off" className="input-profile-update" name="passwordnew" type="password" placeholder="Nhập Mật khẩu Mới"></Field>
                                        {errors.passwordnew && touched.passwordnew ? (
                                            <p className='input-error-update-profile'>{errors.passwordnew}</p>
                                        ) : <p className='input-error-update-profile'></p>}
                                        <div className='option-btn-model-update'>
                                            <button type='button' className="btn-submit-update" onClick={() => setOpenchangepass(false)} >Hủy</button>
                                            <button className="btn-submit-update" type="submit">Xác nhận</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Overlay>
                <ToastContainer />
                <div className='profile-container'>
                    <div className='infor-profile'>
                        <div>
                            <h3 className='list-post-active'>Thông tin Tài khoản</h3>
                        </div>
                        <div className='img-name-user-profile'>
                            <div className='img-user-profile'>
                                <img src={dataUser.avatar}></img>
                            </div>
                            <div className='name-email-user-profile'>
                                <h3>{dataUser.name}</h3>
                                <p>{dataUser.email}</p>
                                <p>Số điện thoại : {dataUser.phoneNumber === '' ? 'không có' : `${dataUser.phoneNumber}`}</p>
                                {dataUser.chucvu === 'user' ? null : <p>Chức vụ : {dataUser.chucvu}</p>}
                            </div>
                            <button onClick={() => { setOpen(true); setImageUser(dataUser.avatar) }} className='btn-option-update-profile'>Cập nhật tài khoản</button>
                            <button onClick={() => { setOpenchangepass(true) }} className='btn-option-update-profile'>Đổi mật khẩu</button>
                        </div>
                    </div>
                    <div className='post-by-user-profile' >
                        <div className='option-profile'>
                            <h3 className='active'>Bài viết của tôi</h3> 
                        </div>
                        <div className='list-post-profile'>
                            {listpost.length === 0 ? <p className='no-post-profile'>Không có bài viết nào</p> : <>
                            <InfiniteScroll className='list-post-profile'
                                dataLength={listpost.length}
                                next={fetchData}
                                hasMore={loadmore}
                                loader={<div className="load-post-profile"></div>}
                                endMessage={<></>}
                            >
                                {listpost.map((post, index) => (
                                    <div className='post-item-profile' key={index} >
                                        <div className='img-post-profile'>
                                            <img src={post.imagepost}></img>
                                            <div className='interactions-post-profile'>
                                                <p>{post.likecount} <HiThumbUp className='ic-inter-profile' /> - {post.views} lượt xem</p>
                                            </div>
                                            <div className='option-post-profile'>
                                                <button onClick={() => history.push(`/postdetail/${post._id}`)} className='btn-option-profile review-post-profile'>Xem bài viết</button>
                                                <button onClick={() => history.push(`/updatepost/${post._id}`)} className='btn-option-profile'><FiEdit className='ic-option-post-profile' /></button>
                                                <button onClick={() => { setIdpost(post._id); setOpenmodeldelete(true); setIndex(index) }} className='btn-option-profile'><FiTrash className='ic-option-post-profile' /></button>
                                            </div>
                                        </div>

                                        <h3 className='title-post-profile'>{post.title}</h3>
                                    </div>
                                ))}
                            </InfiniteScroll>
                            </>}
                        </div>
                        
                    </div>
                </div>
            </div>}
        </>
    );
}

export default Profile;