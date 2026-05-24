/**
 * Central theme configuration — single source of truth.
 * Imported by lib/birthdayService, birthday components, and dashboard/share components.
 */
const THEMES = {
  cute: {
    pageBg: 'bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100',
    card: 'bg-white/95 shadow-xl border border-pink-100 rounded-3xl',
    cardHeaderGrad: 'from-pink-400 to-rose-400',
    btnPrimary:
      'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:from-pink-600 hover:to-rose-500 active:scale-95 rounded-2xl font-bold transition-all duration-200',
    btnOption:
      'bg-white border-2 border-pink-200 text-pink-800 hover:border-pink-400 hover:bg-pink-50 rounded-2xl font-medium',
    btnSuccess:
      'bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl font-bold pointer-events-none',
    btnWrong:
      'bg-gradient-to-r from-red-300 to-rose-300 text-white rounded-2xl font-bold pointer-events-none opacity-70',
    heading: 'text-pink-700 font-extrabold',
    text: 'text-gray-700',
    subtext: 'text-pink-500',
    progressBg: 'bg-pink-100 rounded-full',
    progressFill: 'bg-gradient-to-r from-pink-400 to-rose-400 rounded-full',
    unlockBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    inputCls:
      'border-2 border-pink-200 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-800 placeholder-gray-400',
    badgeBg: 'bg-pink-100 text-pink-700 border border-pink-200',
    feedbackSuccessBg: 'bg-green-50 border border-green-200 text-green-700',
    feedbackWrongBg: 'bg-red-50 border border-red-200 text-red-600',
    memCardBg: 'bg-white border border-pink-100 shadow-md',
    memCardAccent: 'from-pink-400 to-rose-400',
    floatingEmojis: ['🌸', '💕', '🎀', '✨', '🦋', '🌺', '💗', '🎊', '🌷', '🎈'],
    confettiColors: ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#DB7093', '#fff'],
    musicBtnBg: 'bg-pink-500/80 hover:bg-pink-600 text-white backdrop-blur-sm',
    dark: false,
    lockEmoji: '🔒',
    cakeEmoji: '🎂',
    label: 'Cute 🌸',
  },
  romantic: {
    pageBg: 'bg-gradient-to-br from-red-100 via-pink-50 to-rose-100',
    card: 'bg-white/95 shadow-xl border border-red-100 rounded-3xl',
    cardHeaderGrad: 'from-red-500 to-rose-400',
    btnPrimary:
      'bg-gradient-to-r from-red-500 to-rose-400 text-white shadow-lg hover:from-red-600 hover:to-rose-500 active:scale-95 rounded-2xl font-bold transition-all duration-200',
    btnOption:
      'bg-white border-2 border-red-200 text-red-800 hover:border-red-400 hover:bg-red-50 rounded-2xl font-medium',
    btnSuccess:
      'bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-2xl font-bold pointer-events-none',
    btnWrong:
      'bg-gradient-to-r from-red-300 to-rose-300 text-white rounded-2xl font-bold pointer-events-none opacity-70',
    heading: 'text-red-700 font-extrabold',
    text: 'text-gray-700',
    subtext: 'text-red-500',
    progressBg: 'bg-red-100 rounded-full',
    progressFill: 'bg-gradient-to-r from-red-400 to-rose-400 rounded-full',
    unlockBg: 'bg-gradient-to-br from-red-50 to-rose-50',
    inputCls:
      'border-2 border-red-200 focus:ring-red-400 focus:border-red-400 bg-white text-gray-800 placeholder-gray-400',
    badgeBg: 'bg-red-100 text-red-700 border border-red-200',
    feedbackSuccessBg: 'bg-green-50 border border-green-200 text-green-700',
    feedbackWrongBg: 'bg-red-50 border border-red-200 text-red-600',
    memCardBg: 'bg-white border border-red-100 shadow-md',
    memCardAccent: 'from-red-400 to-rose-400',
    floatingEmojis: ['❤️', '💖', '🌹', '💌', '💝', '🥀', '💞', '🫶', '💋', '🌹'],
    confettiColors: ['#FF0000', '#FF69B4', '#DC143C', '#FF1493', '#C71585', '#fff'],
    musicBtnBg: 'bg-red-500/80 hover:bg-red-600 text-white backdrop-blur-sm',
    dark: false,
    lockEmoji: '💌',
    cakeEmoji: '🎂',
    label: 'Romantic ❤️',
  },
  neon: {
    pageBg: 'bg-gray-950',
    card: 'bg-gray-900/95 shadow-2xl border border-cyan-500/20 rounded-3xl',
    cardHeaderGrad: 'from-cyan-500 to-purple-500',
    btnPrimary:
      'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:from-cyan-400 hover:to-purple-400 active:scale-95 rounded-2xl font-bold transition-all duration-200',
    btnOption:
      'bg-gray-800/90 border-2 border-cyan-500/30 text-cyan-200 hover:border-cyan-400 hover:bg-gray-700/90 rounded-2xl font-medium',
    btnSuccess:
      'bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-2xl font-bold pointer-events-none',
    btnWrong:
      'bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-2xl font-bold pointer-events-none opacity-70',
    heading: 'text-cyan-300 font-extrabold',
    text: 'text-gray-200',
    subtext: 'text-cyan-400',
    progressBg: 'bg-gray-800 rounded-full',
    progressFill: 'bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full',
    unlockBg: 'bg-gray-900',
    inputCls:
      'border-2 border-cyan-500/30 focus:ring-cyan-400 focus:border-cyan-400 bg-gray-800/80 text-gray-100 placeholder-gray-500',
    badgeBg: 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30',
    feedbackSuccessBg: 'bg-green-900/50 border border-green-500/50 text-green-300',
    feedbackWrongBg: 'bg-red-900/50 border border-red-500/50 text-red-300',
    memCardBg: 'bg-gray-800/80 border border-cyan-500/20',
    memCardAccent: 'from-cyan-500 to-purple-500',
    floatingEmojis: ['⚡', '💫', '🔮', '✨', '💜', '🌀', '⭐', '🌟', '💠', '🔆'],
    confettiColors: ['#00FFFF', '#8B00FF', '#FF00FF', '#7DF9FF', '#9400D3', '#fff'],
    musicBtnBg: 'bg-cyan-600/80 hover:bg-cyan-700 text-white backdrop-blur-sm',
    dark: true,
    lockEmoji: '⚡',
    cakeEmoji: '🎂',
    label: 'Neon ⚡',
  },
  galaxy: {
    pageBg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    card: 'bg-indigo-900/60 shadow-2xl border border-indigo-400/20 rounded-3xl backdrop-blur-sm',
    cardHeaderGrad: 'from-indigo-500 to-purple-600',
    btnPrimary:
      'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:from-indigo-400 hover:to-purple-400 active:scale-95 rounded-2xl font-bold transition-all duration-200',
    btnOption:
      'bg-indigo-900/70 border-2 border-indigo-400/30 text-indigo-200 hover:border-indigo-300 hover:bg-indigo-800/80 rounded-2xl font-medium',
    btnSuccess:
      'bg-gradient-to-r from-teal-500 to-green-400 text-white rounded-2xl font-bold pointer-events-none',
    btnWrong:
      'bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl font-bold pointer-events-none opacity-70',
    heading: 'text-indigo-200 font-extrabold',
    text: 'text-indigo-100',
    subtext: 'text-indigo-300',
    progressBg: 'bg-indigo-900/50 rounded-full',
    progressFill: 'bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full',
    unlockBg: 'bg-indigo-950',
    inputCls:
      'border-2 border-indigo-400/30 focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-900/50 text-indigo-100 placeholder-indigo-500',
    badgeBg: 'bg-indigo-800/50 text-indigo-200 border border-indigo-400/30',
    feedbackSuccessBg: 'bg-teal-900/50 border border-teal-500/50 text-teal-300',
    feedbackWrongBg: 'bg-red-900/50 border border-red-500/50 text-red-300',
    memCardBg: 'bg-indigo-900/60 border border-indigo-400/20',
    memCardAccent: 'from-indigo-500 to-purple-500',
    floatingEmojis: ['🌌', '⭐', '🌙', '💫', '🪐', '✨', '☄️', '🔭', '🌠', '💎'],
    confettiColors: ['#818CF8', '#A78BFA', '#C4B5FD', '#6366F1', '#7C3AED', '#fff'],
    musicBtnBg: 'bg-indigo-600/80 hover:bg-indigo-700 text-white backdrop-blur-sm',
    dark: true,
    lockEmoji: '🌌',
    cakeEmoji: '🎂',
    label: 'Galaxy 🌌',
  },
  cartoon: {
    pageBg: 'bg-gradient-to-br from-yellow-100 via-orange-50 to-green-100',
    card: 'bg-white shadow-xl border-4 border-gray-800 rounded-3xl',
    cardHeaderGrad: 'from-yellow-400 to-orange-400',
    btnPrimary:
      'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black shadow-lg hover:from-yellow-500 hover:to-orange-500 border-2 border-gray-800 active:scale-95 rounded-2xl transition-all duration-200',
    btnOption:
      'bg-white border-[3px] border-gray-800 text-gray-900 hover:bg-yellow-50 rounded-2xl font-semibold shadow-[3px_3px_0px_rgba(0,0,0,0.2)]',
    btnSuccess:
      'bg-gradient-to-r from-green-400 to-lime-400 text-gray-900 border-2 border-gray-800 rounded-2xl font-black pointer-events-none',
    btnWrong:
      'bg-gradient-to-r from-red-400 to-orange-400 text-white border-2 border-gray-800 rounded-2xl font-bold pointer-events-none opacity-70',
    heading: 'text-gray-900 font-black',
    text: 'text-gray-800',
    subtext: 'text-orange-600',
    progressBg: 'bg-gray-200 border-2 border-gray-800 rounded-full',
    progressFill: 'bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full',
    unlockBg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    inputCls:
      'border-[3px] border-gray-800 focus:ring-orange-400 focus:border-orange-400 bg-white text-gray-900 placeholder-gray-400',
    badgeBg: 'bg-yellow-100 text-gray-800 border-2 border-gray-800',
    feedbackSuccessBg: 'bg-green-100 border-2 border-green-600 text-green-800',
    feedbackWrongBg: 'bg-red-100 border-2 border-red-600 text-red-800',
    memCardBg: 'bg-white border-4 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]',
    memCardAccent: 'from-yellow-400 to-orange-400',
    floatingEmojis: ['🎈', '🎊', '🎨', '⭐', '🌈', '🎉', '🎁', '🎶', '🌟', '🎯'],
    confettiColors: ['#FFD700', '#FF6347', '#32CD32', '#FF69B4', '#1E90FF', '#fff'],
    musicBtnBg: 'bg-orange-500/80 hover:bg-orange-600 text-white border-2 border-gray-800',
    dark: false,
    lockEmoji: '🔑',
    cakeEmoji: '🎂',
    label: 'Cartoon 🎨',
  },
};

export default THEMES;
