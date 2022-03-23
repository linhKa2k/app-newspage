import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import '../css/home.css'
import { useSelector, useDispatch } from 'react-redux';
import { getListPostByCategory } from '../redux/features/home/postsByCategorySlice';
import { getListPostNewAndViews } from '../redux/features/home/postsNewSlice';
import { NewsHeaderCard } from 'react-ui-cards';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';
import { FiCodesandbox } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import moment from 'moment';
function Home() {
    let history = useHistory();
    const dispatch = useDispatch();
    const loadingpostnew = useSelector((state) => state.postnewhome.isLoading);
    const loadingpostcategory = useSelector((state) => state.postbycategoryhome.isLoading);
    const listpostnew = useSelector((state) => state.postnewhome.datapostnew);
    const listpostviews = useSelector((state) => state.postnewhome.datapostviews);
    const listbycategory = useSelector((state) => state.postbycategoryhome.data);


    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getListPostByCategory());
        dispatch(getListPostNewAndViews());
    }, []);


    return (
        <div>
                <div className="home">
                {loadingpostnew && loadingpostcategory ? <div width="500px" height="500px" className="home-loader" /> : <>
                    <div className="body-container">
                        <div>
                            <div className="list-category-new1">
                                <h2 className="post-category" > <FiCodesandbox className="icon-category" />Bài đăng mới nhất</h2>
                            </div>

                            <div className="post-by-category-new-header">
                                {listpostnew.map((post, index) => (
                                    <div key={index} className="post-by-category-item" onClick={() => history.push(`/postdetail/${post._id}`)}>
                                        <img src={post.imagepost}></img>
                                        <div className="title-post-by-category">
                                            <div className="inforpost-by-category">
                                                <h3>{post.category.namecategory}</h3>
                                                <div className="title-desc-new">
                                                    <h2>{post.title}</h2>
                                                    <p>{post.description.slice(0,90) + "..."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="body-container2">
                        <div className="listpost">
                            {listbycategory.map((category, index) => (
                                <div key={index} className="list-item-new">
                                    <div className="list-category-new">
                                        <h2 className="post-category" > <FiCodesandbox className="icon-category" /> {category.namecategory}</h2>
                                    </div>
                                    <div className="post-list-category">
                                        {category.listpost.map((postcategory,index) => (
                                            <div key={index} className="post-list-category-item" onClick={() => history.push(`/postdetail/${postcategory._id}`)}>
                                                <div className='image-post-new-cateory'>
                                                <img className="post-img-category" src={postcategory.imagepost}></img>
                                                <p className='views-post-new-cateory'>{postcategory.views} lượt xem</p>
                                                </div>
                                                <div className="infor-post">
                                                    <h2 className="post-title-category" >{postcategory.title.slice(0, 100)}</h2>
                                                    <p className="post-desc-category">{postcategory.description.slice(0, 70) + "..."}</p>
                                                    {/* <p className="post-day-category" >{moment(postcategory.createAtpost).format('DD/MM/YYYY')}</p> */}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    <div className="load-more-category-new" onClick={() => history.push(`/postsbycategory/${category._id}`)}>
                                        <h5>Xem thêm</h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="most-view">
                        <h3 className="header-most-view">Xem nhiều nhất</h3>
                            <div className="list-post-viewest">
                           
                                {listpostviews.map((postview, index) => (
                                    <div className="post-most-view" key={index} onClick={() => history.push(`/postdetail/${postview._id}`)}>
                                        <img className="img-post-most-view" src={postview.imagepost}></img>
                                        <h4>{postview.category.namecategory}</h4>
                                        <div className='infor-post-most-view'>
                                            <div className="view-post-most-view">{postview.views} <AiOutlineEye /></div>
                                            <h3>{postview.title}</h3>
                                        <p className="desc-post-most-view">{postview.description.slice(0,90) + '...'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                    </>}
                </div>
        </div>
    );
}

export default Home;