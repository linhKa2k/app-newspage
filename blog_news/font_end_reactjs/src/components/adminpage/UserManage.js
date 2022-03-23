import React, { useEffect, useState } from 'react';
import '../../css/usermanager.css';
import { BiSearchAlt, BiDotsVerticalRounded } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux';
import adminApi from '../../commons/axios/api/adminApi';
import { Formik, Form, Field } from 'formik';
import { BiXCircle } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
function UserManage(props) {
  const [listuser, setListuser] = useState([]);
  const [loadinguser, setLoadinguser] = useState(false);
  const [index, setIndex] = useState();
  const [option, setOption] = useState('');
  const [user, setUser] = useState({});
  const [showinfor, setShowinfor] = useState(false);
  const [showmodel, setShowmodel] = useState(false);
  const [namefilter, setNamefilter] = useState('');
  const { dataUser } = useSelector((state) => state.user);
  useEffect(async () => {
    window.scrollTo(0, 0);
    // document.getElementById("resert-form").reset();

    setLoadinguser(true)
    if (!dataUser) return;
    await adminApi.admingetuser(1, props.value, namefilter).then(res => {
      setListuser(res.datauser)
    });
    setLoadinguser(false)
  }, [dataUser, props.value, namefilter])


  const addCensor = async (id) => {
    await adminApi.addcensor(id).then(res => {
      listuser.splice(index, 1);
      switch (res.message) {
        case 'Đã thêm cộng tác viên':
          toast.success(res.message, {
            theme: "dark"
          })
          setShowinfor(false)
          break;
        case 'Chỉ được thêm tối đa 5 Cộng tác viên !':
          toast.info(res.message, {
            theme: "dark"
          })
          break;
      }
    })
  }

  const removeCensor = async (id) => {
    await adminApi.removeCensor(id).then(res => {
      listuser.splice(index, 1);
      setShowinfor(false)
      toast.success(res.message, {
        theme: "dark"
      })
    })
  }

  const verifiAccount = async (id) => {
    await adminApi.accountVerification(id).then(res => {
      listuser.splice(index, 1);
      setShowmodel(false)
      toast.success(res.message, {
        theme: "dark"
      })
    })
  }

  const unlockaccount = async (id) => {
    await adminApi.unlockaccount(id).then(res => {
      listuser.splice(index, 1);
      setShowinfor(false)
      toast.success(res.message, {
        theme: "dark"
      })
    })
  }
  const removeAccount = async (id) => {
    await adminApi.removeAccount(id).then(res => {
      listuser.splice(index, 1);
      setShowmodel(false)
      toast.success(res.message, {
        theme: "dark"
      })
    })
  }
  const lockAccount = async (id) => {
    await adminApi.lockAccount(id).then(res => {
      listuser.splice(index, 1);
      toast.success(res.message, {
        theme: "dark"
      })
      setShowinfor(false)
    })
  }

  return (
    <>
      <ToastContainer />
      {showinfor ? <div className="overlay-user-manager">
        <div className="infor-user-manager">
          <button className="button-close" onClick={() => setShowinfor(false)}><BiXCircle className="ic-close-btn" /></button>
          <div className="image-user-infor">
            <img src={user.avatar}></img>
            <div className="name-email-user-manager">

              <p>Tên người dùng:</p>
              <h3>{user.name}</h3>
            </div>
          </div>
          <div className="infor-detail-user-manage">
            <p>Thông tin tài khoản :</p>
            <p>Email  : {user.email}</p>
            <p>Số điện thoại : {user.phoneNumber === '' ? 'không có' : user.phoneNumber}</p>
            <p>chức vụ  : {user.chucvu}</p>
            <p>Ngày tham gia : {moment(user.createAcountAt).format('DD/MM/YYYY')}</p>
          </div>
          <div className="authorization-user">
            {user.chucvu === 'Cộng tác viên' ? <button onClick={() => removeCensor(user._id)}>Hủy chức Cộng tác viên</button> :
              <>
                {user.is_available === false ? <button onClick={() => unlockaccount(user._id)}>Mở khóa tài khoản</button> :
                  <>
                    <button onClick={() => addCensor(user._id)}>Thêm Cộng tác viên</button>
                    <button onClick={() => lockAccount(user._id)} >Khóa tài khoản</button>
                  </>
                }
              </>
            }
          </div>
        </div>
      </div> : null}

      {showmodel ? <div className="overlay-user-manager">
        <div className="model-delete">
          <div className="ask-model">
            <p>{option}</p>
          </div>
          <div className="ask-model-btn">
            <button onClick={() => { setShowmodel(false) }}>hủy</button>
            {option === 'Bạn có chắc chắn muốn xóa tài khoản này ?' ? 
             <button onClick={() => { removeAccount(user._id) }} >đồng ý</button> 
             : <button onClick={() => { verifiAccount(user._id) }} >đồng ý</button> }
          </div>
        </div>
      </div> : null}
      <div className='user-manager-container'>
        {props.value === 'user' ? <h3 className="title-user-manager">Danh sách người dùng</h3> : null}
        {props.value === 'censor' ? <h3 className="title-user-manager">Quản lý Cộng tác viên</h3> : null}
        {props.value === 'false' ? <h3 className="title-user-manager">Quản lý tài khoản bị khóa</h3> : null}
        {props.value === 'Pending' ? <h3 className="title-user-manager">Quản lý tài khoản chưa xác thực</h3> : null}

        <div className="search-div">
          <Formik
            enableReinitialize={true}
            initialValues={{ search: '' }}
            onSubmit={values => {
              setNamefilter(values.search)
            }}
          >
            <Form id='resert-form'>
              <Field className="search-user-manager" name="search" autocomplete="off" type="text" placeholder="Nhập tên người dùng tìm kiếm" />
            </Form>
          </Formik>
        </div>
        <div className="list-user">
          {loadinguser ? <div width="20px" height="100px" className="load-more-ic" /> :
            <>
              {listuser.length <= 0 ? <div><p>không có tài khoản nào để hiển thị</p></div> : <>
                {listuser.map((account, index) => (
                  <div className="list-user-item" key={index}>
                    <div className="img-item-list-user">
                      <img src={account.avatar}></img>
                    </div>
                    <div className="infor-user-item">
                      <div className="name-user">
                        <h3>{account.name}</h3>
                        {account.chucvu === "Cộng tác viên" ? <span className="role-user">Cộng tác viên</span> : null}
                      </div>
                      <span>email: {account.email}</span>
                    </div>
                    <div className="model-item-list-user">
                      {account.status === 'Pending' ? 
                      <> 
                      <button onClick={() => {setOption('Tài khoản này sẽ có thể đăng nhập vào trang web sau khi được xác thực') ; setShowmodel(true) ; setUser(account); setIndex(index)}}>Kích hoạt tài khoản</button> 
                      <button onClick={() => { setOption('Bạn có chắc chắn muốn xóa tài khoản này ?') ;setShowmodel(true); setUser(account); setIndex(index) }}>Xóa tài khoản</button> 
                      </> : null}
                      {account.status === 'Active' ? <button onClick={() => { setShowinfor(true); setUser(account); setIndex(index) }}>thông tin Tài khoản</button> : null}

                    </div>
                  </div>
                ))}
              </>}
            </>}
        </div>
      </div>
    </>
  )
};

export default UserManage;