import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
const {product} = props;
const {addToCart} = useContext(ShopContext);
  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src= {product.image} alt="" />
                <img src= {product.image} alt="" />
                <img src= {product.image} alt="" />
                <img src= {product.image} alt="" />

            </div>
            <div className="productdisplay-img">
                <img className='productdisplay-main-img' src= {product.image} alt="" />
            </div>
        </div>
        <div className="productdisplay-right">
            <h1>{product.name}</h1>
            <div className="productdisplay-right-star">
                <img src= {star_icon} alt="" />
                <img src= {star_icon} alt="" />
                <img src= {star_icon} alt="" />
                <img src= {star_icon} alt="" />
                <img src= {star_dull_icon} alt="" />
                <p>(122)</p>
            </div>
            <div className="productdisplay-right-prices">
                <div className="productdisplay-right-price-old">
                    Rs{product.old_price}
                </div>
                <div className="productdisplay-right-price-new">
                    Rs{product.new_price}
                </div>
                <div className="productdisplay-right-description">
                    The clothes someone wears tell us about their cultural identity and life status. When describing someone to someone else, we talk about their outer beauty/appearance and inner qualities/personality. While describing someone’s appearance, the first thing that comes up is the clothes. If you wonder how to describe clothes, this post is for you.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>
                    </div>
                </div>
                <button onClick={() => {addToCart(product.id)}}>Add To Cart</button>
                <p className='productdisplay-right-category'><span>Category :</span>Women, T-Shirt, Crop Top</p>
                <p className='productdisplay-right-category'><span>Tags :</span> Modern, Latest</p>
            </div>

        </div>

      
    </div>
  )
}

export default ProductDisplay
