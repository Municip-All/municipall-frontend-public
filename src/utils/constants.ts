export const CAT_STYLE: Record<string, { bg: string; color: string; icon: string }> = {
  'Voirie':        { bg: 'var(--color-primary-bg)',  color: 'var(--color-primary-light)', icon: '🛣️' },
  'Éclairage':     { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: '💡' },
  'Propreté':      { bg: 'var(--color-success-bg)',  color: 'var(--color-success)', icon: '🗑️' },
  'Espaces verts': { bg: 'var(--color-success-bg)',  color: 'var(--color-success)', icon: '🌳' },
  'Stationnement': { bg: 'var(--color-secondary-bg)',   color: 'var(--color-secondary)', icon: '🚗' },
  'Bâtiment':      { bg: 'var(--color-gold-bg)', color: 'var(--color-gold)', icon: '🏚️' },
  'Nuisance':      { bg: 'var(--color-danger-bg)',   color: 'var(--color-danger)', icon: '🔊' },
  'Autre':         { bg: 'var(--color-primary-bg)',   color: 'var(--color-primary-light)', icon: '📍' },
};

export const STATUS_COLOR: Record<string, string> = {
  'en-cours': 'var(--color-primary-light)',
  'attente':  'var(--color-warning)',
  'resolu':   'var(--color-success)',
  'rejete':   'var(--color-danger)',
};

export const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  culture:  { bg: 'var(--color-purple-bg)', color: 'var(--color-purple)' },
  marche:   { bg: 'var(--color-warning-bg)',  color: 'var(--color-warning)' },
  sport:    { bg: 'var(--color-success-bg)',   color: 'var(--color-success)' },
  info:     { bg: 'var(--color-primary-bg)',   color: 'var(--color-primary-light)' },
  social:   { bg: 'var(--color-warning-bg)',  color: 'var(--color-gold)' },
};

export const CAT_COLOR: Record<string, string> = {
  sport:        'var(--color-success-light)',
  culture:      'var(--color-purple)',
  social:       'var(--color-warning-light)',
  environnement:'var(--color-success-light)',
  jeunesse:     '#A8C69F',
  sante:        'var(--color-danger)',
};


