import React, { useState, useEffect } from 'react';
import '../css/verificationcode.css';
import postApi from '../commons/axios/api/postApi';
import OtpInput from 'react-otp-input';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { postVerificationCode } from '../redux/features/auth/authSlice'
import { Overlay } from 'react-portal-overlay';
import { DialogContainer, dialog } from 'react-dialogify';
import { useHistory  } from 'react-router-dom';
function Verificationcode() {
  const dispatch = useDispatch()
  let history = useHistory();
  const [code, setCode] = useState('');
  const [showmodelforgot, setShowmodelforgot] = useState(false);
  const { isLoading } = useSelector((state) => state.auth);
  const email = history.location.state.account;
  const type = history.location.state.type;

  const showDialog = () => {
    dialog.success({
      title: 'Xác thực tài khoản thành công !',
      text: 'Bạn đã xác thực tài khoản thành công, bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.',
      btnText: 'Đồng ý',
      btnOnClick() { history.push(`/auth`); },
    });
  }

  const onVerificationCode = () => {
      dispatch(postVerificationCode({ code, email })).unwrap()
        .then((data) => {
          if (data.message === 'Đã xác thực tài khoản') {
            showDialog();
          } else {
            toast.error(data.message)
          }
        })
  }

  const checkcodeforgot = async () => {
    await postApi.checkCodeForgotPassword(email, code).then(res => {
      if(res.message === 'Mã xác thực không chính xác'){
          toast.info(res.message)
      }else{
        setShowmodelforgot(true)
      }
    })
  }


  return (


    <div className="background">
      {isLoading ? <div className="loader" width="500px" height="500px" ></div> : null}

      <Overlay className='overlay-verification'
                open={showmodelforgot}
                closeOnEsc={true}
            // onClose={() => setOpenmodeldelete(false)}
            >
              <div className='forgot-sucess'>
                    <h2>Thông báo</h2>
                    <p>Mật khẩu mới đã được gửi đến email của bạn, Vui lòng kiểm tra hộp thư !!</p>
                    <button onClick={() => history.replace(`/auth`)} >đồng ý</button>
              </div>
            </Overlay>

      <ToastContainer />
      <div className="container-code">
        <DialogContainer />
        <span className="title">Xác thực mã OTP</span>
        <span className="email">Vui lòng nhập mã vừa gửi tới email: {email}</span>
        <OtpInput className="input-otp"
          value={code}
          onChange={setCode}
          numInputs={6}
          isInputNum={true}
          inputStyle={{
            width: "40px",
            height: "50px",
          }}
          containerStyle={{
            margin: "20px auto",
            padding: "10px"
          }}
        />
        {/* <div>
          <span>bạn chưa nhận được mã ?</span> <button className="btn-resend">Gửi lại OTP</button>
        </div> */}
        {type === 'forgot' ? <button className="btn-varicode" disabled={code.length < 6} onClick={checkcodeforgot}>Xác thực</button> : <button className="btn-varicode" disabled={code.length < 6} onClick={onVerificationCode}>Xác thực</button>}
        

      </div>
      <div>
        <span className="credit">Sản phẩm tốt nghiệp của sinh viên</span>
      </div>
    </div>
  );
}

export default Verificationcode;