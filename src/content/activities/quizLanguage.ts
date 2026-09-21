import type { ActivityDefinition } from '@/domain/activity/schema';
import { palette } from '@/theme';

/** Grade-aligned quiz banks for Filipino (G1–G6) and English grammar (G1–G6).
 *  Filipino: two sets per grade — "Baitang N" (10 questions) and "Filipino Plus: Baitang N" (8 questions).
 *  English: one set per grade, "English: Grade N" (10 questions). */
export const languageQuizActivities: ActivityDefinition[] = [
  // ════════════════════════════════════════════════════════════
  // FILIPINO — first set "Baitang N" (10 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_fil_g1',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 1',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 1! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-1'],
    grades: [1],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g1_q1',
          prompt: "Ano ang tawag sa 'dog' sa Filipino?",
          choices: [
            { id: 'aso', label: 'Aso', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'pusa', label: 'Pusa', picture: { icon: 'cat', color: palette.coral } },
            { id: 'ibon', label: 'Ibon', picture: { icon: 'bird', color: palette.sea } },
          ],
          answerId: 'aso',
        },
        {
          id: 'fil_g1_q2',
          prompt: "Ano ang tawag sa 'cat' sa Filipino?",
          choices: [
            { id: 'pusa', label: 'Pusa', picture: { icon: 'cat', color: palette.coral } },
            { id: 'aso', label: 'Aso', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'isda', label: 'Isda', picture: { icon: 'fish', color: palette.sea } },
          ],
          answerId: 'pusa',
        },
        {
          id: 'fil_g1_q3',
          prompt: "Ano ang tawag sa 'bird' sa Filipino?",
          choices: [
            { id: 'ibon', label: 'Ibon', picture: { icon: 'bird', color: palette.sea } },
            { id: 'aso', label: 'Aso', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'pusa', label: 'Pusa', picture: { icon: 'cat', color: palette.coral } },
          ],
          answerId: 'ibon',
        },
        {
          id: 'fil_g1_q4',
          prompt: 'Anong kulay ang saging?',
          choices: [
            { id: 'dilaw', label: 'Dilaw' },
            { id: 'pula', label: 'Pula' },
            { id: 'asul', label: 'Asul' },
          ],
          answerId: 'dilaw',
        },
        {
          id: 'fil_g1_q5',
          prompt: 'Anong kulay ang dagat?',
          choices: [
            { id: 'asul', label: 'Asul' },
            { id: 'dilaw', label: 'Dilaw' },
            { id: 'berde', label: 'Berde' },
          ],
          answerId: 'asul',
        },
        {
          id: 'fil_g1_q6',
          prompt: "Ano ang Filipino ng bilang na '3'?",
          choices: [
            { id: 'tatlo', label: 'Tatlo' },
            { id: 'dalawa', label: 'Dalawa' },
            { id: 'apat', label: 'Apat' },
          ],
          answerId: 'tatlo',
        },
        {
          id: 'fil_g1_q7',
          prompt: "Ano ang Filipino ng bilang na '10'?",
          choices: [
            { id: 'sampu', label: 'Sampu' },
            { id: 'siyam', label: 'Siyam' },
            { id: 'walo', label: 'Walo' },
          ],
          answerId: 'sampu',
        },
        {
          id: 'fil_g1_q8',
          prompt: "Alin ang magalang na sagot sa 'Gusto mo ba ng kanin?'",
          choices: [
            { id: 'opo', label: 'Opo' },
            { id: 'oolang', label: 'Oo lang' },
            { id: 'ayaw', label: 'Ayaw' },
          ],
          answerId: 'opo',
        },
        {
          id: 'fil_g1_q9',
          prompt: 'Ano ang sasabihin mo kung may binigay sa iyo?',
          choices: [
            { id: 'salamatpo', label: 'Salamat po' },
            { id: 'wala', label: 'Wala' },
            { id: 'ayoko', label: 'Ayoko' },
          ],
          answerId: 'salamatpo',
        },
        {
          id: 'fil_g1_q10',
          prompt: "Ilang pantig ang salitang 'aso'?",
          choices: [
            { id: 'two', label: '2' },
            { id: 'one', label: '1' },
            { id: 'three', label: '3' },
          ],
          answerId: 'two',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil_g2',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 2',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 2! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-2'],
    grades: [2],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g2_q1',
          prompt: 'Alin ang pangngalan (naming word)?',
          choices: [
            { id: 'bahay', label: 'Bahay', picture: { icon: 'house', color: palette.sea } },
            { id: 'tumatakbo', label: 'Tumatakbo' },
            { id: 'pula', label: 'Pula' },
          ],
          answerId: 'bahay',
        },
        {
          id: 'fil_g2_q2',
          prompt: 'Alin ang pandiwa (action word)?',
          choices: [
            { id: 'kumakain', label: 'Kumakain' },
            { id: 'bola', label: 'Bola', picture: { icon: 'ball', color: palette.tangerine } },
            { id: 'pula', label: 'Pula' },
          ],
          answerId: 'kumakain',
        },
        {
          id: 'fil_g2_q3',
          prompt: "Ano ang kasalungat ng 'malaki'?",
          choices: [
            { id: 'maliit', label: 'Maliit' },
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'mataas', label: 'Mataas' },
          ],
          answerId: 'maliit',
        },
        {
          id: 'fil_g2_q4',
          prompt: "Ano ang kasalungat ng 'mabilis'?",
          choices: [
            { id: 'mabagal', label: 'Mabagal' },
            { id: 'malaki', label: 'Malaki' },
            { id: 'masaya', label: 'Masaya' },
          ],
          answerId: 'mabagal',
        },
        {
          id: 'fil_g2_q5',
          prompt: "Ano ang kasingkahulugan ng 'masaya'?",
          choices: [
            { id: 'natutuwa', label: 'Natutuwa' },
            { id: 'malungkot', label: 'Malungkot' },
            { id: 'galit', label: 'Galit' },
          ],
          answerId: 'natutuwa',
        },
        {
          id: 'fil_g2_q6',
          prompt: 'Ilan ang araw ng isang linggo?',
          choices: [
            { id: 'pito', label: 'Pito' },
            { id: 'anim', label: 'Anim' },
            { id: 'walo', label: 'Walo' },
          ],
          answerId: 'pito',
        },
        {
          id: 'fil_g2_q7',
          prompt: 'Ano ang ikalawang araw ng linggo, pagkatapos ng Linggo?',
          choices: [
            { id: 'lunes', label: 'Lunes' },
            { id: 'martes', label: 'Martes' },
            { id: 'sabado', label: 'Sabado' },
          ],
          answerId: 'lunes',
        },
        {
          id: 'fil_g2_q8',
          prompt: 'Ilan ang buwan sa isang taon?',
          choices: [
            { id: 'labindalawa', label: 'Labindalawa' },
            { id: 'labingisa', label: 'Labing-isa' },
            { id: 'sampu', label: 'Sampu' },
          ],
          answerId: 'labindalawa',
        },
        {
          id: 'fil_g2_q9',
          prompt: 'Ano ang unang buwan ng taon?',
          choices: [
            { id: 'enero', label: 'Enero' },
            { id: 'disyembre', label: 'Disyembre' },
            { id: 'pebrero', label: 'Pebrero' },
          ],
          answerId: 'enero',
        },
        {
          id: 'fil_g2_q10',
          prompt: 'Alin ang pandiwa?',
          choices: [
            { id: 'sumusulat', label: 'Sumusulat' },
            { id: 'guro', label: 'Guro' },
            { id: 'masaya', label: 'Masaya' },
          ],
          answerId: 'sumusulat',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil_g3',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 3',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 3! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-3'],
    grades: [3],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g3_q1',
          prompt: 'Alin ang panghalip na ginagamit sa sarili?',
          choices: [
            { id: 'ako', label: 'Ako' },
            { id: 'siya', label: 'Siya' },
            { id: 'sila', label: 'Sila' },
          ],
          answerId: 'ako',
        },
        {
          id: 'fil_g3_q2',
          prompt: "Anong panghalip ang gagamitin para kay 'Maria'?",
          choices: [
            { id: 'siya', label: 'Siya' },
            { id: 'ako', label: 'Ako' },
            { id: 'kami', label: 'Kami' },
          ],
          answerId: 'siya',
        },
        {
          id: 'fil_g3_q3',
          prompt: 'Alin ang pang-uri (describing word)?',
          choices: [
            { id: 'matangkad', label: 'Matangkad' },
            { id: 'tumalon', label: 'Tumalon' },
            { id: 'bahay', label: 'Bahay' },
          ],
          answerId: 'matangkad',
        },
        {
          id: 'fil_g3_q4',
          prompt: 'Anong bantas ang ginagamit sa dulo ng tanong?',
          choices: [
            { id: 'q', label: '?' },
            { id: 'p', label: '.' },
            { id: 'e', label: '!' },
          ],
          answerId: 'q',
        },
        {
          id: 'fil_g3_q5',
          prompt: 'Anong bantas ang ginagamit sa dulo ng pangungusap na may damdamin?',
          choices: [
            { id: 'e', label: '!' },
            { id: 'p', label: '.' },
            { id: 'q', label: '?' },
          ],
          answerId: 'e',
        },
        {
          id: 'fil_g3_q6',
          prompt: 'Anong bantas ang ginagamit sa dulo ng payak na pangungusap?',
          choices: [
            { id: 'p', label: '.' },
            { id: 'e', label: '!' },
            { id: 'q', label: '?' },
          ],
          answerId: 'p',
        },
        {
          id: 'fil_g3_q7',
          prompt: "Alin ang salitang magkatugma sa 'pusa'?",
          choices: [
            { id: 'mesa', label: 'Mesa' },
            { id: 'aso', label: 'Aso' },
            { id: 'bahay', label: 'Bahay' },
          ],
          answerId: 'mesa',
        },
        {
          id: 'fil_g3_q8',
          prompt: "Alin ang salitang magkatugma sa 'araw'?",
          choices: [
            { id: 'ilaw', label: 'Ilaw' },
            { id: 'bahay', label: 'Bahay' },
            { id: 'pusa', label: 'Pusa' },
          ],
          answerId: 'ilaw',
        },
        {
          id: 'fil_g3_q9',
          prompt: 'Alin ang panghalip na ginagamit kung ikaw at ako ay kasama?',
          choices: [
            { id: 'tayo', label: 'Tayo' },
            { id: 'sila', label: 'Sila' },
            { id: 'kayo', label: 'Kayo' },
          ],
          answerId: 'tayo',
        },
        {
          id: 'fil_g3_q10',
          prompt: 'Alin ang naglalarawan ng laki ng bagay?',
          choices: [
            { id: 'malaki', label: 'Malaki' },
            { id: 'tumakbo', label: 'Tumakbo' },
            { id: 'mesa', label: 'Mesa' },
          ],
          answerId: 'malaki',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil_g4',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 4',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 4! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-4'],
    grades: [4],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g4_q1',
          prompt: "'Kumain' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
            { id: 'magaganap', label: 'Magaganap' },
          ],
          answerId: 'naganap',
        },
        {
          id: 'fil_g4_q2',
          prompt: "'Kumakain' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'nagaganap', label: 'Nagaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'magaganap', label: 'Magaganap' },
          ],
          answerId: 'nagaganap',
        },
        {
          id: 'fil_g4_q3',
          prompt: "'Kakain' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'magaganap', label: 'Magaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
          ],
          answerId: 'magaganap',
        },
        {
          id: 'fil_g4_q4',
          prompt: 'Alin ang pang-abay (naglalarawan sa pandiwa)?',
          choices: [
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'bahay', label: 'Bahay' },
            { id: 'pula', label: 'Pula' },
          ],
          answerId: 'mabilis',
        },
        {
          id: 'fil_g4_q5',
          prompt: "'Siya ay _____ tumakbo patungo sa paaralan.' Alin ang tamang pang-abay?",
          choices: [
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'malaki', label: 'Malaki' },
            { id: 'matamis', label: 'Matamis' },
          ],
          answerId: 'mabilis',
        },
        {
          id: 'fil_g4_q6',
          prompt: "Salawikain: 'Pagkahaba-haba man ng prusisyon, sa simbahan din ang _____.'",
          choices: [
            { id: 'tuloy', label: 'Tuloy' },
            { id: 'layo', label: 'Layo' },
            { id: 'wala', label: 'Wala' },
          ],
          answerId: 'tuloy',
        },
        {
          id: 'fil_g4_q7',
          prompt:
            "Salawikain: 'Ang hindi marunong _____ sa pinanggalingan, hindi makararating sa paroroonan.'",
          choices: [
            { id: 'lumingon', label: 'Lumingon' },
            { id: 'tumakbo', label: 'Tumakbo' },
            { id: 'kumain', label: 'Kumain' },
          ],
          answerId: 'lumingon',
        },
        {
          id: 'fil_g4_q8',
          prompt: "Bugtong: 'May mata, hindi nakakakita.' Ano ito?",
          choices: [
            { id: 'karayom', label: 'Karayom' },
            { id: 'mata', label: 'Mata' },
            { id: 'salamin', label: 'Salamin' },
          ],
          answerId: 'karayom',
        },
        {
          id: 'fil_g4_q9',
          prompt: "'Kailan ka nag-aral?' Alin ang sagot na may pang-abay ng panahon?",
          choices: [
            { id: 'kahapon', label: 'Kahapon' },
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'malakas', label: 'Malakas' },
          ],
          answerId: 'kahapon',
        },
        {
          id: 'fil_g4_q10',
          prompt: "'Maglalaba' - kailan ito mangyayari?",
          choices: [
            { id: 'magaganap', label: 'Magaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
          ],
          answerId: 'magaganap',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil_g5',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 5',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 5! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-5'],
    grades: [5],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g5_q1',
          prompt: "'Kumain ka na ba?' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'patanong', label: 'Patanong' },
            { id: 'pautos', label: 'Pautos' },
            { id: 'padamdam', label: 'Padamdam' },
          ],
          answerId: 'patanong',
        },
        {
          id: 'fil_g5_q2',
          prompt: "'Kumain ka ng gulay.' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'pautos', label: 'Pautos' },
            { id: 'patanong', label: 'Patanong' },
            { id: 'pasalaysay', label: 'Pasalaysay' },
          ],
          answerId: 'pautos',
        },
        {
          id: 'fil_g5_q3',
          prompt: "'Nakakatuwa naman ang palabas!' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'padamdam', label: 'Padamdam' },
            { id: 'patanong', label: 'Patanong' },
            { id: 'pautos', label: 'Pautos' },
          ],
          answerId: 'padamdam',
        },
        {
          id: 'fil_g5_q4',
          prompt: "'Maganda ang bulaklak.' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'pasalaysay', label: 'Pasalaysay' },
            { id: 'padamdam', label: 'Padamdam' },
            { id: 'pautos', label: 'Pautos' },
          ],
          answerId: 'pasalaysay',
        },
        {
          id: 'fil_g5_q5',
          prompt: "'Nakaupo siya _____ mesa.' Alin ang tamang pang-ukol?",
          choices: [
            { id: 'sailalimng', label: 'Sa ilalim ng' },
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'malaki', label: 'Malaki' },
          ],
          answerId: 'sailalimng',
        },
        {
          id: 'fil_g5_q6',
          prompt: "'Ang libro ay _____ mesa.' Alin ang tamang pang-ukol?",
          choices: [
            { id: 'saibabawng', label: 'Sa ibabaw ng' },
            { id: 'mabait', label: 'Mabait' },
            { id: 'kumain', label: 'Kumain' },
          ],
          answerId: 'saibabawng',
        },
        {
          id: 'fil_g5_q7',
          prompt: 'Ano ang bunga kung umulan nang malakas?',
          choices: [
            { id: 'bumaha', label: 'Bumaha' },
            { id: 'uminit', label: 'Uminit' },
            { id: 'tumawa', label: 'Tumawa' },
          ],
          answerId: 'bumaha',
        },
        {
          id: 'fil_g5_q8',
          prompt: 'Ano ang sanhi kung nabasa ang damit?',
          choices: [
            { id: 'umulan', label: 'Umulan' },
            { id: 'kumain', label: 'Kumain' },
            { id: 'natulog', label: 'Natulog' },
          ],
          answerId: 'umulan',
        },
        {
          id: 'fil_g5_q9',
          prompt: "Ano ang ibig sabihin ng idyomang 'nagbibilang ng poste'?",
          choices: [
            { id: 'walangginawa', label: 'Walang ginawa' },
            { id: 'mabiliskumain', label: 'Mabilis kumain' },
            { id: 'masipag', label: 'Masipag' },
          ],
          answerId: 'walangginawa',
        },
        {
          id: 'fil_g5_q10',
          prompt: "Ano ang ibig sabihin ng idyomang 'balat-sibuyas'?",
          choices: [
            { id: 'madalingmasaktan', label: 'Madaling masaktan ang damdamin' },
            { id: 'matapang', label: 'Matapang' },
            { id: 'masipag', label: 'Masipag' },
          ],
          answerId: 'madalingmasaktan',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil_g6',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino: Baitang 6',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo nang mag-Filipino, Baitang 6! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-6'],
    grades: [6],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil_g6_q1',
          prompt: 'Ang payak na pangungusap ay may ______ kaisipan.',
          choices: [
            { id: 'isa', label: 'Isa' },
            { id: 'dalawa', label: 'Dalawa' },
            { id: 'tatlo', label: 'Tatlo' },
          ],
          answerId: 'isa',
        },
        {
          id: 'fil_g6_q2',
          prompt: 'Alin ang tambalang (compound) pangungusap?',
          choices: [
            { id: 'a', label: 'Kumain ako at natulog ako.' },
            { id: 'b', label: 'Kumain ako.' },
            { id: 'c', label: 'Masaya ako.' },
          ],
          answerId: 'a',
        },
        {
          id: 'fil_g6_q3',
          prompt: "'Kasing puti ng gatas.' Anong tayutay ito?",
          choices: [
            { id: 'pagtutulad', label: 'Pagtutulad' },
            { id: 'pagmamalabis', label: 'Pagmamalabis' },
            { id: 'paguuyam', label: 'Pag-uyam' },
          ],
          answerId: 'pagtutulad',
        },
        {
          id: 'fil_g6_q4',
          prompt: "'Ang kanyang puso ay bato.' Anong tayutay ito?",
          choices: [
            { id: 'metapora', label: 'Metapora' },
            { id: 'pagtutulad', label: 'Pagtutulad' },
            { id: 'onomatopeya', label: 'Onomatopeya' },
          ],
          answerId: 'metapora',
        },
        {
          id: 'fil_g6_q5',
          prompt: "Ano ang kasingkahulugan ng 'obserbahan'?",
          choices: [
            { id: 'pagmasdan', label: 'Pagmasdan' },
            { id: 'kalimutan', label: 'Kalimutan' },
            { id: 'ipagbawal', label: 'Ipagbawal' },
          ],
          answerId: 'pagmasdan',
        },
        {
          id: 'fil_g6_q6',
          prompt: "Ano ang kahulugan ng 'hipotesis'?",
          choices: [
            { id: 'hakahaka', label: 'Haka-haka na susuriin' },
            { id: 'tapos', label: 'Tapos na resulta' },
            { id: 'tanong', label: 'Tanong lamang' },
          ],
          answerId: 'hakahaka',
        },
        {
          id: 'fil_g6_q7',
          prompt: 'Ang tambalang pangungusap ay binubuo ng ______ payak na pangungusap.',
          choices: [
            { id: 'dalawa', label: 'Dalawa' },
            { id: 'isa', label: 'Isa' },
            { id: 'apat', label: 'Apat' },
          ],
          answerId: 'dalawa',
        },
        {
          id: 'fil_g6_q8',
          prompt: "'Umiiyak ang langit.' Anong tayutay ito?",
          choices: [
            { id: 'personipikasyon', label: 'Personipikasyon' },
            { id: 'metapora', label: 'Metapora' },
            { id: 'pagtutulad', label: 'Pagtutulad' },
          ],
          answerId: 'personipikasyon',
        },
        {
          id: 'fil_g6_q9',
          prompt: 'Alin ang gumagamit ng pagtutulad (simile)?',
          choices: [
            { id: 'a', label: 'Matulin siyang parang kidlat.' },
            { id: 'b', label: 'Siya ang bituin ng gabi.' },
            { id: 'c', label: 'Masaya ako.' },
          ],
          answerId: 'a',
        },
        {
          id: 'fil_g6_q10',
          prompt: 'Ano ang tawag sa pangunahing ideya ng isang talata?',
          choices: [
            { id: 'pangunahingkaisipan', label: 'Pangunahing kaisipan' },
            { id: 'pamagat', label: 'Pamagat' },
            { id: 'konklusyon', label: 'Konklusyon' },
          ],
          answerId: 'pangunahingkaisipan',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // FILIPINO — second set "Filipino Plus: Baitang N" (8 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_fil2_g1',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 1',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 1! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-1', 'plus'],
    grades: [1],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g1_q1',
          prompt: "Ano ang tawag sa 'fish' sa Filipino?",
          choices: [
            { id: 'isda', label: 'Isda', picture: { icon: 'fish', color: palette.sea } },
            { id: 'aso', label: 'Aso', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'pusa', label: 'Pusa', picture: { icon: 'cat', color: palette.coral } },
          ],
          answerId: 'isda',
        },
        {
          id: 'fil2_g1_q2',
          prompt: "Ano ang tawag sa 'butterfly' sa Filipino?",
          choices: [
            {
              id: 'paruparo',
              label: 'Paruparo',
              picture: { icon: 'butterfly', color: palette.blossom },
            },
            { id: 'ibon', label: 'Ibon', picture: { icon: 'bird', color: palette.sea } },
            { id: 'bubuyog', label: 'Bubuyog', picture: { icon: 'bee', color: palette.sunshine } },
          ],
          answerId: 'paruparo',
        },
        {
          id: 'fil2_g1_q3',
          prompt: 'Anong kulay ang araw?',
          choices: [
            { id: 'dilaw', label: 'Dilaw' },
            { id: 'asul', label: 'Asul' },
            { id: 'itim', label: 'Itim' },
          ],
          answerId: 'dilaw',
        },
        {
          id: 'fil2_g1_q4',
          prompt: 'Anong kulay ang dahon?',
          choices: [
            { id: 'berde', label: 'Berde' },
            { id: 'pula', label: 'Pula' },
            { id: 'puti', label: 'Puti' },
          ],
          answerId: 'berde',
        },
        {
          id: 'fil2_g1_q5',
          prompt: "Ano ang Filipino ng bilang na '5'?",
          choices: [
            { id: 'lima', label: 'Lima' },
            { id: 'apat', label: 'Apat' },
            { id: 'anim', label: 'Anim' },
          ],
          answerId: 'lima',
        },
        {
          id: 'fil2_g1_q6',
          prompt: "Ano ang Filipino ng bilang na '7'?",
          choices: [
            { id: 'pito', label: 'Pito' },
            { id: 'anim', label: 'Anim' },
            { id: 'walo', label: 'Walo' },
          ],
          answerId: 'pito',
        },
        {
          id: 'fil2_g1_q7',
          prompt: 'Ano ang sasabihin mo pagkatapos matulungan ka?',
          choices: [
            { id: 'salamatpo', label: 'Salamat po' },
            { id: 'ayoko', label: 'Ayoko' },
            { id: 'hindi', label: 'Hindi' },
          ],
          answerId: 'salamatpo',
        },
        {
          id: 'fil2_g1_q8',
          prompt: "Ilang pantig ang salitang 'mesa'?",
          choices: [
            { id: 'two', label: '2' },
            { id: 'one', label: '1' },
            { id: 'three', label: '3' },
          ],
          answerId: 'two',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil2_g2',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 2',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 2! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-2', 'plus'],
    grades: [2],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g2_q1',
          prompt: 'Alin ang pandiwa?',
          choices: [
            { id: 'tumatawa', label: 'Tumatawa' },
            { id: 'maliit', label: 'Maliit' },
            { id: 'kama', label: 'Kama' },
          ],
          answerId: 'tumatawa',
        },
        {
          id: 'fil2_g2_q2',
          prompt: "Ano ang kasalungat ng 'mataas'?",
          choices: [
            { id: 'mababa', label: 'Mababa' },
            { id: 'malaki', label: 'Malaki' },
            { id: 'mabilis', label: 'Mabilis' },
          ],
          answerId: 'mababa',
        },
        {
          id: 'fil2_g2_q3',
          prompt: "Ano ang kasingkahulugan ng 'mabait'?",
          choices: [
            { id: 'matulungin', label: 'Matulungin' },
            { id: 'masungit', label: 'Masungit' },
            { id: 'tamad', label: 'Tamad' },
          ],
          answerId: 'matulungin',
        },
        {
          id: 'fil2_g2_q4',
          prompt: 'Ilan ang buwan sa isang taon?',
          choices: [
            { id: 'twelve', label: '12' },
            { id: 'ten', label: '10' },
            { id: 'eleven', label: '11' },
          ],
          answerId: 'twelve',
        },
        {
          id: 'fil2_g2_q5',
          prompt: 'Anong araw pagkatapos ng Miyerkules?',
          choices: [
            { id: 'huwebes', label: 'Huwebes' },
            { id: 'martes', label: 'Martes' },
            { id: 'biyernes', label: 'Biyernes' },
          ],
          answerId: 'huwebes',
        },
        {
          id: 'fil2_g2_q6',
          prompt: 'Alin ang pangngalan?',
          choices: [
            { id: 'guro', label: 'Guro' },
            { id: 'tumakbo', label: 'Tumakbo' },
            { id: 'mabilis', label: 'Mabilis' },
          ],
          answerId: 'guro',
        },
        {
          id: 'fil2_g2_q7',
          prompt: 'Ano ang huling buwan ng taon?',
          choices: [
            { id: 'disyembre', label: 'Disyembre' },
            { id: 'nobyembre', label: 'Nobyembre' },
            { id: 'enero', label: 'Enero' },
          ],
          answerId: 'disyembre',
        },
        {
          id: 'fil2_g2_q8',
          prompt: "Ano ang kasalungat ng 'malinis'?",
          choices: [
            { id: 'marumi', label: 'Marumi' },
            { id: 'maganda', label: 'Maganda' },
            { id: 'mabango', label: 'Mabango' },
          ],
          answerId: 'marumi',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil2_g3',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 3',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 3! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-3', 'plus'],
    grades: [3],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g3_q1',
          prompt: 'Alin ang panghalip para sa maraming tao, hindi kasama ang nagsasalita?',
          choices: [
            { id: 'sila', label: 'Sila' },
            { id: 'tayo', label: 'Tayo' },
            { id: 'ako', label: 'Ako' },
          ],
          answerId: 'sila',
        },
        {
          id: 'fil2_g3_q2',
          prompt: 'Alin ang pang-uri?',
          choices: [
            { id: 'masarap', label: 'Masarap' },
            { id: 'kumain', label: 'Kumain' },
            { id: 'mesa', label: 'Mesa' },
          ],
          answerId: 'masarap',
        },
        {
          id: 'fil2_g3_q3',
          prompt: 'Anong bantas ang ginagamit sa hulihan ng tanong?',
          choices: [
            { id: 'q', label: '?' },
            { id: 'p', label: '.' },
            { id: 'e', label: '!' },
          ],
          answerId: 'q',
        },
        {
          id: 'fil2_g3_q4',
          prompt: "Alin ang salitang magkatugma sa 'bahay'?",
          choices: [
            { id: 'tulay', label: 'Tulay' },
            { id: 'mesa', label: 'Mesa' },
            { id: 'ilaw', label: 'Ilaw' },
          ],
          answerId: 'tulay',
        },
        {
          id: 'fil2_g3_q5',
          prompt: "Ano ang magalang na panghalip para sa 'ikaw'?",
          choices: [
            { id: 'kayo', label: 'Kayo' },
            { id: 'siya', label: 'Siya' },
            { id: 'sila', label: 'Sila' },
          ],
          answerId: 'kayo',
        },
        {
          id: 'fil2_g3_q6',
          prompt: 'Alin ang naglalarawan ng kulay?',
          choices: [
            { id: 'pula', label: 'Pula' },
            { id: 'tumalon', label: 'Tumalon' },
            { id: 'mesa', label: 'Mesa' },
          ],
          answerId: 'pula',
        },
        {
          id: 'fil2_g3_q7',
          prompt: 'Anong bantas ang ginagamit sa dulo ng pangungusap na padamdam?',
          choices: [
            { id: 'e', label: '!' },
            { id: 'p', label: '.' },
            { id: 'q', label: '?' },
          ],
          answerId: 'e',
        },
        {
          id: 'fil2_g3_q8',
          prompt: 'Alin ang naglalarawan ng tamis?',
          choices: [
            { id: 'matamis', label: 'Matamis' },
            { id: 'mesa', label: 'Mesa' },
            { id: 'tumakbo', label: 'Tumakbo' },
          ],
          answerId: 'matamis',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil2_g4',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 4',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 4! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-4', 'plus'],
    grades: [4],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g4_q1',
          prompt: "'Naligo' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
            { id: 'magaganap', label: 'Magaganap' },
          ],
          answerId: 'naganap',
        },
        {
          id: 'fil2_g4_q2',
          prompt: "'Naliligo' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'nagaganap', label: 'Nagaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'magaganap', label: 'Magaganap' },
          ],
          answerId: 'nagaganap',
        },
        {
          id: 'fil2_g4_q3',
          prompt: "'Maliligo' - anong aspekto ng pandiwa ito?",
          choices: [
            { id: 'magaganap', label: 'Magaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
          ],
          answerId: 'magaganap',
        },
        {
          id: 'fil2_g4_q4',
          prompt: "'Kumanta siya nang _____ ang boses.' Alin ang tamang pang-abay?",
          choices: [
            { id: 'malakas', label: 'Malakas' },
            { id: 'matamis', label: 'Matamis' },
            { id: 'pula', label: 'Pula' },
          ],
          answerId: 'malakas',
        },
        {
          id: 'fil2_g4_q5',
          prompt: "Salawikain: 'Kung ano ang _____, iyan ang bunga.'",
          choices: [
            { id: 'binhi', label: 'Binhi' },
            { id: 'puno', label: 'Puno' },
            { id: 'dahon', label: 'Dahon' },
          ],
          answerId: 'binhi',
        },
        {
          id: 'fil2_g4_q6',
          prompt: "Bugtong: 'Apat ang paa, hindi nakalalakad.' Ano ito?",
          choices: [
            { id: 'mesa', label: 'Mesa' },
            { id: 'karayom', label: 'Karayom' },
            { id: 'aso', label: 'Aso' },
          ],
          answerId: 'mesa',
        },
        {
          id: 'fil2_g4_q7',
          prompt: "'Gaano karami ang kanyang kinain?' Alin ang sagot na may pang-abay ng dami?",
          choices: [
            { id: 'marami', label: 'Marami' },
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'kahapon', label: 'Kahapon' },
          ],
          answerId: 'marami',
        },
        {
          id: 'fil2_g4_q8',
          prompt: "'Magluluto' - kailan ito mangyayari?",
          choices: [
            { id: 'magaganap', label: 'Magaganap' },
            { id: 'naganap', label: 'Naganap' },
            { id: 'nagaganap', label: 'Nagaganap' },
          ],
          answerId: 'magaganap',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil2_g5',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 5',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 5! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-5', 'plus'],
    grades: [5],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g5_q1',
          prompt: "'Isara mo ang pinto.' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'pautos', label: 'Pautos' },
            { id: 'pasalaysay', label: 'Pasalaysay' },
            { id: 'patanong', label: 'Patanong' },
          ],
          answerId: 'pautos',
        },
        {
          id: 'fil2_g5_q2',
          prompt: "'Ang bahay ay malaki.' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'pasalaysay', label: 'Pasalaysay' },
            { id: 'pautos', label: 'Pautos' },
            { id: 'padamdam', label: 'Padamdam' },
          ],
          answerId: 'pasalaysay',
        },
        {
          id: 'fil2_g5_q3',
          prompt: "'Naglalaro sila _____ labas ng bahay.' Alin ang tamang pang-ukol?",
          choices: [
            { id: 'sa', label: 'Sa' },
            { id: 'mabait', label: 'Mabait' },
            { id: 'kumain', label: 'Kumain' },
          ],
          answerId: 'sa',
        },
        {
          id: 'fil2_g5_q4',
          prompt: 'Ano ang bunga kung hindi nag-aral ang bata?',
          choices: [
            { id: 'bagsak', label: 'Bagsak sa eksamen' },
            { id: 'tumawa', label: 'Tumawa' },
            { id: 'kumain', label: 'Kumain' },
          ],
          answerId: 'bagsak',
        },
        {
          id: 'fil2_g5_q5',
          prompt: 'Ano ang sanhi kung masaya ang bata?',
          choices: [
            { id: 'natanggap', label: 'Nakatanggap ng regalo' },
            { id: 'umulan', label: 'Umulan' },
            { id: 'natulog', label: 'Natulog' },
          ],
          answerId: 'natanggap',
        },
        {
          id: 'fil2_g5_q6',
          prompt: "Ano ang ibig sabihin ng idyomang 'nagsisilbing tulay'?",
          choices: [
            { id: 'tumutulong', label: 'Tumutulong ikonekta ang dalawa' },
            { id: 'mabilis', label: 'Mabilis tumakbo' },
            { id: 'masipag', label: 'Masipag' },
          ],
          answerId: 'tumutulong',
        },
        {
          id: 'fil2_g5_q7',
          prompt: "'Saan ka pupunta?' - anong uri ng pangungusap ito?",
          choices: [
            { id: 'patanong', label: 'Patanong' },
            { id: 'pautos', label: 'Pautos' },
            { id: 'pasalaysay', label: 'Pasalaysay' },
          ],
          answerId: 'patanong',
        },
        {
          id: 'fil2_g5_q8',
          prompt: "'Ang pusa ay nahiga _____ ilalim ng mesa.' Alin ang tamang pang-ukol?",
          choices: [
            { id: 'sa', label: 'Sa' },
            { id: 'mabait', label: 'Mabait' },
            { id: 'kumain', label: 'Kumain' },
          ],
          answerId: 'sa',
        },
      ],
    },
  },

  {
    id: 'act_quiz_fil2_g6',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'Filipino Plus: Baitang 6',
    icon: 'book',
    color: palette.blossom,
    voiceIntro: 'Tayo ulit mag-Filipino, Baitang 6! Tap the right answer.',
    instruction: 'Piliin ang tamang sagot.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'filipino', 'grade-6', 'plus'],
    grades: [6],
    subject: 'filipino',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'fil2_g6_q1',
          prompt: 'Alin ang halimbawa ng payak na pangungusap?',
          choices: [
            { id: 'a', label: 'Tumakbo ang bata.' },
            { id: 'b', label: 'Tumakbo ang bata at humiga siya.' },
            { id: 'c', label: 'Kung tumakbo siya, mapapagod siya.' },
          ],
          answerId: 'a',
        },
        {
          id: 'fil2_g6_q2',
          prompt: 'Ang tambalang pangungusap ay gumagamit ng pangatnig tulad ng ______.',
          choices: [
            { id: 'at', label: 'At' },
            { id: 'mabilis', label: 'Mabilis' },
            { id: 'pula', label: 'Pula' },
          ],
          answerId: 'at',
        },
        {
          id: 'fil2_g6_q3',
          prompt: "'Ang mundo ay entablado.' Anong tayutay ito?",
          choices: [
            { id: 'metapora', label: 'Metapora' },
            { id: 'pagtutulad', label: 'Pagtutulad' },
            { id: 'onomatopeya', label: 'Onomatopeya' },
          ],
          answerId: 'metapora',
        },
        {
          id: 'fil2_g6_q4',
          prompt: 'Alin ang halimbawa ng personipikasyon?',
          choices: [
            { id: 'a', label: 'Sumayaw ang mga dahon.' },
            { id: 'b', label: 'Malaki ang puno.' },
            { id: 'c', label: 'Pula ang bulaklak.' },
          ],
          answerId: 'a',
        },
        {
          id: 'fil2_g6_q5',
          prompt: "Ano ang kahulugan ng 'konklusyon'?",
          choices: [
            { id: 'paglagom', label: 'Paglagom sa huli' },
            { id: 'simula', label: 'Simula ng kwento' },
            { id: 'tanong', label: 'Tanong lamang' },
          ],
          answerId: 'paglagom',
        },
        {
          id: 'fil2_g6_q6',
          prompt: "Ano ang kahulugan ng 'ebidensya'?",
          choices: [
            { id: 'patunay', label: 'Patunay' },
            { id: 'opinyon', label: 'Opinyon lamang' },
            { id: 'guhit', label: 'Guhit' },
          ],
          answerId: 'patunay',
        },
        {
          id: 'fil2_g6_q7',
          prompt: "Alin ang gumagamit ng 'parang' o 'tulad ng' (simile)?",
          choices: [
            { id: 'a', label: 'Matigas siya na parang bato.' },
            { id: 'b', label: 'Bato ang ulo niya.' },
            { id: 'c', label: 'Matigas ang bato.' },
          ],
          answerId: 'a',
        },
        {
          id: 'fil2_g6_q8',
          prompt: 'Karaniwan, saan matatagpuan ang pangunahing kaisipan ng talata?',
          choices: [
            { id: 'unang', label: 'Unang pangungusap' },
            { id: 'gitna', label: 'Gitna ng talata' },
            { id: 'wala', label: 'Wala' },
          ],
          answerId: 'unang',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // ENGLISH — grammar (10 questions each, grades 1–6)
  // ════════════════════════════════════════════════════════════

  {
    id: 'act_quiz_eng_g1',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 1',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 1! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-1'],
    grades: [1],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g1_q1',
          prompt: 'Which one is a naming word?',
          choices: [
            { id: 'dog', label: 'Dog', picture: { icon: 'dog', color: palette.tangerine } },
            { id: 'run', label: 'Run' },
            { id: 'happy', label: 'Happy' },
          ],
          answerId: 'dog',
        },
        {
          id: 'eng_g1_q2',
          prompt: 'Which one is an action word?',
          choices: [
            { id: 'jump', label: 'Jump' },
            { id: 'cat', label: 'Cat', picture: { icon: 'cat', color: palette.coral } },
            { id: 'blue', label: 'Blue' },
          ],
          answerId: 'jump',
        },
        {
          id: 'eng_g1_q3',
          prompt: "Choose the correct word: '___ apple'",
          choices: [
            { id: 'an', label: 'An' },
            { id: 'a', label: 'A' },
          ],
          answerId: 'an',
        },
        {
          id: 'eng_g1_q4',
          prompt: "Choose the correct word: '___ ball'",
          choices: [
            { id: 'a', label: 'A', picture: { icon: 'ball', color: palette.sunshine } },
            { id: 'an', label: 'An' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g1_q5',
          prompt: "Which word starts correctly? 'the boy's name is ___'",
          choices: [
            { id: 'juanbig', label: 'Juan' },
            { id: 'juansmall', label: 'juan' },
          ],
          answerId: 'juanbig',
        },
        {
          id: 'eng_g1_q6',
          prompt: 'Which one is a naming word?',
          choices: [
            { id: 'book', label: 'Book', picture: { icon: 'book', color: palette.sea } },
            { id: 'sing', label: 'Sing' },
            { id: 'fast', label: 'Fast' },
          ],
          answerId: 'book',
        },
        {
          id: 'eng_g1_q7',
          prompt: "Choose the correct word: '___ umbrella'",
          choices: [
            { id: 'an', label: 'An' },
            { id: 'a', label: 'A' },
          ],
          answerId: 'an',
        },
        {
          id: 'eng_g1_q8',
          prompt: 'Which one is an action word?',
          choices: [
            { id: 'eat', label: 'Eat' },
            { id: 'table', label: 'Table' },
            { id: 'red', label: 'Red' },
          ],
          answerId: 'eat',
        },
        {
          id: 'eng_g1_q9',
          prompt: "Choose the correct word: '___ orange'",
          choices: [
            { id: 'an', label: 'An' },
            { id: 'a', label: 'A' },
          ],
          answerId: 'an',
        },
        {
          id: 'eng_g1_q10',
          prompt: 'Which sentence starts correctly?',
          choices: [
            { id: 'a', label: 'The cat is sleeping.' },
            { id: 'b', label: 'the cat is sleeping.' },
          ],
          answerId: 'a',
        },
      ],
    },
  },

  {
    id: 'act_quiz_eng_g2',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 2',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 2! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-2'],
    grades: [2],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g2_q1',
          prompt: "What is the plural of 'cat'?",
          choices: [
            { id: 'cats', label: 'Cats', picture: { icon: 'cat', color: palette.coral } },
            { id: 'cat', label: 'Cat' },
            { id: 'cates', label: 'Cates' },
          ],
          answerId: 'cats',
        },
        {
          id: 'eng_g2_q2',
          prompt: "What is the plural of 'box'?",
          choices: [
            { id: 'boxes', label: 'Boxes' },
            { id: 'box', label: 'Box' },
            { id: 'boxs', label: 'Boxs' },
          ],
          answerId: 'boxes',
        },
        {
          id: 'eng_g2_q3',
          prompt: "'Maria is a girl. ___ is happy.'",
          choices: [
            { id: 'she', label: 'She' },
            { id: 'he', label: 'He' },
            { id: 'they', label: 'They' },
          ],
          answerId: 'she',
        },
        {
          id: 'eng_g2_q4',
          prompt: "'Juan is a boy. ___ is tall.'",
          choices: [
            { id: 'he', label: 'He' },
            { id: 'she', label: 'She' },
            { id: 'they', label: 'They' },
          ],
          answerId: 'he',
        },
        {
          id: 'eng_g2_q5',
          prompt: "'The boys are playing. ___ are happy.'",
          choices: [
            { id: 'they', label: 'They' },
            { id: 'he', label: 'He' },
            { id: 'she', label: 'She' },
          ],
          answerId: 'they',
        },
        {
          id: 'eng_g2_q6',
          prompt: "'The dog ___ big.'",
          choices: [
            { id: 'is', label: 'Is' },
            { id: 'are', label: 'Are' },
            { id: 'am', label: 'Am' },
          ],
          answerId: 'is',
        },
        {
          id: 'eng_g2_q7',
          prompt: "'The dogs ___ big.'",
          choices: [
            { id: 'are', label: 'Are' },
            { id: 'is', label: 'Is' },
            { id: 'am', label: 'Am' },
          ],
          answerId: 'are',
        },
        {
          id: 'eng_g2_q8',
          prompt: "What is the plural of 'leaf'?",
          choices: [
            { id: 'leaves', label: 'Leaves', picture: { icon: 'leaf', color: palette.leaf } },
            { id: 'leafs', label: 'Leafs' },
            { id: 'leafes', label: 'Leafes' },
          ],
          answerId: 'leaves',
        },
        {
          id: 'eng_g2_q9',
          prompt: "'I ___ happy.'",
          choices: [
            { id: 'am', label: 'Am' },
            { id: 'is', label: 'Is' },
            { id: 'are', label: 'Are' },
          ],
          answerId: 'am',
        },
        {
          id: 'eng_g2_q10',
          prompt: "What is the plural of 'child'?",
          choices: [
            { id: 'children', label: 'Children' },
            { id: 'childs', label: 'Childs' },
            { id: 'childes', label: 'Childes' },
          ],
          answerId: 'children',
        },
      ],
    },
  },

  {
    id: 'act_quiz_eng_g3',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 3',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 3! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-3'],
    grades: [3],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g3_q1',
          prompt: "What is the past tense of 'walk'?",
          choices: [
            { id: 'walked', label: 'Walked' },
            { id: 'walk', label: 'Walk' },
            { id: 'walking', label: 'Walking' },
          ],
          answerId: 'walked',
        },
        {
          id: 'eng_g3_q2',
          prompt: "What is the past tense of 'go'?",
          choices: [
            { id: 'went', label: 'Went' },
            { id: 'goed', label: 'Goed' },
            { id: 'going', label: 'Going' },
          ],
          answerId: 'went',
        },
        {
          id: 'eng_g3_q3',
          prompt: "What is the past tense of 'eat'?",
          choices: [
            { id: 'ate', label: 'Ate' },
            { id: 'eated', label: 'Eated' },
            { id: 'eating', label: 'Eating' },
          ],
          answerId: 'ate',
        },
        {
          id: 'eng_g3_q4',
          prompt: 'Which word is an adjective?',
          choices: [
            { id: 'beautiful', label: 'Beautiful' },
            { id: 'run', label: 'Run' },
            { id: 'quickly', label: 'Quickly' },
          ],
          answerId: 'beautiful',
        },
        {
          id: 'eng_g3_q5',
          prompt: "What is the past tense of 'play'?",
          choices: [
            { id: 'played', label: 'Played' },
            { id: 'plaied', label: 'Plaied' },
            { id: 'playing', label: 'Playing' },
          ],
          answerId: 'played',
        },
        {
          id: 'eng_g3_q6',
          prompt: 'What punctuation ends a question?',
          choices: [
            { id: 'q', label: '?' },
            { id: 'p', label: '.' },
            { id: 'e', label: '!' },
          ],
          answerId: 'q',
        },
        {
          id: 'eng_g3_q7',
          prompt: 'What punctuation ends a statement?',
          choices: [
            { id: 'p', label: '.' },
            { id: 'q', label: '?' },
            { id: 'e', label: '!' },
          ],
          answerId: 'p',
        },
        {
          id: 'eng_g3_q8',
          prompt: "'The tall tree swayed.' Which word is the adjective?",
          choices: [
            { id: 'tall', label: 'Tall' },
            { id: 'tree', label: 'Tree', picture: { icon: 'tree', color: palette.leaf } },
            { id: 'swayed', label: 'Swayed' },
          ],
          answerId: 'tall',
        },
        {
          id: 'eng_g3_q9',
          prompt: "What is the past tense of 'see'?",
          choices: [
            { id: 'saw', label: 'Saw' },
            { id: 'seed', label: 'Seed' },
            { id: 'seeing', label: 'Seeing' },
          ],
          answerId: 'saw',
        },
        {
          id: 'eng_g3_q10',
          prompt: 'What punctuation shows excitement?',
          choices: [
            { id: 'e', label: '!' },
            { id: 'p', label: '.' },
            { id: 'q', label: '?' },
          ],
          answerId: 'e',
        },
      ],
    },
  },

  {
    id: 'act_quiz_eng_g4',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 4',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 4! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-4'],
    grades: [4],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g4_q1',
          prompt: 'Which word is an adverb?',
          choices: [
            { id: 'quickly', label: 'Quickly' },
            { id: 'table', label: 'Table' },
            { id: 'happy', label: 'Happy' },
          ],
          answerId: 'quickly',
        },
        {
          id: 'eng_g4_q2',
          prompt: "'I like tea ___ coffee.'",
          choices: [
            { id: 'and', label: 'And' },
            { id: 'but', label: 'But' },
            { id: 'or', label: 'Or' },
          ],
          answerId: 'and',
        },
        {
          id: 'eng_g4_q3',
          prompt: "'She is tired ___ she keeps working.'",
          choices: [
            { id: 'but', label: 'But' },
            { id: 'and', label: 'And' },
            { id: 'or', label: 'Or' },
          ],
          answerId: 'but',
        },
        {
          id: 'eng_g4_q4',
          prompt: "'He ___ to school every day.'",
          choices: [
            { id: 'goes', label: 'Goes' },
            { id: 'go', label: 'Go' },
            { id: 'going', label: 'Going' },
          ],
          answerId: 'goes',
        },
        {
          id: 'eng_g4_q5',
          prompt: "'They ___ to school every day.'",
          choices: [
            { id: 'go', label: 'Go' },
            { id: 'goes', label: 'Goes' },
            { id: 'going', label: 'Going' },
          ],
          answerId: 'go',
        },
        {
          id: 'eng_g4_q6',
          prompt: "'She ran quickly.' Which word is the adverb?",
          choices: [
            { id: 'quickly', label: 'Quickly' },
            { id: 'ran', label: 'Ran' },
            { id: 'she', label: 'She' },
          ],
          answerId: 'quickly',
        },
        {
          id: 'eng_g4_q7',
          prompt: "'You can have juice ___ water.'",
          choices: [
            { id: 'or', label: 'Or' },
            { id: 'and', label: 'And' },
            { id: 'but', label: 'But' },
          ],
          answerId: 'or',
        },
        {
          id: 'eng_g4_q8',
          prompt: "'The dog ___ loudly.'",
          choices: [
            { id: 'barks', label: 'Barks' },
            { id: 'bark', label: 'Bark' },
            { id: 'barking', label: 'Barking' },
          ],
          answerId: 'barks',
        },
        {
          id: 'eng_g4_q9',
          prompt: 'Which word is an adverb?',
          choices: [
            { id: 'slowly', label: 'Slowly' },
            { id: 'jump', label: 'Jump' },
            { id: 'red', label: 'Red' },
          ],
          answerId: 'slowly',
        },
        {
          id: 'eng_g4_q10',
          prompt: "'The children ___ happily.'",
          choices: [
            { id: 'play', label: 'Play' },
            { id: 'plays', label: 'Plays' },
            { id: 'playing', label: 'Playing' },
          ],
          answerId: 'play',
        },
      ],
    },
  },

  {
    id: 'act_quiz_eng_g5',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 5',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 5! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-5'],
    grades: [5],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g5_q1',
          prompt: "'The book is ___ the table.'",
          choices: [
            { id: 'on', label: 'On' },
            { id: 'under', label: 'Under' },
            { id: 'in', label: 'In' },
          ],
          answerId: 'on',
        },
        {
          id: 'eng_g5_q2',
          prompt: "'She is ___ school.'",
          choices: [
            { id: 'in', label: 'In' },
            { id: 'on', label: 'On' },
            { id: 'under', label: 'Under' },
          ],
          answerId: 'in',
        },
        {
          id: 'eng_g5_q3',
          prompt: "What is the comparative of 'big'?",
          choices: [
            { id: 'bigger', label: 'Bigger' },
            { id: 'biggest', label: 'Biggest' },
            { id: 'big', label: 'Big' },
          ],
          answerId: 'bigger',
        },
        {
          id: 'eng_g5_q4',
          prompt: "What is the superlative of 'big'?",
          choices: [
            { id: 'biggest', label: 'Biggest' },
            { id: 'bigger', label: 'Bigger' },
            { id: 'big', label: 'Big' },
          ],
          answerId: 'biggest',
        },
        {
          id: 'eng_g5_q5',
          prompt: "What is the comparative of 'happy'?",
          choices: [
            { id: 'happier', label: 'Happier' },
            { id: 'happiest', label: 'Happiest' },
            { id: 'happy', label: 'Happy' },
          ],
          answerId: 'happier',
        },
        {
          id: 'eng_g5_q6',
          prompt: "What is the superlative of 'tall'?",
          choices: [
            { id: 'tallest', label: 'Tallest' },
            { id: 'taller', label: 'Taller' },
            { id: 'tall', label: 'Tall' },
          ],
          answerId: 'tallest',
        },
        {
          id: 'eng_g5_q7',
          prompt: "'The cat is ___ the box.'",
          choices: [
            { id: 'under', label: 'Under' },
            { id: 'on', label: 'On' },
            { id: 'at', label: 'At' },
          ],
          answerId: 'under',
        },
        {
          id: 'eng_g5_q8',
          prompt: 'What punctuation is used around the exact words someone says?',
          choices: [
            { id: 'quotes', label: 'Quotation marks' },
            { id: 'period', label: 'Period' },
            { id: 'comma', label: 'Comma' },
          ],
          answerId: 'quotes',
        },
        {
          id: 'eng_g5_q9',
          prompt: 'Which sentence correctly punctuates direct speech?',
          choices: [
            { id: 'a', label: 'She said, "I am happy."' },
            { id: 'b', label: 'She said I am happy.' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g5_q10',
          prompt: "What is the comparative of 'good'?",
          choices: [
            { id: 'better', label: 'Better' },
            { id: 'gooder', label: 'Gooder' },
            { id: 'best', label: 'Best' },
          ],
          answerId: 'better',
        },
      ],
    },
  },

  {
    id: 'act_quiz_eng_g6',
    kind: 'QUIZ',
    islandId: 'letters',
    title: 'English: Grade 6',
    icon: 'book',
    color: palette.lavender,
    voiceIntro: "Let's practice English, Grade 6! Tap the right answer.",
    instruction: 'Choose the correct answer.',
    reward: { diamonds: 5 },
    tags: ['quiz', 'english', 'grade-6'],
    grades: [6],
    subject: 'english',
    data: {
      kind: 'QUIZ',
      pick: 5,
      questions: [
        {
          id: 'eng_g6_q1',
          prompt: 'Which is an independent clause?',
          choices: [
            { id: 'a', label: 'The sun is bright.' },
            { id: 'b', label: 'Because it is bright' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g6_q2',
          prompt: 'Which is a dependent clause?',
          choices: [
            { id: 'a', label: 'Because it rained' },
            { id: 'b', label: 'It rained yesterday.' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g6_q3',
          prompt: 'Which sentence is in active voice?',
          choices: [
            { id: 'a', label: 'The boy kicked the ball.' },
            { id: 'b', label: 'The ball was kicked by the boy.' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g6_q4',
          prompt: 'Which sentence is in passive voice?',
          choices: [
            { id: 'a', label: 'The ball was kicked by the boy.' },
            { id: 'b', label: 'The boy kicked the ball.' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g6_q5',
          prompt: "What figure of speech is 'as brave as a lion'?",
          choices: [
            { id: 'simile', label: 'Simile' },
            { id: 'metaphor', label: 'Metaphor' },
            { id: 'idiom', label: 'Idiom' },
          ],
          answerId: 'simile',
        },
        {
          id: 'eng_g6_q6',
          prompt: "What figure of speech is 'time is money'?",
          choices: [
            { id: 'metaphor', label: 'Metaphor' },
            { id: 'simile', label: 'Simile' },
            { id: 'idiom', label: 'Idiom' },
          ],
          answerId: 'metaphor',
        },
        {
          id: 'eng_g6_q7',
          prompt: "'The arid desert had no rain for months.' What does 'arid' mean?",
          choices: [
            { id: 'dry', label: 'Dry' },
            { id: 'wet', label: 'Wet' },
            { id: 'cold', label: 'Cold' },
          ],
          answerId: 'dry',
        },
        {
          id: 'eng_g6_q8',
          prompt: "'She was ecstatic and jumped for joy.' What does 'ecstatic' mean?",
          choices: [
            { id: 'veryhappy', label: 'Very happy' },
            { id: 'verysad', label: 'Very sad' },
            { id: 'verytired', label: 'Very tired' },
          ],
          answerId: 'veryhappy',
        },
        {
          id: 'eng_g6_q9',
          prompt: 'Which sentence uses a simile?',
          choices: [
            { id: 'a', label: 'He is as strong as an ox.' },
            { id: 'b', label: 'He is strong.' },
          ],
          answerId: 'a',
        },
        {
          id: 'eng_g6_q10',
          prompt: 'Which sentence uses a metaphor?',
          choices: [
            { id: 'a', label: 'Her smile is sunshine.' },
            { id: 'b', label: 'Her smile is nice.' },
          ],
          answerId: 'a',
        },
      ],
    },
  },
];
