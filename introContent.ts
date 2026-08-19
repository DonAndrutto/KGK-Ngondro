/**
 * Content for the Introduction pop-up: "About the Text" and "How to Use".
 *
 * Kept as structured blocks rather than raw markup so the modal can render the
 * prose with the same typographic voice as the liturgy itself. Inline emphasis
 * is written with **double asterisks**.
 */

export type IntroBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'pairs'; items: { term: string; gloss: string }[] };

export interface IntroSection {
  id: string;
  title: string;
  /** The first few lines, shown while the section is collapsed. */
  preview: string;
  blocks: IntroBlock[];
}

const ABOUT_THE_TEXT: IntroSection = {
  id: 'about',
  title: 'About the Text',
  preview:
    'The Kunzang Gongdu Ngondro is the preliminary practice liturgy for Pema Lingpa’s Dzogchen cycle Künzang Gongpa Kündü — The Synthesis of the Entire Wisdom Mind of Samantabhadra. Ngondro literally means “that which goes before.”',
  blocks: [
    { kind: 'heading', text: 'Kunzang Gongdu Ngondro' },
    {
      kind: 'paragraph',
      text: 'The Kunzang Gongdu Ngondro is the preliminary practice liturgy for Pema Lingpa’s Dzogchen cycle Künzang Gongpa Kündü — The Synthesis of the Entire Wisdom Mind of Samantabhadra.',
    },
    {
      kind: 'paragraph',
      text: 'Ngondro literally means “that which goes before.” These practices prepare the practitioner for the main practice of Dzogchen, while at the same time forming a complete path of practice in their own right. For practitioners of this lineage, the Ngondro may become a lifelong daily practice rather than something simply completed and left behind.',
    },
    {
      kind: 'paragraph',
      text: 'The Kunzang Gongdu Ngondro belongs to the broad tradition of preliminary practices found throughout Vajrayana Buddhism. What distinguishes it is the way the perspective of the Great Completeness, or Dzogchen, runs through virtually every part of the liturgy.',
    },

    { kind: 'subheading', text: 'The practices' },
    {
      kind: 'paragraph',
      text: 'The practice begins with the common preliminaries: contemplations intended to turn the mind away from habitual involvement in samsara and make it workable for practice.',
    },
    {
      kind: 'paragraph',
      text: 'These include the four considerations that turn the mind towards Dharma, together with contemplation of the four immeasurables: immeasurable love, compassion, joy, and impartiality.',
    },
    { kind: 'paragraph', text: 'They are followed by the five special preliminaries:' },
    {
      kind: 'list',
      items: [
        'Going for refuge',
        'Developing the spirit of awakening, or bodhicitta',
        'Purification through the practice of Vajrasattva',
        'Mandala offering and the gathering of the accumulations',
        'Guru Yoga',
      ],
    },
    { kind: 'paragraph', text: 'These five practices form the central body of the Ngondro.' },

    { kind: 'subheading', text: 'Preparation for Dzogchen' },
    {
      kind: 'paragraph',
      text: 'Traditionally, Ngondro prepares the practitioner for the main practices of Dzogchen: Tregchö, “Cutting Through,” and Thögal, “Crossing Over.”',
    },
    {
      kind: 'paragraph',
      text: 'The conventional requirement is to complete one hundred thousand repetitions of each of the five special preliminaries. These accumulations establish familiarity with the practices while training body, speech, and mind over a sustained period.',
    },
    {
      kind: 'paragraph',
      text: 'Recognising that completing the full traditional accumulations can take considerable time for lay practitioners, Gangteng Tulku Rinpoche has permitted students to begin receiving further Dzogchen instructions after completing ten per cent of the prescribed accumulations, provided that they make a commitment to complete the Ngondro within their lifetime.',
    },
    {
      kind: 'paragraph',
      text: 'This makes it possible for practitioners to begin studying and practising Ati Yoga while continuing to deepen and complete the preliminaries.',
    },
    {
      kind: 'paragraph',
      text: 'The Ngondro should therefore not be understood merely as an entrance examination for Dzogchen. Its practices continue to accompany and support the practitioner throughout the path.',
    },

    { kind: 'subheading', text: 'What makes this Ngondro distinctive?' },
    {
      kind: 'paragraph',
      text: 'The structure of the Kunzang Gongdu Ngondro is broadly recognisable from other Vajrayana preliminary practices, but its perspective is distinctly Dzogchen.',
    },
    {
      kind: 'paragraph',
      text: 'Again and again, familiar practices such as refuge, bodhicitta, purification, offering and Guru Yoga are expressed in the language and vision of the Great Completeness — Dzogpa Chenpo.',
    },
    {
      kind: 'paragraph',
      text: 'The liturgy therefore does more than accumulate the conventional causes and conditions for later practice. Within the preliminaries themselves, the practitioner is repeatedly given glimpses of the view that will become central in the main practice.',
    },
    {
      kind: 'paragraph',
      text: 'In this sense, the Ngondro serves both as preparation and as an entryway into the distinctive perspective of Dzogchen.',
    },

    { kind: 'subheading', text: 'A living lineage' },
    { kind: 'paragraph', text: 'Another defining feature of the practice is its lineage of transmission.' },
    {
      kind: 'paragraph',
      text: 'In Vajrayana, a liturgy does not stand by itself as an isolated text. It is practised within a living stream of transmission passed from teacher to student. Through receiving the empowerment, instructions and reading transmission of a practice, the practitioner becomes connected to that lineage.',
    },
    {
      kind: 'paragraph',
      text: 'The lineage of the Kunzang Gongdu traces its origin to the primordial Buddha Samantabhadra, and passes through figures including Padmasambhava and Yeshe Tsogyal, the great eighth-century masters associated with the establishment of Vajrayana Buddhism in Tibet.',
    },
    {
      kind: 'paragraph',
      text: 'The cycle was later revealed by the fifteenth-century Bhutanese treasure revealer Pema Lingpa.',
    },
    {
      kind: 'paragraph',
      text: 'Its transmission continued through the holders of Pema Lingpa’s revealed teachings, known collectively as the Pedling Chökor, including Gyalse Pema Trinle, the first Gangteng Tulku, and later masters such as Dudjom Rinpoche Jigdral Yeshe Dorje.',
    },
    {
      kind: 'paragraph',
      text: 'The lineage continues today through the ninth Gangteng Tulku, Kunzang Rigdzin Pema Namgyal.',
    },
    {
      kind: 'paragraph',
      text: 'Gangteng Tulku Rinpoche continues to transmit Pema Lingpa’s Kunzang Gongdu Dzogchen teachings to students who have completed the required preliminary practice. In Bhutan, these teachings and practices remain active in Rinpoche’s monasteries, retreat centres and hermitages. Internationally, they are transmitted primarily through the Yeshe Khorlo centres.',
    },

    { kind: 'subheading', text: 'Pema Lingpa and the larger cycle' },
    {
      kind: 'paragraph',
      text: 'Pema Lingpa was a fifteenth-century Bhutanese master and treasure revealer, or tertön. He is traditionally counted among the five sovereign treasure revealers, sometimes referred to as the Five Tertön Kings.',
    },
    {
      kind: 'paragraph',
      text: 'His revealed teachings encompass the principal categories traditionally associated with a major treasure revealer: teachings of the Guru, Great Completeness and Compassionate Mind — bLa, rDzogs, Thugs gSum.',
    },
    {
      kind: 'paragraph',
      text: 'The Guru teachings include peaceful and wrathful manifestations of Guru Rinpoche, particularly the cycles of Lama Norbu Gyamtsho — The Guru Teachings, Like an Ocean of Jewels, and Guru Drakpo — The Wrathful Guru.',
    },
    {
      kind: 'paragraph',
      text: 'Pema Lingpa’s Great Completeness teachings include a group known as the Father, Mother and Child Dzogchen cycles:',
    },
    {
      kind: 'pairs',
      items: [
        {
          term: 'Father Great Completeness — Künzang Gongpa Kündü',
          gloss: 'The Synthesis of the Entire Wisdom Mind of Samantabhadra',
        },
        {
          term: 'Mother Great Completeness — Longsel Sangwa Nyingchu',
          gloss: 'The Quintessence of the Luminous Expanse',
        },
        {
          term: 'Child Great Completeness — Nyimei Gyu Buchung',
          gloss: 'The Non-dual Tantra of the Small Child',
        },
      ],
    },
    {
      kind: 'paragraph',
      text: 'Of these, the Kunzang Gongpa Kündü is today among the most widely practised. Its transmission remains active, supported by a substantial body of oral and written commentary, daily practitioners and practitioners undertaking its teachings in strict retreat.',
    },

    { kind: 'subheading', text: 'The liturgy' },
    {
      kind: 'paragraph',
      text: 'The present Ngondro liturgy was composed by Dudjom Rinpoche Jigdral Yeshe Dorje in Swayambhu, Nepal, in 1976, at the request of Gangteng Tulku Rinpoche.',
    },
    {
      kind: 'paragraph',
      text: 'It was composed on the basis of Pema Lingpa’s original treasure text, presenting the preliminary practices of the Kunzang Gongdu cycle in a form suitable for regular practice.',
    },

    { kind: 'subheading', text: 'Using the app' },
    {
      kind: 'paragraph',
      text: 'This app was created as a digital companion to the liturgy. Its purpose is simple: to make the text easy to read, recite, contemplate and practise without allowing the technology itself to become a distraction.',
    },
    {
      kind: 'paragraph',
      text: 'The display can be adapted to the needs of the practitioner. The original Tibetan text, phonetic pronunciation and translation can each be shown or hidden independently, and the interface currently supports both English and Polish.',
    },
    { kind: 'paragraph', text: 'An index allows quick movement between sections of the practice.' },
    {
      kind: 'paragraph',
      text: 'For recitation, the app includes automatic scrolling with adjustable speed, as well as tilt-to-scroll, allowing the text to move simply by changing the angle of the device. A full-screen mode and adjustable text size make the liturgy practical to use on a phone, tablet or desktop computer.',
    },
    {
      kind: 'paragraph',
      text: 'A day/night display can also be selected, particularly useful for practice in low light.',
    },

    { kind: 'subheading', text: 'Meditation timer' },
    {
      kind: 'paragraph',
      text: 'At several points in the liturgy, the practitioner is instructed to stop reciting and remain in meditative equipoise.',
    },
    {
      kind: 'paragraph',
      text: 'The app therefore includes a meditation timer designed specifically around the structure of the Ngondro.',
    },
    {
      kind: 'paragraph',
      text: 'For example, if you intend to spend sixty minutes in meditation during a complete session, you can set a sixty-minute countdown before beginning. When you reach a section calling for meditation — such as the dissolution following refuge and bodhicitta — a play button appears.',
    },
    {
      kind: 'paragraph',
      text: 'You can meditate for twenty minutes, pause the timer, continue the liturgy, and resume it at the next appropriate interval. The app will remember that forty minutes remain.',
    },
    {
      kind: 'paragraph',
      text: 'A chime sounds when the full allotted meditation period has been completed.',
    },

    { kind: 'subheading', text: 'Visual aids' },
    {
      kind: 'paragraph',
      text: 'The app also contains visual supports for practices involving more elaborate visualisation, including images of the Refuge Tree, Vajrasattva, and the visualisation associated with Guru Yoga.',
    },
    {
      kind: 'paragraph',
      text: 'Within the Vajrasattva section, selecting VISUALIZE opens an interactive representation of the 100-syllable mantra. Both the viewing angle and the speed of rotation of the mantra can be adjusted, allowing the practitioner to examine the visualisation from different perspectives before returning to the practice itself.',
    },

    { kind: 'subheading', text: 'The importance of authentic transmission' },
    {
      kind: 'paragraph',
      text: 'The app is intended as a companion to an existing practice tradition, not as a substitute for transmission and instruction from a qualified teacher.',
    },
    {
      kind: 'paragraph',
      text: 'The Kunzang Gongdu Ngondro belongs to Vajrayana. Those practising the liturgy should therefore have received at least its reading transmission (lung) from an authorised lineage holder.',
    },
    {
      kind: 'paragraph',
      text: 'Ideally, practitioners should also have received the appropriate empowerment (wang) and instructions connected with the practice.',
    },
    {
      kind: 'paragraph',
      text: 'Those wishing to receive the transmission or learn more about the practice may contact their local Yeshe Khorlo Centre.',
    },

    { kind: 'subheading', text: 'Translation and development' },
    {
      kind: 'paragraph',
      text: 'Credit for the English translation on which the initial version of the text was based goes to Richard Barron and Sarah Harding.',
    },
    {
      kind: 'paragraph',
      text: 'The digital edition and app were developed by Andrzej R. Rybszleger, interpreter and translator for Gangteng Tulku Rinpoche.',
    },
  ],
};

const HOW_TO_USE: IntroSection = {
  id: 'how-to-use',
  title: 'How to Use',
  preview:
    'The app allows you to adapt the liturgy to the way you practise. You can independently show or hide the Tibetan text, phonetic pronunciation and translation, change the text size, switch between day and night display, and use the index to move directly to any section of the practice.',
  blocks: [
    { kind: 'paragraph', text: 'The app allows you to adapt the liturgy to the way you practise.' },
    {
      kind: 'paragraph',
      text: 'You can independently show or hide the **Tibetan text, phonetic pronunciation and translation**, change the text size, switch between day and night display, and use the index to move directly to any section of the practice.',
    },
    {
      kind: 'paragraph',
      text: 'For hands-free recitation, use **Auto Scroll** and adjust its speed, or enable **Tilt to Scroll** to move through the text by tilting your device.',
    },
    {
      kind: 'paragraph',
      text: 'Where the liturgy calls for resting in meditation, the built-in **timer** can be started directly from the relevant section. If you pause it and continue reciting, the remaining meditation time carries over to the next meditation interval.',
    },
    {
      kind: 'paragraph',
      text: 'Visualisation aids are provided for the **Refuge Tree, Vajrasattva and Guru Yoga**. In the Vajrasattva section, tap **VISUALIZE** to open the interactive 100-syllable mantra, where its angle and speed of rotation can be adjusted.',
    },
    {
      kind: 'paragraph',
      text: 'Tap the **?** icon at any time for a quick overview of the controls.',
    },
  ],
};

export const INTRO_SECTIONS: IntroSection[] = [ABOUT_THE_TEXT, HOW_TO_USE];
