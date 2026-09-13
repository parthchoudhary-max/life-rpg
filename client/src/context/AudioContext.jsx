import React, { createContext, useContext, useState, useEffect } from 'react';
import soundEngine from '../services/soundEngine';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('life_rpg_muted');
    return saved ? JSON.parse(saved) : false;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('life_rpg_volume');
    return saved ? Number(saved) : 0.4;
  });

  useEffect(() => {
    soundEngine.setMuted(isMuted);
    localStorage.setItem('life_rpg_muted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    soundEngine.setVolume(volume);
    localStorage.setItem('life_rpg_volume', volume.toString());
  }, [volume]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (isMuted) {
      soundEngine.setMuted(false);
      soundEngine.playTone(587.33, 'square', 0.08, 0, 0.2); // unmuted chime
    }
  };

  const playLevelUp = () => soundEngine.playLevelUp();
  const playQuestComplete = () => soundEngine.playQuestComplete();
  const playCoin = () => soundEngine.playCoinSound();
  const playDamage = () => soundEngine.playDamageSound();
  const playPotion = () => soundEngine.playPotionSound();
  const playEquip = () => soundEngine.playEquipSound();
  const playClick = () => soundEngine.playButtonClick();

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        volume,
        setVolume,
        toggleMute,
        playLevelUp,
        playQuestComplete,
        playCoin,
        playDamage,
        playPotion,
        playEquip,
        playClick,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
