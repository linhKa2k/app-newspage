import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import adminApi from '../../commons/axios/api/adminApi';
import { BiEraser,BiBlock } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { ToastContainer, toast } from 'react-toastify';
import '../../css/categorymanager.css';
function CategoryManage(props) {
  const [listcategory, setListcategory] = useState([]);
  const [loadingcategory, setLoadingcategory] = useState(false);
  const [valuenamecategory, setValuenamecategory] = useState('');
  const [idcategory, setIdcategory] = useState('');
  const [indexupdate, setIndexupdate] = useState('');
  const [showmodelupdate, setShowmodelupdate] = useState(false);
  const [showmodeldelete, setShowmodeldelete] = useState(false);
  const [showmodelunlookcategory, setShowmodelunlookcategory] = useState(false);
  useEffect(async () => {
    if(props.value === 'avalible'){
      setListcategory([])
      setLoadingcategory(true)
      await adminApi.getcategory(true).then(res => {
        setListcategory(res.listcategory)
        setLoadingcategory(false)
      })
    }else{
      setListcategory([])
      setLoadingcategory(true)
      await adminApi.getcategory(false).then(res => {
        setListcategory(res.listcategory)
      setLoadingcategory(false)

      })
    }
  }, [props.value]);

  const list = listcategory.map(function (category, index) {
    return <div className="list-category-item" key={index}>
      <h3>{category.namecategory}</h3>
      <div className="option-item-category">
        <button onClick={() => { setValuenamecategory(category.namecategory); setIdcategory(category._id); setShowmodelupdate(true); setIndexupdate(index) }} className="edit-category"><BiEraser className="ic-edit-category" /></button>
        <button onClick={() => { setValuenamecategory(category.namecategory); setIdcategory(category._id); setShowmodeldelete(true); setIndexupdate(index) }} className="delete-category"><BiBlock className="ic-delete-category" /></button>
      </div>
    </div>
  })

  const listCategoryunalivable = listcategory.map((category, index) => (
    <div className="list-category-item" key={index}>
      <h3>{category.namecategory}</h3>
      <div className="option-item-category">
        <button onClick={() => { setValuenamecategory(category.namecategory); setIdcategory(category._id); setShowmodelunlookcategory(true); setIndexupdate(index) }} className="delete-category"><CgUnblock className="ic-delete-category" /></button>
      </div>
    </div>
  ))

  const addcategory = async (namecategory) => {
    if(namecategory === '') {
      toast.info('vui lòng nhập thông tin thể loại', {
        theme: "dark"
      })
      return;
    }
    await adminApi.addCategory(namecategory).then(res => {
      toast.success(res.message, {
        theme: "dark"
      })
      adminApi.getcategory(true).then(response => {
        setListcategory(response.listcategory)
      })
    })
  }

  const updateCategory = async () => {

    if (valuenamecategory === '') {
      return toast.info('Vui lòng không để trống tên thể loại', {
        theme: "dark"
      });
    }
    await adminApi.updateCategory(valuenamecategory, idcategory).then(res => {
      switch (res.message) {
        case 'Thể loại này đã tồn tại':
          toast.info(res.message, {
            theme: "dark"
          })
          break;
        default:
          listcategory[indexupdate] = res.result;
          setShowmodelupdate(false)
          setIdcategory('')
          setIndexupdate('')
          toast.success(res.message, {
            theme: "dark"
          })

          break;
      }
    })
  }

  const deletecategory = async () => {
    await adminApi.removeCategory(idcategory).then(res => {
      listcategory.splice(indexupdate , 1);
      setShowmodeldelete(false)
      toast.success(res.message, {
        theme: "dark"
      })

    })
  }

  const unlockcategory = async () => {
    await adminApi.unlockCategory(idcategory).then(res => {
      listcategory.splice(indexupdate , 1);
      setShowmodelunlookcategory(false)
      toast.success(res.message, {
        theme: "dark"
      })
    })

  }

  return (
    <>
      <ToastContainer />
      {showmodelupdate ? <div className="overlay-user-manager">
        <div className="model-update-category">
        <h4 className="title-category-update">Cập nhật thể loại</h4>
          <input className="input-update-category" value={valuenamecategory} onChange={e => setValuenamecategory(e.target.value)}></input>
          <button onClick={() => setShowmodelupdate(false)}>hủy</button>
          <button onClick={() => updateCategory()}>Cập nhật</button>
        </div>
      </div> : null}

      {showmodeldelete ? <div className="overlay-user-manager">
        <div className="model-update-category">
          <h4 className="title-category-update">Thêm thể loại vào danh sách hạn chế</h4>
          <p className="ask-delete-category">Lưu ý: Khi thêm thể loại vào danh sách hạn chế thì người dùng sẽ không thể đăng bài thuộc thể loại này nữa </p>
          <button onClick={() => setShowmodeldelete(false)}>hủy</button>
          <button onClick={() => deletecategory()}>Đồng ý</button>
        </div>
      </div> : null}

      {showmodelunlookcategory ? <div className="overlay-user-manager">
        <div className="model-update-category">
          <h4 className="title-category-update">Bỏ hạn chế thể loại</h4>
          <p className="ask-delete-category">Người dùng sẽ có thể đăng bài cùng thể loại này sau khi bỏ hạn chế thể loại</p>
          <button onClick={() => setShowmodelunlookcategory(false)}>hủy</button>
          <button onClick={() => unlockcategory()}>Đồng ý</button>
        </div>
      </div> : null}

      <div className="category-manager-container">
        {props.value === 'avalible' ? <h3 className="category-manager-title">Quản lý Thể loại bài viết</h3> : null}
        {props.value === 'unavalible' ? <h3 className="category-manager-title">Danh sách thể loại bị hạn chế</h3> : null}
        
        {
          props.value === 'avalible' ? <> <div className="add-category">
          <Formik
            enableReinitialize={true}
            initialValues={{ namecategory: '' }}
            onSubmit={(values, { resetForm }) => {
              addcategory(values.namecategory)
              resetForm()
            }}
          >
            <Form>
              <Field className="add-category-manager" name="namecategory" autocomplete="off" type="text" placeholder="Thêm thể loại bài viết" />
              <button type="submit" className="add-category-btn">thêm thể loại</button>
            </Form>
          </Formik>
        </div>
        <h3 className="list-title-category">Danh sách thể loại :</h3></> :null
        }
        <div className="list-categoy-manager">
        {loadingcategory ? <div width="20px" height="100px" className="load-more-ic" /> :
        <>
          {listcategory.length === 0 ? <p>Không có thể loại nào</p> :
            <>
            {props.value === 'avalible' ? <>{list}</> : <>{listCategoryunalivable}</>}
            </>
          }
          </>}
        </div>
      </div>
    </>
  )
};

export default CategoryManage;