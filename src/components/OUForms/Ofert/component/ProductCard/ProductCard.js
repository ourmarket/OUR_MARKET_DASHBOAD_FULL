/* eslint-disable react/prop-types */
import "./productCard.css";

export function ProductCard({ image, name, presentation, price }) {
  return (
    <div className="box-wrapper">
      <img src={image} alt="pollo" />
      <div className="box-content">
        <div className="buy"></div>
        <div className="title">{name}</div>
        <div className="desc">{presentation}</div>
        <span className="price">${price}</span>
      </div>
    </div>
  );
}
