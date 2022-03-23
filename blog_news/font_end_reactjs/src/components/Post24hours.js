import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../css/post24hours.css';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AiOutlineEye } from "react-icons/ai";
import { HiThumbUp } from "react-icons/hi";
import { BiChevronsRight, BiMessageRounded, BiPaperPlane, BiChevronDownCircle } from "react-icons/bi";
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import postApi from '../commons/axios/api/postApi';

function Post24hours(props) {
    let history = useHistory();;
    const dispatch = useDispatch();
    const location = useLocation();

    return (
        <div className='post-25hours-container'>
            <h1>24 giờ qua</h1>
        </div>
        
    );
}

export default Post24hours;