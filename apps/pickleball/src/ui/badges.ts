// The 20 award badges (paddle-shaped liquid glass), made by Anass with an image generator on 22 Nov 2026
// (prompts in docs/badges-source/README.md, rights in RIGHTS.md). Cut from two sheets by a script.
import type { AwardId } from '../logic/achievements';

export const BADGES: Record<AwardId, number> = {
  'first-dink': require('../../assets/badges/01-first-dink.png'),
  pickled: require('../../assets/badges/02-pickled.png'),
  comeback: require('../../assets/badges/03-comeback.png'),
  marathon: require('../../assets/badges/04-marathon.png'),
  'quick-kill': require('../../assets/badges/05-quick-kill.png'),
  'hot-streak': require('../../assets/badges/06-hot-streak.png'),
  'on-fire': require('../../assets/badges/07-on-fire.png'),
  'iron-paddle': require('../../assets/badges/08-iron-paddle.png'),
  'social-butterfly': require('../../assets/badges/09-social-butterfly.png'),
  'win-by-two': require('../../assets/badges/10-win-by-two.png'),
  host: require('../../assets/badges/11-host.png'),
  regular: require('../../assets/badges/12-regular.png'),
  'club-captain': require('../../assets/badges/13-club-captain.png'),
  'full-house': require('../../assets/badges/14-full-house.png'),
  'four-courts': require('../../assets/badges/15-four-courts.png'),
  century: require('../../assets/badges/16-century.png'),
  'early-bird': require('../../assets/badges/17-early-bird.png'),
  'night-owl': require('../../assets/badges/18-night-owl.png'),
  'weekend-warrior': require('../../assets/badges/19-weekend-warrior.png'),
  'golden-paddle': require('../../assets/badges/20-golden-paddle.png'),
};
