import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Confetti particle component
const Particle = ({ index, type }) => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const color = colors[index % colors.length];
  
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 1.5 + Math.random() * 1;
  const randomRotation = Math.random() * 720 - 360;
  
  if (type === 'star') {
    return (
      <motion.div
        className="absolute text-2xl"
        initial={{ 
          x: `${randomX}vw`, 
          y: -20,
          rotate: 0,
          opacity: 1,
          scale: 0.5
        }}
        animate={{ 
          y: '100vh',
          rotate: randomRotation,
          opacity: [1, 1, 0],
          scale: [0.5, 1.2, 0.8]
        }}
        transition={{ 
          duration: randomDuration + 0.5,
          delay: randomDelay,
          ease: "easeOut"
        }}
      >
        ⭐
      </motion.div>
    );
  }
  
  if (type === 'emoji') {
    const emojis = ['🎉', '🌟', '✨', '💫', '🎊', '🥳'];
    return (
      <motion.div
        className="absolute text-3xl"
        initial={{ 
          x: `${randomX}vw`, 
          y: -30,
          rotate: 0,
          opacity: 1,
          scale: 0
        }}
        animate={{ 
          y: '100vh',
          rotate: randomRotation,
          opacity: [1, 1, 0],
          scale: [0, 1.5, 1]
        }}
        transition={{ 
          duration: randomDuration + 0.8,
          delay: randomDelay,
          ease: "easeOut"
        }}
      >
        {emojis[index % emojis.length]}
      </motion.div>
    );
  }
  
  // Default confetti
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color }}
      initial={{ 
        x: `${randomX}vw`, 
        y: -10,
        rotate: 0,
        opacity: 1
      }}
      animate={{ 
        y: '100vh',
        rotate: randomRotation,
        opacity: [1, 1, 0]
      }}
      transition={{ 
        duration: randomDuration,
        delay: randomDelay,
        ease: "easeOut"
      }}
    />
  );
};

// Celebration burst from center
const CelebrationBurst = () => {
  const particles = Array.from({ length: 20 });
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{ 
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][i % 4]
            }}
            initial={{ 
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1
            }}
            animate={{ 
              scale: [0, 1.5, 0],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Star burst animation
const StarBurst = () => {
  const stars = Array.from({ length: 12 });
  
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {stars.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 80;
        
        return (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ 
              scale: 0,
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              scale: [0, 1.2, 0],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: [1, 1, 0],
              rotate: 180
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: i * 0.02
            }}
          >
            ⭐
          </motion.div>
        );
      })}
    </div>
  );
};

// Main Celebration component
export function Celebration({ show, type = 'confetti', onComplete }) {
  const [visible, setVisible] = useState(show);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!visible) return null;
  
  const particleCount = type === 'epic' ? 50 : type === 'big' ? 30 : 20;
  const particles = Array.from({ length: particleCount });
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Confetti rain */}
        {particles.map((_, i) => (
          <Particle 
            key={i} 
            index={i} 
            type={type === 'epic' ? (i % 3 === 0 ? 'emoji' : i % 3 === 1 ? 'star' : 'confetti') : 'confetti'} 
          />
        ))}
        
        {/* Center burst */}
        {(type === 'big' || type === 'epic') && <CelebrationBurst />}
        
        {/* Star burst for epic celebrations */}
        {type === 'epic' && <StarBurst />}
      </div>
    </AnimatePresence>
  );
}

// Success checkmark animation
export function SuccessAnimation({ show }) {
  if (!show) return null;
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.2, 1], rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.svg
          className="w-12 h-12 text-white"
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

// Floating stars animation
export function FloatingStars({ count = 5, show }) {
  if (!show) return null;
  
  const stars = Array.from({ length: count });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{ 
            x: '50%',
            y: '50%',
            scale: 0,
            opacity: 1
          }}
          animate={{ 
            x: `${30 + Math.random() * 40}%`,
            y: `${20 + Math.random() * 30}%`,
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
}

export default Celebration;
