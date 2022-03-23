const randompass = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 11; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return String(result);
}
export default randompass;