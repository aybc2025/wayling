export default {
  appName: 'Wayling',
  rating: { fun: 'Fun', tricky: 'Tricky', taxing: 'Taxing', mayhem: 'Mayhem' },
  skill: {
    climber: 'Climber', floater: 'Floater', bomber: 'Bomber', blocker: 'Blocker',
    builder: 'Builder', basher: 'Basher', miner: 'Miner', digger: 'Digger'
  },
  state: { walk: 'Walking', fall: 'Falling', climb: 'Climbing', block: 'Blocking', build: 'Building', bash: 'Bashing', mine: 'Mining', dig: 'Digging' },
  hud: { out: 'Out', saved: 'Saved', need: 'Need', time: 'Time' },
  controls: {
    slower: 'Slower release', faster: 'Faster release', pause: 'Pause', fast: 'Fast forward',
    nuke: 'Blow up all', nukeHold: 'Hold to blow up', rate: 'Release rate', skills: 'Skills', home: 'Level select', map: 'Level map'
  },
  menu: {
    levelInfo: '{count} wanderers, need {need}', fresh: 'New', done: 'Done', locked: 'Locked',
    progress: '{n} of {total} levels', settings: 'Settings', ratings: 'Difficulty'
  },
  pause: { title: 'Paused', resume: 'Resume', restart: 'Restart level', levels: 'Level select', settings: 'Settings' },
  result: {
    won: 'Level complete', lost: 'Not enough saved', next: 'Next level', again: 'Play again', retry: 'Try again',
    levels: 'Level select', saved: 'Saved', need: 'Needed', best: 'Previous best',
    short: 'Saved {saved} of {count}. Needed {need}.', all: 'All levels done'
  },
  settings: {
    title: 'Settings', sound: 'Sound', music: 'Music', language: 'Language', contrast: 'High contrast',
    motion: 'Reduce motion', vibrate: 'Vibration', close: 'Close', auto: 'Auto', on: 'On', off: 'Off'
  },
  update: { text: 'New version available', action: 'Update' },
  rotate: 'Rotate for a wider view',
  loading: 'Loading'
};
