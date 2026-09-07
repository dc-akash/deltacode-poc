import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        {trend && (
          <span className="stat-card-trend">
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <span className="stat-card-title">
          {title}
        </span>

        <strong className="stat-card-value">
          {value}
        </strong>

        {subtitle && (
          <span className="stat-card-subtitle">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;