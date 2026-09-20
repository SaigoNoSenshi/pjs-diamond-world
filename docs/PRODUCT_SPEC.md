# PJ's Diamond World — Product Specification

Version: 0.1 (MVP)
Primary user: PJ, a kindergarten-age child (approximately 5 years old)
Secondary user: PJ's parent (Parent Mode)

## 1. Product vision

PJ's Diamond World is a magical creative world where a young child can draw, color, stamp, follow real-world craft activities, photograph what she made, keep everything in a personal scrapbook, and watch a magical island garden grow because she created things.

It sits between a creative drawing app, an interactive scrapbook, a guided craft companion, and a gentle exploration world. Creativity comes first. It is not a classroom.

## 2. PJ's original ideas (preserved)

PJ likes diamonds, princesses, flowers, leaves, stars, drawing, crafts, clay, yellow, orange, islands, the sea, and jellyfish. Her favourite animal is the jellyfish.

She asked for: a water/sea environment, an island, yellow jellyfish, a princess, drawings, sounds, a princess-style song, large buttons, crafts, and saving finished creations. She also said "I'm a robot" and "I'm a pig", so a robot stamp and a pig stamp are in the first stamp set.

All characters, art, music, and designs are original. No Disney or other licensed properties are used or referenced.

## 3. World

**Diamond Island** sits in a magical sea. Visual themes: glowing diamonds, tropical plants, flowers, stars, colourful sea life, friendly jellyfish.

**Jelly** (temporary name, configurable in `src/constants/characters.ts`) is an original yellow jellyfish who guides PJ. Jelly communicates through animation, icons, short voice prompts, reactions and simple sounds — never long speeches.

**The Princess** is an original friendly princess who appears in the intro. Tapping her makes a magical plant grow, flowers appear, diamonds sparkle, and an original princess-style musical cue play.

## 4. Intro experience

1. Logo appears.
2. Transition to Diamond Island.
3. Princess appears; PJ taps her.
4. Plant grows, flowers bloom, diamonds sparkle, musical cue plays.
5. Jelly appears and welcomes PJ.

Target: PJ reaches the home screen within 5–10 seconds. Returning users see a large SKIP control and the intro auto-advances if PJ does nothing. The intro-seen flag is stored in local settings.

## 5. Home: Diamond Island

Four extremely clear, icon-first, voice-supported primary areas:

| Area            | Icon                 | Purpose                                            |
| --------------- | -------------------- | -------------------------------------------------- |
| CREATE          | paintbrush / rainbow | Draw & Paint, Craft With Me, future creation modes |
| MY GARDEN       | flower / plant       | Progression world that grows with creations        |
| MUSIC REEF      | music note / shell   | Original music loops and sounds                    |
| MY DIAMOND BOOK | book / diamond       | Personal scrapbook of creations                    |

Every primary button reads its label aloud on press (when voice is enabled). No reading is required to navigate.

A small, deliberately unremarkable parent-gate control lives in a corner and requires press-and-hold plus an adult challenge.

## 6. Create hub

Two modes at launch, registered through a creation-mode registry so more can be added as data:

- **Draw & Paint**
- **Craft With Me**

Future modes (not built): stickers, colouring pages, shape maker, clay activities, paper crafts, story drawing, photo decoration, character creator.

## 7. Draw & Paint

Tools: freehand brush, crayon, eraser, undo, redo, clear canvas (press-and-hold), colour selector, stamps, save.

Colours (large circles, never a conventional colour picker): yellow, orange, pink, blue, green, purple, red, white, black.

Stamps (first pack, expandable): diamond, flower, leaf, star, jellyfish, princess crown, heart, robot, pig.

Child-safe canvas rules: the canvas occupies most of the screen; controls sit within reach of small hands along the bottom and one side; undo is always visible; clear requires press-and-hold; the drawing autosaves as a draft every few seconds and on background/navigation so leaving the screen never destroys work.

Saving produces a PNG asset, a thumbnail, an auto-generated friendly title such as "PJ's Yellow Star" (based on dominant colour and last stamp), a `Creation` record, and a `DRAWING_COMPLETED` + `CREATION_SAVED` progression event.

## 8. Craft With Me

Crafts are data (`CraftTemplate`), validated with a schema, and rendered by one reusable Craft Player. Each step shows a large illustration, a very short instruction, a voice prompt, and large NEXT / BACK buttons. Progress within a craft is saved so an interrupted craft resumes.

### First craft: PJ's Clay Cup

1. Make a clay log.
2. Connect the clay together.
3. Shape the cup.
4. Add colors.
5. Make the handle.
6. Take a picture.
7. Save My Cup.

Completion: gentle celebration ("PJ made a cup!"), then SAVE MY CUP stores the photo in My Diamond Book and emits `CRAFT_COMPLETED`, `PHOTO_SAVED`, `CREATION_SAVED`.

## 9. Camera and photos

Photos are taken with the device camera (or chosen from the library on web preview). Photos are stored locally only. Cloud backup is optional, parent-controlled, and off by default. No face detection, no biometric analysis, no use of photos for AI training.

## 10. My Diamond Book

A visual scrapbook of large cards. Filters: ALL, DRAWINGS, CRAFTS, FAVORITES. Tap a card to see the creation full-screen, toggle favourite, and (future) add a sticker or voice note. Titles are auto-generated; parents may rename in Parent Mode. PJ never types a filename.

## 11. My Garden and progression

Every creation grows the garden. No leaderboards, rankings, or pressure.

Progression is event-driven: `CREATION_SAVED`, `CRAFT_COMPLETED`, `DRAWING_COMPLETED`, `PHOTO_SAVED`, `ACTIVITY_COMPLETED`, `GARDEN_ITEM_UNLOCKED`. Rules are data (`GardenItem.unlockRequirement`). Example ladder: first drawing → sprout; first craft → flower; three creations → tree; five creations → diamond; further items unlock as the content pack grows.

## 12. Music Reef

Original short loops and ambient sounds with PLAY, PAUSE, NEXT, VOLUME. Volume starts moderate, respects device volume, and never jumps. The MVP ships placeholder loops that must be replaced with commissioned original music before any public release.

## 13. Voice guidance

Short, cheerful, calm prompts ("Let's make a cup!", "Make a clay log."). The MVP uses on-device text-to-speech through an `AudioPromptService` interface so prerecorded voice assets can replace it without touching features.

## 14. Parent Mode

Entered through a press-and-hold parent gate followed by an adult challenge (simple arithmetic) or an optional parent PIN. Provides: app settings, audio settings, storage usage, export creations, delete creations, rename creations, cloud backup settings (off by default), child profile (nickname only), activity management, privacy controls, reset intro.

## 15. Child privacy and safety

See `CHILD_SAFETY.md`. Summary: nickname only, no personal data, no ads, no external links for the child, no public profiles or posting, no chat, no open browsing, no AI chatbot exposed to the child, local-first storage, optional parent-controlled cloud.

## 16. Definition of done (MVP)

PJ can independently: open the app, enter Diamond Island, tap Create, make a drawing, choose colours, add stamps, save it, find it in My Diamond Book, start PJ's Clay Cup, follow each step, photograph her cup, save it, see her garden grow, play music, and return home — without an adult explaining normal navigation. Parent-only actions stay protected. No critical errors occur along that path.

## 17. The most important product test

Can PJ understand what to do without someone explaining it? If an interface needs repeated adult explanation, simplify it.

## 18. Assumptions made during the build

- The build environment is a sandboxed container, not Replit. The repository includes a `.replit` file and standard npm scripts so it opens directly in Replit. Native (iOS/Android) behaviour is validated through unit tests and the web preview only; device testing is a follow-up.
- Drawing uses an SVG-based canvas behind a `DrawingCanvas` abstraction. Skia can replace it later if performance requires.
- Music and voice assets are placeholders (synthesised tones and on-device TTS) clearly labelled for replacement.
- Illustrations are original generated artwork in one consistent soft, bright style.
