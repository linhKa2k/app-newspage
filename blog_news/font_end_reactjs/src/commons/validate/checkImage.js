export const checkImage = (file) => {
    const types = ['image/png', 'image/jpg', 'image/jpeg']
    let err = "";
    // if(!file) return err = "Vui lòng chọn file"
    
    if(!types.includes(file.type))
    err = "Hình ảnh không đúng định dạng"

    return err;
}