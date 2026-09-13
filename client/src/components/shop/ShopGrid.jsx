import React, { useState, useEffect } from 'react';
import { Store, PlusCircle, Sparkles } from 'lucide-react';
import ShopItemCard from './ShopItemCard';
import CustomRewardModal from './CustomRewardModal';
import SkeletonLoader from '../common/SkeletonLoader';
import RetroButton from '../common/RetroButton';
import { getShopItems, purchaseItem, deleteCustomReward } from '../../services/shopService';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';

const SHOP_CATEGORIES = [
  { id: 'ALL', label: 'All Wares' },
  { id: 'POTION', label: 'Potions & Elixirs' },
  { id: 'EQUIPMENT', label: 'Gear & Armor' },
  { id: 'THEME', label: 'Dungeon Themes' },
  { id: 'BADGE', label: 'Badges' },
  { id: 'CUSTOM', label: 'Real-Life Rewards' },
];

export const ShopGrid = ({ character, onCharacterUpdated }) => {
  const { playCoin, playEquip, playPotion, playClick } = useAudio();
  const { addToast, addFloatingText } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [purchasingId, setPurchasingId] = useState(null);

  // Fetch shop items
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await getShopItems();
        if (res.success) {
          setItems(res.items);
        }
      } catch (err) {
        addToast('Failed to load merchant wares', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [addToast]);

  // Handle purchasing an item
  const handlePurchase = async (item) => {
    if (purchasingId) return;

    try {
      setPurchasingId(item._id);
      playCoin();

      const res = await purchaseItem(item._id);
      if (res.success) {
        if (item.category === 'POTION') playPotion();
        else playEquip();

        addToast(res.message, 'success');
        if (item.costGold > 0) {
          addFloatingText(`-${item.costGold} Gold`, { color: '#ef4444' });
        }
        onCharacterUpdated(res.character);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Transaction declined by merchant', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  // Delete custom reward
  const handleDeleteCustom = async (id) => {
    if (window.confirm('Remove this custom reward from the merchant list?')) {
      try {
        await deleteCustomReward(id);
        setItems((prev) => prev.filter((i) => i._id !== id));
        addToast('Reward removed', 'info');
      } catch (err) {
        addToast('Failed to delete reward', 'error');
      }
    }
  };

  // Callback when a new custom reward is created
  const handleRewardCreated = (newReward) => {
    setItems((prev) => [newReward, ...prev]);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {/* Merchant Header & Category Bar */}
      <div className="bg-dungeon-900 border-2 border-dungeon-border p-4 shadow-pixel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/60 border border-amber-500/60 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-pixel text-sm text-slate-100 uppercase">
                Ye Olde Adventurer Merchant
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Trade your hard-earned quest gold for gear, themes, elixirs, or real-life treats.
              </p>
            </div>
          </div>

          <RetroButton
            variant="cyan"
            size="sm"
            onClick={() => setIsCustomModalOpen(true)}
            className="shrink-0 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Custom Reward</span>
          </RetroButton>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-dungeon-800 pt-3">
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setSelectedCategory(cat.id);
              }}
              className={`
                px-3 py-1.5 font-pixel text-[10px] sm:text-xs uppercase border-2 transition-all whitespace-nowrap
                ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 border-amber-300 text-amber-950 font-bold shadow-pixel-sm'
                    : 'bg-dungeon-950 border-dungeon-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-dungeon-900/60 border-2 border-dashed border-dungeon-border p-8">
          <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-pixel text-xs text-slate-400 uppercase">No Wares Found</p>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Check back later or craft your own custom real-life reward!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item._id}
              item={item}
              character={character}
              onPurchase={handlePurchase}
              onDeleteCustom={handleDeleteCustom}
              isPurchasing={purchasingId === item._id}
            />
          ))}
        </div>
      )}

      {/* Custom Reward Modal */}
      <CustomRewardModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onRewardCreated={handleRewardCreated}
      />
    </div>
  );
};

export default ShopGrid;
