import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Wand,
  Zap,
  Heart,
  Feather,
  FlaskConical,
  ShieldAlert,
} from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import { CHARACTER_CLASSES } from '../../utils/leveling';
import { triggerCelebration } from '../../utils/confetti';

const CLASS_ICONS = {
  WARRIOR: Shield,
  MAGE: Wand,
  ROGUE: Zap,
  PALADIN: Heart,
  HEALER: Feather,
  ALCHEMIST: FlaskConical,
};

export const RegisterModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { register } = useAuth();
  const { playClick, playLevelUp } = useAudio();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    characterName: '',
    characterClass: 'WARRIOR',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMsg('Please complete all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Passphrase must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await register({
        ...formData,
        characterName: formData.characterName || formData.username,
      });

      if (res.success) {
        playLevelUp();
        triggerCelebration();
        addToast(`Hero ${res.user.character.name} has risen!`, 'success');
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Hero creation failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Adventurer"
      maxWidth="max-w-xl"
      icon={Sparkles}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {errorMsg && (
          <div className="p-2.5 bg-rose-950/80 border border-rose-500 text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-pixel text-[10px]">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-pixel text-[10px] text-amber-300 mb-1 uppercase">
              Username *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., PixelPaladin"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-pixel text-[10px] text-amber-300 mb-1 uppercase">
              Character Alias (Display Name)
            </label>
            <input
              type="text"
              placeholder="Defaults to username"
              value={formData.characterName}
              onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
              className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-pixel text-[10px] text-amber-300 mb-1 uppercase">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="hero@realm.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-pixel text-[10px] text-amber-300 mb-1 uppercase">
              Secret Passphrase (Min 6) *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Character Class Picker */}
        <div>
          <label className="block font-pixel text-[10px] text-amber-300 mb-1.5 uppercase">
            Choose Character Class & Discipline *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(CHARACTER_CLASSES).map(([key, cls]) => {
              const Icon = CLASS_ICONS[key] || Shield;
              const isSelected = formData.characterClass === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    playClick();
                    setFormData({ ...formData, characterClass: key });
                  }}
                  className={`
                    p-2.5 border-2 text-left transition-all flex flex-col justify-between
                    ${
                      isSelected
                        ? 'bg-purple-950 border-amber-400 shadow-pixel-gold'
                        : 'bg-dungeon-950 border-dungeon-800 hover:border-dungeon-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-purple-400'}`} />
                    <span className="font-pixel text-[10px] text-slate-100 uppercase">{cls.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans line-clamp-2 leading-tight">
                    {cls.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <RetroButton
          variant="gold"
          size="md"
          type="submit"
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? 'Forging Character...' : 'Begin Life RPG Adventure'}
        </RetroButton>

        <div className="pt-3 border-t border-dungeon-800 text-center text-slate-400">
          Already an adventurer?{' '}
          <button
            type="button"
            onClick={() => {
              playClick();
              onSwitchToLogin();
            }}
            className="text-amber-400 hover:underline font-pixel text-[10px] ml-1"
          >
            Resume Quest
          </button>
        </div>
      </form>
    </RetroModal>
  );
};

export default RegisterModal;
