import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADMIN,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})
export const sendMailService = (name, email, code) => {
    const mailOption = {
        from: ' "Blogchiasekienthuc.com" <quocdatcao5@gmail.com>',
        to: email,
        subject: 'Xác thực tài khoản',
        html: `<h1>Xin chào ${name} !</h1>
    <h3>Yêu cầu được gửi đến từ Blogchiasekienthuc.com</h3>
    <p>Đây là mã xác thực của bạn :</p>
    <h1 style="color: #D61109">${code}</h1>
    <p>Nếu trong vòng 5 phút bạn không thực hiện yêu cầu, yêu cầu này sẽ tự động hủy.</p>
    <p>Trân trọng !!</p>`
    
    }
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send('gui ok')
        }
    })
}
export const sendEmailRegisterSuccess = (dataUser) => {
    const mailOption = {
        from: ' "Blogchiasekienthuc.com" <quocdatcao5@gmail.com>',
        to: dataUser.email,
        subject: 'Xác thực Email thành công',
        html: `<h1>Xin chào !!</h1>
    <h3>Bạn đã đăng kí thành công tài khoản tại Blogchiasekienthuc.com</h3>
    <p>Bây giờ bạn có thể truy cập vào trang web và sử dụng dịch vụ của chúng tôi</p>
    <p>Trân trọng !!</p>`
    
    }
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send('gui ok')
        }
    })
}
export const sendEmailForgotpassword = (email, code) => {
    const mailOption = {
        from: ' "Blogchiasekienthuc.com" <quocdatcao5@gmail.com>',
        to: email,
        subject: 'Forgot Password',
        html: `<h1>Chào bạn !!</h1>
    <h3><b> Chúng tôi vừa nhận được một yêu cầu khôi phục mật khẩu từ Blogchiasekienthuc.com </b></h3>
    <p>Đây là mã xác thực của bạn :</p>
    <h1 style="color: #D61109">${code}</h1>
    <p>Lý do bạn nhận được email này là bạn đã yêu cầu khôi phục mật khẩu trên Website của chúng tôi</p>
    <p><b>nếu bạn không yêu cầu thay đổi này thì bạn có thể bỏ qua email này</b></p>
    <p>Trân trọng !!</p>`
    
    }
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send('gui ok')
        }
    })
}
export const sendEmailNewPass = (email, passnew) => {
    const mailOption = {
        from: ' "Blogchiasekienthuc.com" <quocdatcao5@gmail.com>',
        to: email,
        subject: 'Cấp lại mật khẩu',
        html: `<h1>Chào bạn !!</h1>
    <h3><b>Yêu cầu cầu lại mật khẩu của bạn đã được chấp nhận</b></h3>
    <p>Mật khẩu hiện tại của bạn là :</p>
    <h2 style="color: #213CF5">${passnew}</h2>
    <p>Vui lòng đổi lại mật khẩu mới để tránh việc ai đó đánh cắp mật khẩu của bạn thông qua Email này</p>
    <p>Trân trọng !!</p>`
    
    }
    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            return res.send('gui ok')
        }
    })
}
