'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

const CORRECT_MESSAGES = [
  '🎉 Correct! Amazing!',
  '✨ You got it! Brilliant!',
  '💯 That\'s right! You know me so well!',
  '🌟 Perfect answer!',
  '🎊 Yes! Exactly right!',
];

const WRONG_MESSAGES = [
  "Oops! Not quite right! Try again 😅",
  "Hmm, that's not it! Keep thinking! 🤔",
  "Nope! But I believe in you! 💪",
  "Not this time! Give it another shot! 🎯",
  "Wrong! But nice try! 🙈",
  "Lol nope 😂 Try again though!",
  "Almost... just kidding! 😆",
];

const DODGE_MESSAGES = [
  "Catch me if you can! 🏃💨",
  "Too slow! 😎 Try another one!",
  "I'm faster than you think! 🐇",
];

async function fireCorrectConfetti(colors) {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.65 },
      colors: colors || ['#FF69B4', '#FFD700', '#00CED1'],
      zIndex: 9999,
    });
  } catch {
    // canvas-confetti not available (SSR guard)
  }
}

export default function QuizSection({ questions, theme, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const current = questions[currentIndex];

  const handleOptionSelect = async (option) => {
    if (feedback) return;

    if (option.is_correct) {
      const msg =
        CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];

      // Fire confetti immediately
      await fireCorrectConfetti(theme.confettiColors);

      setFeedback({ type: 'correct', message: msg, optionId: option.id });

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= questions.length) {
          onComplete();
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 1800);
    } else {
      const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
      setFeedback({ type: 'wrong', message: msg, optionId: option.id });
      setTimeout(() => setFeedback(null), 1600);
    }
  };

  const handleDodge = () => {
    if (feedback) return;
    const msg = DODGE_MESSAGES[Math.floor(Math.random() * DODGE_MESSAGES.length)];
    setFeedback({ type: 'wrong', message: msg, optionId: null });
    setTimeout(() => setFeedback(null), 1200);
  };

  if (!current) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-8 lg:px-16 py-10 relative z-10">
      {/* Progress bar — full width */}
      <div className="w-full mb-8">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          theme={theme}
        />
      </div>

      {/* Question card — fills remaining height */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={current.id}
            question={current}
            questionNumber={currentIndex + 1}
            feedback={feedback}
            onOptionSelect={handleOptionSelect}
            onDodge={handleDodge}
            theme={theme}
          />
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p className={`text-center text-sm mt-6 ${theme.subtext} opacity-70`}>
        {feedback?.type === 'correct'
          ? 'Moving to next question…'
          : 'Select the correct answer to continue 💡'}
      </p>
    </div>
  );
}
