import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [image, setImage] = useState(null);

  const [product, setProduct] = useState({
    title: '',
    old_price: '',
    new_price: '',
    category: 'plate', // default category
  });

  // Handle text/select/file changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setImage(files[0]);
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Submit product
  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', product.title);
      formData.append('old_price', Number(product.old_price));
      formData.append('new_price', Number(product.new_price));
      formData.append('category', product.category);
      formData.append('image', image); // must match multer field in backend

      const resp = await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();

      if (data.success) {
        toast.success('✅ Product Added Successfully!');
        
        // Reset form with correct default category
        setProduct({ title: '', old_price: '', new_price: '', category: 'paper' });
        setImage(null);

        // Clear file input manually
        document.getElementById('file-input').value = '';
      } else {
        toast.error(`❌ Failed to add product: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('⚠ Something went wrong');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.title || !product.old_price || !product.new_price || !image) {
      toast.error('⚠ Please fill all fields!');
      return;
    }
    addProduct();
  };

  return (
    <form className="add-product" onSubmit={handleSubmit}>
      {/* Product title */}
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          type="text"
          name="title"
          placeholder="Type here"
          value={product.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Prices */}
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            type="number"
            name="old_price"
            placeholder="Type here"
            value={product.old_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            type="number"
            name="new_price"
            placeholder="Type here"
            value={product.new_price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          name="category"
          className="add-product-selector"
          value={product.category}
          onChange={handleChange}
        >
          <option value="paper">Paper</option>
          <option value="plate">Plate</option>
          <option value="glass">Glass</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt="upload"
          />
        </label>
        <input
          type="file"
          name="image"
          id="file-input"
          hidden
          onChange={handleChange}
          accept="image/*"
        />
      </div>

      <button type="submit" className="addproduct-btn">
        Add
      </button>
    </form>
  );
};

export default AddProduct;
