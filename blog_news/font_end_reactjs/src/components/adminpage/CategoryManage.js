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
      toast.info('vui l??ng nh???p th??ng tin th??? lo???i', {
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
      return toast.info('Vui l??ng kh??ng ????? tr???ng t??n th??? lo???i', {
        theme: "dark"
      });
    }
    await adminApi.updateCategory(valuenamecategory, idcategory).then(res => {
      switch (res.message) {
        case 'Th??? lo???i n??y ???? t???n t???i':
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
        <h4 className="title-category-update">C???p nh???t th??? lo???i</h4>
          <input className="input-update-category" value={valuenamecategory} onChange={e => setValuenamecategory(e.target.value)}></input>
          <button onClick={() => setShowmodelupdate(false)}>h???y</button>
          <button onClick={() => updateCategory()}>C???p nh???t</button>
        </div>
      </div> : null}

      {showmodeldelete ? <div className="overlay-user-manager">
        <div className="model-update-category">
          <h4 className="title-category-update">Th??m th??? lo???i v??o danh s??ch h???n ch???</h4>
          <p className="ask-delete-category">L??u ??: Khi th??m th??? lo???i v??o danh s??ch h???n ch??? th?? ng?????i d??ng s??? kh??ng th??? ????ng b??i thu???c th??? lo???i n??y n???a </p>
          <button onClick={() => setShowmodeldelete(false)}>h???y</button>
          <button onClick={() => deletecategory()}>?????ng ??</button>
        </div>
      </div> : null}

      {showmodelunlookcategory ? <div className="overlay-user-manager">
        <div className="model-update-category">
          <h4 className="title-category-update">B??? h???n ch??? th??? lo???i</h4>
          <p className="ask-delete-category">Ng?????i d??ng s??? c?? th??? ????ng b??i c??ng th??? lo???i n??y sau khi b??? h???n ch??? th??? lo???i</p>
          <button onClick={() => setShowmodelunlookcategory(false)}>h???y</button>
          <button onClick={() => unlockcategory()}>?????ng ??</button>
        </div>
      </div> : null}

      <div className="category-manager-container">
        {props.value === 'avalible' ? <h3 className="category-manager-title">Qu???n l?? Th??? lo???i b??i vi???t</h3> : null}
        {props.value === 'unavalible' ? <h3 className="category-manager-title">Danh s??ch th??? lo???i b??? h???n ch???</h3> : null}
        
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
              <Field className="add-category-manager" name="namecategory" autocomplete="off" type="text" placeholder="Th??m th??? lo???i b??i vi???t" />
              <button type="submit" className="add-category-btn">th??m th??? lo???i</button>
            </Form>
          </Formik>
        </div>
        <h3 className="list-title-category">Danh s??ch th??? lo???i :</h3></> :null
        }
        <div className="list-categoy-manager">
        {loadingcategory ? <div width="20px" height="100px" className="load-more-ic" /> :
        <>
          {listcategory.length === 0 ? <p>Kh??ng c?? th??? lo???i n??o</p> :
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