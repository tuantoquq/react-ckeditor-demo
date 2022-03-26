import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
function App() {
  const [productForm, setProductForm] = useState({});
  const API_URL = "http://atroboticsvn.com";
  const UPLOAD_ENDPOINT = "api/v1/admin/auth/file-uploads/single-file";
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("image", file);
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization":
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDgxMzEzNjEsImlhdCI6MTY0ODEyMDU2MSwidXNlcklEIjoiMDJmZGZkMzYtNDljMS00YWUwLWJhZDgtODBmNzJmYjM2NjkyIn0.0a7gX8mlRvABuUvDZxGkskZOxEIrSyDGpwLPJkkDNLU",
              },
              body: body,
              // mode: "no-cors"
            })
              .then((res) => res.json())
              .then((res) => {
                console.log("Response from server: ", res)
                resolve({
                  default: res.data,
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProductForm({
      ...productForm,
      [name]: value,
    });
  };
  const handleCKeditor = (event, editor) => {
    const data = editor.getData();
    setProductForm({
      ...productForm,
      productLongDsc: data,
    });
  };
  console.log(productForm);
  return (
    <div className="App">
      <div className="container">
        <div className="wrapper">
          <form className="form-group">
            <h1>Add Product Form</h1>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                placeholder="Enter product name"
                className="form-control"
                value={productForm.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Short Description</label>
              <input
                type="text"
                name="productShortDsc"
                placeholder="Enter product short description"
                className="form-control"
                value={productForm.productShortDsc}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Price</label>
              <input
                type="text"
                name="productPrice"
                placeholder="Enter product price"
                value={productForm.productPrice}
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Brand</label>
              <input
                type="text"
                name="productBrand"
                placeholder="Enter product brand"
                className="form-control"
                value={productForm.productBrand}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Long Description </label>
              <CKEditor
                id="editor"
                name="productLongDsc"
                editor={ClassicEditor}
                data={productForm.productLongDsc}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                config={{
                  extraPlugins: [uploadPlugin],
                }}
                onChange={handleCKeditor}
              />
            </div>
            <div className="form-group">
              <input
                type="submit"
                name="submit"
                className="btn btn-secondary"
                required
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
