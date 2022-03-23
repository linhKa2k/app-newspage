import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../css/postbycategory.css';
import { BiCubeAlt } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { getListPostNewAndViews } from '../redux/features/home/postsNewSlice';
import { getpostbycategory, clearStatepostbycategory } from "../redux/features/postbycategory/postbycategorySlice";
function Postsbycategory(props) {
    let history = useHistory();;
    const dispatch = useDispatch();
    const [page, setPage] = useState(2);
    const [loadmore, setLoadmore] = useState(true);
    const { idcategory } = useParams();
    const listCategory = useSelector((state) => state.category.listCategory);
    const listpostviews = useSelector((state) => state.postnewhome.datapostviews);
    const listpostbycategory = useSelector((state) => state.postbycategory.listpostbycategory);
    const total = useSelector((state) => state.postbycategory.total);
    const isLoading = useSelector((state) => state.postbycategory.isLoading);

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
        dispatch(clearStatepostbycategory())
        setLoadmore(true)
        setPage(2)
        window.scrollTo(0, 0);
        await dispatch(getpostbycategory({ idcategory, page: 1 })).then(res => {
            if (total === res.payload.datapost.length) {
                setLoadmore(false)
                dispatch(getListPostNewAndViews());
            } else {
                setLoadmore(true)

            }
        })
    }, [idcategory])

    const fetchData = async () => {
        if (total === listpostbycategory.length) {
            setLoadmore(false)
            dispatch(getListPostNewAndViews());
        } else {
            setLoadmore(true)
            setPage(page + 1)
            dispatch(getpostbycategory({ idcategory, page: page }))
        }
    }

    return (
        <>
            <div className='container-post-bycategory'>
                {isLoading && listpostbycategory.length === 0 ? <div className="loading-post-bycategory"></div> : <>
                    {listpostbycategory.length === 0 ? <>
                        <div className="no-post">
                            <p>Chưa có bài viết nào liên quan đến thể loại này</p>
                                </div>
                                <div className='related-post-bycategory'>
                                <div className='related-title'>
                                    <h3>Bài viết được nhiều đọc giả quan tâm</h3>
                                </div>
                                <div className='list-post-related'>
                                    {listpostviews.map((postview, index) => (
                                        <div key={index} className='post-bycategory-item' onClick={() => history.push(`/postdetail/${postview._id}`)}>
                                            <div className='img-post-bycategory'>
                                                <img src={postview.imagepost}></img>
                                                <p className='view-post-bycategory'>{postview.category.namecategory}</p>
                                                <p className='read-more-post-bycategory'>Xem thêm</p>
                                            </div>
                                            <div className='title-post-bycategory'>
                                                <h4>{postview.title}</h4>
                                                <p>{postview.description.slice(0, 90) + '...'}</p>
                                            </div>
                                            <div className='time-post-bycategory'>
                                                <em>thời gian đăng : {moment(postview.createAtpost).fromNow()}</em>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                    </>
                     :
                                <>
                                    <div className='name-category'>
                                        <h1>{listpostbycategory[0].category.namecategory}</h1>
                                    </div>
                                    <InfiniteScroll className="post-by-category-container"
                                        dataLength={listpostbycategory.length}
                                        next={fetchData}
                                        hasMore={loadmore}
                                        loader={<div className="loading-post-bycategory2"></div>}
                                        endMessage={<></>}
                                    >
                                        {listpostbycategory.map((post, index) => (
                                            <div onClick={() => history.push(`/postdetail/${post._id}`)} className='post-bycategory-item' key={index}>
                                                <div className='img-post-bycategory'>
                                                    <img src={post.imagepost}></img>
                                                    <p className='view-post-bycategory'>{post.views} lượt xem</p>
                                                    <p className='read-more-post-bycategory'>Xem thêm</p>
                                                </div>
                                                <div className='title-post-bycategory'>
                                                    <h4>{post.title}</h4>
                                                    <p>{post.description.slice(0, 300) + '...'}</p>
                                                </div>
                                                <div className='time-post-bycategory'>
                                                    <em>{moment(post.createAtpost).fromNow()}</em>
                                                </div>
                                            </div>
                                        ))}
                                    </InfiniteScroll>
                                </>}
                            </>}
                            {listpostbycategory.length === 0 ? null : <>
                            {loadmore ? null : <div className='related-post-bycategory'>
                                <div className='related-title'>
                                    <h3>Bài viết được nhiều đọc giả quan tâm</h3>
                                </div>
                                <div className='list-post-related'>
                                    {listpostviews.map((postview, index) => (
                                        <div key={index} className='post-bycategory-item' onClick={() => history.push(`/postdetail/${postview._id}`)}>
                                            <div className='img-post-bycategory'>
                                                <img src={postview.imagepost}></img>
                                                <p className='view-post-bycategory'>{postview.category.namecategory}</p>
                                                <p className='read-more-post-bycategory'>Xem thêm</p>
                                            </div>
                                            <div className='title-post-bycategory'>
                                                <h4>{postview.title}</h4>
                                                <p>{postview.description.slice(0, 90) + '...'}</p>
                                            </div>
                                            <div className='time-post-bycategory'>
                                                <em>thời gian đăng : {moment(postview.createAtpost).fromNow()}</em>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>}</>}


                        </div>
        </>
    );
}

                export default Postsbycategory;