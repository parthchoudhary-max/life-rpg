import React, { useState } from 'react';
import { KeyRound, ShieldAlert } from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';

export const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const { login } = useAuth();
  const { playClick, playQuestComplete } = useAudio();
  const { addToast } = useToast();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier || !password) {
      setErrorMsg('Please enter username/email and passphrase');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await login(loginIdentifier, password);
      if (res.success) {
        playQuestComplete();
        addToast(`Welcome back, ${res.user.character.name}!`, 'success');
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg('Dungeon gate locked. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Quest (Login)"
      maxWidth="max-w-md"
      icon={KeyRound}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {errorMsg && (
          <div className="p-2.5 bg-rose-950/80 border border-rose-500 text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-pixel text-[10px]">{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block font-pixel text-[10px] text-amber-300 mb-1.5 uppercase">
            Adventurer Username or Email *
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="e.g., ShadowKnight or hero@realm.com"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-pixel text-[10px] text-amber-300 mb-1.5 uppercase">
            Secret Passphrase *
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <RetroButton
          variant="gold"
          size="md"
          type="submit"
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? 'Unlocking Gate...' : 'Enter the Dungeon'}
        </RetroButton>

        <div className="pt-3 border-t border-dungeon-800 text-center text-slate-400">
          New to the realm?{' '}
          <button
            type="button"
            onClick={() => {
              playClick();
              onSwitchToRegister();
            }}
            className="text-amber-400 hover:underline font-pixel text-[10px] ml-1"
          >
            Create Hero
          </button>
        </div>
      </form>
    </RetroModal>
  );
};

export default LoginModal;
