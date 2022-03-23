import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import postApi from '../commons/axios/api/postApi';
import { getComment, clearStatecmt, createCmt } from '../redux/features/comments/commentSlice';
import commentService from '../redux/features/comments/commentService';
import '../css/postdetails.css';
import 'react-quill/dist/quill.snow.css';
import '../../node_modules/react-quill/dist/quill.snow.css';
import { HiThumbUp } from "react-icons/hi";
import { BiChevronsRight, BiMessageRounded, BiPaperPlane, BiChevronDownCircle, BiX } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { Formik, Form, Field } from 'formik';
import { getListPostNewAndViews } from '../redux/features/home/postsNewSlice';
import moment from 'moment';
import parse from 'html-react-parser';
import { ToastContainer, toast } from 'react-toastify';
function PostDetail() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [page, setPage] = useState(2);
    const { idpost } = useParams();
    const [likepending, setLikepending] = useState(false);
    const [post, setPost] = useState();
    const [postbyposter, setPostbyposter] = useState();
    const [asklogin, setAsklogin] = useState(false);
    const [likecount, setLikecount] = useState();
    const [relatedpost, setRelatedpost] = useState([]);
    const [checkliked, setCheckliked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const { isLogin } = useSelector((state) => state.auth);
    const listcomment = useSelector((state) => state.comments.listcomment);
    const { isLoading } = useSelector((state) => state.comments);
    const total = useSelector((state) => state.comments.total);
    const socket = useSelector((state) => state.socket.socket);
    const { dataUser } = useSelector((state) => state.user);
    const { isSuccess } = useSelector((state) => state.user);
    const listpostviews = useSelector((state) => state.postnewhome.datapostviews);
    var localeData = moment.updateLocale('en', {
        relativeTime: {
            future: "in %s",
            past: "%s ",
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
        if (!idpost || !socket) return;
        socket.emit("joinRoom", idpost)
        return () => {
            socket.emit("outRoom", idpost)
        }
    }, [socket, idpost])

    useEffect(async () => {
        window.scrollTo(0, 0);
        setCheckliked(false)
        if (isLogin === true && dataUser.length <= 0) return;
        setLoading(true)
        await postApi.getpostbyid(idpost, dataUser._id).then(res => {
            if (res.post) {
                setPost(res.post)
                postApi.getPostbyposter(res.post.poster._id).then(result => {
                    setPostbyposter(result.listpostbyposter)
                } )
                dispatch(getListPostNewAndViews());
                setLikecount(res.post.likecount)
                setCheckliked(res.checkidlike)
                // postApi.getpostbycategory(res.post.category._id).then(respone => {
                //     setRelatedpost(respone.datapost)
                //     console.log('respone',respone)
                // });
                postApi.getrelatedpost(res.post.category._id, idpost).then(respone => {
                    setRelatedpost(respone.datapost)
                });
                dispatch(clearStatecmt())
                dispatch(getComment({ id: idpost, page: 1 }))
                setLoading(false)
            }
            else {
                history.replace('/404-not-found')
            }
        });
        setTimeout(() => {
            postApi.postincreaseviews(idpost)
        }, 10000);
    }, [idpost, dataUser]);

    const postComment = async (content) => {
        await commentService.postCreateComment(idpost, content).then(res => {
            if (res.message === 'Bài viết không tồn tại hoặc đã bị xóa') {
                toast.error(res.message)
            }
        })
    };

    const loadMoreCmt = () => {
        setPage(page + 1)
        dispatch(getComment({ id: idpost, page }))
    }

    const likePost = async () => {
        if (!isLogin) {
            setAsklogin(true)
        } else {
            setLikepending(true)
            await postApi.postLike(idpost).then(res => {
                if (res.message) {
                    toast.error(res.message)
                    return;
                }
                setCheckliked(res.liked)
                if (res.liked) {
                    setLikecount(Number(likecount) + 1)
                    setDisable(false);
                } else {
                    setLikecount(Number(likecount) - 1)
                    setDisable(true);
                }
                setLikepending(false)
            })
        }
    }

    return (
        <>
            {asklogin ?
                <div className='ask-login'>
                    <div onClick={() => { setAsklogin(false) }}><BiX className='close-model-login' /></div>
                    <div className='model-login'>
                        <p>Để tương tác bài viết bạn cần đăng nhập, nếu bạn đã có tài khoản vui lòng đăng nhập tài khoản của bạn</p>
                        <button onClick={() => {history.push(`/auth?postdetail/${idpost}`)}}>đăng nhập</button>
                    </div>
                </div>
                : null}
            {loading ? <div width="500px" height="500px" className="fp-loader" /> :
                <div className="container-post-details">

                    <ToastContainer />
                    <div className="details-post">
                        {post &&
                            <div>
                                <div className="header-post">
                                    <div className="div-title">
                                        <h1 className="title-details">{post.title}</h1>
                                    </div>
                                    <div className="div-infor-post">
                                        <div className="day-submit">
                                            <p>Ngày đăng : {moment(post.createAtpost).format('DD/MM/YYYY')}</p>
                                        </div>
                                        <div className="poster-details">
                                            <p> Tác giả: {post.poster.name}</p>
                                        </div>
                                    </div>
                                    <div className="like-action">
                                        <span>{post.views} <AiOutlineEye className="views-icon" /></span>
                                        <span>{likecount} <HiThumbUp className="likecount-icon" /></span>

                                        {checkliked ? <button className="btnlike" disabled={likepending} onClick={likePost}> Đã thích </button> :
                                            <button className="btnlike" onClick={likePost} disabled={disable} >Thích <HiThumbUp className="like-icon" /></button>}

                                    </div>
                                </div>
                                <div className='content-post-detail'>
                                <p className="desc-details">{post.description}</p>
                                <div className='ql-post-detail'>
                                <div className="ql-editor" dangerouslySetInnerHTML={{
                                    __html: post.content
                                }}></div>
                                </div>
                                </div>
                            </div>
                        }
                        <div className="comment-header">
                            <div className="comment-title">
                                {listcomment && <h3> <BiMessageRounded /> Bình luận ({total})</h3>}
                            </div>
                        </div>
                        {isLogin ?
                            <Formik
                                initialValues={{ comment: '' }}
                                onSubmit={(values, { resetForm }) => {
                                    postComment(values.comment);
                                    resetForm();
                                }}
                            >
                                {({ values }) => (
                                    <Form>
                                        <div className="make-comments">
                                            <div className="input-cmt">
                                                {/* <textarea name="comment" placeholder="Bạn nghĩ gì về bài viết..."></textarea> */}
                                                <Field name="comment" as="textarea" rows="2" placeholder="Bạn nghĩ gì về bài viết..." />
                                            </div>
                                            <div className="submit-button">
                                                <button disabled={values.comment.length === 0} type="submit">Bình luận <BiPaperPlane className="ic-send-cmt" /></button>
                                            </div>
                                        </div>
                                    </Form>)}
                            </Formik> : <em><Link className="login-detail-post" to={`/auth?postdetail/${idpost}`}>Đăng nhập</Link> để bình luận bài viết</em>}
                        {listcomment && <>
                            {listcomment.length <= 0 ? <div className="show-comment"><p className="no-comment">Chưa có bình luận nào, hãy là người đầu tiên bình luận</p></div> :

                                <div className="show-comment">

                                    {listcomment.map((comment, index) => (
                                        <div className="cmt" key={index}>
                                            <div className="img-commenters">
                                                <img src={comment.user.avatar}></img>
                                            </div>
                                            <div className="content-cmt">
                                                <div className="infor-commenters">
                                                    <p className='name-user-detailpost'>{comment.user.name}</p>

                                                    {post && <>
                                                        {comment.user._id === post.poster._id ? <p className="position-user">tác giả</p> : null}
                                                    </>}

                                                </div>
                                                <p className="content-commenters">{comment.content}</p>
                                                <p className="time-cmt">{moment(comment.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                    ))
                                    }
                                    {total === listcomment.length ? null : <> {isLoading ? <div width="20px" height="100px" className="load-more-ic" /> : <p onClick={loadMoreCmt} className="load-more-cmt" >Xem thêm bình luận <BiChevronDownCircle /></p>}</>}

                                </div>}</>}
                        {postbyposter && 
                        <div className='post-by-poster'>
                            <div className='title-posterr'>
                                <p>Bài viết cùng tác giả</p>
                            </div>
                            <div className='list-post-by-poster'>
                                {postbyposter.map((postbyposter, index) => (
                                     <div className='post-bt-poster-item' key={index} onClick={() => history.push(`/postdetail/${postbyposter._id}`)}>
                                     <div className='img-post-by-poster'>
                                         <img src={postbyposter.imagepost}></img>
                                     </div>
                                     <p className='title-post-by-poster'>{postbyposter.title}</p>
                                 </div>
                                ))}
                            </div>

                        </div>}
                    </div>
                    <div className="related">
                        {relatedpost.length === 0 ? null :
                            <div className="related-posts">
                                <div className='blog-title'>
                                    <p>Bài viết cùng thể loại</p>
                                </div>
                                <div className='post-list-related'>
                                    {relatedpost &&
                                        relatedpost.map((postrelate, index) => (
                                            <div className="post-related" key={index} onClick={() => history.push(`/postdetail/${postrelate._id}`)}>
                                                <div className="img-post-related">
                                                    <img src={postrelate.imagepost}></img>
                                                </div>
                                                <div className="title-post-related">
                                                    <p>{postrelate.title}</p>
                                                    {/* <em>đăng ngày: 22/24/3444</em> */}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="read-more">
                                    <p onClick={() => history.push(`/postsbycategory/${post.category._id}`)}>Xem thêm <BiChevronsRight /></p>
                                </div>

                            </div>}

                        <div className='other'>
                            <div className='blog-title'>
                                <p>Top bài viết nhiều người đọc</p>
                            </div>
                            <div className='list-post-top'>
                                {listpostviews.map((postview, index) => (
                                    <div className='post-top-view-item-detail' key={index} onClick={() => history.push(`/postdetail/${postview._id}`)}>
                                        <div className='img-top-view-detail'>
                                            <img src={postview.imagepost}></img>
                                            <p className='category-post-top-views'>{postview.category.namecategory}</p>
                                        </div>
                                        <div className='detail-post-top-view-detail'>
                                            <p className='title-post-top-view-detail'>{postview.title}</p>
                                            <div className='interactions-post-top-view'>
                                                <p>{postview.views} lượt xem</p>
                                                <p>2 <HiThumbUp className='ic-top-post' /></p>
                                            </div>
                                        </div>

                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            }
        </>
    );
}

export default PostDetail;