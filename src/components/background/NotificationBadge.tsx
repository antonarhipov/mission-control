interface NotificationBadgeProps {
  count: number;
  type?: 'default' | 'urgent' | 'success';
  pulse?: boolean;
}

export function NotificationBadge({
  count,
  type = 'default',
  pulse = false,
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const getColorClasses = () => {
    switch (type) {
      case 'urgent':
        return 'bg-accent-red text-white';
      case 'success':
        return 'bg-accent-green text-white';
      case 'default':
      default:
        return 'bg-accent-blue text-white';
    }
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div className="relative inline-flex">
      <span
        className={`
          inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
          ${getColorClasses()}
          ${pulse ? 'animate-pulse' : ''}
        `}
      >
        {displayCount}
      </span>
      {pulse && (
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span
            className={`
              animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${type === 'urgent' ? 'bg-accent-red' : 'bg-accent-blue'}
            `}
          />
          <span
            className={`
              relative inline-flex rounded-full h-3 w-3
              ${type === 'urgent' ? 'bg-accent-red' : 'bg-accent-blue'}
            `}
          />
        </span>
      )}
    </div>
  );
}
