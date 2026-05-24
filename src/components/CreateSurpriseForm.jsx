'use client';

import { useState, useCallback } from 'react';
import QuestionBuilder from './QuestionBuilder';
import MemoryBuilder from './MemoryBuilder';
import PreviewCard from './PreviewCard';
import GeneratedLinkBox from './GeneratedLinkBox';

// ── Theme definitions ─────────────────────────────────────────────────────────
const THEMES = [
  {
    id: 'cute',
    label: 'Cute',
    emoji: '🌸',
    gradient: 'from-pink-400 to-rose-300',
    description: 'Sweet & adorable',
    ring: 'ring-pink-500',
  },
  {
    id: 'romantic',
    label: 'Romantic',
    emoji: '❤️',
    gradient: 'from-red-500 to-pink-400',
    description: 'Love & passion',
    ring: 'ring-red-500',
  },
  {
    id: 'neon',
    label: 'Neon',
    emoji: '⚡',
    gradient: 'from-cyan-500 to-purple-500',
    description: 'Electric & vibrant',
    ring: 'ring-cyan-500',
  },
  {
    id: 'galaxy',
    label: 'Galaxy',
    emoji: '🌌',
    gradient: 'from-indigo-900 to-purple-900',
    description: 'Cosmic & dreamy',
    ring: 'ring-indigo-500',
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    emoji: '🎨',
    gradient: 'from-yellow-400 to-orange-400',
    description: 'Fun & playful',
    ring: 'ring-yellow-500',
  },
];

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, subtitle, children, headerGradient, badge }) {
  return (
    <div className="card animate-slide-up">
      <div className={`card-header bg-gradient-to-r ${headerGradient}`}>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
        {badge != null && (
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6 space-y-4">{children}</div>
    </div>
  );
}

// ── Inline error message ──────────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="error-msg">
      <span>⚠</span> {message}
    </p>
  );
}

// ── Initial state ─────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  birthdayPersonName: '',
  birthdayDate: '',
  welcomeMessage: '',
  finalMessage: '',
  musicUrl: '',
  theme: 'cute',
  unlockQuestion: '',
  unlockAnswer: '',
};

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateSurpriseForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [questions, setQuestions] = useState([]);
  const [memories, setMemories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState(null);

  // ── Field change handler ────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setTheme = (themeId) =>
    setFormData((prev) => ({ ...prev, theme: themeId }));

  // ── Client-side validation ──────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs = {};

    if (!formData.birthdayPersonName.trim()) {
      errs.birthdayPersonName = "Birthday person's name is required.";
    }

    if (!formData.birthdayDate) {
      errs.birthdayDate = 'Birthday date is required.';
    }

    if (questions.length === 0) {
      errs.questions = 'Add at least one question.';
    } else {
      questions.forEach((q, i) => {
        if (!q.questionText.trim()) {
          errs[`q_${i}_text`] = `Question ${i + 1}: question text is required.`;
        }
        const nonEmptyOptions = q.options.filter((o) => o.text.trim());
        if (nonEmptyOptions.length < 2) {
          errs[`q_${i}_options`] = `Question ${i + 1}: must have at least 2 filled options.`;
        }
        if (!q.options.some((o) => o.isCorrect)) {
          errs[`q_${i}_correct`] = `Question ${i + 1}: mark one option as correct.`;
        }
      });
    }

    if (memories.some((m) => m.isUploadingImage)) {
      errs.memoriesUpload = 'Please wait for all memory images to finish uploading.';
    }

    if (memories.some((m) => m.imageUploadError)) {
      errs.memoriesUpload = 'Fix failed memory image uploads or remove those images.';
    }

    return errs;
  }, [formData, questions, memories]);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      setTimeout(() => {
        const first = document.querySelector('[data-error]');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    const payloadMemories = memories.map((mem) => ({
      id: mem.id,
      title: mem.title,
      date: mem.date,
      caption: mem.caption,
      imageUrl: mem.imageUrl,
    }));

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/create-birthday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, questions, memories: payloadMemories }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setGeneratedSlug(data.slug);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Question-level error summary (collected) ────────────────────────────
  const questionValidationErrors = Object.entries(errors)
    .filter(([k]) => k.startsWith('q_') || k === 'questions')
    .map(([, v]) => v);

  const memoryValidationErrors = Object.entries(errors)
    .filter(([k]) => k === 'memoriesUpload')
    .map(([, v]) => v);

  const hasPendingImageUploads = memories.some((m) => m.isUploadingImage);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Success overlay */}
      {generatedSlug && (
        <GeneratedLinkBox
          slug={generatedSlug}
          onClose={() => {
            setGeneratedSlug(null);
            setFormData(INITIAL_FORM);
            setQuestions([]);
            setMemories([]);
            setErrors({});
          }}
        />
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-7xl mx-auto px-4 pt-8 pb-16"
      >
        {/* Page heading */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            🎂 Create a Birthday Surprise
          </h1>
          <p className="text-gray-500 mt-2">
            Fill out everything below. When you&apos;re done, you&apos;ll get a unique shareable link.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT COLUMN: Form ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Global submit error */}
            {submitError && (
              <div
                role="alert"
                data-error
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              >
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{submitError}</span>
              </div>
            )}

            {/* ── Section 1: Basic Info ──────────────────────────────────── */}
            <Section
              title="🎉 Basic Information"
              subtitle="Tell us about the birthday person"
              headerGradient="from-blue-500 to-cyan-500"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="birthdayPersonName">
                    Birthday Person&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="birthdayPersonName"
                    type="text"
                    name="birthdayPersonName"
                    value={formData.birthdayPersonName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah"
                    autoComplete="off"
                    data-error={errors.birthdayPersonName ? true : undefined}
                    className={`input ${errors.birthdayPersonName ? 'input-error' : ''}`}
                  />
                  <FieldError message={errors.birthdayPersonName} />
                </div>

                <div>
                  <label className="label" htmlFor="birthdayDate">
                    Birthday Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="birthdayDate"
                    type="date"
                    name="birthdayDate"
                    value={formData.birthdayDate}
                    onChange={handleChange}
                    data-error={errors.birthdayDate ? true : undefined}
                    className={`input ${errors.birthdayDate ? 'input-error' : ''}`}
                  />
                  <FieldError message={errors.birthdayDate} />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="welcomeMessage">
                  Custom Welcome Message
                </label>
                <textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  placeholder="Write a heartfelt message the birthday person will see when they open the surprise..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div>
                <label className="label" htmlFor="finalMessage">
                  Final Birthday Message
                </label>
                <textarea
                  id="finalMessage"
                  name="finalMessage"
                  value={formData.finalMessage}
                  onChange={handleChange}
                  placeholder="The message shown at the very end of the experience, after all quizzes and memories..."
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <div>
                <label className="label" htmlFor="musicUrl">
                  Background Music URL
                </label>
                <input
                  id="musicUrl"
                  type="url"
                  name="musicUrl"
                  value={formData.musicUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/birthday-song.mp3"
                  className="input"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Supports direct MP3 links. YouTube/SoundCloud links may need extra setup in Module 2.
                </p>
              </div>
            </Section>

            {/* ── Section 2: Theme ──────────────────────────────────────── */}
            <Section
              title="🎨 Choose a Theme"
              subtitle="Pick the look and feel for the birthday experience"
              headerGradient="from-purple-500 to-pink-500"
              badge={THEMES.find((t) => t.id === formData.theme)?.emoji + ' ' + formData.theme}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {THEMES.map((theme) => {
                  const isSelected = formData.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setTheme(theme.id)}
                      aria-pressed={isSelected}
                      className={`relative rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.ring} ${
                        isSelected
                          ? 'scale-105 shadow-lg ring-2 ring-offset-2'
                          : 'opacity-70 hover:opacity-100 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-br ${theme.gradient} px-3 py-4 text-center`}
                      >
                        <div className="text-3xl mb-1">{theme.emoji}</div>
                        <div className="text-white text-xs font-bold">{theme.label}</div>
                      </div>
                      <div className="bg-white py-2 px-1 text-center">
                        <p className="text-xs text-gray-500 leading-tight">{theme.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-purple-600 text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* ── Section 3: Unlock / Password ─────────────────────────── */}
            <Section
              title="🔒 Unlock Question"
              subtitle="Optional: protect the surprise with a secret question"
              headerGradient="from-amber-500 to-orange-500"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="unlockQuestion">
                    Unlock Question
                  </label>
                  <input
                    id="unlockQuestion"
                    type="text"
                    name="unlockQuestion"
                    value={formData.unlockQuestion}
                    onChange={handleChange}
                    placeholder="e.g. What's my favorite food?"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="unlockAnswer">
                    Answer
                  </label>
                  <input
                    id="unlockAnswer"
                    type="text"
                    name="unlockAnswer"
                    value={formData.unlockAnswer}
                    onChange={handleChange}
                    placeholder="e.g. Pizza"
                    className="input"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex gap-2">
                <span className="shrink-0 text-base">💡</span>
                <span>
                  The birthday person must answer this correctly to unlock the surprise.{' '}
                  <strong>Leave both fields blank</strong> if you don&apos;t want a password.
                </span>
              </div>
            </Section>

            {/* ── Section 4: Questions ─────────────────────────────────── */}
            <Section
              title="❓ Quiz Questions"
              subtitle="Create fun questions about your shared memories"
              headerGradient="from-indigo-500 to-purple-500"
              badge={questions.length > 0 ? `${questions.length} question${questions.length === 1 ? '' : 's'}` : null}
            >
              {/* Question-level validation errors */}
              {questionValidationErrors.length > 0 && (
                <div
                  data-error
                  className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1"
                >
                  {questionValidationErrors.map((msg, i) => (
                    <p key={i} className="text-red-600 text-xs flex items-center gap-1">
                      <span>⚠</span> {msg}
                    </p>
                  ))}
                </div>
              )}

              <QuestionBuilder questions={questions} setQuestions={setQuestions} />
            </Section>

            {/* ── Section 5: Memories ──────────────────────────────────── */}
            <Section
              title="📸 Memory Gallery"
              subtitle="Upload photos and captions from your favourite moments together"
              headerGradient="from-rose-500 to-pink-500"
              badge={memories.length > 0 ? `${memories.length} memor${memories.length === 1 ? 'y' : 'ies'}` : null}
            >
              {memoryValidationErrors.length > 0 && (
                <div
                  data-error
                  className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1"
                >
                  {memoryValidationErrors.map((msg, i) => (
                    <p key={i} className="text-red-600 text-xs flex items-center gap-1">
                      <span>⚠</span> {msg}
                    </p>
                  ))}
                </div>
              )}

              <MemoryBuilder memories={memories} setMemories={setMemories} />
            </Section>

            {/* ── Submit ───────────────────────────────────────────────── */}
            <div className="pt-2">
              {/* Quick summary before submit */}
              <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                {[
                  {
                    label: 'Name',
                    value: formData.birthdayPersonName || '—',
                    ok: !!formData.birthdayPersonName,
                  },
                  {
                    label: 'Questions',
                    value: questions.length,
                    ok: questions.length > 0,
                  },
                  {
                    label: 'Memories',
                    value: memories.length,
                    ok: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl p-2.5 border text-xs ${
                      item.ok
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="font-bold truncate">{item.value}</div>
                    <div className="opacity-70">{item.label}</div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || hasPendingImageUploads}
                className={`w-full py-4 rounded-2xl font-extrabold text-lg text-white transition-all duration-200 shadow-lg relative overflow-hidden ${
                  isSubmitting || hasPendingImageUploads
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving your surprise…
                  </span>
                ) : hasPendingImageUploads ? (
                  '📤 Uploading memory images...'
                ) : (
                  '✨ Create Birthday Surprise'
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Your surprise will be saved and a shareable link will be generated instantly.
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Preview ──────────────────────────────────── */}
          <aside className="lg:w-72 xl:w-80 shrink-0">
            <PreviewCard
              formData={formData}
              questions={questions}
              memories={memories}
            />
          </aside>
        </div>
      </form>
    </>
  );
}
