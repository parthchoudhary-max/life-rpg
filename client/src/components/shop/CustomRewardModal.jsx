import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { createCustomReward } from '../../services/shopService';
import { useToast } from '../../context/ToastContext';

export const CustomRewardModal = ({ isOpen, onClose, onRewardCreated }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [costGold, setCostGold] = useState(30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Reward title is required!', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await createCustomReward({
        name,
        description,
        costGold: Number(costGold),
        icon: 'Gift',
      });
      if (res.success) {
        addToast('Custom reward added to the merchant ledger!', 'success');
        onRewardCreated(res.reward);
        onClose();
        setName('');
        setDescription('');
        setCostGold(30);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create reward', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Craft Custom Real-World Reward"
      maxWidth="max-w-md"
      icon={Gift}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <p className="text-slate-400 leading-relaxed font-sans text-xs">
          Reward yourself in real life by spending your earned Gold! For instance, watch an episode of anime, eat a sweet treat, or enjoy guilt-free gaming.
        </p>

        <div>
          <label className="block font-pixel text-[10px] text-amber-300 mb-1 uppercase">
            Reward Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., 1 Hour of Video Games, Pizza Night, Coffee Break"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1 uppercase">
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., 1 hour on Steam after completing all daily rituals"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1 uppercase">
            Gold Price *
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            required
            value={costGold}
            onChange={(e) => setCostGold(e.target.value)}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-amber-400 font-pixel text-xs focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-dungeon-800 flex justify-end gap-2">
          <RetroButton variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </RetroButton>
          <RetroButton variant="gold" size="sm" type="submit" disabled={loading}>
            {loading ? 'Forging...' : 'Add Reward'}
          </RetroButton>
        </div>
      </form>
    </RetroModal>
  );
};

export default CustomRewardModal;
