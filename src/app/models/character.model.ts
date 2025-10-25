export interface Character {
  // Basic Info
  name: string;
  lineage: string;
  class: string;
  experience: string;
  luck: number;
  grit: number;

  // Attributes
  might: number;
  toughness: number;
  agility: number;
  willpower: number;
  intelligence: number;
  fate: number;

  // Armor Stats
  armorType: string;
  armor: number;
  av: number;
  penalty: number;
  traits: string[]; // Max 2

  // Magic Items
  talisman1: string;
  talisman2: string;
  trinket1: string;
  trinket2: string;
  focus: string;

  // Oaths
  oaths: string[]; // Max 3

  // Magic
  magicAndSpecialTraits: string;
  arcaneStress: string;
  stressThreshold: string;
  spellSaveModifier: string;

  // Currency
  copper: number;
  silver: number;
  gold: number;

  // Item Slots (grid)
  itemSlots: string[]; // Array of item descriptions

  // Weapons
  weapons: Weapon[];

  // Skills
  skills: Skill[];
}

export interface Weapon {
  weapon: string;
  range: string;
  damage: string;
  ap: string;
  traits: string;
}

export interface Skill {
  name: string;
  skillRanks: string;
  modifiers: string;
  totalDice: string;
  diceColor: string;
}

// Lineage and Class definitions
export const LINEAGES = [
  'Dwarf',
  'Firbolg',
  'Halfling',
  'High Elf',
  'Human',
  'Wood Elf'
];

export const CLASSES_BY_LINEAGE: { [key: string]: string[] } = {
  'Dwarf': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour'],
  'Firbolg': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour'],
  'Halfling': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour'],
  'High Elf': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour'],
  'Human': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour'],
  'Wood Elf': ['Berserker', 'Champion', 'Delver', 'Knight', 'Mage', 'Priest', 'Scout', 'Soldier', 'Spellblade', 'Troubadour']
};

// Available oaths
export const AVAILABLE_OATHS = [
  'Compassion',
  'Courage',
  'Diligence',
  'Faith',
  'Humility',
  'Justice',
  'Loyalty',
  'Peace',
  'Perseverance',
  'Purity',
  'Truth',
  'Wisdom'
];

// Default skill ranks by class
export const CLASS_SKILL_DEFAULTS: { [key: string]: { [key: string]: number } } = {
  'Berserker': {
    'Acrobatics (Ag)': 1,
    'Athletics (M)': 3,
    'Defense (Ag / M)': 1,
    'Fighting (Ag / M)': 2,
    'Survival (WP)': 1,
    'Resilience (T)': 3
  },
  'Champion': {
    'Athletics (M)': 1,
    'Acrobatics (Ag)': 2,
    'Defense (Ag / M)': 2,
    'Dexterity (Ag)': 1,
    'Discipline (WP)': 1,
    'Fighting (Ag / M)': 2,
    'Leadership (WP)': 1,
    'Resilience (T)': 2
  },
  'Delver': {
    'Academics (Int)': 1,
    'Acrobatics (Ag)': 2,
    'Athletics (M)': 2,
    'Defense (Ag / M)': 2,
    'Dexterity (Ag)': 2,
    'Fighting (Ag / M)': 1,
    'Folklore (WP)': 2,
    'Fortune (F)': 2,
    'Orientation (Int)': 2,
    'Perception (WP)': 2,
    'Resilience (T)': 1,
    'Shooting (Ag)': 1,
    'Stealth (Ag)': 2,
    'Survival (WP)': 2
  },
  'Knight': {
    'Academics (Int)': 1,
    'Animal Handling (WP)': 1,
    'Athletics (M)': 2,
    'Defense (Ag / M)': 2,
    'Diplomacy (WP)': 1,
    'Discipline (WP)': 1,
    'Fighting (Ag / M)': 2,
    'Leadership (WP)': 2,
    'Resilience (T)': 2,
    'Ride (Ag)': 2
  },
  'Mage': {
    'Academics (Int)': 2,
    'Brewing (Int)': 1,
    'Folklore (WP)': 1,
    'Fortune (F)': 1,
    'Magic (Int / WP)': 2,
    'Orientation (Int)': 2,
    'Perception (WP)': 1,
    'Resilience (T)': 1
  },
  'Priest': {
    'Defense (Ag / M)': 1,
    'Diplomacy (WP)': 1,
    'Fighting (Ag / M)': 1,
    'Fortune (F)': 2,
    'Heal (Int)': 2,
    'Leadership (WP)': 1,
    'Magic (Int / WP)': 2,
    'Orientation (Int)': 1,
    'Resilience (T)': 2
  },
  'Scout': {
    'Animal Handling (WP)': 2,
    'Defense (Ag / M)': 1,
    'Dexterity (Ag)': 1,
    'Folklore (WP)': 2,
    'Heal (Int)': 1,
    'Orientation (Int)': 2,
    'Perception (WP)': 2,
    'Resilience (T)': 2,
    'Stealth (Ag)': 1,
    'Shooting (Ag)': 2,
    'Survival (WP)': 2,
    'Tracking (Int)': 2
  },
  'Soldier': {
    'Athletics (M)': 2,
    'Defense (Ag / M)': 2,
    'Discipline (WP)': 2,
    'Fighting (Ag / M)': 2,
    'Leadership (WP)': 2,
    'Orientation (Int)': 1,
    'Resilience (T)': 3,
    'Shooting (Ag)': 2
  },
  'Spellblade': {
    'Academics (Int)': 1,
    'Acrobatics (Ag)': 2,
    'Athletics (M)': 1,
    'Defense (Ag / M)': 2,
    'Fighting (Ag / M)': 2,
    'Folklore (WP)': 1,
    'Fortune (F)': 2,
    'Magic (Int / WP)': 1,
    'Resilience (T)': 2
  },
  'Troubadour': {
    'Acrobatics (Ag)': 2,
    'Athletics (M)': 1,
    'Defense (Ag / M)': 2,
    'Dexterity (Ag)': 2,
    'Diplomacy (WP)': 2,
    'Fighting (Ag / M)': 1,
    'Folklore (WP)': 2,
    'Fortune (F)': 1,
    'Orientation (Int)': 2,
    'Perception (WP)': 1,
    'Resilience (T)': 1,
    'Shooting (Ag)': 1,
    'Survival (WP)': 1
  }
};

// Default skills list (non-editable names)
export const DEFAULT_SKILLS: string[] = [
  'Academics (Int)',
  'Acrobatics (Ag)',
  'Animal Handling (WP)',
  'Athletics (M)',
  'Brewing (Int)',
  'Carpentry (Ag)',
  'Defense (Ag / M)',
  'Dexterity (Ag)',
  'Diplomacy (WP)',
  'Discipline (WP)',
  'Fighting (Ag / M)',
  'Folklore (WP)',
  'Fortune (F)',
  'Heal (Int)',
  'Leadership (WP)',
  'Magic (Int / WP)',
  'Masonry (M)',
  'Orientation (Int)',
  'Perception (WP)',
  'Resilience (T)',
  'Ride (Ag)',
  'Shooting (Ag)',
  'Smithing (M)',
  'Stealth (Ag)',
  'Survival (WP)',
  'Tracking (Int)'
];

// Factory function to create a new character with defaults
export function createNewCharacter(): Character {
  return {
    name: '',
    lineage: '',
    class: '',
    experience: '',
    luck: 0,
    grit: 0,
    
    // Attributes - default to 0
    might: 0,
    toughness: 0,
    agility: 0,
    willpower: 0,
    intelligence: 0,
    fate: 0,
    
    // Armor stats
    armorType: '',
    armor: 0,
    av: 0,
    penalty: 0,
    traits: ['', ''],
    
    // Magic items
    focus: '',
    talisman1: '',
    talisman2: '',
    trinket1: '',
    trinket2: '',
    
    // Oaths
    oaths: ['', '', ''],
    
    // Magic
    magicAndSpecialTraits: '',
    arcaneStress: '',
    stressThreshold: '',
    spellSaveModifier: '',
    
    // Currency
    copper: 0,
    silver: 0,
    gold: 0,
    
    // Item slots (default 20 slots)
    itemSlots: Array(20).fill(''),
    
    // Weapons (default 3 empty rows)
    weapons: [
      { weapon: '', range: '', damage: '', ap: '', traits: '' },
      { weapon: '', range: '', damage: '', ap: '', traits: '' },
      { weapon: '', range: '', damage: '', ap: '', traits: '' }
    ],
    
    // Skills with default structure
    skills: DEFAULT_SKILLS.map(skillName => ({
      name: skillName,
      skillRanks: '',
      modifiers: '',
      totalDice: '',
      diceColor: ''
    }))
  };
}

// Character slot management
export interface CharacterSlot {
  id: number;
  character: Character | null;
  lastModified: Date;
}

export const MAX_CHARACTER_SLOTS = 5;

// Apply class skill defaults to a character
export function applyClassSkillDefaults(character: Character, className: string): void {
  const defaults = CLASS_SKILL_DEFAULTS[className];
  
  if (!defaults) {
    return; // No defaults for this class
  }

  // Reset ALL skill fields to empty string first
  character.skills.forEach(skill => {
    skill.skillRanks = '';
    skill.modifiers = '';
    skill.totalDice = '';
    skill.diceColor = '';
  });

  // Apply the rank defaults for this class
  character.skills.forEach(skill => {
    const rank = defaults[skill.name];
    if (rank !== undefined) {
      skill.skillRanks = rank.toString();
    }
  });
}