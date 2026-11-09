export default function Card({ title, subtitle, children, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className={`card ${onClick ? "card-click" : ""}`} onClick={onClick}>
      {title && <h3>{title}</h3>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </Tag>
  );
}
