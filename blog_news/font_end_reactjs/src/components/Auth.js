import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/auth.css';
import postApi from '../commons/axios/api/postApi';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { postLogin, clearState, postRegister, postRenderOtp } from '../redux/features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { valid } from '../commons/validate/validateForm';
import { Overlay } from 'react-portal-overlay';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Login() {
  let history = useHistory();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { email } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.auth);
  const { isLogin } = useSelector((state) => state.auth);
  const [showmodel, setShowmodel] = useState(false);
  const url = history.location.search.replace('?', '/');

  useEffect(() => {
    if (isLogin) {
      history.push(url)
    }
  }, []);

  const onBtnDialog = () => {
    dispatch(postRenderOtp({ email })).unwrap()
      .then((data) => {
        if (data.message === 'Đã gửi mã otp xác thực') {
          history.push({
            pathname: '/verificationcode',
            state: { account: email },
          })
        }
      })
  }

  const onRegister = (values) => {
    const { name, email, password } = values;
    dispatch(postRegister({ name, email, password })).unwrap()
      .then((data) => {
        switch (data.message) {
          case 'đăng kí thành công':
            history.push({
              pathname: '/verificationcode',
              state: { account: email, type: 'register' },

            })
            break;
          default:
            toast.warn(data.message)
            break;
        }
      })
  }


  const onlogin = (values) => {
    const { email, password } = values;
    dispatch(postLogin({ email, password })).unwrap()
      .then((data) => {
        switch (data.message) {
          case 'đăng nhập thành công':
            history.push(url);
            break;
          case 'admin':
            history.push('/admin');
            break;
          case 'tài khoản chưa được xác thực':
            setOpen(true)
            break;
          default:
            toast.warn(data.message)
            break;
        }
      })
  };
  const singup = () => {
    document.getElementById('container').classList.add("right-panel-active");
    dispatch(clearState());

  };
  const signin = () => {
    document.getElementById('container').classList.remove("right-panel-active");
    dispatch(clearState());
  };

  const forgotpass = async (email) => {
    await postApi.forgotPassword(email).then(res => {
      console.log(res)
      if(res.message === 'Địa chỉ email không tồn tại'){
          toast.warn(res.message)
      }else{
        setShowmodel(false)
        history.push({
          pathname: '/verificationcode',
          state: { account: email, type: 'forgot' },

        })
      }
    })
  }


  return (
    <>
      <Dialog
        open={open}
        className="dialog-verifi"
      >
        <DialogTitle>
          {"Tài khoản chưa xác thực"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tài khoản của bạn chưa xác thực thông tin, Vui lòng xác thực tài khoản trước khi đăng nhập
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="btn-dialog" onClick={() => setOpen(false)}>Hủy</Button>
          <Button className="btn-dialog" onClick={onBtnDialog} >Xác thực</Button>
        </DialogActions>
      </Dialog>

      <Overlay className='overlay-profile'
                open={showmodel}
                closeOnEsc={true}
            // onClose={() => setOpenmodeldelete(false)}
            >
                <div className='input-email-forgot'>
                <Formik
                initialValues={{ emailforgot: ''}}
                validationSchema={valid.forgotvalid}
                onSubmit={(values) => {
                  forgotpass(values.emailforgot)
                }}
              >
                {({ errors, touched }) => (
                  <Form className="form">
                      <div>
                        <h3 className='forgot-title'>Quên mật khẩu</h3>
                    <div className='input-forgot-cn'>
                      <Field className="input-forgot" name="emailforgot" type="email" placeholder="Email" />
                    </div>
                    {errors.emailforgot && touched.emailforgot ? (
                      <span className='error'>{errors.emailforgot}</span>
                    ) : <span className='error'></span>}
                      <div className='btn-forgot-div'>
                      <button type='button' onClick={() => {setShowmodel(false)}} className='btn-send-code-forgot'>hủy</button>
                      <button type='submit' className='btn-send-code-forgot'>gửi mã</button>
                      </div>
          
                    </div>
                  </Form>
                )}
              </Formik>
                </div>
            </Overlay>

      <div className="anhnen">
        {isLoading ? <div width="50px" height="50px" className="loader-globle" /> : null}
        <ToastContainer />
        <div className="container" id="container">

          <div className="right-container"></div>
          <div className="left-container">

            <div className="form-container sign-in-container">
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={valid.loginValid}
                onSubmit={(values) => {
                  onlogin(values);
                }}
              >
                {({ errors, touched }) => (
                  <Form className="form">
                    <img className="logoMbf" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Blogger_logo.svg/1200px-Blogger_logo.svg.png" width="70%" />
                    <h5 className="title-login">Đăng nhập bằng tài khoản của bạn</h5>

                    <div className="formItem">
                      <img src="../access/iconEmail.png" alt="" className="icon-input" />
                      <Field className="input" name="email" type="email" placeholder="Email" />
                    </div>
                    {errors.email && touched.email ? (
                      <span className='error'>{errors.email}</span>
                    ) : <span className='error'></span>}

                    <div className="formItem">
                      <img src="../access/iconPassword.png" alt="" className="icon-input" />

                      <Field className="input" name="password" type="password" placeholder="Password"></Field>
                    </div>
                    {errors.password && touched.password ? (
                      <span className='error'>{errors.password}</span>
                    ) : <span className='error'></span>}
                    <button className="btn" type="submit">Đăng nhập</button>

                    <p onClick={() => {setShowmodel(true)}} className="forgotpassword">Forgot your password ?</p>
                    <div className='ask-register'>
                      <span>Nếu chưa có tài khoản hãy </span>
                      <button className="click-form-register" type="reset" onClick={singup} >  Đăng kí tài khoản</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>


            <div className="form-container sign-up-container">
              <Formik
                initialValues={{ name: '', email: '', password: '', cfpassword: '' }}
                validationSchema={valid.registerValid}
                onSubmit={values => {
                  onRegister(values)
                }}
              >
                {({ errors, touched }) => (
                  <Form className="form">
                    <h5 className="title-register">Đăng kí tài khoản</h5>

                    <div className="formItem">
                      <img src="../access/iconuser.png" alt="" className="icon-input" />
                      <Field className="input" name="name" type="text" placeholder="Họ và Tên" />
                    </div>
                    {errors.name && touched.name ? (
                      <span className='error'>{errors.name}</span>
                    ) : <span className='error'></span>}

                    <div className="formItem">
                      <img src="../access/iconEmail.png" alt="" className="icon-input" />
                      <Field className="input" name="email" type="email" placeholder="me@example.com" />
                    </div>
                    {errors.email && touched.email ? (
                      <span className='error'>{errors.email}</span>
                    ) : <span className='error'></span>}

                    <div className="formItem">
                      <img src="../access/iconPassword.png" alt="" className="icon-input" />
                      <Field className="input" name="password" type="password" placeholder="*****" />
                    </div>
                    {errors.password && touched.password ? (
                      <span className='error'>{errors.password}</span>
                    ) : <span className='error'></span>}

                    <div className="formItem">
                      <img src="../access/iconPassword.png" alt="" className="icon-input" />
                      <Field className="input" name="cfpassword" type="password" placeholder="*****" />
                    </div>
                    {errors.cfpassword && touched.cfpassword ? (
                      <span className='error'>{errors.cfpassword}</span>
                    ) : <span className='error'></span>}

                    <button className="btn" type="submit">Đăng kí</button>

                    <div className="rs">
                      <span>Bạn đã có tài khoản ? </span>
                      <button className="click-form-register" type="reset" onClick={signin} >  Đăng nhập</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div>
            <span className="credit">Sản phẩm tốt nghiệp của sinh viên</span>
          </div>

        </div>

      </div>


    </>


  );
}

export default Login;