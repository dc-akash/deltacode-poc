import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: number;
};

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card-title">
        {title}
      </p>

      <h2 className="stat-card-value">
        {value}
      </h2>
    </div>
  );
}

export default StatCard;