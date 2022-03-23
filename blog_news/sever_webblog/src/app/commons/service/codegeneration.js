
const codegeneration = () =>{
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < 6; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
  }
export default codegeneration;