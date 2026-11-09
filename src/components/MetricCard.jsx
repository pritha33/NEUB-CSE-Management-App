export default function MetricCard({ title, value }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  );
}
