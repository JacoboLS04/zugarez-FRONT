import "./MenuCard.css";

export default function CategoryCard({ title , image }) {
  return (
    <div className="category-card">
      <div className="category-card__header">{title}</div>
      <div className="category-card__image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
}
