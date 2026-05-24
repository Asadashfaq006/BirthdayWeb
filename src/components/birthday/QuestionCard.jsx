'use client';

import { AnimatePresence, motion } from 'framer-motion';
import MovingOptionButton from './MovingOptionButton';

export default function QuestionCard({
  question,
  questionNumber,
  feedback,
  onOptionSelect,
  onDodge,
  theme,
}) {
  const isLocked = !!feedback;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="w-full h-full flex flex-col"
    >
      {/* Question label */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm font-bold uppercase tracking-widest ${theme.subtext} opacity-70`}>
          Question {questionNumber}
        </span>
        <span className="text-2xl">🧩</span>
      </div>

      {/* Question text */}
      <p className={`text-3xl sm:text-4xl font-bold leading-tight mb-10 ${theme.heading}`}>
        {question.question_text}
      </p>

      {/* Options — 2-column grid on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 relative">
        {question.options.map((opt) => {
          const isSelected = feedback?.optionId === opt.id;
          const isCorrect = opt.is_correct;

          let cls = theme.btnOption;
          if (isLocked && isSelected) {
            cls = feedback.type === 'correct' ? theme.btnSuccess : theme.btnWrong;
          } else if (isLocked && isCorrect && feedback?.type === 'correct') {
            cls = theme.btnSuccess;
          }

          if (opt.is_moving && !isCorrect) {
            return (
              <MovingOptionButton
                key={opt.id}
                option={opt}
                theme={theme}
                disabled={isLocked}
                onDodgeClick={() => onDodge && onDodge(opt)}
              />
            );
          }

          return (
            <motion.button
              key={opt.id}
              type="button"
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.97 } : {}}
              onClick={() => !isLocked && onOptionSelect(opt)}
              disabled={isLocked}
              className={`w-full py-5 px-6 text-base font-semibold ${cls} transition-all duration-200 text-left min-h-[80px] flex items-center`}
            >
              {opt.option_text}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 rounded-2xl px-6 py-4 text-base font-semibold flex items-center gap-3 ${
              feedback.type === 'correct'
                ? theme.feedbackSuccessBg
                : theme.feedbackWrongBg
            }`}
          >
            <span className="text-2xl shrink-0">
              {feedback.type === 'correct' ? '🎉' : '😅'}
            </span>
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
