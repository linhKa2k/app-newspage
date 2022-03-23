import React, { useEffect, useState } from 'react';
import UserManage from './adminpage/UserManage';
import PostManager from './adminpage/postmanager/PostManager';
import { useHistory, useParams, Link } from 'react-router-dom';
import CategoryManage from './adminpage/CategoryManage';
import { useSelector, useDispatch } from 'react-redux';
import { getuser, clearUserlogout } from '../redux/features/user/userSlice';
import io from 'socket.io-client';
import { websocket } from '../redux/features/socket/socket';
import '../css/adminpage.css';
import { postLogout } from '../redux/features/auth/authSlice';
import { BiUser, BiUserPin, BiSpreadsheet, BiReceipt, BiLogOut,BiHomeCircle,BiCaretDown } from "react-icons/bi";
import PostDeleted from './adminpage/postmanager/PostDeleted';
function AdminPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [cpn, setCpn] = useState('');
  const [showlist, setShowlist] = useState(false);
  const [showlistcategory, setShowlistcategory] = useState(false);
  const [showlistpost, setShowlistpost] = useState(false);
  const { dataUser } = useSelector((state) => state.user);
  const { isLogin } = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket.socket);

  useEffect(()=>{
    if(!socket) {
      const socket = io("http://localhost:3800")
      dispatch(websocket({ socket }));
    }
    if (isLogin) {
            dispatch(getuser()).then(res => {
              if(res.payload.results.role !== 'admin'){
                history.replace('/404-not-found')
              }
            })
    }else{
      history.replace('/404-not-found')
    }
},[isLogin]);

const onlogout = () => {
  dispatch(postLogout()).then(res => {
    dispatch(clearUserlogout())
    history.replace('/auth')
  })
}

  return (
    <div className="container-adminpage">
      <div className="header-admin">
        <div className="home-come-back">
          <button onClick={() => {onlogout()}}><BiLogOut className="ic-home-come-back"/>Đăng xuất</button>
        </div>
        {(isLogin === true && dataUser !== undefined) ?
        <div className="infor-admin">
        <div className="name-admin">
        <em>admin</em>
        <h3>{dataUser.name}</h3>
        </div>
        <div className="image-admin">
          <img src={dataUser.avatar}></img>
        </div>
      </div> : null
        }
      </div>
      <div className="manage-list">
        <h3 className="title-manage1">Quản lý</h3>
        <div className="manage-list-item">
          <div className="btn-user-manager">
            <button className="btn-list" onClick={() => setShowlistcategory(!showlistcategory)}><BiSpreadsheet className="icon-manage" /> Quản lý thể loại bài viết</button>
            <BiCaretDown className="icon-menu-category"/>
          </div>
          {showlistcategory === true ? <div className="list-item">
            <button onClick={() => setCpn('avalible')}> Danh sách thể loại</button>
            <button onClick={() => setCpn('unavalible')}>Danh sách thể loại hạn chế</button>
          </div> : null }
          <div className="btn-user-manager">
            <button className="btn-list" onClick={() => setShowlistpost(!showlistpost)}><BiSpreadsheet className="icon-manage" /> Quản lý Bài viết</button>
            <BiCaretDown className="icon-menu-category"/>
          </div>
          {showlistpost === true ? <div className="list-item">
            <button onClick={() => setCpn('postmanage')}>Danh sách bài viết</button>
            <button onClick={() => setCpn('postdeleted')}>Bài viết đã xóa</button>
          </div> : null }
          <div className="btn-user-manager">
          <button className="btn-list" onClick={() => setShowlist(!showlist)}><BiUserPin className="icon-manage" /> Quản lý người dùng</button>
          <BiCaretDown className="icon-menu"/>
          </div>
          {showlist === true ? <div className="list-item">
            <button onClick={() => setCpn('user')}> Danh sách người dùng</button>
            <button onClick={() => setCpn('censor')}>Quản lý cộng tác viên</button>
            <button onClick={() => setCpn('Pending')}>Tài khoản chưa xác thực</button>
            <button onClick={() => setCpn('false')}>Tài khoản bị khóa</button>
          </div> : null }
        </div>
      </div>
      <div className="manager-detail" >
        {cpn === '' ? <div className="manager-detail"><h1>Xin chào Admin !</h1></div> : null}
        {cpn === 'user' || cpn === 'censor' || cpn === 'false' || cpn === 'Pending' ? <UserManage value={cpn}/> : null}
        {cpn === 'postmanage'? <PostManager/> : null}
        {cpn === 'postdeleted'? <PostDeleted/> : null}
        {cpn === 'avalible' || cpn === 'unavalible' ? <CategoryManage value={cpn}/> : null}

      </div>
    </div>
  )
}

export default AdminPage;