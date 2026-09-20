import { GUIDE } from './characters';

/**
 * Every child-facing string lives here so the app can be localised and so voice
 * prompts stay short, cheerful, calm and clear. Keys are stable identifiers used by
 * the AudioPromptService.
 */
export const strings = {
  app: {
    name: "PJ's Diamond World",
    worldName: 'Diamond Island',
  },
  intro: {
    tapPrincess: 'Tap the princess!',
    welcome: (nickname: string) => `Welcome to Diamond Island, ${nickname}!`,
    skip: 'Skip',
    guideHello: `Hi! I'm ${GUIDE.name}!`,
  },
  home: {
    create: 'Create',
    garden: 'My Garden',
    music: 'Music Reef',
    book: 'My Diamond Book',
    parent: 'Grown-ups',
  },
  create: {
    title: 'Create',
    draw: 'Draw & Paint',
    craft: 'Craft With Me',
  },
  drawing: {
    brush: 'Brush',
    crayon: 'Crayon',
    eraser: 'Eraser',
    undo: 'Undo',
    redo: 'Redo',
    clear: 'Start over',
    clearHint: 'Hold to start over',
    colors: 'Colors',
    stamps: 'Stamps',
    save: 'Save',
    saved: (title: string) => `${title} is in your Diamond Book!`,
  },
  crafts: {
    title: 'Craft With Me',
    next: 'Next',
    back: 'Back',
    takePicture: 'Take a picture',
    retake: 'Try again',
    keep: 'Keep it',
    save: (thing: string) => `Save My ${thing.charAt(0).toUpperCase()}${thing.slice(1)}`,
    celebrate: (nickname: string, thing: string) => `${nickname} made a ${thing}!`,
    skipPhoto: 'No picture today',
  },
  book: {
    title: 'My Diamond Book',
    all: 'All',
    drawings: 'Drawings',
    crafts: 'Crafts',
    favorites: 'Favorites',
    empty: 'Make something and it will appear here!',
    favorite: 'Favorite',
  },
  garden: {
    title: 'My Garden',
    grew: 'Your garden grew!',
    unlocked: (name: string) => `A ${name} appeared!`,
    hint: 'Make drawings and crafts to help your garden grow.',
  },
  music: {
    title: 'Music Reef',
    play: 'Play',
    pause: 'Pause',
    next: 'Next song',
    volume: 'Volume',
  },
  common: {
    home: 'Home',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    oops: "Oops! Let's try again.",
    tryAgain: 'Try again',
    close: 'Close',
  },
  parent: {
    gateTitle: 'Grown-ups only',
    gateHint: 'Hold the button, then answer the question.',
    gateQuestion: (a: number, b: number) => `What is ${a} + ${b}?`,
    pinTitle: 'Enter your PIN',
    title: 'Parent Mode',
    settings: 'Settings',
    creations: 'Creations',
    privacy: 'Privacy',
    storage: 'Storage',
    profile: 'Child profile',
    exit: 'Back to Diamond Island',
  },
} as const;

/** Voice prompt catalogue. Short, cheerful, calm. */
export const voicePrompts = {
  welcome: (nickname: string) => `Welcome to Diamond Island, ${nickname}!`,
  tapPrincess: 'Tap the princess!',
  home: 'What do you want to do?',
  create: "Let's create!",
  draw: "Let's draw!",
  craft: "Let's make a craft!",
  garden: 'Look at your garden!',
  music: "Let's listen to music!",
  book: "Here's your Diamond Book!",
  saved: 'Saved!',
  celebrate: (nickname: string, thing: string) => `${nickname} made a ${thing}!`,
  gardenGrew: 'Your garden grew!',
  oops: "Oops! Let's try again.",
} as const;
