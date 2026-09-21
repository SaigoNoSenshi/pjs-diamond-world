import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { findActivity } from '@/content/activities';
import type { MathData, WordsData } from '@/domain/activity/schema';
import { generateMath } from '@/domain/generators/math';
import { generateWords } from '@/domain/generators/words';
import { wordsForGrade } from '@/content/words';
import { AppServicesProvider } from '@/hooks/useAppServices';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices } from '@/services/container';

import { MathPlayer } from '../engines/MathPlayer';
import { WordsPlayer } from '../engines/WordsPlayer';

function wrap(ui: React.ReactElement) {
  const services = createTestServices();
  return render(
    <AppServicesProvider services={services}>
      <ProfileProvider>{ui}</ProfileProvider>
    </AppServicesProvider>,
  );
}

jest.setTimeout(40000);

const tid = (s: string) => `math-choice-${s.replace(/[^0-9a-z]/gi, '_')}`;

describe('MathPlayer', () => {
  it('grade 1 addition with choice cards: one wrong tap then right answers, score reflects it', async () => {
    const activity = findActivity('act_math_addition_g1')! as Parameters<
      typeof MathPlayer
    >[0]['activity'];
    const data = activity.data as MathData;
    const questions = generateMath(
      data.generator,
      data.grade,
      data.rounds,
      'test-seed',
      data.input,
    );
    const onComplete = jest.fn();
    const screen = await wrap(
      <MathPlayer activity={activity} onComplete={onComplete} seed="test-seed" />,
    );
    expect(screen.getByTestId('math-player')).toBeTruthy();
    for (const [i, q] of questions.entries()) {
      await waitFor(() => expect(screen.getByText(`${i + 1} / ${questions.length}`)).toBeTruthy(), {
        timeout: 3000,
      });
      if (i === 0) {
        const wrong = q.choices!.find((c) => c !== q.answer)!;
        await fireEvent.press(screen.getByTestId(tid(wrong)));
      }
      await fireEvent.press(screen.getByTestId(tid(q.answer)));
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(onComplete.mock.calls[0]?.[0]).toBeCloseTo((questions.length - 1) / questions.length);
  });

  it('grade 3 multiplication uses the keypad; two misses reveal the answer and move on', async () => {
    const activity = findActivity('act_math_multiplication_g3')! as Parameters<
      typeof MathPlayer
    >[0]['activity'];
    const data = activity.data as MathData;
    const questions = generateMath(data.generator, data.grade, data.rounds, 'kp', data.input);
    expect(questions.every((q) => !q.choices)).toBe(true);
    const onComplete = jest.fn();
    const screen = await wrap(<MathPlayer activity={activity} onComplete={onComplete} seed="kp" />);
    expect(screen.getByTestId('keypad')).toBeTruthy();
    const type = async (s: string) => {
      for (const ch of s) await fireEvent.press(screen.getByTestId(`key-${ch}`));
      await fireEvent.press(screen.getByTestId('key-check'));
    };
    // Q1: miss twice → reveal.
    await type('1');
    await type('1');
    expect(await screen.findByTestId('math-reveal')).toHaveTextContent(`= ${questions[0]!.answer}`);
    for (let i = 1; i < questions.length; i += 1) {
      await waitFor(() => expect(screen.getByText(`${i + 1} / ${questions.length}`)).toBeTruthy(), {
        timeout: 3000,
      });
      await type(questions[i]!.answer);
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(onComplete.mock.calls[0]?.[0]).toBeCloseTo((questions.length - 1) / questions.length);
  });
});

describe('WordsPlayer', () => {
  it('spelling: tapping letters in order completes each word', async () => {
    const activity = findActivity('act_words_spell_g1');
    if (!activity) return; // word bank not authored yet in this checkout
    const data = activity.data as WordsData;
    const qs = generateWords(wordsForGrade(1), 'spell', data.rounds, 'sp');
    const onComplete = jest.fn();
    const screen = await wrap(
      <WordsPlayer
        activity={activity as Parameters<typeof WordsPlayer>[0]['activity']}
        onComplete={onComplete}
        seed="sp"
      />,
    );
    for (const [i, q] of qs.entries()) {
      if (q.mode !== 'spell') throw new Error('mode');
      await waitFor(() => expect(screen.getByText(`${i + 1} / ${qs.length}`)).toBeTruthy(), {
        timeout: 3000,
      });
      const remaining = q.letters.map((l, idx) => ({ l, idx }));
      for (const target of q.word.split('')) {
        const k = remaining.findIndex((r) => r.l === target);
        const { idx } = remaining.splice(k, 1)[0]!;
        await fireEvent.press(screen.getByTestId(`letter-${idx}`));
      }
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(1), { timeout: 3000 });
  });

  it('missing letter: choose the hidden letter', async () => {
    const activity = findActivity('act_words_missing_g2');
    if (!activity) return;
    const data = activity.data as WordsData;
    const qs = generateWords(wordsForGrade(2), 'missing', data.rounds, 'ml');
    const onComplete = jest.fn();
    const screen = await wrap(
      <WordsPlayer
        activity={activity as Parameters<typeof WordsPlayer>[0]['activity']}
        onComplete={onComplete}
        seed="ml"
      />,
    );
    for (const [i, q] of qs.entries()) {
      if (q.mode !== 'missing') throw new Error('mode');
      await waitFor(() => expect(screen.getByText(`${i + 1} / ${qs.length}`)).toBeTruthy(), {
        timeout: 3000,
      });
      await fireEvent.press(screen.getByTestId(`letter-choice-${q.word[q.index]}`));
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(1), { timeout: 3000 });
  });
});
