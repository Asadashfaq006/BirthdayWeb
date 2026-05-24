'use client';

// Lightweight unique ID generator (client-side only)
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const createOption = () => ({
  id: uid(),
  text: '',
  isCorrect: false,
  isMoving: false,
});

export const createQuestion = () => ({
  id: uid(),
  questionText: '',
  options: [createOption(), createOption()],
});

export default function QuestionBuilder({ questions, setQuestions }) {
  // ── Question-level helpers ────────────────────────────────────────────────
  const addQuestion = () =>
    setQuestions((prev) => [...prev, createQuestion()]);

  const removeQuestion = (qId) =>
    setQuestions((prev) => prev.filter((q) => q.id !== qId));

  const updateQuestionText = (qId, text) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, questionText: text } : q))
    );

  // ── Option-level helpers ─────────────────────────────────────────────────
  const addOption = (qId) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: [...q.options, createOption()] }
          : q
      )
    );

  const removeOption = (qId, optId) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((o) => o.id !== optId) }
          : q
      )
    );

  const updateOptionText = (qId, optId, text) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optId ? { ...o, text } : o
              ),
            }
          : q
      )
    );

  // Only one option can be correct at a time
  const setCorrectOption = (qId, optId) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                isCorrect: o.id === optId,
                // Correct option can't also be moving
                isMoving: o.id === optId ? false : o.isMoving,
              })),
            }
          : q
      )
    );

  const toggleMovingOption = (qId, optId) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optId && !o.isCorrect
                  ? { ...o, isMoving: !o.isMoving }
                  : o
              ),
            }
          : q
      )
    );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {questions.length === 0 && (
        <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-2xl py-8 text-center">
          <div className="text-3xl mb-2">🧩</div>
          <p className="text-purple-500 text-sm font-medium">No questions yet</p>
          <p className="text-purple-400 text-xs mt-1">
            Click &quot;Add Question&quot; below to get started
          </p>
        </div>
      )}

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden"
        >
          {/* Question header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">
              Question {qIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              className="text-white/70 hover:text-white text-xs font-medium transition-colors hover:bg-white/20 px-2 py-1 rounded-lg"
            >
              ✕ Remove
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Question text */}
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
              placeholder="e.g. What is my favorite movie?"
              className="input"
            />

            {/* Options list */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Answer Options
              </p>

              {q.options.map((opt, optIndex) => {
                const borderColor = opt.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : opt.isMoving
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 bg-gray-50';

                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-colors ${borderColor}`}
                  >
                    {/* Option index */}
                    <span className="text-xs text-gray-400 font-bold w-5 text-center shrink-0">
                      {String.fromCharCode(65 + optIndex)}
                    </span>

                    {/* Option text input */}
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        updateOptionText(q.id, opt.id, e.target.value)
                      }
                      placeholder={`Option ${optIndex + 1}...`}
                      className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 min-w-0"
                    />

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Mark correct */}
                      <button
                        type="button"
                        onClick={() => setCorrectOption(q.id, opt.id)}
                        title="Mark as correct answer"
                        className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${
                          opt.isCorrect
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-500'
                        }`}
                      >
                        ✓
                      </button>

                      {/* Mark moving (wrong answer that moves away) */}
                      <button
                        type="button"
                        onClick={() => toggleMovingOption(q.id, opt.id)}
                        title={
                          opt.isCorrect
                            ? 'Correct option cannot be moving'
                            : 'Toggle moving button (runs away on click)'
                        }
                        disabled={opt.isCorrect}
                        className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${
                          opt.isMoving
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-400 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed'
                        }`}
                      >
                        🏃
                      </button>

                      {/* Remove option (only if more than 2) */}
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(q.id, opt.id)}
                          title="Remove option"
                          className="w-7 h-7 rounded-lg text-xs bg-white border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 flex items-center justify-center transition-all"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add option */}
            <button
              type="button"
              onClick={() => addOption(q.id)}
              className="text-purple-500 hover:text-purple-700 text-xs font-medium flex items-center gap-1.5 transition-colors group"
            >
              <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                +
              </span>
              Add Option
            </button>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3 h-3 rounded bg-green-500 inline-block" />
                Correct answer
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-3 h-3 rounded bg-orange-500 inline-block" />
                Moving (runs away on click)
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Add question button */}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-purple-300 text-purple-500 hover:border-purple-500 hover:bg-purple-50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-xl leading-none">+</span>
        Add Question
      </button>
    </div>
  );
}
