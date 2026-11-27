import { ladders } from './challenges';
import { drawFromBank } from './decks';

export const ladderLevels = ['Classic', 'Stretch', 'Expert'] as const;
export type LadderLevel = typeof ladderLevels[number];
export type LadderPuzzle = { path: string[]; checkpoint?: string };

// At least four positions differ between the endpoints of each five-letter ladder.
const stretch = [
  'BRAIN TRAIN TRAIT TRACT TRACK TRICK',
  'BRICK BRINK BLINK BLANK PLANK',
  'PEACH PEACE PLACE PLATE SLATE STATE',
  'SMILE SMITE SUITE QUITE QUOTE',
  'PLANT PLANK BLANK BLAND BLOND BLOOD BLOOM',
  'TRAIN TRAIT TRACT TRACK TRICK THICK THINK',
  'BREAD BROAD BROOD BLOOD BLOOM GLOOM',
  'CLOCK BLOCK BLACK BLANK BLAND',
  'GIANT GRANT GRAND BRAND BLAND BLIND BLINK',
  'SPARK SPARE SPACE SPICE SPIKE SPOKE SMOKE',
  'STONE ATONE ALONE CLONE CLOSE CHOSE CHASE',
  'SHARK SNARK SNACK SLACK BLACK BLOCK CLOCK',
  'FRESH FLESH FLASH CLASH CLASS GLASS GLOSS',
  'FLOUR FLOOR FLOOD BLOOD BROOD BROOM',
  'CROWN GROWN GROWS GROSS GRASS',
  'CHESS CHEST CREST CRUST TRUST',
  'SCORE SHORE SHIRE SHIRT SHIFT SWIFT',
  'SNAIL SNARL SNARK STARK STORK STORM',
  'COAST BOAST BEAST LEAST LEASE LEAVE',
  'BOOKS BOOTS BOATS BEATS SEATS SEAMS TEAMS',
  'TRUCK TRACK CRACK CRANK CLANK CLANG',
  'PAINT SAINT STINT STINK STICK STUCK',
  'DREAM CREAM CREAK CREEK CHEEK CHECK',
  'SLIME SLICE SLICK STICK STOCK SHOCK',
  'SHINE SHONE PHONE PRONE PROVE DROVE',
  'CRANE CRAVE GRAVE GROVE GLOVE GLOBE',
  'GLASS GLOSS GLOWS BLOWS BLOWN CLOWN',
  'BENCH BEACH PEACH PEACE PLACE PLATE',
  'RIVER LIVER LOVER LOVED MOVED MOWED',
  'BRUSH BLUSH FLUSH FLASH CLASH CLASS',
];

// The first leg ends at the checkpoint. The second continues to the target.
const expert = [
  ['DUSK DUCK BUCK BACK', 'BARK BARN DARN DAWN'],
  ['MOON SOON SOOT BOOT BOAT', 'BEAT SEAT STAT STAR'],
  ['FISH WISH WISE WINE WING', 'WIND BIND BIRD'],
  ['BOOK TOOK TOOL TOLL TELL', 'TALL TALE PALE PAGE'],
  ['READ ROAD ROAM FOAM FORM', 'FORT PORT POET POEM'],
  ['FIRE FIRM FORM FORT FOOT', 'SOOT SHOT SHOW SNOW'],
  ['WOLF GOLF GOLD BOLD BOND', 'BAND BANK BACK PACK'],
  ['WIND WILD WILL FILL FULL', 'FALL FAIL RAIL RAIN'],
  ['EAST CAST COST COAT BOAT', 'BEAT BEST WEST'],
  ['SEED SEND BEND BENT', 'BEAT BEAN LEAN LEAF'],
  ['SHIP SHOP SHOT SOOT BOOT', 'BOOK LOOK LOCK DOCK'],
  ['MINT MINE MICE DICE', 'RICE RACE RAGE SAGE'],
  ['HAND BAND BIND MIND MILD', 'MOLD MOOD FOOD FOOT'],
  ['SOFT SOOT BOOT BOOK', 'COOK CORK CORD LORD LOUD'],
  ['SAND LAND LANE LAKE', 'LIKE LIME TIME TIDE'],
  ['BLACK BLANK BLINK BRINK BRICK', 'TRICK TRICE TRITE WRITE WHITE'],
  ['SHORE STORE STARE STATE SLATE', 'PLATE PLACE PEACE PEACH BEACH'],
  ['PLANE PLANK CLANK CRANK CRACK', 'TRACK TRACT TRAIT TRAIN'],
  ['BOOKS BOOTS BOATS BEATS SEATS', 'STATS STARS STARE STORE STORY'],
  ['CRANE CRANK CLANK BLANK BLACK', 'SLACK STACK STOCK STORK'],
  ['STONE SHONE SHINE SWINE', 'TWINE TWICE TRICE TRICK BRICK'],
  ['SEEDS SEEMS SEAMS SEATS STATS STATE', 'SLATE PLATE PLANE PLANT'],
  ['SLICE SLICK CLICK CHICK CHECK', 'CHEEK CREEK CREAK BREAK BREAD'],
  ['SHAKER SHAKES STAKES STATES', 'SLATES PLATES PLANES PLANET'],
  ['TICKET PICKET PACKET PACKED', 'PARKED PARTED CARTED CARVED'],
  ['MARKET MARKED BARKED BANKED', 'BANNED BANNER TANNER'],
  ['POTTER POTTED ROTTED RATTED', 'BATTED BATTER BUTTER'],
  ['SCARED STARED STATED SLATED SLATES', 'PLATES PLACES PLACED PLAYED'],
  ['WONDER WANDER SANDER SANDED BANDED', 'BANKED BACKED PACKED PACKET'],
  ['LETTER BETTER BATTER BATTED BASTED', 'BASKED BANKED BANDED HANDED'],
];

export const ladderBanks: Record<LadderLevel, LadderPuzzle[]> = {
  Classic: ladders.map(path => ({ path })),
  Stretch: stretch.map(route => ({ path: route.split(' ') })),
  Expert: expert.map(([firstLeg, secondLeg]) => {
    const first = firstLeg.split(' ');
    return { path: [...first, ...secondLeg.split(' ')], checkpoint: first[first.length - 1] };
  }),
};

export function drawLadder(level: LadderLevel, previous?: LadderPuzzle): LadderPuzzle {
  const bank = ladderBanks[level];
  if (level === 'Classic') {
    // The original game stored numeric indices under this key. Keep its saved rotation.
    const indices = bank.map((_, i) => i);
    const [index] = drawFromBank('challenge-4', indices, 1, previous ? [bank.indexOf(previous)] : []);
    return bank[index];
  }
  return drawFromBank('word-ladder-' + level, bank, 1, previous ? [previous] : [])[0];
}

export function ladderStepError(puzzle: LadderPuzzle, trail: string[], word: string): string | undefined {
  const last = trail[trail.length - 1];
  if (word.length !== last.length || !/^[A-Z]+$/.test(word)) {
    return `Enter a ${last.length}-letter word.`;
  }
  if (trail.includes(word)) return `${word} is already on the ladder.`;
  if ([...word].filter((letter, i) => letter !== last[i]).length !== 1) {
    return `Change exactly one letter in ${last}.`;
  }
  if (word === puzzle.path[puzzle.path.length - 1] && puzzle.checkpoint && !trail.includes(puzzle.checkpoint)) {
    return `Reach ${puzzle.checkpoint} before finishing at ${word}.`;
  }
}
