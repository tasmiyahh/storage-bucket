
import axios from 'axios';
import { useEffect, useState } from "react";
import "./index.css"


function Product() {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [editProduct, setEditProduct] = useState(null)

  const [users, setUsers] = useState([])
  const [toggleRefresh, setToggleRefresh] = useState(true)

  useEffect(() => {

    let getAllUsers = async () => {
       let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
     // let response = await axios.get('http://localhost:5000/products');

      setUsers(response.data.data)
    }
    getAllUsers();

  }, [toggleRefresh])





  const producthandler = async (e) => {
    e.preventDefault();

    var productimage = document.getElementById("productimage");
    console.log("fileInput: ", productimage.files); // local url



    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax


    formData.append("name", name); // this is how you add some text data along with file
    formData.append("description", description); // this is how you add some text data along with file
    formData.append("price", price); // this is how you add some text data along with file
    formData.append("productimage", productimage.files[0]); // file input is for browser only, use fs to read file in nodejs client


    axios({
      method: 'post',
       url: "https://storage-bucket-production.up.railway.app/product",
     // url: "http://localhost:5000/product",
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      // withCredentials: true
    })
      .then(res => {
        console.log(`upload Success` + res.data);
        setToggleRefresh(!toggleRefresh)
      })
      .catch(err => {
        console.log(err);
      })
  }

  //   let edithandler = (e) =>{
  //     e.preventDefault();
  //  axios({
  //   url : `http://localhost:5000/product/${editProduct?._id}`,
  //   method : "put" ,
  //   data :  {
  //     name: editProduct.name,
  //     price: editProduct.price,
  //     description: editProduct.description,

  //   },

  //  })
  //  .then(res=>{
  //     console.log(res.data , "response")
  //     setToggleRefresh(!toggleRefresh);
  //     setEditProduct(null);

  //  })

  //  .catch(err=>{
  // console.log(err , "error")
  //  })

  // }

  let edithandler = (e) => {
    e.preventDefault();




    // axios.put(`http://localhost:5000/product/${editProduct?._id}`,
    // 
    axios.put(`https://storage-bucket-production.up.railway.app/product/${editProduct?._id}`,
      {
        name: editProduct.name,
        price: editProduct.price,
        description: editProduct.description,
        code: editProduct.code,
      }
    )
      .then(function (response) {
        console.log("updated: ", response.data);

        setToggleRefresh(!toggleRefresh);
        setEditProduct(null);

      })


      .catch(function (e) {
        console.log("Error in api call: ", e);

      }


      )
  }


  return (
    <div className='products'>
      <div className="head">
        <form onSubmit={producthandler}>
          <h1>PRODUCT FORM</h1>
          Name: <input name="name" type="text" placeholder="Name" id='name' onChange={(e) => { setName(e.target.value) }} />
          <br />
          description: <input name="description" type="text" placeholder="description" id='description' onChange={(e) => { setDescription(e.target.value) }} />
          <br />
          price: <input name="price" type="Number" placeholder="price" id='price' onChange={(e) => { setPrice(e.target.value) }} />
          <br />

          productimage: <input type="file" id="productimage" accept='image/*'
            onChange={() => {
              ////// to display imager instantly on screen
              var productimage = document.getElementById("productimage");
              var url = URL.createObjectURL(productimage.files[0])
              console.log("url: ", url);
              document.getElementById("img").innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `
            }} />


          <div id="img" ></div>

          <br />
          <button type='submit'>product add</button>

        </form>
        <hr />
        {(editProduct !== null) ?
          (<div>
            <form onSubmit={edithandler}>
            <h1>EDIT FORM</h1>
              name : <input type="text" onChange={(e) => {
                setEditProduct({ ...editProduct, name: e.target.value })
              }} value={editProduct?.name} /> <br />

              description : <input type="text" onChange={(e) => {
                setEditProduct({ ...editProduct, description: e.target.value })
              }} value={editProduct?.description} /> <br />

              price : <input type="number" onChange={(e) => {
                setEditProduct({ ...editProduct, price: e.target.value })
              }} value={editProduct?.price} /> <br />

              <button>edit product</button>
            </form>
          </div>) : null
        }
      </div>


      <h1>products List: </h1>

      <div className='productlist'>
        {users.map(eachProduct => (
          <div key={eachProduct.id}>
            <div className='product'>
              <img className="productimg" width="120px" src={eachProduct.productimage} alt="" />
              <h4>{eachProduct.name}</h4>
              <p className='description'>{eachProduct.description}</p>
              <p ><span className='price'>{eachProduct.price}</span><span>pkr</span></p>
              <button onClick={() => {
                axios({
                //  url: `http://localhost:5000/product/${eachProduct._id}`,
                   url: `https://storage-bucket-production.up.railway.app/product/${eachProduct._id}`,
                  method: "delete",

                })
                  .then(function (response) {
                    console.log(response.data)
                    setToggleRefresh(!toggleRefresh)
                  })
                  .catch(function (error) {
                    console.log('error', error)
                  })



              }

              }>delete</button> <br />
              <button onClick={() => {
                setEditProduct({
                  _id : eachProduct?._id,
                  name: eachProduct?.name,
                  description: eachProduct?.description,
                  price: eachProduct?.price,
                
                })
              }}>edit product</button>

              {/* <button onClick={() => {
                setEditProduct({
                  _id: eachProduct?._id,
                  name: eachProduct?.name,
                  description: eachProduct?.description,
                  price: eachProduct?.price,
                  
                })
              }}>edit</button> */}

              <hr />
            </div>
          </div>
        ))}
      </div>





      {/* <div>Cloudinary Demo</div>

      <img
        width="200px"
        src="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/laptop.jpeg?alt=media&token=0005799a-2099-4eec-8918-56f0a20bbff1"
        alt="" />
      <br />
      <img
        width="200px"
        src="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/nature.jpeg?alt=media&token=18fc659f-5186-443e-ab5b-633d2039d94c"
        alt="" />
      <br />
      <img
        width="200px"
        src="https://res.cloudinary.com/malikasinger/image/upload/v1665676922/laptop_lsqoem.jpg"
        alt="" />

      <br />

      <a
        style={{
          border: "1px solid black",
          borderRadius: "20px",
          padding: "5px",
          margin: "20px",
          marginTop: "20px",
          display: "inline-block"
        }}
        href="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/fontawesome-free-6.1.1-web.zip?alt=media&token=7ce3812c-af48-4a08-be3a-c7c0a311d0e8"
      > Download zip file</a> */}
    </div>
  );
}

export default Product;