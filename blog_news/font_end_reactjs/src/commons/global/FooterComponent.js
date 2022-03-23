import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../../css/footer.css';
import { useSelector, useDispatch } from 'react-redux';
import { getuser, clearUserlogout } from '../../redux/features/user/userSlice';
import { getCategories } from '../../redux/features/category/categorySlice';
import { postLogout } from '../../redux/features/auth/authSlice';
import { BiCog, BiHighlight, BiChevronDown, BiPencil, BiBell, BiUserCircle, BiLogOut, BiBookOpen, BiTagAlt } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import { Formik, Form, Field } from 'formik';
import io from 'socket.io-client';
import { websocket } from '../../redux/features/socket/socket';
import moment from 'moment';
import postApi from '../axios/api/postApi';
const FooterComponent = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    const listCategory = useSelector((state) => state.category.listCategory);

    return (
        <>
        <div className='footer-container'>
            <div className='container-footer'>
            <div className='infor-web' >
                <img className='logo-footer' src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Blogger_logo.svg/1200px-Blogger_logo.svg.png' ></img>
                <p className='review-web'>Trang thông tin chia sẻ kiến thức hay mỗi ngày, Hãy cùng nhau chia sẻ ý tưởng của bạn, mọi người sẽ cùng cho bạn những góp ý thiết thực nhất.</p>
                <div className='contact'>
                    <p className='title-contact'>Email :</p>
                    <p className='email-contact'>Blogchiasekienthuc@gmail.com</p>
                    <div>
                    <p className='title-contact'>Facebook :</p>
                    <a href='https://www.facebook.com/caoquocdat12092001/' className='email-contact'>My Facebook</a>
                    </div>
                    <div>
                    <p className='title-contact'>Phone number :</p>
                    <p className='email-contact'>0354492575</p>
                    </div>
                </div>
            </div>
            <div className='category-footer' >
                <div className='title-category-footer'>
                    <h3>thể loại</h3>
                </div>
                <div className='listcategory-footer'>
                    {listCategory.map((category, index) => (
                        <Link key={index} to={`/postsbycategory/${category._id}`} className='category-item-footer'>{category.namecategory}</Link>
                    ))}
                </div>
            </div>

            </div>
        </div>
        </>

    );
}

export default FooterComponent;