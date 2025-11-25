// box.jsx
import './box.css'

function Box({ image, title, text }) {
  return (
    <div className="box">
      <img src={image} alt={title} className="box-image" />
      <h2 className="box-title">{title}</h2>
      <p className="box-text">{text}</p>
    </div>
  )
}

export default Box
