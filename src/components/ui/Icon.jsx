/** One stroke grid (20x20, 1.8 stroke, round caps) for every pictogram. */
const PATHS = {
  climber: <><path d="M4 2v16" /><path d="M9 14l3.5-4.5L16 14" /><path d="M12.5 9.5V18" /></>,
  floater: <><path d="M2.5 9.5a7.5 7.5 0 0 1 15 0z" /><path d="M10 9.5V16a2 2 0 0 1-4 0" /></>,
  bomber: <><circle cx="9" cy="12" r="5.5" /><path d="M13 8l2.5-3" /><path d="M15.5 2.5V4M18 5h-1.5" /></>,
  blocker: <><circle cx="10" cy="4" r="1.8" /><path d="M10 6v7" /><path d="M3 9h14" /><path d="M10 13l-3 5M10 13l3 5" /></>,
  builder: <path d="M2 17h4.5v-4H11v-4h4.5V5" />,
  basher: <><path d="M2 10h10" /><path d="M8.5 6.5L12 10l-3.5 3.5" /><path d="M16.5 3v14" /></>,
  miner: <><path d="M3 3l9 9" /><path d="M12.5 7v5.5H7" /><path d="M3 17.5h14" /></>,
  digger: <><path d="M10 2v10" /><path d="M6.5 8.5L10 12l3.5-3.5" /><path d="M3 17h14" /></>,
  minus: <path d="M5 10h10" />,
  plus: <path d="M5 10h10M10 5v10" />,
  pause: <path d="M7 4v12M13 4v12" />,
  play: <path d="M6 3.5l11 6.5-11 6.5z" />,
  ff: <path d="M3 4.5l7 5.5-7 5.5zM10.5 4.5l7 5.5-7 5.5z" />,
  nuke: <path d="M10 1.5l1.9 4.9 4.9-1.9-1.9 4.9 4.6 1.9-4.6 1.9 1.9 4.9-4.9-1.9L10 18.5l-1.9-4.9-4.9 1.9 1.9-4.9L.5 8.9l4.6-1.9-1.9-4.9 4.9 1.9z" transform="translate(0 .4) scale(.96 .92)" />,
  gear: <><circle cx="10" cy="10" r="2.6" /><path d="M10 2.5v2.2M10 15.3v2.2M2.5 10h2.2M15.3 10h2.2M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M15.3 4.7l-1.6 1.6M6.3 13.7l-1.6 1.6" /></>,
  grid: <path d="M3 3h5.5v5.5H3zM11.5 3H17v5.5h-5.5zM3 11.5h5.5V17H3zM11.5 11.5H17V17h-5.5z" />,
  chevron: <path d="M7 4l6 6-6 6" />,
  lock: <><rect x="4.5" y="9" width="11" height="8" rx="1.5" /><path d="M7 9V6.5a3 3 0 0 1 6 0V9" /></>,
  retry: <><path d="M16 10a6 6 0 1 1-2-4.5" /><path d="M16 3v4h-4" /></>
};

export default function Icon({ name, className = 'h-5 w-5', filled = false }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  );
}
