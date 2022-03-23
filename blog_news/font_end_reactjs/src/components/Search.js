import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../css/search.css';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AiOutlineEye } from "react-icons/ai";
import { HiThumbUp } from "react-icons/hi";
import { BiChevronsRight, BiMessageRounded, BiPaperPlane, BiChevronDownCircle } from "react-icons/bi";
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import postApi from '../commons/axios/api/postApi';

function Search(props) {
    let history = useHistory();;
    const dispatch = useDispatch();
    const location = useLocation();
    const [value, setValue] = useState('');
    const [listpost, setListpost] = useState([]);
    const [listposttopview, setListposttopview] = useState([]);
    const [page, setPage] = useState(2)
    const [hasmore, setHasmore] = useState(true)
    const [isloading, setIsloading] = useState(false)
    const [loadingresult, setLoadingresult] = useState(false)
    useEffect(async () => {
        window.scrollTo(0, 0);

        if(listposttopview.length === 0){
            setIsloading(true)
            await postApi.getPostTopView().then(res => {
                console.log(res.listtopview)
                setListposttopview(res.listtopview)
                setIsloading(false)
            })
        }

        if (!location.search) return;
        setHasmore(true)
        setLoadingresult(true)
        setPage(2)
        await postApi.getpostsearch(queryString.parse(location.search).v.replace(/-/g, ' '), 1).then(result => {
            setValue(queryString.parse(location.search).v.replace(/-/g, ' '))
            if(result.listsearch.length < 5){
                setHasmore(false)
            }
            setListpost([])
            setListpost(result.listsearch)
            setLoadingresult(false)

        })
    }, [location])

    const fetchData = async () => {
        setPage(Number(page + 1))
        await postApi.getpostsearch(queryString.parse(location.search).v.replace(/-/g, ' '), page).then(result => {
            if(result.listsearch.length < 5 || listpost > 10){
                setHasmore(false)
            }
            let array = listpost.concat(result.listsearch)
            setListpost(array)
        })  
    }

    return (
        <>
        <div className='search-container'>
        {isloading ? <div className='overlay-loading-search'></div>: 
        <>
            
            <div className='search-result-container'>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ search: value }}
                        onSubmit={(values) => {
                            history.replace(`/search?v=${values.search.trim().replace(/\s+/g, '-').toLowerCase()}`)
                            setValue(values.search)
                        }}
                    >
                        <Form className='input-container'>
                            <Field className="input-search" name="search" autocomplete="off" type="text" placeholder="" />
                            <button type='submit' className='btn-search'>tìm kiếm</button>
                        </Form>
                    </Formik>
                </div>
                {value === '' ? null : <h5 className='value-search'>Kết quả tìm kiếm : {value}</h5>}
                <div className='list-result-search'>
                    {loadingresult ? <div className="loading-post-search"></div> : <>
                    {listpost.length === 0 ? <p className='no-result-search'>Không có bài viết nào phù hợp</p> :
                        <InfiniteScroll className="scoll-list-search"
                                dataLength={listpost.length}
                                next={fetchData}
                                hasMore={hasmore}
                                loader={<div className="loading-post-search"></div>}
                                endMessage={<p></p>}

                            >
                        {listpost.map((post, index) => (
                            <div className='item-resule-search' key={index} onClick={() => history.push(`/postdetail/${post._id}`)}>
                            <div className='item-img-result'>
                                <img src={post.imagepost}></img>
                            </div>
                            <div className='detail-item-search'>
                                <h3>{post.title.slice(0, 70)}</h3>
                                <div className='poster-time-result'>
                                    <p className='poster-result-search'>Tác giả : {post.poster === null ? 'anonymous': `${post.poster.name}`}</p>
                                    <em className='view-result-search'><AiOutlineEye /> {post.views} lượt xem</em>
                                </div>
                                <div className='desc-result-search'>
                                    <p>{post.description.slice(0, 150) + "..."}</p>
                                </div>
                            </div>
                        </div>
                        ))}
                        </InfiniteScroll>
                        }
                        </>}
                </div>
            </div>
            <div className='other-result'>
                <div className='top-blog-title'>
                    <p>Top bài viết nhiều người đọc</p>
                </div>
                <div className='list-post-top-view'>
                    {listposttopview.map((post,index) => (
                        <div className='post-top-view-item' key={index} onClick={() => history.push(`/postdetail/${post._id}`)}>
                        <div className='img-top-view'>
                            <img src={post.imagepost}></img>
                            <p className='category-post-top-view'>{post.category.namecategory}</p>
                        </div>
                            <div className='detail-post-top-view'>
                                <p className='title-post-top-view'>{post.title}</p>
                                <div className='interactions-post-top-view'>
                                    <p>{post.views} lượt xem</p>
                                    <p>{post.likecount} <HiThumbUp className='ic-top-post'/></p>
                                </div>
                            </div>

                    </div>
                    ))}
                </div>
            </div></>}
            
        </div></>
    );
}

export default Search;