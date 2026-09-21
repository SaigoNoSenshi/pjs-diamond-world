import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

/** Read-along story activities — 3 original tales for Diamond Island. */
export const storyActivities: ActivityDefinition[] = [
  // 1. Jelly's Lost Diamond
  {
    id: 'act_story_lost_diamond',
    grades: [1, 2],
    subject: 'english',
    kind: 'STORY',
    islandId: 'stories',
    title: "Jelly's Lost Diamond",
    icon: 'jellyfish',
    color: palette.sunshine,
    voiceIntro: "Let's read a story! Tap the words and I will read them.",
    instruction: 'Tap a word to hear it.',
    reward: { diamonds: 5, stickerId: 'stk_moon' },
    tags: ['story', 'read-along'],
    data: {
      kind: 'STORY',
      pages: [
        {
          text: 'Jelly the yellow jellyfish played in the blue lagoon. She loved her sparkly diamond. She tossed it and caught it in the gentle waves.',
          illustration: 'story.lostDiamond.1',
        },
        {
          text: 'One morning, the diamond was gone! Jelly looked and looked. She swam to Crab on the sandy floor. "Have you seen my diamond?" she asked.',
          illustration: 'story.lostDiamond.2',
        },
        {
          text: 'Turtle paddled over to help. They searched near the big rocks and the coral shells. "Do not worry, Jelly," said Turtle with a kind smile.',
          illustration: 'story.lostDiamond.3',
        },
        {
          text: 'Whale blew a big whoosh of water and lifted them high. Turtle looked down and spotted a sparkle under a striped shell. "There it is!"',
          illustration: 'story.lostDiamond.4',
        },
        {
          text: 'Turtle lifted the shell and the diamond shone bright. Jelly laughed with joy. "Thank you, friends!" she said. They all danced in the waves.',
          illustration: 'story.lostDiamond.5',
        },
      ],
      question: {
        id: 'ld_end_q1',
        prompt: 'Who found the diamond under the shell?',
        choices: [
          { id: 'turtle', label: 'Turtle', picture: { icon: 'turtle', color: palette.leaf } },
          { id: 'crab', label: 'Crab', picture: { icon: 'crab', color: palette.coral } },
          { id: 'whale', label: 'Whale', picture: { icon: 'whale', color: palette.sea } },
        ],
        answerId: 'turtle',
      },
    },
  },

  // 2. The Princess and the Rainbow Fish
  {
    id: 'act_story_rainbow_fish',
    grades: [1, 2],
    subject: 'english',
    kind: 'STORY',
    islandId: 'stories',
    title: 'The Princess and the Rainbow Fish',
    icon: 'fish',
    color: palette.blossom,
    voiceIntro: "Let's read a story! Tap the words and I will read them.",
    instruction: 'Tap a word to hear it.',
    reward: { diamonds: 5, stickerId: 'stk_boat' },
    tags: ['story', 'read-along'],
    data: {
      kind: 'STORY',
      pages: [
        {
          text: 'On Diamond Island there lived a princess who loved to paint. Every day she sat on the beach with her colourful brushes, painting the sea.',
          illustration: 'story.rainbowFish.1',
        },
        {
          text: 'A small grey fish peeked up from the water. It looked so sad. "I wish I had colours," the fish said softly. The princess put down her brush.',
          illustration: 'story.rainbowFish.2',
        },
        {
          text: 'The princess smiled and dipped her big brush into pink, blue, yellow and green. Then she painted the waves with swirling, swirling colour.',
          illustration: 'story.rainbowFish.3',
        },
        {
          text: 'The grey fish swam through the painted waves. Splash! Its scales turned pink and blue and yellow and green. It was a rainbow fish now!',
          illustration: 'story.rainbowFish.4',
        },
        {
          text: 'The princess clapped her hands. The rainbow fish leapt and danced in the sunset. "Thank you!" it sang. The sky turned orange and gold.',
          illustration: 'story.rainbowFish.5',
        },
      ],
      question: {
        id: 'rf_end_q1',
        prompt: 'How did the fish get its colours?',
        choices: [
          {
            id: 'swam_waves',
            label: 'Swam through the waves',
            picture: { icon: 'fish', color: palette.blossom },
          },
          {
            id: 'found_rainbow',
            label: 'Found a rainbow',
            picture: { icon: 'rainbow', color: palette.sunshine },
          },
          {
            id: 'whale_painted',
            label: 'Whale painted it',
            picture: { icon: 'whale', color: palette.sea },
          },
        ],
        answerId: 'swam_waves',
      },
    },
  },

  // 3. PJ's Robot Pig Day
  {
    id: 'act_story_robot_pig',
    grades: [1, 2],
    subject: 'english',
    kind: 'STORY',
    islandId: 'stories',
    title: "PJ's Robot Pig Day",
    icon: 'pig',
    color: palette.lavender,
    voiceIntro: "Let's read a story! Tap the words and I will read them.",
    instruction: 'Tap a word to hear it.',
    reward: { diamonds: 5, stickerId: 'stk_pig' },
    tags: ['story', 'read-along'],
    data: {
      kind: 'STORY',
      pages: [
        {
          text: 'PJ spread her arms wide and walked very stiffly. "I am a robot!" she called. Bzzzt! Bzzzt! Her friend Jelly bobbed up and down watching her.',
          illustration: 'story.robotPig.1',
        },
        {
          text: 'Jelly tried too. She waved her tentacles very slowly. "Beep! Boop!" she beeped. PJ laughed and laughed. "You are the best robot, Jelly!"',
          illustration: 'story.robotPig.2',
        },
        {
          text: '"Now I am a pig!" said PJ. She dropped to her knees in the warm sand. "Oink! Oink!" She rolled and rolled. Jelly bounced with joy.',
          illustration: 'story.robotPig.3',
        },
        {
          text: 'Together they built a tall sand castle. "This is where the robot pig lives!" said PJ. They put shells and a little flag on top.',
          illustration: 'story.robotPig.4',
        },
        {
          text: 'The sun dipped low. PJ lay under the big palm tree. Jelly floated gently beside her. They were tired and very happy. Soon they were fast asleep.',
          illustration: 'story.robotPig.5',
        },
      ],
      question: {
        id: 'rp_end_q1',
        prompt: 'What did PJ and Jelly build together?',
        choices: [
          {
            id: 'castle',
            label: 'Sand castle',
            picture: { icon: 'island', color: palette.sunshine },
          },
          { id: 'robot', label: 'A robot', picture: { icon: 'robot', color: palette.sea } },
          { id: 'boat', label: 'A boat', picture: { icon: 'boat', color: palette.tangerine } },
        ],
        answerId: 'castle',
      },
    },
  },
];
