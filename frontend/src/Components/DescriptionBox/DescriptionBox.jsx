import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-descripton">
            <p>E-commerce or electronic commerce is a digital marketplace where businesses and consumers can buy and sell goods and services through websites, mobile apps, or platforms like Amazon, eBay, and Flipkart. E-commerce makes shopping online more convenient and accessible worldwide.</p>
            <p>B2B involves companies selling products or services to other businesses. This model often deals with larger quantities, more complex transactions, and longer sales cycles. For Example, An e-commerce company like Amazon purchase a payment gateway from an company like Razorpay.</p>
        </div>
      
    </div>
  )
}

export default DescriptionBox
