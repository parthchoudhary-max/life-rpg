import React from 'react';
import {
  Coins,
  Gem,
  Sword,
  Shield,
  FlaskConical,
  Palette,
  Award,
  Sparkles,
  Gift,
  Trash2,
  Check,
} from 'lucide-react';
import RetroButton from '../common/RetroButton';

const ICON_MAP = {
  Sword,
  Shield,
  FlaskConical,
  Palette,
  Award,
  Sparkles,
  Gift,
};

export const ShopItemCard = ({
  item,
  character,
  onPurchase,
  onDeleteCustom,
  isPurchasing,
}) => {
  const Icon = ICON_MAP[item.icon] || Sparkles;

  const canAfford =
    character.gold >= item.costGold && character.gems >= item.costGems;

  // Check if character already owns unique item (equipment / theme / badge)
  const isAlreadyOwned =
    item.category !== 'POTION' &&
    item.category !== 'CUSTOM' &&
    character.inventory?.some((inv) => inv.itemId === item.itemId);

  return (
    <div className="bg-dungeon-950 border-2 border-dungeon-border p-4 shadow-pixel flex flex-col justify-between transition-colors hover:border-dungeon-borderHighlight">
      <div>
        {/* Header: Icon & Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-dungeon-900 border border-dungeon-800 text-amber-400 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-pixel text-xs text-slate-100 uppercase leading-snug">
                {item.name}
              </h4>
              <span className="text-[10px] font-pixel text-purple-400 tracking-wider">
                {item.category}
              </span>
            </div>
          </div>

          {item.isCustomReward && (
            <button
              onClick={() => onDeleteCustom(item._id)}
              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
              title="Delete Custom Reward"
              aria-label="Delete Custom Reward"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 font-sans leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Attributes / Effects */}
        {item.healAmount > 0 && (
          <div className="mb-2 text-[10px] font-pixel text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-1">
            Restores +{item.healAmount} HP
          </div>
        )}

        {item.statBonus && Object.entries(item.statBonus).some(([_, v]) => v > 0) && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2 text-[9px] font-pixel text-sky-300">
            {Object.entries(item.statBonus).map(
              ([stat, val]) =>
                val > 0 && (
                  <span key={stat} className="bg-sky-950/70 border border-sky-600 px-1.5 py-0.5">
                    +{val} {stat.toUpperCase()}
                  </span>
                )
            )}
          </div>
        )}
      </div>

      {/* Price & Action */}
      <div className="pt-3 border-t border-dungeon-800 flex items-center justify-between gap-2">
        {/* Cost Tags */}
        <div className="flex items-center gap-2 font-pixel text-xs">
          {item.costGold > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{item.costGold}</span>
            </div>
          )}
          {item.costGems > 0 && (
            <div className="flex items-center gap-1 text-sky-400">
              <Gem className="w-3.5 h-3.5" />
              <span>{item.costGems}</span>
            </div>
          )}
          {item.costGold === 0 && item.costGems === 0 && (
            <span className="text-emerald-400 text-[10px]">FREE</span>
          )}
        </div>

        {/* Buy button */}
        {isAlreadyOwned ? (
          <span className="inline-flex items-center gap-1 font-pixel text-[10px] text-slate-500 bg-dungeon-900 border border-dungeon-800 px-2 py-1">
            <Check className="w-3 h-3" /> Owned
          </span>
        ) : (
          <RetroButton
            variant={canAfford ? (item.category === 'CUSTOM' ? 'cyan' : 'gold') : 'secondary'}
            size="xs"
            onClick={() => onPurchase(item)}
            disabled={!canAfford || isPurchasing}
          >
            {item.category === 'CUSTOM' ? 'Claim Reward' : 'Purchase'}
          </RetroButton>
        )}
      </div>
    </div>
  );
};

export default ShopItemCard;
