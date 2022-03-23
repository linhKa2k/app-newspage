import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../../css/header.css';
import { useSelector, useDispatch } from 'react-redux';
import { getuser, clearUserlogout } from '../../redux/features/user/userSlice';
import { getCategories } from '../../redux/features/category/categorySlice';
import { postLogout } from '../../redux/features/auth/authSlice';
import {BiLayer,BiHomeAlt ,BiCog, BiHighlight, BiChevronDown, BiPencil, BiBell, BiUserCircle, BiLogOut, BiBookOpen, BiTagAlt, BiPlay } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import { Formik, Form, Field } from 'formik';
import io from 'socket.io-client';
import { getListPostNewAndViews } from '../../redux/features/home/postsNewSlice';
import { websocket } from '../../redux/features/socket/socket';
import moment from 'moment';
import postApi from '../axios/api/postApi';
import { Overlay } from 'react-portal-overlay';
const HeaderComponent = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    const { dataUser } = useSelector((state) => state.user);
    const isLoading = useSelector((state) => state.user.isLoading);
    const { isLogin } = useSelector((state) => state.auth);
    const [notifi, setNotifi] = useState([]);
    const [countnotifi, setCountnotifi] = useState(0);
    const [isnotifi, setIsnotifi] = useState(false);
    const [showlistnotifi, setShowlistnotifi] = useState(false);
    const [lockedaccount, setLockedaccount] = useState(false);
    const listCategory = useSelector((state) => state.category.listCategory);
    const socket = useSelector((state) => state.socket.socket);
    
    const Categories = listCategory.map((category) => {
        const { _id, namecategory } = category;
        return (
            <Link key={_id} to={`/postsbycategory/${_id}`}><BiTagAlt className="ic-category" /> {namecategory}</Link>
        );
    })

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

    useEffect(() => {
        const socket = io("http://localhost:3800")
        dispatch(websocket({ socket }));
        if (isLogin) {
            dispatch(getuser()).then(res => {
                if (!res.payload.results.is_available) {
                    return setLockedaccount(true)
                }
                if (res.payload.results.role === "admin") {
                    history.replace('/admin')
                }
            })
        }
        dispatch(getCategories())

    }, [isLogin]);

    useEffect(() => {
        if (!dataUser) return;
        if (!dataUser.notification) return;
        setNotifi(dataUser.notification)
        const listNotiIsReading = dataUser.notification.filter((noti) => noti.is_reading === false)
        if (listNotiIsReading.length >= 1) {
            setCountnotifi(listNotiIsReading.length)
            setIsnotifi(true)
        }
        // if(dataUser)
    }, [dataUser]);

    useEffect(() => {
        if (!socket) return;
        socket.on("new_msg", function (data) {
            setNotifi(data.msg)
            setCountnotifi(countnotifi => countnotifi + 1)
            setIsnotifi(true)
            dispatch(getListPostNewAndViews());

        });
        socket.on("lock_account", function (data) {
            setLockedaccount(true)
        });
    }, [socket])

    const onlogout = () => {
        dispatch(postLogout())
        dispatch(clearUserlogout())
    }

    const readingnotifi = async (item, index) => {
        if (!item.is_reading) {
            await postApi.readingnoti(item._id).then(res => {
                setCountnotifi(countnotifi => countnotifi - 1)
                setNotifi(res.payload)
            })
            if (item.idpost === '') {
                return;
            } else {
                setShowlistnotifi(false)
                history.push(`/postdetail/${item.idpost}`)
            }
        } else {
            if (item.idpost === '') {
                return;
            } else {
                setShowlistnotifi(false)
                history.push(`/postdetail/${item.idpost}`)
            }
        }
    }


    return (
        <>
            {isLoading ? null:
                <>
                    {/* {lockedaccount ? */}
                        <Overlay className='overlay-profile'
                        open={lockedaccount}
                        closeOnEsc={true}
                    >
                         <div className="notifi-globle">
                                <div className="noti-title-globle">
                                    <h2>Thông báo</h2>
                                    <p>Tài khoản của bạn đã bị khóa, vui lòng liên hệ đến Email: <a href="mailto:Blogchiasekienthuc@gmail.com" className="email-noti">Blogchiasekienthuc@gmail.com</a> để biết thêm chi tiết</p>
                                </div>
                                <button onClick={() => { onlogout(); setLockedaccount(false) }} className="btn-globle">đồng ý</button>
                            </div>
                    </Overlay>
                        {/* <div className="overlay-globle">
                           
                        </div> */}
                    <div className="sticky-top">
                        {/* PC */}
                        <div className="header-global">
                            <div onClick={() => history.push('/')}>
                                <img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Blogger_logo.svg/1200px-Blogger_logo.svg.png"></img>
                            </div>
                            <div className="menu">
                                <Link to={'/'} className="nav-link">trang chủ</Link>
                                {/* <Link to={'/24gio-qua'} className="nav-link">Bài viết trong ngày</Link> */}
                                {/* <Link className="nav-link">tin nổi bật</Link> */}
                                <div className="dropdown">
                                    <button className="nav-link">Thể loại bài viết <BiChevronDown /></button>
                                    <div class="noidung_dropdown">
                                        {Categories}

                                    </div>
                                </div>
                            </div>

                            <div>
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{ valuesearch: '' }}
                                    onSubmit={(values, { resetForm }) => {
                                        history.push(`/search?v=${values.valuesearch.trim().replace(/\s+/g, '-').toLowerCase()}`)
                                        resetForm()
                                    }}
                                >
                                    <Form>
                                        <Field className="search-header" name="valuesearch" autocomplete="off" type="text" placeholder="Tìm kiếm bài viết..." />
                                    </Form>
                                </Formik>

                            </div>
                            {(isLogin === true && dataUser !== undefined) ?
                                <div className="infor-user-login">
                                    <div className="ic"><Link to={'/contribute'}><BiPencil className="ic-create-notifi" /></Link></div>
                                    <div className="ic">
                                        {countnotifi === 0 ? null : <p className="count-notifi">{countnotifi}</p>}
                                        <button onClick={() => { setShowlistnotifi(!showlistnotifi); }}><BiBell className="ic-create-notifi" /></button>
                                        {showlistnotifi ?
                                            <div className="title-notifi">
                                                <div className="option-notifi">
                                                    <h3>Thông báo</h3>
                                                </div>
                                                <div className="list-item-notifi" >

                                                    {notifi && <>
                                                        {notifi.length === 0 ? <p className="no-notifi">Chưa có thông báo nào dành cho bạn</p> :
                                                            <>
                                                                {notifi.map((item, index) => (
                                                                    <div className="notifi-item" key={index} onClick={() => readingnotifi(item, index)}>
                                                                        <img src={item.image}></img>
                                                                        <div className="message-time-notifi">
                                                                            {item.is_reading === true ? <p className="no-read">{item.message}</p> : <p className="is-read">{item.message}</p>}
                                                                            <em>{moment(item.time).fromNow()}</em>
                                                                        </div>
                                                                    </div>
                                                                ))}</>}</>}


                                                </div>
                                            </div> : null}
                                    </div>
                                    <div className="dropdown-user">
                                        <img className="img-user-header" src={dataUser.avatar}></img>
                                        <div className="noidung_dropdown-user">
                                            <Link to={`/my-profile/${dataUser._id}`}><BiUserCircle className="ic-user-model" /> Tài khoản cá nhân</Link>
                                            {dataUser.role === 'admin' ? <Link to={`/admin`}><BiCog className="ic-user-model" /> Quản lý page</Link> : null}
                                            {dataUser.role === 'censor' ? <Link to={`/browsing-page`}><BiHighlight className="ic-user-model" /> Duyệt bài viết</Link> : null}
                                            {dataUser.role === 'user' ? <Link to={`/post-waiting/${dataUser._id}`}><BiHighlight className="ic-user-model" /> Bài viết đang chờ</Link> : null}

                                            <div onClick={onlogout} className="logout"><BiLogOut className="ic-user-model" /> Đăng xuất</div>

                                        </div>
                                    </div>
                                </div> : <div className="auth-header">
                                    <Link to={'/auth'} className="signup-signin">Đăng nhập / Đăng ký</Link>
                                </div>}
                        </div>

                        {/* mobile */}
                        <div className="header-mobile">
                            <div onClick={() => history.push('/')}>
                                <img className="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Blogger_logo.svg/1200px-Blogger_logo.svg.png"></img>
                            </div>
                            
                            <input type="checkbox" hidden className="check" id="check"></input>
                                    <div className="ic">
                                        {countnotifi === 0 ? null : <p className="count-notifi">{countnotifi}</p>}
                                        <button onClick={() => { setShowlistnotifi(!showlistnotifi); }}><BiBell className="ic-create-notifi" /></button>
                                        {showlistnotifi ?
                                            <div className="title-notifi">
                                                <div className="option-notifi">
                                                    <h3>Thông báo</h3>
                                                </div>
                                                <div className="list-item-notifi">

                                                    {notifi && <>
                                                        {notifi.length === 0 ? <p className="no-notifi">Chưa có thông báo nào dành cho bạn</p> :
                                                            <>
                                                                {notifi.map((item, index) => (
                                                                    <div className="notifi-item" key={index} onClick={() => readingnotifi(item, index)}>
                                                                        <img src={item.image}></img>
                                                                        <div className="message-time-notifi">
                                                                            {item.is_reading === true ? <p className="no-read">{item.message}</p> : <p className="is-read">{item.message}</p>}
                                                                            <em>{moment(item.time).fromNow()}</em>
                                                                        </div>
                                                                    </div>
                                                                ))}</>}</>}


                                                </div>
                                            </div> : null}
                                    </div>
                            <label htmlFor="check" className="ic-toggle"><FiMenu className="ic-toggle-item" /></label>
                            <label htmlFor="check" className="nav-overlay"></label>
                            <div className="header-global--mobile">
                                <label for="check" className="close-menu"><FiX /></label>

                                {(isLogin === true && dataUser !== undefined) ?
                                <>
                                 <div className="dropdown-user-mobile">
                                    <img className="img-user-header-mobile" src={dataUser.avatar}></img>
                                    <p>{dataUser.name}</p>



                                </div>
                                </> : <div className="auth-header-mobile">
                                    <Link to={'/auth'} className="signup-signin-mobile">đăng nhập / đăng ký</Link>
                                </div>}
                                {/* <div>
                                    <input className="search-header-mobile" placeholder="Nhập nội dung tìm kiếm..."></input>

                                </div> */}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={{ valuesearch: '' }}
                                    onSubmit={(values, { resetForm }) => {
                                        history.push(`/search?v=${values.valuesearch.trim().replace(/\s+/g, '-').toLowerCase()}`)
                                        resetForm()
                                    }}
                                >
                                    <Form>
                                        <Field className="search-header-mobile" name="valuesearch" autocomplete="off" type="text" placeholder="Tìm kiếm bài viết..." />
                                    </Form>
                                </Formik>
                                <div className="menu-mobile">
                                <Link className='nav-link-mobile' to={'/contribute'}><BiPencil className="ic-user-model" /> Tạo bài viết</Link>
                                <Link className='nav-link-mobile' to={`/my-profile/${dataUser._id}`}><BiUserCircle className="ic-user-model" /> tài khoản cá nhân</Link>
                                
                                            {dataUser.role === 'censor' ? <Link  className='nav-link-mobile' to={`/browsing-page`}><BiHighlight className="ic-user-model" /> Duyệt bài viết</Link> : null}
                                            {dataUser.role === 'user' ? <Link to={`/post-waiting/${dataUser._id}`} className="nav-link-mobile"><BiHighlight className="ic-user-model" /> Bài viết đang chờ</Link> : null}
                                    <Link to={'/'} className="nav-link-mobile"> <BiHomeAlt className="ic-user-model" />trang chủ</Link>
                                   
                                    <div class="dropdown-mobile">
                                        <input type="checkbox" hidden className="check-list" id="block-listcategory"></input>

                                        <label htmlFor="block-listcategory" className="nav-link-mobile category-list"><BiLayer className="ic-user-model" />Thể loại <BiChevronDown /></label>
                                        <div className="noidung_dropdown-mobile">
                                            {Categories}

                                        </div>
                                    </div>

                                </div>
                                <div>
                                    {(isLogin === true && dataUser !== undefined) ? <div onClick={onlogout} className="logout"><BiLogOut className="ic-user-model" /> đăng xuất</div> : null}

                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </>

    );
}

export default HeaderComponent;