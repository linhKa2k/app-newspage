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
            past: "%s tr?????c",
            s: 'v??i gi??y',
            ss: '%d seconds',
            m: "1 ph??t",
            mm: "%d ph??t",
            h: "1 gi???",
            hh: "%d gi???",
            d: "1 ng??y",
            dd: "%d ng??y",
            M: "1 th??ng",
            MM: "%d th??ng",
            y: "1 n??m",
            yy: "%d n??m"
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
                                    <h2>Th??ng b??o</h2>
                                    <p>T??i kho???n c???a b???n ???? b??? kh??a, vui l??ng li??n h??? ?????n Email: <a href="mailto:Blogchiasekienthuc@gmail.com" className="email-noti">Blogchiasekienthuc@gmail.com</a> ????? bi???t th??m chi ti???t</p>
                                </div>
                                <button onClick={() => { onlogout(); setLockedaccount(false) }} className="btn-globle">?????ng ??</button>
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
                                <Link to={'/'} className="nav-link">trang ch???</Link>
                                {/* <Link to={'/24gio-qua'} className="nav-link">B??i vi???t trong ng??y</Link> */}
                                {/* <Link className="nav-link">tin n???i b???t</Link> */}
                                <div className="dropdown">
                                    <button className="nav-link">Th??? lo???i b??i vi???t <BiChevronDown /></button>
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
                                        <Field className="search-header" name="valuesearch" autocomplete="off" type="text" placeholder="T??m ki???m b??i vi???t..." />
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
                                                    <h3>Th??ng b??o</h3>
                                                </div>
                                                <div className="list-item-notifi" >

                                                    {notifi && <>
                                                        {notifi.length === 0 ? <p className="no-notifi">Ch??a c?? th??ng b??o n??o d??nh cho b???n</p> :
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
                                            <Link to={`/my-profile/${dataUser._id}`}><BiUserCircle className="ic-user-model" /> T??i kho???n c?? nh??n</Link>
                                            {dataUser.role === 'admin' ? <Link to={`/admin`}><BiCog className="ic-user-model" /> Qu???n l?? page</Link> : null}
                                            {dataUser.role === 'censor' ? <Link to={`/browsing-page`}><BiHighlight className="ic-user-model" /> Duy???t b??i vi???t</Link> : null}
                                            {dataUser.role === 'user' ? <Link to={`/post-waiting/${dataUser._id}`}><BiHighlight className="ic-user-model" /> B??i vi???t ??ang ch???</Link> : null}

                                            <div onClick={onlogout} className="logout"><BiLogOut className="ic-user-model" /> ????ng xu???t</div>

                                        </div>
                                    </div>
                                </div> : <div className="auth-header">
                                    <Link to={'/auth'} className="signup-signin">????ng nh???p / ????ng k??</Link>
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
                                                    <h3>Th??ng b??o</h3>
                                                </div>
                                                <div className="list-item-notifi">

                                                    {notifi && <>
                                                        {notifi.length === 0 ? <p className="no-notifi">Ch??a c?? th??ng b??o n??o d??nh cho b???n</p> :
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
                                    <Link to={'/auth'} className="signup-signin-mobile">????ng nh???p / ????ng k??</Link>
                                </div>}
                                {/* <div>
                                    <input className="search-header-mobile" placeholder="Nh???p n???i dung t??m ki???m..."></input>

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
                                        <Field className="search-header-mobile" name="valuesearch" autocomplete="off" type="text" placeholder="T??m ki???m b??i vi???t..." />
                                    </Form>
                                </Formik>
                                <div className="menu-mobile">
                                <Link className='nav-link-mobile' to={'/contribute'}><BiPencil className="ic-user-model" /> T???o b??i vi???t</Link>
                                <Link className='nav-link-mobile' to={`/my-profile/${dataUser._id}`}><BiUserCircle className="ic-user-model" /> t??i kho???n c?? nh??n</Link>
                                
                                            {dataUser.role === 'censor' ? <Link  className='nav-link-mobile' to={`/browsing-page`}><BiHighlight className="ic-user-model" /> Duy???t b??i vi???t</Link> : null}
                                            {dataUser.role === 'user' ? <Link to={`/post-waiting/${dataUser._id}`} className="nav-link-mobile"><BiHighlight className="ic-user-model" /> B??i vi???t ??ang ch???</Link> : null}
                                    <Link to={'/'} className="nav-link-mobile"> <BiHomeAlt className="ic-user-model" />trang ch???</Link>
                                   
                                    <div class="dropdown-mobile">
                                        <input type="checkbox" hidden className="check-list" id="block-listcategory"></input>

                                        <label htmlFor="block-listcategory" className="nav-link-mobile category-list"><BiLayer className="ic-user-model" />Th??? lo???i <BiChevronDown /></label>
                                        <div className="noidung_dropdown-mobile">
                                            {Categories}

                                        </div>
                                    </div>

                                </div>
                                <div>
                                    {(isLogin === true && dataUser !== undefined) ? <div onClick={onlogout} className="logout"><BiLogOut className="ic-user-model" /> ????ng xu???t</div> : null}

                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </>

    );
}

export default HeaderComponent;