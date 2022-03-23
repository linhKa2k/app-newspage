import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, Link } from 'react-router-dom';
import '../css/browsingpage.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import postApi from '../commons/axios/api/postApi';
import { BiXCircle } from "react-icons/bi";
import { Overlay } from 'react-portal-overlay';
import moment from 'moment';

function BrowsingPage() {
    const history = useHistory();
    const [viewdetails, setViewdetails] = useState(false);
    const [showmodel, setShowmodel] = useState(false);
    const [showmodelappro, setShowmodelnoappro] = useState(false);
    const [idpost, setIdpost] = useState('');
    const [selectoption, setSelectoption] = useState('');
    const [indexlist, setIndexlist] = useState('');
    const [datapostpending, setDatapostpending] = useState([]);
    const [detailpostpending, setDetailpostpending] = useState();
    const [isloading, setIsLoading] = useState(false);
    const { dataUser } = useSelector((state) => state.user);
    const { isLogin } = useSelector((state) => state.auth);
    const listCategory = useSelector((state) => state.category.listCategory);
    const { isSuccess } = useSelector((state) => state.user);
    const [categoryid, setCategoryid] = useState('');
    const Categories = listCategory.map((category) => {
        const { _id, namecategory } = category;
        return (
            <option key={_id} value={_id}>{namecategory}</option>
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

    const approve = async (idpost, index) => {
        await postApi.postapprovePost(idpost).then(result => {
            switch (result.message) {
                case 'Đã duyệt bài viết':
                    toast.success(result.message, {
                        theme: "dark"
                    })
                    setDetailpostpending(datapostpending.splice(index, 1))
                    setIndexlist('')
                    setIdpost('')
                    break;
                case 'Bài viết không tồn tại hoặc đã được cộng tác viên khác xử lý':
                    toast.info(result.message, {
                        theme: "dark"
                    })
                    setDetailpostpending(datapostpending.splice(index, 1))
                    setIndexlist('')
                    setIdpost('')
                    break;
                default: 
                    toast.info('Bài viết không tồn tại hoặc đã được cộng tác viên khác xử lý', {
                    theme: "dark"
                    })
                    setDetailpostpending(datapostpending.splice(index, 1))
                    setIndexlist('')
                    setIdpost('')
            }
        })

    }

    const unapprove = async (index) => {
        if (selectoption === '') {
            toast.info('Vui lòng chọn lý do hủy yêu cầu duyệt bài', {
                theme: "dark"
            })
        } else {
            await postApi.unapprovePost(selectoption, idpost).then(result => {
                if (result.message === 'Đã hủy yêu cầu đăng bài bài viết') {
                    toast.success(result.message, {
                        theme: "dark"
                    })
                    setDetailpostpending(datapostpending.splice(index, 1))
                    setSelectoption('')
                    setIndexlist('')
                    setIdpost('')
                    setShowmodelnoappro(false)
                }else{
                    toast.info(result.message, {
                        theme: "dark"
                    })
                    setDetailpostpending(datapostpending.splice(index, 1))
                    setSelectoption('')
                    setIndexlist('')
                    setIdpost('')
                    setShowmodelnoappro(false)
                }

            })
        }
    }

    useEffect(async () => {
        window.scrollTo(0, 0);
        setIsLoading(true)
        if (isLogin === false) {
            history.replace('/home')
            return;
        }
        if (isSuccess === false) return;
        if (dataUser.role !== 'censor') {
            history.replace('/404-not-found')
            return;
        }
        await postApi.getPostPending(categoryid).then((res) => {
            setDatapostpending(res.data)
        })
        setIsLoading(false)
    }, [dataUser, isLogin, categoryid])

    return (
        <div className="browsing-page">
            <Overlay className='overlay-profile'
                open={viewdetails}
                closeOnEsc={true}
            >
                <div className="detail-post-browsing-page" >
                    <div className="model">
                        <div className="detail">
                            {detailpostpending && <>
                                <button className="close-btn" onClick={() => setViewdetails(false)}><BiXCircle className="ic-close-btn" /></button>
                                <h3>Nội dung bài viết</h3>
                                <div className="content-post-brosing">
                                    <div className="ql-editor" dangerouslySetInnerHTML={{
                                        __html: detailpostpending.content
                                    }}></div>
                                </div>
                            </>}
                        </div>

                    </div>

                </div>
            </Overlay>

            <ToastContainer />
            <Overlay className='overlay-profile'
                open={viewdetails}
                closeOnEsc={true}
            // onClose={() => setOpenmodeldelete(false)}
            >
                <div className="detail-post-browsing-page" >
                    <div className="model">
                        <div className="detail">
                            {detailpostpending && <>
                                <button className="close-btn" onClick={() => setViewdetails(false)}><BiXCircle className="ic-close-btn" /></button>
                                <h3>Nội dung bài viết</h3>
                                <div className="content-post-brosing">
                                    <div className="ql-editor" dangerouslySetInnerHTML={{
                                        __html: detailpostpending.content
                                    }}></div>
                                </div>
                            </>}
                        </div>

                    </div>

                </div>
            </Overlay>
            <Overlay className='overlay-profile'
                open={showmodel}
                closeOnEsc={true}
            >
                <div className='ask-brosing'>
                    <div className='notifi-brosing'>
                        <h2>Duyệt bài viết</h2>
                    </div>
                    <p>Bạn có đồng ý duyệt bài viết này ?</p>
                    <div className='btn-brosing-model'>
                        <button onClick={() => setShowmodel(false)}>Hủy</button>
                        <button onClick={() => { approve(idpost, indexlist); setShowmodel(false) }}>Đồng ý</button>
                    </div>
                </div>
            </Overlay>

            <Overlay className='overlay-profile'
                open={showmodelappro}
                closeOnEsc={true}
            >
                <div className='ask-unbrosing'>
                    <div className='notifi-brosing'>
                        <h2>Hủy yêu cầu đăng bài</h2>
                    </div>
                    {/* <p>Lý do hủy yêu cầu đăng bài viết này ?</p> */}

                    <div className='choose-radio'>
                        <label><input onChange={() => { setSelectoption('nội dung có chứa từ nghữ thô tục') }} type="radio" value="Nội dung có chứa từ nghữ thô tục" name="option" />Nội dung có chứa từ nghữ thô tục</label>
                        <label><input onChange={() => { setSelectoption('chia sẻ nội dung không phù hợp') }} type="radio" value="Chia sẻ nội dung không phù hợp" name="option" />Chia sẻ nội dung không phù hợp </label>
                        <label><input onChange={() => { setSelectoption('có chứa nội dung spam') }} type="radio" value="Nội dung spam" name="option" />Nội dung spam</label>
                        <label><input onChange={() => { setSelectoption('ngôn từ kích động') }} type="radio" value="Ngôn từ kích động" name="option" />Ngôn từ kích động</label>
                    </div>
                    <div className='btn-brosing-model'>
                        <button onClick={() => setShowmodelnoappro(false)}>Hủy</button>
                        <button onClick={() => { unapprove(indexlist) }}>Đồng ý</button>
                    </div>

                </div>
            </Overlay>

            <div className="container-browsing-page">
                <div className="unap-title-filter">
                    <h2 className="unap-title">Bài viết chưa được duyệt</h2>
                    <div className="filter">
                        <p className="filter-category">Lọc theo thể loại : </p>
                        <select value={categoryid} onChange={event => setCategoryid(event.target.value)} className="select-filter">
                            <option value="">Chọn thể loại</option>
                            {Categories}
                        </select>
                    </div>
                </div>
                <div className="list-browsing-page">
                    {isloading ? <div className="loading-post-browsing"></div> : <>
                        {Array.isArray(datapostpending) && datapostpending.length ? <>
                            {datapostpending.map((post, index) => (
                                <div className="list-item-browsing-page" key={index}>
                                    <div className="img-item-browsing-page">
                                        <img src={post.imagepost}></img>
                                    </div>
                                    <div className="infor-item-browsing-page">
                                        <h3>{post.title}</h3>
                                        <p>Người đăng: {post.poster.name}</p>
                                        <p>Thể loại: {post.category.namecategory}</p>
                                        <p>Yêu cầu lúc : {moment(post.createdAt).fromNow()}</p>

                                        <div className="browse-and-view-details">
                                            <button id="previewbtn" className="preview-details" onClick={() => { setViewdetails(true); setDetailpostpending(post) }}>Xem trước</button>
                                            <button onClick={() => { setShowmodelnoappro(true); setIdpost(post._id); setIndexlist(index) }}>Hủy yêu cầu</button>
                                            <button onClick={() => { setShowmodel(true); setIdpost(post._id); setIndexlist(index) }}>Duyệt bài</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </> : <h3 className="no-post-browsing">Không có bài viết nào</h3>}
                    </>}
                </div>
            </div>

        </div>
    );
}

export default BrowsingPage;