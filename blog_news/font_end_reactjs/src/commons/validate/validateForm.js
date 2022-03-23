import { yupToFormErrors } from 'formik';
import * as Yup from 'yup';
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g 
const registerValid = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập Tên'),
    email: Yup.string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
    password: Yup.string()
      .matches(
        /^(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Password > 8 kí tự, 1 kí tự đặc biệt"
      )
      .required('Vui lòng nhập Password'),
    cfpassword: Yup.string().required('Passwords phải trùng khớp')
      .oneOf([Yup.ref('password'), null], 'Passwords phải trùng khớp')
  });

  const loginValid = Yup.object().shape({
    email: Yup.string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
    password: Yup.string()
      .required('Vui lòng nhập Password'),
  });

  const forgotvalid = Yup.object().shape({
    emailforgot: Yup.string()
      .email('Email không đúng định dạng')
      .required('Vui lòng nhập Email'),
  });


  const postValid = Yup.object().shape({
    tittle: Yup.string()
    .required('Tiêu đề bắt buộc phải nhập')
    .max(150, 'Tối đa 150 kí tự'),

    description: Yup.string()
    .required('Mô tả bài viết bắt buộc phải nhập')
    .max(350, 'Tối đa 350 kí tự'),

    idcategory: Yup.string().required('Vui lòng chọn thể loại'),

    avatarpost: Yup.string().required('vui lòng chọn file'),

    content: Yup.string()
    .required('Nội dung bài viết không được trống')
    .max(20000, 'Tối đa 20000 kí tự'),
  });

  const postupdateValid = Yup.object().shape({
    content: Yup.string()
    .min(40, 'vui lòng nhập nội dung bài viết')
    .max(20000, 'Tối đa 20000 kí tự'),
  });

  const updateuser = Yup.object().shape({
    name: Yup.string()
    .required('Vui lòng nhập tên người dùng'),
    phone: Yup.string()
    .matches(phoneRegex, 'Vui lòng nhập số điện thoại đúng định dạng'),
    password: Yup.string()
    .required('Vui lòng nhập mật khẩu của bạn')
  });

  const changePassword = Yup.object().shape({
    oldpassword: Yup.string()
    .required('Vui lòng nhập mật khẩu'),
    passwordnew: Yup.string()
    .required('Vui lòng nhập mật khẩu mới')
  });

export const valid = {registerValid, loginValid, postValid, updateuser, postupdateValid, changePassword, forgotvalid}