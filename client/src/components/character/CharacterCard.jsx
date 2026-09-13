import React from 'react';
import {
  Shield,
  Wand,
  Zap,
  Heart,
  Feather,
  FlaskConical,
  Package,
  Sparkles,
  Sword,
  Shirt,
  Crown,
} from 'lucide-react';
import RetroCard from '../common/RetroCard';
import RetroButton from '../common/RetroButton';
import ProgressBar from '../common/ProgressBar';
import { getXpForNextLevel, CHARACTER_CLASSES } from '../../utils/leveling';

const CLASS_ICONS = {
  WARRIOR: Shield,
  MAGE: Wand,
  ROGUE: Zap,
  PALADIN: Heart,
  HEALER: Feather,
  ALCHEMIST: FlaskConical,
};

export const CharacterCard = ({ character, onOpenInventory }) => {
  if (!character) return null;

  const ClassIcon = CLASS_ICONS[character.class] || Shield;
  const classDetails = CHARACTER_CLASSES[character.class] || {};
  const nextXp = getXpForNextLevel(character.level);

  // Find equipped gear
  const equippedWeapon = character.inventory?.find((i) => i.slot === 'WEAPON' && i.equipped);
  const equippedArmor = character.inventory?.find((i) => i.slot === 'ARMOR' && i.equipped);
  const equippedAccessory = character.inventory?.find((i) => i.slot === 'ACCESSORY' && i.equipped);

  return (
    <RetroCard
      title={`${character.name}'s Dossier`}
      icon={Sparkles}
      highlight={true}
      action={
        <RetroButton variant="gold" size="xs" onClick={onOpenInventory}>
          <Package className="w-3.5 h-3.5" />
          <span>Inventory</span>
        </RetroButton>
      }
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
        {/* Pixel Avatar Crest */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 bg-purple-950 border-4 border-amber-400 flex items-center justify-center text-amber-300 shadow-pixel">
            <ClassIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 border border-amber-950 text-amber-950 font-pixel text-[9px] font-bold px-1.5 py-0.5 shadow-pixel-sm">
            LVL {character.level}
          </div>
        </div>

        {/* Character Bio */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="font-pixel text-base text-slate-100">{character.name}</h2>
            <span className="text-xs font-pixel text-purple-400 bg-purple-950/80 border border-purple-600 px-1.5 py-0.5">
              {character.class}
            </span>
          </div>

          <p className="font-pixel text-[11px] text-amber-400 mt-1">{character.title}</p>
          <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">
            {classDetails.description || 'A brave seeker of discipline through the trial of daily habits.'}
          </p>
        </div>
      </div>

      {/* Health & XP Progress */}
      <div className="space-y-2.5 pt-3 border-t border-dungeon-800">
        <ProgressBar
          current={character.hp.current}
          max={character.hp.max}
          variant="hp"
          height="h-3.5"
        />
        <ProgressBar
          current={character.currentXp}
          max={nextXp}
          variant="xp"
          height="h-3.5"
        />
      </div>

      {/* Equipped Gear Slots */}
      <div className="mt-4 pt-3 border-t border-dungeon-800">
        <h4 className="font-pixel text-[10px] text-slate-400 mb-2 uppercase">Equipped Gear</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* Weapon Slot */}
          <div className="p-2 bg-dungeon-950 border border-dungeon-800 flex items-center gap-2">
            <Sword className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-pixel text-slate-500 uppercase">Weapon</div>
              <div className="text-[11px] font-pixel text-slate-200 truncate">
                {equippedWeapon ? equippedWeapon.name : 'Bare Hands'}
              </div>
            </div>
          </div>

          {/* Armor Slot */}
          <div className="p-2 bg-dungeon-950 border border-dungeon-800 flex items-center gap-2">
            <Shirt className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-pixel text-slate-500 uppercase">Armor</div>
              <div className="text-[11px] font-pixel text-slate-200 truncate">
                {equippedArmor ? equippedArmor.name : 'Cloth Tunic'}
              </div>
            </div>
          </div>

          {/* Accessory Slot */}
          <div className="p-2 bg-dungeon-950 border border-dungeon-800 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] font-pixel text-slate-500 uppercase">Accessory</div>
              <div className="text-[11px] font-pixel text-slate-200 truncate">
                {equippedAccessory ? equippedAccessory.name : 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RetroCard>
  );
};

export default CharacterCard;
