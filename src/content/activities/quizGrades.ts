import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

/** Grade-aligned quiz banks for Science (G1–G6) and Araling Panlipunan (G1–G6).
 *  Two sets per grade per subject: first set 10 questions, second set 8 questions. */
export const gradeQuizActivities: ActivityDefinition[] = [
  // ════════════════════════════════════════════════════════════
  // SCIENCE — first set (10 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_sci_g1',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 1',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 1! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-1'],
    grades: [1],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g1_q1',
          prompt: 'Which one is a living thing?',
          choices: [
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'chair', label: 'Chair', picture: { icon: 'chair', color: palette.sea } },
          ],
          answerId: 'dog',
        },
        {
          id: 'sci_g1_q2',
          prompt: 'Which one is NOT a living thing?',
          choices: [
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'tree', label: 'Tree', picture: { icon: 'tree', color: palette.leaf } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'rock',
        },
        {
          id: 'sci_g1_q3',
          prompt: 'Which body part do we use to see?',
          choices: [
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.tangerine } },
          ],
          answerId: 'eye',
        },
        {
          id: 'sci_g1_q4',
          prompt: 'Which body part do we use to hear?',
          choices: [
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.tangerine } },
          ],
          answerId: 'ear',
        },
        {
          id: 'sci_g1_q5',
          prompt: 'Which body part do we use to smell?',
          choices: [
            { id: 'nose', label: 'Nose', picture: { icon: 'nose', color: palette.tangerine } },
            { id: 'mouth', label: 'Mouth', picture: { icon: 'mouth', color: palette.coral } },
            { id: 'eye', label: 'Eye', picture: { icon: 'eye', color: palette.sea } },
          ],
          answerId: 'nose',
        },
        {
          id: 'sci_g1_q6',
          prompt: 'What do we see in the sky on a sunny day?',
          choices: [
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'moon', label: 'Moon', picture: { icon: 'moon', color: palette.lavender } },
            { id: 'rain', label: 'Rain', picture: { icon: 'rain', color: palette.sea } },
          ],
          answerId: 'sun',
        },
        {
          id: 'sci_g1_q7',
          prompt: 'What falls from clouds on a rainy day?',
          choices: [
            { id: 'rain', label: 'Rain', picture: { icon: 'rain', color: palette.sea } },
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'star', label: 'Star', picture: { icon: 'star', color: palette.lavender } },
          ],
          answerId: 'rain',
        },
        {
          id: 'sci_g1_q8',
          prompt: 'What lights up the sky during the day?',
          choices: [
            { id: 'c_sun', label: 'The sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'c_moon', label: 'The moon', picture: { icon: 'moon', color: palette.lavender } },
            { id: 'c_cloud', label: 'A cloud', picture: { icon: 'cloud', color: palette.sea } },
          ],
          answerId: 'c_sun',
        },
        {
          id: 'sci_g1_q9',
          prompt: 'Where do birds usually build their homes?',
          choices: [
            {
              id: 'tree_nest',
              label: 'In a nest in a tree',
              picture: { icon: 'tree', color: palette.leaf },
            },
            { id: 'in_sea', label: 'In the sea' },
            { id: 'underground', label: 'Under the ground' },
          ],
          answerId: 'tree_nest',
        },
        {
          id: 'sci_g1_q10',
          prompt: 'Which animal lives in water?',
          choices: [
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.leaf } },
          ],
          answerId: 'fish',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci_g2',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 2',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 2! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-2'],
    grades: [2],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g2_q1',
          prompt: 'Which plant part makes food using sunlight?',
          choices: [
            { id: 'leaf', label: 'Leaf', picture: { icon: 'leaf', color: palette.leaf } },
            { id: 'root', label: 'Root' },
            { id: 'stem', label: 'Stem' },
          ],
          answerId: 'leaf',
        },
        {
          id: 'sci_g2_q2',
          prompt: 'Which plant part absorbs water from the soil?',
          choices: [
            { id: 'root', label: 'Root' },
            { id: 'leaf', label: 'Leaf', picture: { icon: 'leaf', color: palette.leaf } },
            { id: 'flower', label: 'Flower', picture: { icon: 'flower', color: palette.blossom } },
          ],
          answerId: 'root',
        },
        {
          id: 'sci_g2_q3',
          prompt: 'Which animal group does a whale belong to?',
          choices: [
            { id: 'fish', label: 'Fish' },
            { id: 'birds', label: 'Birds' },
            { id: 'mammals', label: 'Mammals' },
          ],
          answerId: 'mammals',
        },
        {
          id: 'sci_g2_q4',
          prompt: 'Which animal lays eggs and has feathers?',
          choices: [
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
          ],
          answerId: 'bird',
        },
        {
          id: 'sci_g2_q5',
          prompt: 'Which food is a healthy snack?',
          choices: [
            { id: 'apple', label: 'Apple', picture: { icon: 'apple', color: palette.coral } },
            { id: 'candy', label: 'Candy' },
            { id: 'chips', label: 'Chips' },
          ],
          answerId: 'apple',
        },
        {
          id: 'sci_g2_q6',
          prompt: 'What should you do before eating food?',
          choices: [
            { id: 'wash_hands', label: 'Wash your hands' },
            { id: 'play_outside', label: 'Play outside' },
            { id: 'watch_tv', label: 'Watch TV' },
          ],
          answerId: 'wash_hands',
        },
        {
          id: 'sci_g2_q7',
          prompt: 'Which animal group uses gills to breathe in water?',
          choices: [
            { id: 'fish', label: 'Fish' },
            { id: 'birds', label: 'Birds' },
            { id: 'mammals', label: 'Mammals' },
          ],
          answerId: 'fish',
        },
        {
          id: 'sci_g2_q8',
          prompt: 'Why is it important to drink water every day?',
          choices: [
            { id: 'keep_healthy', label: 'To keep our body healthy' },
            { id: 'grow_taller', label: 'To grow taller only' },
            { id: 'sleep_better', label: 'To help us sleep longer' },
          ],
          answerId: 'keep_healthy',
        },
        {
          id: 'sci_g2_q9',
          prompt: 'Which food gives our body energy to grow?',
          choices: [
            { id: 'rice', label: 'Rice', picture: { icon: 'rice', color: palette.sunshine } },
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'spoon', label: 'Spoon', picture: { icon: 'spoon', color: palette.sea } },
          ],
          answerId: 'rice',
        },
        {
          id: 'sci_g2_q10',
          prompt: 'Which animal is a mammal?',
          choices: [
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.tangerine } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.leaf } },
          ],
          answerId: 'cat',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci_g3',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 3',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 3! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-3'],
    grades: [3],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g3_q1',
          prompt: 'What are the three states of matter?',
          choices: [
            { id: 'slg', label: 'Solid, liquid, and gas' },
            { id: 'hwc', label: 'Hot, warm, and cold' },
            { id: 'rwa', label: 'Rock, water, and air' },
          ],
          answerId: 'slg',
        },
        {
          id: 'sci_g3_q2',
          prompt: 'Which state of matter has a definite shape?',
          choices: [
            { id: 'solid', label: 'Solid' },
            { id: 'liquid', label: 'Liquid' },
            { id: 'gas', label: 'Gas' },
          ],
          answerId: 'solid',
        },
        {
          id: 'sci_g3_q3',
          prompt: 'What does a magnet attract?',
          choices: [
            { id: 'wood', label: 'Wood' },
            { id: 'iron_steel', label: 'Iron and steel' },
            { id: 'plastic', label: 'Plastic' },
          ],
          answerId: 'iron_steel',
        },
        {
          id: 'sci_g3_q4',
          prompt: 'Which body system helps you breathe?',
          choices: [
            { id: 'digestive', label: 'Digestive system' },
            { id: 'respiratory', label: 'Respiratory system' },
            { id: 'skeletal', label: 'Skeletal system' },
          ],
          answerId: 'respiratory',
        },
        {
          id: 'sci_g3_q5',
          prompt: "What stage comes after the egg in a butterfly's life cycle?",
          choices: [
            { id: 'pupa', label: 'Pupa' },
            { id: 'caterpillar', label: 'Caterpillar (larva)' },
            { id: 'adult', label: 'Adult butterfly' },
          ],
          answerId: 'caterpillar',
        },
        {
          id: 'sci_g3_q6',
          prompt: 'What gives the Earth light and warmth?',
          choices: [
            { id: 'moon', label: 'The moon' },
            { id: 'sun', label: 'The sun' },
            { id: 'stars', label: 'The stars' },
          ],
          answerId: 'sun',
        },
        {
          id: 'sci_g3_q7',
          prompt: 'How long does it take Earth to orbit the sun?',
          choices: [
            { id: 'one_week', label: 'One week' },
            { id: 'one_month', label: 'One month' },
            { id: 'one_year', label: 'One year' },
          ],
          answerId: 'one_year',
        },
        {
          id: 'sci_g3_q8',
          prompt: 'Which state of matter takes the shape of its container?',
          choices: [
            { id: 'solid', label: 'Solid' },
            { id: 'liquid', label: 'Liquid' },
            { id: 'gas', label: 'Gas' },
          ],
          answerId: 'liquid',
        },
        {
          id: 'sci_g3_q9',
          prompt: 'Which poles of a magnet attract each other?',
          choices: [
            { id: 'two_north', label: 'Two north poles' },
            { id: 'opposite', label: 'Opposite poles (N and S)' },
            { id: 'two_south', label: 'Two south poles' },
          ],
          answerId: 'opposite',
        },
        {
          id: 'sci_g3_q10',
          prompt: 'What does the Moon orbit?',
          choices: [
            { id: 'the_sun', label: 'The sun' },
            { id: 'mars', label: 'Mars' },
            { id: 'the_earth', label: 'The Earth' },
          ],
          answerId: 'the_earth',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci_g4',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 4',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 4! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-4'],
    grades: [4],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g4_q1',
          prompt: 'In a food chain, what role do plants play?',
          choices: [
            { id: 'consumers', label: 'Consumers' },
            { id: 'producers', label: 'Producers' },
            { id: 'decomposers', label: 'Decomposers' },
          ],
          answerId: 'producers',
        },
        {
          id: 'sci_g4_q2',
          prompt: 'What do we call animals that eat only plants?',
          choices: [
            { id: 'herbivores', label: 'Herbivores' },
            { id: 'carnivores', label: 'Carnivores' },
            { id: 'omnivores', label: 'Omnivores' },
          ],
          answerId: 'herbivores',
        },
        {
          id: 'sci_g4_q3',
          prompt: 'What force pulls objects toward the center of the Earth?',
          choices: [
            { id: 'friction', label: 'Friction' },
            { id: 'gravity', label: 'Gravity' },
            { id: 'magnetism', label: 'Magnetism' },
          ],
          answerId: 'gravity',
        },
        {
          id: 'sci_g4_q4',
          prompt: 'What force slows down a box sliding on the floor?',
          choices: [
            { id: 'gravity', label: 'Gravity' },
            { id: 'friction', label: 'Friction' },
            { id: 'magnetism', label: 'Magnetism' },
          ],
          answerId: 'friction',
        },
        {
          id: 'sci_g4_q5',
          prompt: 'Which material allows light to pass through it?',
          choices: [
            { id: 'wood', label: 'Wood' },
            { id: 'glass', label: 'Glass' },
            { id: 'metal', label: 'Metal' },
          ],
          answerId: 'glass',
        },
        {
          id: 'sci_g4_q6',
          prompt: 'What does sound need to travel from one place to another?',
          choices: [
            { id: 'vacuum', label: 'A vacuum only' },
            { id: 'medium', label: 'A medium like air, water, or solid' },
            { id: 'only_water', label: 'Only water' },
          ],
          answerId: 'medium',
        },
        {
          id: 'sci_g4_q7',
          prompt: 'Which organ starts the digestion of food in our body?',
          choices: [
            { id: 'stomach', label: 'Stomach' },
            { id: 'mouth', label: 'Mouth' },
            { id: 'intestine', label: 'Intestine' },
          ],
          answerId: 'mouth',
        },
        {
          id: 'sci_g4_q8',
          prompt: 'What type of habitat do polar bears live in?',
          choices: [
            { id: 'tropical', label: 'Tropical rainforest' },
            { id: 'arctic', label: 'Cold Arctic regions' },
            { id: 'desert', label: 'Hot desert' },
          ],
          answerId: 'arctic',
        },
        {
          id: 'sci_g4_q9',
          prompt: 'Which type of organism eats only other animals?',
          choices: [
            { id: 'herbivore', label: 'Herbivore' },
            { id: 'carnivore', label: 'Carnivore' },
            { id: 'omnivore', label: 'Omnivore' },
          ],
          answerId: 'carnivore',
        },
        {
          id: 'sci_g4_q10',
          prompt: 'What do we call it when food is broken down in our body?',
          choices: [
            { id: 'evaporation', label: 'Evaporation' },
            { id: 'digestion', label: 'Digestion' },
            { id: 'circulation', label: 'Circulation' },
          ],
          answerId: 'digestion',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci_g5',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 5',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 5! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-5'],
    grades: [5],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g5_q1',
          prompt: 'What gas do plants release during photosynthesis?',
          choices: [
            { id: 'carbon_dioxide', label: 'Carbon dioxide' },
            { id: 'oxygen', label: 'Oxygen' },
            { id: 'nitrogen', label: 'Nitrogen' },
          ],
          answerId: 'oxygen',
        },
        {
          id: 'sci_g5_q2',
          prompt: 'Which gas do plants take in during photosynthesis?',
          choices: [
            { id: 'oxygen', label: 'Oxygen' },
            { id: 'carbon_dioxide', label: 'Carbon dioxide' },
            { id: 'hydrogen', label: 'Hydrogen' },
          ],
          answerId: 'carbon_dioxide',
        },
        {
          id: 'sci_g5_q3',
          prompt: 'What is it called when liquid water turns into water vapor?',
          choices: [
            { id: 'condensation', label: 'Condensation' },
            { id: 'precipitation', label: 'Precipitation' },
            { id: 'evaporation', label: 'Evaporation' },
          ],
          answerId: 'evaporation',
        },
        {
          id: 'sci_g5_q4',
          prompt: 'What do we call water that falls from the atmosphere to Earth?',
          choices: [
            { id: 'evaporation', label: 'Evaporation' },
            { id: 'condensation', label: 'Condensation' },
            { id: 'precipitation', label: 'Precipitation' },
          ],
          answerId: 'precipitation',
        },
        {
          id: 'sci_g5_q5',
          prompt: 'Which simple machine is a wheel with a rope around it?',
          choices: [
            { id: 'lever', label: 'Lever' },
            { id: 'pulley', label: 'Pulley' },
            { id: 'wedge', label: 'Wedge' },
          ],
          answerId: 'pulley',
        },
        {
          id: 'sci_g5_q6',
          prompt: 'Which planet is the largest in our solar system?',
          choices: [
            { id: 'earth', label: 'Earth' },
            { id: 'saturn', label: 'Saturn' },
            { id: 'jupiter', label: 'Jupiter' },
          ],
          answerId: 'jupiter',
        },
        {
          id: 'sci_g5_q7',
          prompt: 'What instrument is used to measure wind speed?',
          choices: [
            { id: 'thermometer', label: 'Thermometer' },
            { id: 'barometer', label: 'Barometer' },
            { id: 'anemometer', label: 'Anemometer' },
          ],
          answerId: 'anemometer',
        },
        {
          id: 'sci_g5_q8',
          prompt: 'Which form of energy comes directly from the sun?',
          choices: [
            { id: 'chemical', label: 'Chemical energy' },
            { id: 'mechanical', label: 'Mechanical energy' },
            { id: 'solar', label: 'Solar (light) energy' },
          ],
          answerId: 'solar',
        },
        {
          id: 'sci_g5_q9',
          prompt: 'How many planets are in our solar system?',
          choices: [
            { id: 'seven', label: '7' },
            { id: 'eight', label: '8' },
            { id: 'nine', label: '9' },
          ],
          answerId: 'eight',
        },
        {
          id: 'sci_g5_q10',
          prompt: 'What instrument measures air temperature?',
          choices: [
            { id: 'anemometer', label: 'Anemometer' },
            { id: 'thermometer', label: 'Thermometer' },
            { id: 'barometer', label: 'Barometer' },
          ],
          answerId: 'thermometer',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci_g6',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest: Grade 6',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has science questions for Grade 6! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-6'],
    grades: [6],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci_g6_q1',
          prompt: 'What is the basic unit of all living things?',
          choices: [
            { id: 'atom', label: 'Atom' },
            { id: 'cell', label: 'Cell' },
            { id: 'organ', label: 'Organ' },
          ],
          answerId: 'cell',
        },
        {
          id: 'sci_g6_q2',
          prompt: 'What do we call a community of living things and their environment?',
          choices: [
            { id: 'habitat', label: 'Habitat' },
            { id: 'ecosystem', label: 'Ecosystem' },
            { id: 'biome', label: 'Biome' },
          ],
          answerId: 'ecosystem',
        },
        {
          id: 'sci_g6_q3',
          prompt: 'What type of circuit has only one path for electricity?',
          choices: [
            { id: 'parallel', label: 'Parallel circuit' },
            { id: 'series', label: 'Series circuit' },
            { id: 'open', label: 'Open circuit' },
          ],
          answerId: 'series',
        },
        {
          id: 'sci_g6_q4',
          prompt: 'What is a mixture of salt dissolved in water called?',
          choices: [
            { id: 'compound', label: 'A compound' },
            { id: 'element', label: 'An element' },
            { id: 'solution', label: 'A solution' },
          ],
          answerId: 'solution',
        },
        {
          id: 'sci_g6_q5',
          prompt: 'What causes most earthquakes in the Philippines?',
          choices: [
            { id: 'rainfall', label: 'Heavy rainfall' },
            { id: 'tectonic', label: 'Movement of tectonic plates' },
            { id: 'wind', label: 'Strong wind' },
          ],
          answerId: 'tectonic',
        },
        {
          id: 'sci_g6_q6',
          prompt: 'The Philippines has many volcanoes because it sits in the ___.',
          choices: [
            { id: 'ring_of_fire', label: 'Pacific Ring of Fire' },
            { id: 'coral_triangle', label: 'Coral Triangle' },
            { id: 'tropic_cancer', label: 'Tropic of Cancer' },
          ],
          answerId: 'ring_of_fire',
        },
        {
          id: 'sci_g6_q7',
          prompt: 'Climate is the ___-term pattern of weather in an area.',
          choices: [
            { id: 'short', label: 'Short' },
            { id: 'long', label: 'Long' },
            { id: 'daily', label: 'Daily' },
          ],
          answerId: 'long',
        },
        {
          id: 'sci_g6_q8',
          prompt: 'Which part of the cell controls its activities?',
          choices: [
            { id: 'membrane', label: 'Cell membrane' },
            { id: 'nucleus', label: 'Nucleus' },
            { id: 'cytoplasm', label: 'Cytoplasm' },
          ],
          answerId: 'nucleus',
        },
        {
          id: 'sci_g6_q9',
          prompt: 'A circuit with more than one path for electricity is a ___ circuit.',
          choices: [
            { id: 'series', label: 'Series' },
            { id: 'open', label: 'Open' },
            { id: 'parallel', label: 'Parallel' },
          ],
          answerId: 'parallel',
        },
        {
          id: 'sci_g6_q10',
          prompt: 'Two or more substances combined without a chemical change form a ___.',
          choices: [
            { id: 'element', label: 'An element' },
            { id: 'compound', label: 'A compound' },
            { id: 'mixture', label: 'A mixture' },
          ],
          answerId: 'mixture',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // SCIENCE — second set (8 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_sci2_g1',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 1',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 1! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-1'],
    grades: [1],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g1_q1',
          prompt: 'Plants need sunlight, water, and ___ to grow.',
          choices: [
            { id: 'soil', label: 'Soil' },
            { id: 'sand', label: 'Sand' },
            { id: 'ice', label: 'Ice' },
          ],
          answerId: 'soil',
        },
        {
          id: 'sci2_g1_q2',
          prompt: 'Which body part do we use to touch things?',
          choices: [
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'hand', label: 'Hand', picture: { icon: 'hand', color: palette.tangerine } },
            { id: 'foot', label: 'Foot', picture: { icon: 'foot', color: palette.coral } },
          ],
          answerId: 'hand',
        },
        {
          id: 'sci2_g1_q3',
          prompt: 'What do clouds bring on a stormy day?',
          choices: [
            { id: 'rain', label: 'Rain', picture: { icon: 'rain', color: palette.sea } },
            { id: 'sun', label: 'Sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'star', label: 'Star', picture: { icon: 'star', color: palette.lavender } },
          ],
          answerId: 'rain',
        },
        {
          id: 'sci2_g1_q4',
          prompt: 'Which light do we see in the sky at night?',
          choices: [
            { id: 'moon', label: 'The moon', picture: { icon: 'moon', color: palette.lavender } },
            { id: 'sun', label: 'The sun', picture: { icon: 'sun', color: palette.sunshine } },
            { id: 'cloud', label: 'A cloud', picture: { icon: 'cloud', color: palette.sea } },
          ],
          answerId: 'moon',
        },
        {
          id: 'sci2_g1_q5',
          prompt: 'Where do cats usually make their home?',
          choices: [
            {
              id: 'house',
              label: 'In a house',
              picture: { icon: 'house', color: palette.tangerine },
            },
            { id: 'water', label: 'In the water' },
            { id: 'tree', label: 'In a tree', picture: { icon: 'tree', color: palette.leaf } },
          ],
          answerId: 'house',
        },
        {
          id: 'sci2_g1_q6',
          prompt: 'Which one is alive?',
          choices: [
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'spoon', label: 'Spoon', picture: { icon: 'spoon', color: palette.tangerine } },
          ],
          answerId: 'bird',
        },
        {
          id: 'sci2_g1_q7',
          prompt: 'Which body part do we use to taste food?',
          choices: [
            { id: 'mouth', label: 'Mouth', picture: { icon: 'mouth', color: palette.coral } },
            { id: 'ear', label: 'Ear', picture: { icon: 'ear', color: palette.blossom } },
            { id: 'foot', label: 'Foot', picture: { icon: 'foot', color: palette.leaf } },
          ],
          answerId: 'mouth',
        },
        {
          id: 'sci2_g1_q8',
          prompt: 'Which animal likes to live near ponds?',
          choices: [
            { id: 'frog', label: 'Frog', picture: { icon: 'frog', color: palette.leaf } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.sea } },
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
          ],
          answerId: 'frog',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci2_g2',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 2',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 2! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-2'],
    grades: [2],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g2_q1',
          prompt: 'Which plant part holds the plant firmly in the soil?',
          choices: [
            { id: 'leaf', label: 'Leaf', picture: { icon: 'leaf', color: palette.leaf } },
            { id: 'root', label: 'Root' },
            { id: 'flower', label: 'Flower', picture: { icon: 'flower', color: palette.blossom } },
          ],
          answerId: 'root',
        },
        {
          id: 'sci2_g2_q2',
          prompt: 'Which is a healthy food to eat every day?',
          choices: [
            {
              id: 'carrot',
              label: 'Carrot',
              picture: { icon: 'carrot', color: palette.tangerine },
            },
            { id: 'cake', label: 'Cake' },
            { id: 'chips', label: 'Chips' },
          ],
          answerId: 'carrot',
        },
        {
          id: 'sci2_g2_q3',
          prompt: 'A dog, cat, and whale all belong to which animal group?',
          choices: [
            { id: 'reptiles', label: 'Reptiles' },
            { id: 'mammals', label: 'Mammals' },
            { id: 'birds', label: 'Birds' },
          ],
          answerId: 'mammals',
        },
        {
          id: 'sci2_g2_q4',
          prompt: 'What is the safest thing to do near a hot stove?',
          choices: [
            { id: 'stay_away', label: 'Stay away from it' },
            { id: 'touch_it', label: 'Touch it' },
            { id: 'jump_near', label: 'Jump near it' },
          ],
          answerId: 'stay_away',
        },
        {
          id: 'sci2_g2_q5',
          prompt: 'Which animal uses gills to breathe?',
          choices: [
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'fish', label: 'Fish', picture: { icon: 'fish', color: palette.sea } },
            { id: 'bird', label: 'Bird', picture: { icon: 'bird', color: palette.leaf } },
          ],
          answerId: 'fish',
        },
        {
          id: 'sci2_g2_q6',
          prompt: 'Which parts make up a plant?',
          choices: [
            { id: 'roots_stem_leaves', label: 'Roots, stem, and leaves' },
            { id: 'fins_tail_scales', label: 'Fins, tail, and scales' },
            { id: 'wings_beak_feathers', label: 'Wings, beak, and feathers' },
          ],
          answerId: 'roots_stem_leaves',
        },
        {
          id: 'sci2_g2_q7',
          prompt: 'Which food gives our body energy?',
          choices: [
            { id: 'rice', label: 'Rice', picture: { icon: 'rice', color: palette.sunshine } },
            { id: 'rock', label: 'Rock', picture: { icon: 'rock', color: palette.ink } },
            { id: 'cup', label: 'Cup', picture: { icon: 'cup', color: palette.sea } },
          ],
          answerId: 'rice',
        },
        {
          id: 'sci2_g2_q8',
          prompt: 'What is the main job of roots in a plant?',
          choices: [
            { id: 'absorb_water', label: 'To absorb water from the soil' },
            { id: 'make_food', label: 'To make food from sunlight' },
            { id: 'make_flowers', label: 'To produce flowers' },
          ],
          answerId: 'absorb_water',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci2_g3',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 3',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 3! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-3'],
    grades: [3],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g3_q1',
          prompt: 'Water changing from liquid to gas is called what?',
          choices: [
            { id: 'melting', label: 'Melting' },
            { id: 'evaporation', label: 'Evaporation' },
            { id: 'freezing', label: 'Freezing' },
          ],
          answerId: 'evaporation',
        },
        {
          id: 'sci2_g3_q2',
          prompt: 'Which body system pumps blood through the body?',
          choices: [
            { id: 'digestive', label: 'Digestive system' },
            { id: 'nervous', label: 'Nervous system' },
            { id: 'circulatory', label: 'Circulatory system' },
          ],
          answerId: 'circulatory',
        },
        {
          id: 'sci2_g3_q3',
          prompt: 'What stage comes just before the adult frog in its life cycle?',
          choices: [
            { id: 'egg', label: 'Egg' },
            { id: 'tadpole', label: 'Tadpole' },
            { id: 'froglet', label: 'Froglet' },
          ],
          answerId: 'froglet',
        },
        {
          id: 'sci2_g3_q4',
          prompt: 'When two magnets of the same pole meet, they ___ each other.',
          choices: [
            { id: 'attract', label: 'Attract' },
            { id: 'repel', label: 'Repel' },
            { id: 'stick', label: 'Stick to' },
          ],
          answerId: 'repel',
        },
        {
          id: 'sci2_g3_q5',
          prompt: 'Which state of matter has no definite shape or volume?',
          choices: [
            { id: 'solid', label: 'Solid' },
            { id: 'liquid', label: 'Liquid' },
            { id: 'gas', label: 'Gas' },
          ],
          answerId: 'gas',
        },
        {
          id: 'sci2_g3_q6',
          prompt: 'How long does it take Earth to spin once on its axis?',
          choices: [
            { id: 'one_week', label: 'One week' },
            { id: 'one_year', label: 'One year' },
            { id: 'one_day', label: 'One day' },
          ],
          answerId: 'one_day',
        },
        {
          id: 'sci2_g3_q7',
          prompt: 'Which body system breaks down food for energy?',
          choices: [
            { id: 'skeletal', label: 'Skeletal system' },
            { id: 'digestive', label: 'Digestive system' },
            { id: 'muscular', label: 'Muscular system' },
          ],
          answerId: 'digestive',
        },
        {
          id: 'sci2_g3_q8',
          prompt: 'Which planet is closest to the Sun?',
          choices: [
            { id: 'venus', label: 'Venus' },
            { id: 'earth', label: 'Earth' },
            { id: 'mercury', label: 'Mercury' },
          ],
          answerId: 'mercury',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci2_g4',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 4',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 4! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-4'],
    grades: [4],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g4_q1',
          prompt: 'In a food chain, the first organism is always a ___.',
          choices: [
            { id: 'animal', label: 'Animal' },
            { id: 'plant', label: 'Plant (producer)' },
            { id: 'fungus', label: 'Fungus' },
          ],
          answerId: 'plant',
        },
        {
          id: 'sci2_g4_q2',
          prompt: 'What do we call a push or pull that can make objects move?',
          choices: [
            { id: 'energy', label: 'Energy' },
            { id: 'force', label: 'Force' },
            { id: 'power', label: 'Power' },
          ],
          answerId: 'force',
        },
        {
          id: 'sci2_g4_q3',
          prompt: 'Which animal eats both plants and animals (omnivore)?',
          choices: [
            { id: 'eagle', label: 'Eagle' },
            { id: 'rabbit', label: 'Rabbit' },
            { id: 'pig', label: 'Pig' },
          ],
          answerId: 'pig',
        },
        {
          id: 'sci2_g4_q4',
          prompt: 'What property of glass lets you see through it?',
          choices: [
            { id: 'magnetism', label: 'Magnetism' },
            { id: 'transparency', label: 'Transparency' },
            { id: 'conductivity', label: 'Conductivity' },
          ],
          answerId: 'transparency',
        },
        {
          id: 'sci2_g4_q5',
          prompt: 'What is the correct path food takes in our digestive system?',
          choices: [
            { id: 'int_first', label: 'Intestine, then stomach, then mouth' },
            { id: 'mouth_first', label: 'Mouth, then stomach, then intestines' },
            { id: 'stomach_first', label: 'Stomach, then mouth, then intestines' },
          ],
          answerId: 'mouth_first',
        },
        {
          id: 'sci2_g4_q6',
          prompt: 'How does sound from a ringing bell reach our ears?',
          choices: [
            { id: 'light_waves', label: 'Through light waves' },
            { id: 'vibrations', label: 'Through vibrations in the air' },
            { id: 'heat_waves', label: 'Through heat waves' },
          ],
          answerId: 'vibrations',
        },
        {
          id: 'sci2_g4_q7',
          prompt: 'What force keeps our feet on the ground?',
          choices: [
            { id: 'friction', label: 'Friction' },
            { id: 'gravity', label: 'Gravity' },
            { id: 'magnetism', label: 'Magnetism' },
          ],
          answerId: 'gravity',
        },
        {
          id: 'sci2_g4_q8',
          prompt: 'Where do fish, frogs, and ducks typically live?',
          choices: [
            { id: 'desert', label: 'Desert' },
            { id: 'freshwater', label: 'Freshwater habitat' },
            { id: 'arctic', label: 'Arctic tundra' },
          ],
          answerId: 'freshwater',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci2_g5',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 5',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 5! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-5'],
    grades: [5],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g5_q1',
          prompt: 'What do plants need for photosynthesis to happen?',
          choices: [
            { id: 'slc', label: 'Sunlight, water, and carbon dioxide' },
            { id: 'rwo', label: 'Rain, wind, and oxygen' },
            { id: 'hsn', label: 'Heat, soil, and nitrogen' },
          ],
          answerId: 'slc',
        },
        {
          id: 'sci2_g5_q2',
          prompt: 'After evaporation, where does water vapor go?',
          choices: [
            { id: 'ground', label: 'Into the ground' },
            { id: 'atmosphere', label: 'Into the atmosphere' },
            { id: 'rivers', label: 'Into rivers only' },
          ],
          answerId: 'atmosphere',
        },
        {
          id: 'sci2_g5_q3',
          prompt: 'A ramp is an example of which simple machine?',
          choices: [
            { id: 'pulley', label: 'Pulley' },
            { id: 'wedge', label: 'Wedge' },
            { id: 'inclined_plane', label: 'Inclined plane' },
          ],
          answerId: 'inclined_plane',
        },
        {
          id: 'sci2_g5_q4',
          prompt: 'Which planet has large rings around it?',
          choices: [
            { id: 'jupiter', label: 'Jupiter' },
            { id: 'saturn', label: 'Saturn' },
            { id: 'neptune', label: 'Neptune' },
          ],
          answerId: 'saturn',
        },
        {
          id: 'sci2_g5_q5',
          prompt: 'What instrument measures air pressure?',
          choices: [
            { id: 'thermometer', label: 'Thermometer' },
            { id: 'rain_gauge', label: 'Rain gauge' },
            { id: 'barometer', label: 'Barometer' },
          ],
          answerId: 'barometer',
        },
        {
          id: 'sci2_g5_q6',
          prompt: 'What type of energy is stored in food?',
          choices: [
            { id: 'solar', label: 'Solar energy' },
            { id: 'chemical', label: 'Chemical energy' },
            { id: 'mechanical', label: 'Mechanical energy' },
          ],
          answerId: 'chemical',
        },
        {
          id: 'sci2_g5_q7',
          prompt: "Which step of the water cycle brings water back to Earth's surface?",
          choices: [
            { id: 'evaporation', label: 'Evaporation' },
            { id: 'condensation', label: 'Condensation' },
            { id: 'precipitation', label: 'Precipitation' },
          ],
          answerId: 'precipitation',
        },
        {
          id: 'sci2_g5_q8',
          prompt: 'Which planet in our solar system is closest to the Sun?',
          choices: [
            { id: 'venus', label: 'Venus' },
            { id: 'earth', label: 'Earth' },
            { id: 'mercury', label: 'Mercury' },
          ],
          answerId: 'mercury',
        },
      ],
    },
  },

  {
    id: 'act_quiz_sci2_g6',
    kind: 'QUIZ',
    islandId: 'science',
    title: 'Science Quest 2: Grade 6',
    icon: 'flask',
    color: palette.leaf,
    voiceIntro: 'Jelly has more science questions for Grade 6! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'science', 'grade-6'],
    grades: [6],
    subject: 'science',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'sci2_g6_q1',
          prompt: 'Which part is found in plant cells but NOT in animal cells?',
          choices: [
            { id: 'nucleus', label: 'Nucleus' },
            { id: 'cell_wall', label: 'Cell wall' },
            { id: 'membrane', label: 'Cell membrane' },
          ],
          answerId: 'cell_wall',
        },
        {
          id: 'sci2_g6_q2',
          prompt: 'What do producers in an ecosystem do?',
          choices: [
            { id: 'eat_others', label: 'Eat other organisms' },
            { id: 'decompose', label: 'Break down dead matter' },
            { id: 'make_food', label: 'Make food through photosynthesis' },
          ],
          answerId: 'make_food',
        },
        {
          id: 'sci2_g6_q3',
          prompt: 'What happens when a circuit is broken (open)?',
          choices: [
            { id: 'faster', label: 'Electricity flows faster' },
            { id: 'stops', label: 'Electricity stops flowing' },
            { id: 'reverses', label: 'Electricity reverses direction' },
          ],
          answerId: 'stops',
        },
        {
          id: 'sci2_g6_q4',
          prompt: 'Which of the following is a solution?',
          choices: [
            { id: 'sand_gravel', label: 'Sand and gravel' },
            { id: 'salt_water', label: 'Salt water' },
            { id: 'oil_water', label: 'Oil and water' },
          ],
          answerId: 'salt_water',
        },
        {
          id: 'sci2_g6_q5',
          prompt: 'Which Philippine volcano is famous for its perfect cone shape?',
          choices: [
            { id: 'mount_apo', label: 'Mount Apo' },
            { id: 'mayon', label: 'Mayon Volcano' },
            { id: 'pinatubo', label: 'Mount Pinatubo' },
          ],
          answerId: 'mayon',
        },
        {
          id: 'sci2_g6_q6',
          prompt: 'What is the main cause of global climate change?',
          choices: [
            { id: 'greenhouse', label: 'Increase in greenhouse gases' },
            { id: 'rainfall', label: 'More rainfall in forests' },
            { id: 'smaller_oceans', label: 'Decrease in ocean size' },
          ],
          answerId: 'greenhouse',
        },
        {
          id: 'sci2_g6_q7',
          prompt: 'What type of rock is formed when magma cools and hardens?',
          choices: [
            { id: 'sedimentary', label: 'Sedimentary rock' },
            { id: 'metamorphic', label: 'Metamorphic rock' },
            { id: 'igneous', label: 'Igneous rock' },
          ],
          answerId: 'igneous',
        },
        {
          id: 'sci2_g6_q8',
          prompt: 'What do we call the variety of living things in an ecosystem?',
          choices: [
            { id: 'climate', label: 'Climate' },
            { id: 'biodiversity', label: 'Biodiversity' },
            { id: 'habitat', label: 'Habitat' },
          ],
          answerId: 'biodiversity',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // ARALING PANLIPUNAN — first set (10 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_ap_g1',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 1',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 1! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-1'],
    grades: [1],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g1_q1',
          prompt: 'What are the colors of the Philippine flag?',
          choices: [
            { id: 'blue_red_white', label: 'Blue, red, and white' },
            { id: 'green_white_yellow', label: 'Green, white, and yellow' },
            { id: 'red_green_blue', label: 'Red, green, and blue' },
          ],
          answerId: 'blue_red_white',
        },
        {
          id: 'ap_g1_q2',
          prompt: 'Who takes care of you at home?',
          choices: [
            { id: 'strangers', label: 'Strangers' },
            { id: 'family', label: 'Family' },
            { id: 'teachers', label: 'Teachers' },
          ],
          answerId: 'family',
        },
        {
          id: 'ap_g1_q3',
          prompt: 'What do we call a community helper who puts out fires?',
          choices: [
            { id: 'doctor', label: 'Doctor' },
            { id: 'firefighter', label: 'Firefighter' },
            { id: 'farmer', label: 'Farmer' },
          ],
          answerId: 'firefighter',
        },
        {
          id: 'ap_g1_q4',
          prompt: 'What do we call the person who teaches you at school?',
          choices: [
            { id: 'doctor', label: 'Doctor' },
            { id: 'police', label: 'Police officer' },
            { id: 'teacher', label: 'Teacher' },
          ],
          answerId: 'teacher',
        },
        {
          id: 'ap_g1_q5',
          prompt: 'Where does a family usually live?',
          choices: [
            { id: 'school', label: 'School', picture: { icon: 'book', color: palette.sea } },
            { id: 'home', label: 'Home', picture: { icon: 'house', color: palette.tangerine } },
            { id: 'market', label: 'Market' },
          ],
          answerId: 'home',
        },
        {
          id: 'ap_g1_q6',
          prompt: 'What is the name of our country?',
          choices: [
            { id: 'indonesia', label: 'Indonesia' },
            { id: 'malaysia', label: 'Malaysia' },
            { id: 'philippines', label: 'Philippines' },
          ],
          answerId: 'philippines',
        },
        {
          id: 'ap_g1_q7',
          prompt: 'Which community helper helps you when you are sick?',
          choices: [
            { id: 'farmer', label: 'Farmer' },
            { id: 'teacher', label: 'Teacher' },
            { id: 'doctor', label: 'Doctor' },
          ],
          answerId: 'doctor',
        },
        {
          id: 'ap_g1_q8',
          prompt: 'How many stars are on the Philippine flag?',
          choices: [
            { id: 'two', label: 'Two' },
            { id: 'three', label: 'Three' },
            { id: 'five', label: 'Five' },
          ],
          answerId: 'three',
        },
        {
          id: 'ap_g1_q9',
          prompt: 'What do we call someone who grows food on a farm?',
          choices: [
            { id: 'firefighter', label: 'Firefighter' },
            { id: 'doctor', label: 'Doctor' },
            { id: 'farmer', label: 'Farmer' },
          ],
          answerId: 'farmer',
        },
        {
          id: 'ap_g1_q10',
          prompt: 'What shape is the Philippine flag?',
          choices: [
            { id: 'square', label: 'Square' },
            { id: 'circle', label: 'Circle' },
            { id: 'rectangle', label: 'Rectangle' },
          ],
          answerId: 'rectangle',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap_g2',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 2',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 2! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-2'],
    grades: [2],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g2_q1',
          prompt: 'What is the smallest unit of government in the Philippines?',
          choices: [
            { id: 'province', label: 'Province' },
            { id: 'municipality', label: 'Municipality' },
            { id: 'barangay', label: 'Barangay' },
          ],
          answerId: 'barangay',
        },
        {
          id: 'ap_g2_q2',
          prompt: 'Who leads the barangay?',
          choices: [
            { id: 'mayor', label: 'Mayor' },
            { id: 'governor', label: 'Governor' },
            { id: 'barangay_captain', label: 'Barangay captain' },
          ],
          answerId: 'barangay_captain',
        },
        {
          id: 'ap_g2_q3',
          prompt: 'What community place is used to buy and sell goods?',
          choices: [
            { id: 'market', label: 'Market' },
            { id: 'church', label: 'Church' },
            { id: 'school', label: 'School', picture: { icon: 'book', color: palette.sea } },
          ],
          answerId: 'market',
        },
        {
          id: 'ap_g2_q4',
          prompt: 'What is an important rule to follow at school?',
          choices: [
            { id: 'talk_loud', label: 'Talk loudly all the time' },
            { id: 'listen', label: 'Listen to the teacher' },
            { id: 'play_all', label: 'Play all day' },
          ],
          answerId: 'listen',
        },
        {
          id: 'ap_g2_q5',
          prompt: 'What does a map show?',
          choices: [
            { id: 'cooking', label: 'How to cook food' },
            { id: 'places', label: 'Places in an area' },
            { id: 'weather', label: 'What the weather will be' },
          ],
          answerId: 'places',
        },
        {
          id: 'ap_g2_q6',
          prompt: 'What is the job of a doctor?',
          choices: [
            { id: 'sell_goods', label: 'To sell goods' },
            { id: 'grow_food', label: 'To grow food' },
            { id: 'help_sick', label: 'To help sick people get better' },
          ],
          answerId: 'help_sick',
        },
        {
          id: 'ap_g2_q7',
          prompt: 'What is the job of a teacher?',
          choices: [
            { id: 'catch_criminals', label: 'To catch criminals' },
            { id: 'teach_students', label: 'To teach and guide students' },
            { id: 'sell_medicine', label: 'To sell medicine' },
          ],
          answerId: 'teach_students',
        },
        {
          id: 'ap_g2_q8',
          prompt: 'Which community place lets people borrow books?',
          choices: [
            { id: 'hospital', label: 'Hospital' },
            { id: 'library', label: 'Library' },
            { id: 'market', label: 'Market' },
          ],
          answerId: 'library',
        },
        {
          id: 'ap_g2_q9',
          prompt: 'What is the job of a farmer?',
          choices: [
            { id: 'make_medicine', label: 'To make medicines' },
            { id: 'grow_crops', label: 'To grow crops and food' },
            { id: 'build_roads', label: 'To build roads' },
          ],
          answerId: 'grow_crops',
        },
        {
          id: 'ap_g2_q10',
          prompt: 'What symbol shows directions on a map?',
          choices: [
            { id: 'a_star', label: 'A star' },
            { id: 'compass_rose', label: 'A compass rose or arrow' },
            { id: 'a_tree', label: 'A tree' },
          ],
          answerId: 'compass_rose',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap_g3',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 3',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 3! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-3'],
    grades: [3],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g3_q1',
          prompt: 'How many major island groups does the Philippines have?',
          choices: [
            { id: 'two', label: 'Two' },
            { id: 'three', label: 'Three' },
            { id: 'four', label: 'Four' },
          ],
          answerId: 'three',
        },
        {
          id: 'ap_g3_q2',
          prompt: 'What is the largest island group in the Philippines?',
          choices: [
            { id: 'visayas', label: 'Visayas' },
            { id: 'mindanao', label: 'Mindanao' },
            { id: 'luzon', label: 'Luzon' },
          ],
          answerId: 'luzon',
        },
        {
          id: 'ap_g3_q3',
          prompt: 'Which island group is in the middle of the Philippines?',
          choices: [
            { id: 'luzon', label: 'Luzon' },
            { id: 'mindanao', label: 'Mindanao' },
            { id: 'visayas', label: 'Visayas' },
          ],
          answerId: 'visayas',
        },
        {
          id: 'ap_g3_q4',
          prompt: 'What is the capital city of the Philippines?',
          choices: [
            { id: 'cebu', label: 'Cebu City' },
            { id: 'davao', label: 'Davao City' },
            { id: 'manila', label: 'Manila' },
          ],
          answerId: 'manila',
        },
        {
          id: 'ap_g3_q5',
          prompt: 'In which city is the Sinulog festival celebrated?',
          choices: [
            { id: 'manila', label: 'Manila' },
            { id: 'davao', label: 'Davao City' },
            { id: 'cebu', label: 'Cebu City' },
          ],
          answerId: 'cebu',
        },
        {
          id: 'ap_g3_q6',
          prompt: 'Who is the national hero of the Philippines?',
          choices: [
            { id: 'bonifacio', label: 'Andres Bonifacio' },
            { id: 'aguinaldo', label: 'Emilio Aguinaldo' },
            { id: 'rizal', label: 'Jose Rizal' },
          ],
          answerId: 'rizal',
        },
        {
          id: 'ap_g3_q7',
          prompt: 'In which city is the Kadayawan festival celebrated?',
          choices: [
            { id: 'manila', label: 'Manila' },
            { id: 'davao', label: 'Davao City' },
            { id: 'cebu', label: 'Cebu City' },
          ],
          answerId: 'davao',
        },
        {
          id: 'ap_g3_q8',
          prompt: 'What is the biggest island in the Philippines?',
          choices: [
            { id: 'mindanao', label: 'Mindanao' },
            { id: 'panay', label: 'Panay' },
            { id: 'luzon', label: 'Luzon' },
          ],
          answerId: 'luzon',
        },
        {
          id: 'ap_g3_q9',
          prompt: 'Mindanao is called the "Land of Promise" because of its ___.',
          choices: [
            { id: 'fertile', label: 'Fertile land and natural resources' },
            { id: 'mountains', label: 'Many high mountains' },
            { id: 'islands', label: 'Large number of islands' },
          ],
          answerId: 'fertile',
        },
        {
          id: 'ap_g3_q10',
          prompt: 'How many provinces does the Philippines have?',
          choices: [
            { id: 'fifty', label: '50' },
            { id: 'eighty_one', label: '81' },
            { id: 'one_twenty', label: '120' },
          ],
          answerId: 'eighty_one',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap_g4',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 4',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 4! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-4'],
    grades: [4],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g4_q1',
          prompt: 'What type of country is the Philippines?',
          choices: [
            { id: 'peninsula', label: 'Peninsula' },
            { id: 'archipelago', label: 'Archipelago' },
            { id: 'continent', label: 'Continent' },
          ],
          answerId: 'archipelago',
        },
        {
          id: 'ap_g4_q2',
          prompt: 'Approximately how many islands make up the Philippines?',
          choices: [
            { id: 'three_thousand', label: 'About 3,000' },
            { id: 'seven_thousand', label: 'About 7,641' },
            { id: 'fifteen_thousand', label: 'About 15,000' },
          ],
          answerId: 'seven_thousand',
        },
        {
          id: 'ap_g4_q3',
          prompt: 'What is the highest mountain in the Philippines?',
          choices: [
            { id: 'mayon', label: 'Mount Mayon' },
            { id: 'pinatubo', label: 'Mount Pinatubo' },
            { id: 'mount_apo', label: 'Mount Apo' },
          ],
          answerId: 'mount_apo',
        },
        {
          id: 'ap_g4_q4',
          prompt: 'What is the national bird of the Philippines?',
          choices: [
            { id: 'maya', label: 'Maya' },
            { id: 'eagle', label: 'Philippine Eagle' },
            { id: 'sarimanok', label: 'Sarimanok' },
          ],
          answerId: 'eagle',
        },
        {
          id: 'ap_g4_q5',
          prompt: 'What is the national flower of the Philippines?',
          choices: [
            { id: 'rose', label: 'Rose' },
            { id: 'orchid', label: 'Orchid' },
            { id: 'sampaguita', label: 'Sampaguita' },
          ],
          answerId: 'sampaguita',
        },
        {
          id: 'ap_g4_q6',
          prompt: 'Which branch of government makes laws?',
          choices: [
            { id: 'executive', label: 'Executive branch' },
            { id: 'judicial', label: 'Judicial branch' },
            { id: 'legislative', label: 'Legislative branch' },
          ],
          answerId: 'legislative',
        },
        {
          id: 'ap_g4_q7',
          prompt: 'What type of climate does the Philippines have?',
          choices: [
            { id: 'arctic', label: 'Arctic' },
            { id: 'tropical', label: 'Tropical' },
            { id: 'desert', label: 'Desert' },
          ],
          answerId: 'tropical',
        },
        {
          id: 'ap_g4_q8',
          prompt: 'What is the longest river in the Philippines?',
          choices: [
            { id: 'pasig', label: 'Pasig River' },
            { id: 'agusan', label: 'Agusan River' },
            { id: 'cagayan', label: 'Cagayan River' },
          ],
          answerId: 'cagayan',
        },
        {
          id: 'ap_g4_q9',
          prompt: 'What is the national tree of the Philippines?',
          choices: [
            { id: 'coconut', label: 'Coconut' },
            { id: 'mango_tree', label: 'Mango' },
            { id: 'narra', label: 'Narra' },
          ],
          answerId: 'narra',
        },
        {
          id: 'ap_g4_q10',
          prompt: 'Which branch of government is led by the President?',
          choices: [
            { id: 'legislative', label: 'Legislative branch' },
            { id: 'judicial', label: 'Judicial branch' },
            { id: 'executive', label: 'Executive branch' },
          ],
          answerId: 'executive',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap_g5',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 5',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 5! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-5'],
    grades: [5],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g5_q1',
          prompt: 'Which country colonized the Philippines starting in 1565?',
          choices: [
            { id: 'portugal', label: 'Portugal' },
            { id: 'england', label: 'England' },
            { id: 'spain', label: 'Spain' },
          ],
          answerId: 'spain',
        },
        {
          id: 'ap_g5_q2',
          prompt: 'What do we call the period before the Spanish arrived in the Philippines?',
          choices: [
            { id: 'colonial', label: 'Colonial period' },
            { id: 'pre_colonial', label: 'Pre-colonial period' },
            { id: 'modern', label: 'Modern period' },
          ],
          answerId: 'pre_colonial',
        },
        {
          id: 'ap_g5_q3',
          prompt: 'What type of communities did early Filipinos live in?',
          choices: [
            { id: 'barangay_com', label: 'Barangay communities' },
            { id: 'large_kingdoms', label: 'Large kingdoms with kings' },
            { id: 'castles', label: 'Medieval castles' },
          ],
          answerId: 'barangay_com',
        },
        {
          id: 'ap_g5_q4',
          prompt: 'Who wrote the novel Noli Me Tangere?',
          choices: [
            { id: 'bonifacio', label: 'Andres Bonifacio' },
            { id: 'aguinaldo', label: 'Emilio Aguinaldo' },
            { id: 'rizal', label: 'Jose Rizal' },
          ],
          answerId: 'rizal',
        },
        {
          id: 'ap_g5_q5',
          prompt: 'In what year did the Philippines declare independence from Spain?',
          choices: [
            { id: 'yr_1886', label: '1886' },
            { id: 'yr_1898', label: '1898' },
            { id: 'yr_1910', label: '1910' },
          ],
          answerId: 'yr_1898',
        },
        {
          id: 'ap_g5_q6',
          prompt: 'Who founded the Katipunan secret society?',
          choices: [
            { id: 'rizal', label: 'Jose Rizal' },
            { id: 'aguinaldo', label: 'Emilio Aguinaldo' },
            { id: 'bonifacio', label: 'Andres Bonifacio' },
          ],
          answerId: 'bonifacio',
        },
        {
          id: 'ap_g5_q7',
          prompt: 'The Katipunan was a secret society that fought against ___.',
          choices: [
            { id: 'americans', label: 'The Americans' },
            { id: 'spanish_rule', label: 'Spanish rule' },
            { id: 'british', label: 'The British' },
          ],
          answerId: 'spanish_rule',
        },
        {
          id: 'ap_g5_q8',
          prompt: 'In what year did the Philippine Revolution against Spain begin?',
          choices: [
            { id: 'yr_1894', label: '1894' },
            { id: 'yr_1896', label: '1896' },
            { id: 'yr_1900', label: '1900' },
          ],
          answerId: 'yr_1896',
        },
        {
          id: 'ap_g5_q9',
          prompt: 'Where was Jose Rizal executed by the Spanish in 1896?',
          choices: [
            { id: 'fort_santiago', label: 'Fort Santiago, Manila' },
            { id: 'bagumbayan', label: 'Bagumbayan (Luneta), Manila' },
            { id: 'intramuros', label: 'Intramuros, Manila' },
          ],
          answerId: 'bagumbayan',
        },
        {
          id: 'ap_g5_q10',
          prompt: 'What is the ancient Filipino writing system called?',
          choices: [
            { id: 'latin', label: 'Latin alphabet' },
            { id: 'baybayin', label: 'Baybayin' },
            { id: 'hangul', label: 'Hangul' },
          ],
          answerId: 'baybayin',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap_g6',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan: Grade 6',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has Araling Panlipunan questions for Grade 6! Tap the right answer.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-6'],
    grades: [6],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap_g6_q1',
          prompt: 'From which country did the Philippines gain independence on July 4, 1946?',
          choices: [
            { id: 'spain', label: 'Spain' },
            { id: 'japan', label: 'Japan' },
            { id: 'usa', label: 'United States' },
          ],
          answerId: 'usa',
        },
        {
          id: 'ap_g6_q2',
          prompt: 'What happened at EDSA in February 1986?',
          choices: [
            { id: 'earthquake', label: 'A major earthquake struck Manila' },
            { id: 'people_power', label: 'The People Power Revolution restored democracy' },
            { id: 'joined_un', label: 'The Philippines joined the United Nations' },
          ],
          answerId: 'people_power',
        },
        {
          id: 'ap_g6_q3',
          prompt: 'What is the name of the current Philippine Constitution?',
          choices: [
            { id: 'const_1935', label: '1935 Constitution' },
            { id: 'const_1973', label: '1973 Constitution' },
            { id: 'const_1987', label: '1987 Constitution' },
          ],
          answerId: 'const_1987',
        },
        {
          id: 'ap_g6_q4',
          prompt: 'What does ASEAN stand for?',
          choices: [
            { id: 'asean_full', label: 'Association of Southeast Asian Nations' },
            { id: 'asean_wrong1', label: 'Alliance of South Asian Economic Networks' },
            { id: 'asean_wrong2', label: 'Asian Scientific and Educational Association' },
          ],
          answerId: 'asean_full',
        },
        {
          id: 'ap_g6_q5',
          prompt: 'How many countries are members of ASEAN?',
          choices: [
            { id: 'eight', label: '8' },
            { id: 'ten', label: '10' },
            { id: 'twelve', label: '12' },
          ],
          answerId: 'ten',
        },
        {
          id: 'ap_g6_q6',
          prompt: 'During whose rule was the 1986 People Power Revolution?',
          choices: [
            { id: 'aquino', label: 'Corazon Aquino' },
            { id: 'marcos', label: 'Ferdinand Marcos' },
            { id: 'estrada', label: 'Joseph Estrada' },
          ],
          answerId: 'marcos',
        },
        {
          id: 'ap_g6_q7',
          prompt: 'When did Japan occupy the Philippines during World War II?',
          choices: [
            { id: 'yr_1939', label: '1939' },
            { id: 'yr_1942', label: '1942' },
            { id: 'yr_1945', label: '1945' },
          ],
          answerId: 'yr_1942',
        },
        {
          id: 'ap_g6_q8',
          prompt: 'What document protects the rights of children worldwide?',
          choices: [
            { id: 'udhr', label: 'Universal Declaration of Human Rights' },
            { id: 'un_crc', label: 'UN Convention on the Rights of the Child' },
            { id: 'phil_const', label: 'Philippine Constitution only' },
          ],
          answerId: 'un_crc',
        },
        {
          id: 'ap_g6_q9',
          prompt: 'Who was the first female President of the Philippines?',
          choices: [
            { id: 'gma', label: 'Gloria Macapagal-Arroyo' },
            { id: 'miriam', label: 'Miriam Defensor Santiago' },
            { id: 'cory', label: 'Corazon Aquino' },
          ],
          answerId: 'cory',
        },
        {
          id: 'ap_g6_q10',
          prompt: 'What is the ASEAN motto?',
          choices: [
            { id: 'ppp', label: 'Peace, Progress, and Prosperity' },
            { id: 'one_vision', label: 'One Vision, One Identity, One Community' },
            { id: 'together', label: 'Together We Build' },
          ],
          answerId: 'one_vision',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // ARALING PANLIPUNAN — second set (8 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_ap2_g1',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 1',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 1! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-1'],
    grades: [1],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g1_q1',
          prompt: 'What is the place where you learn to read and write?',
          choices: [
            { id: 'market', label: 'Market' },
            { id: 'school', label: 'School', picture: { icon: 'book', color: palette.sea } },
            { id: 'church', label: 'Church' },
          ],
          answerId: 'school',
        },
        {
          id: 'ap2_g1_q2',
          prompt: "Who in the family is usually the mother's partner?",
          choices: [
            { id: 'brother', label: 'Brother' },
            { id: 'father', label: 'Father' },
            { id: 'grandfather', label: 'Grandfather' },
          ],
          answerId: 'father',
        },
        {
          id: 'ap2_g1_q3',
          prompt: 'Which community helper protects people and keeps them safe?',
          choices: [
            { id: 'police', label: 'Police officer' },
            { id: 'farmer', label: 'Farmer' },
            { id: 'baker', label: 'Baker' },
          ],
          answerId: 'police',
        },
        {
          id: 'ap2_g1_q4',
          prompt: 'What do we call the people you live with at home?',
          choices: [
            { id: 'neighbors', label: 'Neighbors' },
            { id: 'friends', label: 'Friends' },
            { id: 'family', label: 'Family' },
          ],
          answerId: 'family',
        },
        {
          id: 'ap2_g1_q5',
          prompt: 'What room in a house is used for cooking food?',
          choices: [
            { id: 'bedroom', label: 'Bedroom' },
            { id: 'kitchen', label: 'Kitchen' },
            { id: 'bathroom', label: 'Bathroom' },
          ],
          answerId: 'kitchen',
        },
        {
          id: 'ap2_g1_q6',
          prompt: "The Philippine flag's sun has how many rays?",
          choices: [
            { id: 'four', label: 'Four' },
            { id: 'six', label: 'Six' },
            { id: 'eight', label: 'Eight' },
          ],
          answerId: 'eight',
        },
        {
          id: 'ap2_g1_q7',
          prompt: 'What is the role of a child in the family?',
          choices: [
            { id: 'go_school', label: 'To go to school and help at home' },
            { id: 'earn_money', label: 'To earn money for the family' },
            { id: 'teach_parents', label: 'To teach the parents' },
          ],
          answerId: 'go_school',
        },
        {
          id: 'ap2_g1_q8',
          prompt: 'Which community helper collects our garbage?',
          choices: [
            { id: 'police', label: 'Police officer' },
            { id: 'garbage_collector', label: 'Garbage collector' },
            { id: 'farmer', label: 'Farmer' },
          ],
          answerId: 'garbage_collector',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap2_g2',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 2',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 2! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-2'],
    grades: [2],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g2_q1',
          prompt: 'What is the Filipino term for the barangay leader?',
          choices: [
            { id: 'mayor', label: 'Mayor' },
            { id: 'gobernador', label: 'Gobernador' },
            { id: 'punong', label: 'Punong Barangay' },
          ],
          answerId: 'punong',
        },
        {
          id: 'ap2_g2_q2',
          prompt: 'What do people follow to keep the community peaceful?',
          choices: [
            { id: 'rules', label: 'Rules and laws' },
            { id: 'games', label: 'Games and sports' },
            { id: 'songs', label: 'Songs and stories' },
          ],
          answerId: 'rules',
        },
        {
          id: 'ap2_g2_q3',
          prompt: 'Which direction is shown at the top of most maps?',
          choices: [
            { id: 'south', label: 'South' },
            { id: 'east', label: 'East' },
            { id: 'north', label: 'North' },
          ],
          answerId: 'north',
        },
        {
          id: 'ap2_g2_q4',
          prompt: 'What is the job of a police officer?',
          choices: [
            { id: 'grow_food', label: 'To grow food' },
            { id: 'build_houses', label: 'To build houses' },
            { id: 'protect', label: 'To protect people and keep peace' },
          ],
          answerId: 'protect',
        },
        {
          id: 'ap2_g2_q5',
          prompt: 'What community place has doctors and nurses?',
          choices: [
            { id: 'market', label: 'Market' },
            { id: 'hospital', label: 'Hospital or clinic' },
            { id: 'library', label: 'Library' },
          ],
          answerId: 'hospital',
        },
        {
          id: 'ap2_g2_q6',
          prompt: 'What do we call a drawing that shows where places are?',
          choices: [
            { id: 'chart', label: 'Chart' },
            { id: 'map', label: 'Map' },
            { id: 'graph', label: 'Graph' },
          ],
          answerId: 'map',
        },
        {
          id: 'ap2_g2_q7',
          prompt: 'What services does a barangay provide for residents?',
          choices: [
            { id: 'basic_services', label: 'Basic community services and support' },
            { id: 'national_defense', label: 'Controls the whole country' },
            { id: 'tax_collection', label: 'Collects taxes from all cities' },
          ],
          answerId: 'basic_services',
        },
        {
          id: 'ap2_g2_q8',
          prompt: 'Which building in the community is used for worship?',
          choices: [
            { id: 'school', label: 'School' },
            { id: 'market', label: 'Market' },
            { id: 'worship', label: 'Church or mosque' },
          ],
          answerId: 'worship',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap2_g3',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 3',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 3! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-3'],
    grades: [3],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g3_q1',
          prompt: 'What is the national language of the Philippines?',
          choices: [
            { id: 'english', label: 'English' },
            { id: 'filipino', label: 'Filipino (Tagalog)' },
            { id: 'cebuano', label: 'Cebuano' },
          ],
          answerId: 'filipino',
        },
        {
          id: 'ap2_g3_q2',
          prompt: 'Which province celebrates the Ati-Atihan festival?',
          choices: [
            { id: 'cebu', label: 'Cebu' },
            { id: 'aklan', label: 'Aklan' },
            { id: 'davao_sur', label: 'Davao del Sur' },
          ],
          answerId: 'aklan',
        },
        {
          id: 'ap2_g3_q3',
          prompt: 'Who was the leader of the Katipunan?',
          choices: [
            { id: 'rizal', label: 'Jose Rizal' },
            { id: 'aguinaldo', label: 'Emilio Aguinaldo' },
            { id: 'bonifacio', label: 'Andres Bonifacio' },
          ],
          answerId: 'bonifacio',
        },
        {
          id: 'ap2_g3_q4',
          prompt: 'Which island group is closest to Malaysia (Borneo)?',
          choices: [
            { id: 'luzon', label: 'Luzon' },
            { id: 'visayas', label: 'Visayas' },
            { id: 'mindanao', label: 'Mindanao' },
          ],
          answerId: 'mindanao',
        },
        {
          id: 'ap2_g3_q5',
          prompt: 'A Philippine region is made up of a group of ___.',
          choices: [
            { id: 'barangays', label: 'Barangays only' },
            { id: 'provinces', label: 'Provinces' },
            { id: 'one_city', label: 'One city only' },
          ],
          answerId: 'provinces',
        },
        {
          id: 'ap2_g3_q6',
          prompt: 'In which city is the MassKara festival celebrated?',
          choices: [
            { id: 'cebu', label: 'Cebu City' },
            { id: 'bacolod', label: 'Bacolod City' },
            { id: 'iloilo', label: 'Iloilo City' },
          ],
          answerId: 'bacolod',
        },
        {
          id: 'ap2_g3_q7',
          prompt: 'The three stars on the Philippine flag each represent a ___.',
          choices: [
            { id: 'city', label: 'Major city' },
            { id: 'island_group', label: 'Major island group' },
            { id: 'province', label: 'Province' },
          ],
          answerId: 'island_group',
        },
        {
          id: 'ap2_g3_q8',
          prompt: 'What does Rizal Day on December 30 commemorate?',
          choices: [
            { id: 'birthday', label: 'His birthday' },
            { id: 'martyrdom', label: 'His martyrdom (death anniversary)' },
            { id: 'independence', label: 'Philippine independence' },
          ],
          answerId: 'martyrdom',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap2_g4',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 4',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 4! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-4'],
    grades: [4],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g4_q1',
          prompt: 'What is the national fruit of the Philippines?',
          choices: [
            { id: 'banana', label: 'Banana' },
            { id: 'durian', label: 'Durian' },
            { id: 'mango', label: 'Mango' },
          ],
          answerId: 'mango',
        },
        {
          id: 'ap2_g4_q2',
          prompt: 'Which branch of government interprets the laws?',
          choices: [
            { id: 'executive', label: 'Executive branch' },
            { id: 'legislative', label: 'Legislative branch' },
            { id: 'judicial', label: 'Judicial branch' },
          ],
          answerId: 'judicial',
        },
        {
          id: 'ap2_g4_q3',
          prompt: 'The Philippines has two main seasons. They are the ___ seasons.',
          choices: [
            { id: 'rainy_dry', label: 'Rainy and dry' },
            { id: 'summer_winter', label: 'Summer and winter' },
            { id: 'spring_autumn', label: 'Spring and autumn' },
          ],
          answerId: 'rainy_dry',
        },
        {
          id: 'ap2_g4_q4',
          prompt: 'What is the name of the sea west of the Philippines?',
          choices: [
            { id: 'pacific', label: 'Pacific Ocean' },
            { id: 'west_phil', label: 'West Philippine Sea' },
            { id: 'indian', label: 'Indian Ocean' },
          ],
          answerId: 'west_phil',
        },
        {
          id: 'ap2_g4_q5',
          prompt: 'What do we call land features like mountains and valleys?',
          choices: [
            { id: 'waterways', label: 'Waterways' },
            { id: 'landforms', label: 'Landforms' },
            { id: 'climate_zones', label: 'Climate zones' },
          ],
          answerId: 'landforms',
        },
        {
          id: 'ap2_g4_q6',
          prompt: 'What is the name of the Philippine legislature?',
          choices: [
            { id: 'congress', label: 'Congress' },
            { id: 'parliament', label: 'Parliament' },
            { id: 'cabinet', label: 'Cabinet' },
          ],
          answerId: 'congress',
        },
        {
          id: 'ap2_g4_q7',
          prompt: 'What is the Coral Triangle known for?',
          choices: [
            { id: 'marine', label: 'Rich marine biodiversity' },
            { id: 'mountains', label: 'High mountain peaks' },
            { id: 'rice', label: 'Large rice fields' },
          ],
          answerId: 'marine',
        },
        {
          id: 'ap2_g4_q8',
          prompt: 'Which natural resource is found in large deposits in Mindanao?',
          choices: [
            { id: 'gold', label: 'Gold and other minerals' },
            { id: 'oil', label: 'Oil only' },
            { id: 'coal', label: 'Coal only' },
          ],
          answerId: 'gold',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap2_g5',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 5',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 5! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-5'],
    grades: [5],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g5_q1',
          prompt: 'What was the main reason Filipinos revolted against Spanish rule?',
          choices: [
            { id: 'oppression', label: 'Oppression and lack of rights' },
            { id: 'more_land', label: 'They wanted more land' },
            { id: 'food', label: 'They disagreed with Spanish food' },
          ],
          answerId: 'oppression',
        },
        {
          id: 'ap2_g5_q2',
          prompt: 'In which town was Jose Rizal born?',
          choices: [
            { id: 'manila', label: 'Manila' },
            { id: 'cebu', label: 'Cebu' },
            { id: 'calamba', label: 'Calamba, Laguna' },
          ],
          answerId: 'calamba',
        },
        {
          id: 'ap2_g5_q3',
          prompt: "What was the name of Rizal's second novel?",
          choices: [
            { id: 'noli', label: 'Noli Me Tangere' },
            { id: 'el_fili', label: 'El Filibusterismo' },
            { id: 'florante', label: 'Florante at Laura' },
          ],
          answerId: 'el_fili',
        },
        {
          id: 'ap2_g5_q4',
          prompt: 'Who was the first President of the Philippine Republic (1899)?',
          choices: [
            { id: 'rizal', label: 'Jose Rizal' },
            { id: 'bonifacio', label: 'Andres Bonifacio' },
            { id: 'aguinaldo', label: 'Emilio Aguinaldo' },
          ],
          answerId: 'aguinaldo',
        },
        {
          id: 'ap2_g5_q5',
          prompt: 'Where was the first Philippine flag sewn?',
          choices: [
            { id: 'manila', label: 'Manila' },
            { id: 'hong_kong', label: 'Hong Kong' },
            { id: 'madrid', label: 'Madrid' },
          ],
          answerId: 'hong_kong',
        },
        {
          id: 'ap2_g5_q6',
          prompt: 'What were datus in pre-colonial Philippine society?',
          choices: [
            { id: 'chieftains', label: 'Community leaders or chieftains' },
            { id: 'spanish_gov', label: 'Spanish governors' },
            { id: 'priests', label: 'Religious leaders' },
          ],
          answerId: 'chieftains',
        },
        {
          id: 'ap2_g5_q7',
          prompt: 'Which ancient Filipino script is still studied as cultural heritage?',
          choices: [
            { id: 'latin', label: 'Latin alphabet' },
            { id: 'baybayin', label: 'Baybayin' },
            { id: 'arabic', label: 'Arabic script' },
          ],
          answerId: 'baybayin',
        },
        {
          id: 'ap2_g5_q8',
          prompt: 'Ferdinand Magellan sailed for which country when he came to the Philippines?',
          choices: [
            { id: 'portugal', label: 'Portugal' },
            { id: 'england', label: 'England' },
            { id: 'spain', label: 'Spain' },
          ],
          answerId: 'spain',
        },
      ],
    },
  },

  {
    id: 'act_quiz_ap2_g6',
    kind: 'QUIZ',
    islandId: 'stories',
    title: 'Araling Panlipunan 2: Grade 6',
    icon: 'house',
    color: palette.tangerine,
    voiceIntro: 'Jelly has more Araling Panlipunan questions for Grade 6! Try your best.',
    instruction: 'Tap the right answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'araling-panlipunan', 'grade-6'],
    grades: [6],
    subject: 'araling_panlipunan',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'ap2_g6_q1',
          prompt: 'When did the Americans take control of the Philippines from Spain?',
          choices: [
            { id: 'yr_1896', label: '1896' },
            { id: 'yr_1898', label: '1898' },
            { id: 'yr_1902', label: '1902' },
          ],
          answerId: 'yr_1898',
        },
        {
          id: 'ap2_g6_q2',
          prompt: 'What was the Commonwealth period (1935–1946) in the Philippines?',
          choices: [
            { id: 'full_independence', label: 'A time of full independence' },
            { id: 'transition', label: 'A transition period before full independence' },
            { id: 'japanese_rule', label: 'A time of Japanese rule' },
          ],
          answerId: 'transition',
        },
        {
          id: 'ap2_g6_q3',
          prompt: 'Which country attacked the Philippines on December 8, 1941?',
          choices: [
            { id: 'germany', label: 'Germany' },
            { id: 'usa', label: 'United States' },
            { id: 'japan', label: 'Japan' },
          ],
          answerId: 'japan',
        },
        {
          id: 'ap2_g6_q4',
          prompt: 'What does the Philippine Constitution guarantee for every citizen?',
          choices: [
            { id: 'housing', label: 'Free housing for everyone' },
            { id: 'rights', label: 'Rights and freedoms' },
            { id: 'travel', label: 'Free travel abroad' },
          ],
          answerId: 'rights',
        },
        {
          id: 'ap2_g6_q5',
          prompt: 'Which ASEAN country is directly south of Mindanao?',
          choices: [
            { id: 'vietnam', label: 'Vietnam' },
            { id: 'thailand', label: 'Thailand' },
            { id: 'indonesia', label: 'Indonesia' },
          ],
          answerId: 'indonesia',
        },
        {
          id: 'ap2_g6_q6',
          prompt: 'What was the Bataan Death March of 1942?',
          choices: [
            { id: 'peaceful', label: 'A peaceful march for independence' },
            { id: 'forced_march', label: 'A forced march of prisoners by Japan' },
            { id: 'celebration', label: 'A march to celebrate American rule' },
          ],
          answerId: 'forced_march',
        },
        {
          id: 'ap2_g6_q7',
          prompt: 'Who became President of the Philippines after EDSA 1986?',
          choices: [
            { id: 'ramos', label: 'Fidel Ramos' },
            { id: 'estrada', label: 'Joseph Estrada' },
            { id: 'cory', label: 'Corazon Aquino' },
          ],
          answerId: 'cory',
        },
        {
          id: 'ap2_g6_q8',
          prompt: 'What are the basic rights of children according to the Philippine law?',
          choices: [
            { id: 'vote', label: 'Right to vote' },
            { id: 'child_rights', label: 'Right to education, health, and protection' },
            { id: 'business', label: 'Right to own businesses' },
          ],
          answerId: 'child_rights',
        },
      ],
    },
  },
];
