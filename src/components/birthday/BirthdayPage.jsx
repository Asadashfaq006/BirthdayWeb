'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import THEMES from './themeConfig';
import FloatingEffects from './FloatingEffects';
import MusicPlayer from './MusicPlayer';
import UnlockScreen from './UnlockScreen';
import BirthdayIntro from './BirthdayIntro';
import QuizSection from './QuizSection';
import FinalSurprise from './FinalSurprise';

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.45, ease: 'easeInOut' },
};

export default function BirthdayPage({ project, questions, memories }) {
  const theme = THEMES[project.theme] || THEMES.cute;

  const hasUnlock = !!(project.unlock_question?.trim() && project.unlock_answer?.trim());
  const hasQuestions = Array.isArray(questions) && questions.length > 0;

  const [stage, setStage] = useState(hasUnlock ? 'unlock' : 'intro');
  const [musicShouldPlay, setMusicShouldPlay] = useState(false);

  const handleUnlocked = () => setStage('intro');

  const handleStart = () => {
    if (project.music_url) setMusicShouldPlay(true);
    setStage(hasQuestions ? 'quiz' : 'final');
  };

  const handleQuizComplete = () => setStage('final');

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${theme.pageBg}`}>
      {/* Floating background */}
      <FloatingEffects emojis={theme.floatingEmojis} dark={theme.dark} />

      {/* Music player (floating button) */}
      {project.music_url && (
        <MusicPlayer
          url={project.music_url}
          shouldPlay={musicShouldPlay}
          theme={theme}
        />
      )}

      {/* Stage transitions */}
      <AnimatePresence mode="wait">
        {stage === 'unlock' && (
          <motion.div key="unlock" {...PAGE_TRANSITION}>
            <UnlockScreen
              project={project}
              theme={theme}
              onUnlocked={handleUnlocked}
            />
          </motion.div>
        )}

        {stage === 'intro' && (
          <motion.div key="intro" {...PAGE_TRANSITION}>
            <BirthdayIntro
              project={project}
              theme={theme}
              onStart={handleStart}
            />
          </motion.div>
        )}

        {stage === 'quiz' && (
          <motion.div key="quiz" {...PAGE_TRANSITION}>
            <QuizSection
              questions={questions}
              theme={theme}
              onComplete={handleQuizComplete}
            />
          </motion.div>
        )}

        {stage === 'final' && (
          <motion.div key="final" {...PAGE_TRANSITION}>
            <FinalSurprise
              project={project}
              memories={memories}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
