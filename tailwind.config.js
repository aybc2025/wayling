/** Declared visual system (see CLAUDE.md). Every colour, size and radius used in the app comes from here. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    screens: { land: { raw: '(orientation: landscape) and (max-height: 520px)' }, sm: '640px' },
    colors: {
      transparent: 'transparent', current: 'currentColor',
      peat: 'var(--c-peat)', loam: 'var(--c-loam)', strata: 'var(--c-strata)', ridge: 'var(--c-ridge)',
      chalk: 'var(--c-chalk)', dust: 'var(--c-dust)', marigold: 'var(--c-marigold)',
      ember: 'var(--c-ember)', tarn: 'var(--c-tarn)',
      dirt: '#9a6238', grass: '#6bb04a', steel: '#8b95a1',
      climber: '#65bdff', floater: '#00d2e5', bomber: '#ff8e86', blocker: '#fe8dc5',
      builder: '#d6b529', basher: '#ff9b50', miner: '#ce9dff', digger: '#75d079'
    },
    fontFamily: {
      display: ['"Secular One"', 'system-ui', 'sans-serif'],
      body: ['Assistant', 'system-ui', 'sans-serif'],
      digits: ['Silkscreen', 'ui-monospace', 'monospace']
    },
    fontSize: {
      label: ['11px', '14px'], meta: ['13px', '18px'], body: ['16px', '24px'],
      title: ['20px', '24px'], display: ['28px', '32px']
    },
    borderRadius: { none: '0', DEFAULT: '6px', full: '9999px' },
    boxShadow: {
      none: 'none',
      raised: '0 3px 0 var(--c-strata)',
      overlay: '0 6px 0 var(--c-strata)',
      selected: '0 3px 0 var(--c-chalk)',
      primary: '0 3px 0 #a56f00'
    },
    extend: {
      transitionTimingFunction: { out: 'cubic-bezier(.23,1,.32,1)' },
      transitionDuration: { 100: '100ms', 160: '160ms', 200: '200ms', 600: '600ms' }
    }
  },
  plugins: []
};
