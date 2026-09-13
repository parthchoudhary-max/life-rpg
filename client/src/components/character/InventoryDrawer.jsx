import React, { useState } from 'react';
import {
  Package,
  Sword,
  Shield,
  FlaskConical,
  Palette,
  Award,
  Sparkles,
  Check,
} from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import { consumePotion } from '../../services/characterService';
import { equipItem } from '../../services/shopService';

const ITEM_ICONS = {
  WEAPON: Sword,
  ARMOR: Shield,
  POTION: FlaskConical,
  THEME: Palette,
  BADGE: Award,
  DEFAULT: Package,
};

export const InventoryDrawer = ({
  isOpen,
  onClose,
  character,
  onCharacterUpdated,
}) => {
  const { playPotion, playEquip, playClick } = useAudio();
  const { addToast, addFloatingText } = useToast();
  const [filter, setFilter] = useState('ALL');
  const [isActing, setIsActing] = useState(false);

  if (!character) return null;

  const inventory = character.inventory || [];

  const filteredItems = inventory.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'EQUIPMENT') return item.type === 'EQUIPMENT';
    if (filter === 'POTIONS') return item.type === 'POTION';
    if (filter === 'THEMES') return item.type === 'THEME';
    if (filter === 'BADGES') return item.type === 'BADGE';
    return true;
  });

  // Drink potion
  const handleDrinkPotion = async (item) => {
    if (isActing) return;
    if (character.hp.current >= character.hp.max) {
      addToast('Your Health is already at max!', 'info');
      return;
    }

    try {
      setIsActing(true);
      playPotion();
      const res = await consumePotion(item.itemId);
      if (res.success) {
        addFloatingText(`+${item.healAmount || 25} HP`, { color: '#22c55e' });
        addToast(res.message, 'success');
        onCharacterUpdated(res.character);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not drink potion', 'error');
    } finally {
      setIsActing(false);
    }
  };

  // Equip / Unequip gear, theme, or badge
  const handleEquip = async (item) => {
    if (isActing) return;

    try {
      setIsActing(true);
      playEquip();
      const res = await equipItem(item.itemId);
      if (res.success) {
        addToast(res.message, 'success');
        onCharacterUpdated(res.character);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to equip item', 'error');
    } finally {
      setIsActing(false);
    }
  };

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adventurer Satchel & Inventory"
      maxWidth="max-w-2xl"
      icon={Package}
    >
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'EQUIPMENT', 'POTIONS', 'THEMES', 'BADGES'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setFilter(cat);
              }}
              className={`
                px-2.5 py-1 font-pixel text-[10px] border-2 uppercase transition-all
                ${
                  filter === cat
                    ? 'bg-purple-900 border-purple-400 text-purple-100 shadow-pixel-sm'
                    : 'bg-dungeon-950 border-dungeon-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Inventory Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-dungeon-800 p-6">
            <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-pixel text-xs text-slate-400 uppercase">Satchel Empty in this Category</p>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Visit the Merchant Shop to purchase weapons, potions, or retro dungeon themes!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredItems.map((item, idx) => {
              const Icon = ITEM_ICONS[item.slot] || ITEM_ICONS[item.type] || ITEM_ICONS.DEFAULT;
              const isEquipped = item.equipped;

              return (
                <div
                  key={`${item.itemId}_${idx}`}
                  className={`
                    p-3 bg-dungeon-950 border-2 flex flex-col justify-between gap-2 transition-all
                    ${
                      isEquipped
                        ? 'border-amber-400 shadow-pixel-gold bg-amber-950/20'
                        : 'border-dungeon-800 hover:border-dungeon-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-dungeon-900 border border-dungeon-800 text-amber-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-pixel text-[11px] text-slate-100 truncate">
                          {item.name}
                        </h4>
                        {item.quantity > 1 && (
                          <span className="font-pixel text-[9px] text-purple-300 bg-purple-950 border border-purple-600 px-1">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Stat Bonuses / Heal details */}
                      {item.healAmount > 0 && (
                        <div className="text-[10px] font-pixel text-emerald-400 mt-1">
                          Heals +{item.healAmount} HP
                        </div>
                      )}

                      {item.statBonus && Object.entries(item.statBonus).some(([_, val]) => val > 0) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[9px] font-pixel text-sky-300">
                          {Object.entries(item.statBonus).map(
                            ([stat, val]) =>
                              val > 0 && (
                                <span key={stat} className="bg-sky-950/80 border border-sky-600 px-1">
                                  +{val} {stat.toUpperCase()}
                                </span>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-dungeon-800 flex justify-end">
                    {item.type === 'POTION' ? (
                      <RetroButton
                        variant="success"
                        size="xs"
                        onClick={() => handleDrinkPotion(item)}
                        disabled={isActing}
                      >
                        Drink Potion
                      </RetroButton>
                    ) : item.type === 'THEME' ? (
                      <RetroButton
                        variant={isEquipped ? 'secondary' : 'gold'}
                        size="xs"
                        onClick={() => handleEquip(item)}
                        disabled={isActing || isEquipped}
                      >
                        {isEquipped ? 'Active Theme' : 'Apply Theme'}
                      </RetroButton>
                    ) : (
                      <RetroButton
                        variant={isEquipped ? 'secondary' : 'primary'}
                        size="xs"
                        onClick={() => handleEquip(item)}
                        disabled={isActing}
                      >
                        {isEquipped ? 'Unequip' : 'Equip Gear'}
                      </RetroButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RetroModal>
  );
};

export default InventoryDrawer;
