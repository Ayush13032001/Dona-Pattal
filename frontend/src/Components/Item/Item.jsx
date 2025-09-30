import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div 
      className='item'
      data-aos="zoom-in-up" 
      data-aos-duration="800"
    >
      <Link to={`/products/${props.id}`}>
        <img onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} src={props.image} alt={props.name} />
      </Link>
      
      <p>{props.name}</p>

      <div className="item-prices">
        <div className="item-prices-new">
          Rs {props.new_price}
        </div>
        <div className="item-prices-old">
          Rs {props.old_price}
        </div>
      </div>
    </div>
  )
}

export default Item
