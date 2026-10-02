import * as migration_20261002_132652_initial from './20261002_132652_initial';
import * as migration_20261002_135622_media_prefix from './20261002_135622_media_prefix';

export const migrations = [
  {
    up: migration_20261002_132652_initial.up,
    down: migration_20261002_132652_initial.down,
    name: '20261002_132652_initial',
  },
  {
    up: migration_20261002_135622_media_prefix.up,
    down: migration_20261002_135622_media_prefix.down,
    name: '20261002_135622_media_prefix'
  },
];
