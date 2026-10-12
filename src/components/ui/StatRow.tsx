type Stat = { value: string; label: string };

type StatRowProps = { stats: Stat[]; note?: string; variant?: 'default' | 'floating' };

export function StatRow({ stats, note, variant = 'default' }: StatRowProps) {
  return <div className={`stat-row-wrap stat-row-wrap--${variant}`}><div className={`stat-row stat-row--${stats.length}`}>{stats.map((stat, index) => <div className="stat-row__item" key={stat.value}><span>0{index + 1}</span><strong>{stat.value}</strong><p>{stat.label}</p></div>)}</div>{note ? <p className="stat-row__note">{note}</p> : null}</div>;
}
