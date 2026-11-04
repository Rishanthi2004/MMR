import React from 'react';
import { motion } from 'motion/react';

interface FloatingElementProps {
  className?: string;
  delay?: number;
  duration?: number;
  depth?: number;
  rotate?: number;
}

// Realistic 3D Ventilated Brake Rotor & Caliper
export const BrakeDisc3D: React.FC<FloatingElementProps> = ({
  className = '',
  delay = 0,
  duration = 7,
  rotate = 25,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{
        y: [-8, 8, -8],
        rotate: [rotate - 4, rotate + 4, rotate - 4],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`pointer-events-none select-none drop-shadow-2xl ${className}`}
      style={{ perspective: 800 }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)]"
      >
        <defs>
          <radialGradient id="discGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="90%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </radialGradient>
          <linearGradient id="caliperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#64748B" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Rotor Ring */}
        <circle cx="100" cy="100" r="88" fill="url(#discGrad)" stroke="#64748B" strokeWidth="2" />
        <circle cx="100" cy="100" r="78" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="54" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

        {/* Ventilation Cross-Drilled Holes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const r1 = 66;
          const r2 = 74;
          return (
            <g key={i}>
              <circle
                cx={100 + r1 * Math.cos(rad)}
                cy={100 + r1 * Math.sin(rad)}
                r="2.5"
                fill="#0F172A"
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
              <circle
                cx={100 + r2 * Math.cos(rad + 0.2)}
                cy={100 + r2 * Math.sin(rad + 0.2)}
                r="2.5"
                fill="#0F172A"
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Slotted Grooves */}
        {[15, 75, 135, 195, 255, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 60 * Math.cos(rad);
          const y1 = 100 + 60 * Math.sin(rad);
          const x2 = 100 + 82 * Math.cos(rad + 0.25);
          const y2 = 100 + 82 * Math.sin(rad + 0.25);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#334155"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center Hub & Lug Nuts */}
        <circle cx="100" cy="100" r="32" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        <circle cx="100" cy="100" r="14" fill="#020617" />
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 22 * Math.cos(rad);
          const y = 100 + 22 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="#94A3B8"
              stroke="#F8FAFC"
              strokeWidth="1"
            />
          );
        })}

        {/* Performance Orange Caliper */}
        <path
          d="M 160 55 C 185 80 185 120 160 145 L 140 135 C 155 115 155 85 140 65 Z"
          fill="url(#caliperGrad)"
          stroke="#9A3412"
          strokeWidth="1.5"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
        />
        {/* Caliper Pistons & Metallic Accent */}
        <circle cx="156" cy="85" r="5" fill="#475569" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="156" cy="115" r="5" fill="#475569" stroke="#E2E8F0" strokeWidth="1" />
        <text
          x="153"
          y="102"
          fill="#FFFFFF"
          fontSize="5.5"
          fontWeight="bold"
          letterSpacing="1"
          transform="rotate(90 153 102)"
        >
          MMR
        </text>
      </svg>
    </motion.div>
  );
};

// Realistic 3D Alloy Wheel Rim
export const AlloyWheel3D: React.FC<FloatingElementProps> = ({
  className = '',
  delay = 0.3,
  duration = 8,
  rotate = 15,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{
        y: [8, -8, 8],
        rotate: [rotate + 3, rotate - 3, rotate + 3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`pointer-events-none select-none drop-shadow-2xl ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
      >
        <defs>
          <linearGradient id="rimMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <radialGradient id="tireGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="90%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* Outer High Performance Tire */}
        <circle cx="100" cy="100" r="92" fill="url(#tireGrad)" stroke="#334155" strokeWidth="2" />
        <circle cx="100" cy="100" r="76" stroke="#475569" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="74" fill="#020617" />

        {/* Diamond Cut Alloy Rim Lip */}
        <circle cx="100" cy="100" r="70" stroke="url(#rimMetal)" strokeWidth="4" />
        <circle cx="100" cy="100" r="66" fill="#0F172A" />

        {/* 5-Twin Spoke Alloy Pattern */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const radA = ((angle - 6) * Math.PI) / 180;
          const radB = ((angle + 6) * Math.PI) / 180;
          return (
            <g key={i}>
              <polygon
                points={`
                  ${100 + 18 * Math.cos(radA)},${100 + 18 * Math.sin(radA)}
                  ${100 + 64 * Math.cos(radA)},${100 + 64 * Math.sin(radA)}
                  ${100 + 64 * Math.cos(radB)},${100 + 64 * Math.sin(radB)}
                  ${100 + 18 * Math.cos(radB)},${100 + 18 * Math.sin(radB)}
                `}
                fill="url(#rimMetal)"
                stroke="#1E293B"
                strokeWidth="1"
              />
              <line
                x1={100 + 20 * Math.cos(rad)}
                y1={100 + 20 * Math.sin(rad)}
                x2={100 + 62 * Math.cos(rad)}
                y2={100 + 62 * Math.sin(rad)}
                stroke="#F8FAFC"
                strokeWidth="1"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* Center Hub Cap */}
        <circle cx="100" cy="100" r="20" fill="#020617" stroke="#EA580C" strokeWidth="2" />
        <circle cx="100" cy="100" r="16" fill="#1E293B" />
        {/* Hub Bolts */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = ((angle + 36) * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={100 + 10 * Math.cos(rad)}
              cy={100 + 10 * Math.sin(rad)}
              r="2"
              fill="#E2E8F0"
              stroke="#475569"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Orange Accent Ring */}
        <circle cx="100" cy="100" r="4" fill="#F97316" />
      </svg>
    </motion.div>
  );
};

// 3D Engine Precision Component (Turbo / Piston / Gear)
export const EngineGear3D: React.FC<FloatingElementProps> = ({
  className = '',
  delay = 0.5,
  duration = 9,
  rotate = -20,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{
        y: [-6, 6, -6],
        rotate: [rotate, rotate + 360],
      }}
      transition={{
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: 32, repeat: Infinity, ease: 'linear' },
      }}
      className={`pointer-events-none select-none drop-shadow-xl ${className}`}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* 12 Teeth Precision Gear */}
        <g fill="url(#gearGrad)" stroke="#475569" strokeWidth="1.5">
          {Array.from({ length: 12 }).map((_, idx) => {
            const rot = idx * 30;
            return (
              <rect
                key={idx}
                x="72"
                y="10"
                width="16"
                height="22"
                rx="2"
                transform={`rotate(${rot} 80 80)`}
              />
            );
          })}
          <circle cx="80" cy="80" r="62" fill="url(#gearGrad)" />
        </g>
        <circle cx="80" cy="80" r="48" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="80" cy="80" r="30" fill="#0F172A" stroke="#EA580C" strokeWidth="2" />
        <circle cx="80" cy="80" r="12" fill="#F8FAFC" />
      </svg>
    </motion.div>
  );
};

// Subtle 3D Orange Ambient Energy Node (Disabled per user request)
export const OrangeParticleNode: React.FC<{
  className?: string;
  size?: number;
  delay?: number;
}> = () => {
  return null;
};

// Realistic 3D Chrome Mechanic Wrench
export const MechanicWrench3D: React.FC<{
  className?: string;
  animateIn?: boolean;
}> = ({ className = '', animateIn = false }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
      >
        <defs>
          <linearGradient id="chromeBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="chromeGleam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="30%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="80%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="orangeGrip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>

        {/* Wrench Shaft / Handle */}
        <rect
          x="42"
          y="26"
          width="140"
          height="18"
          rx="5"
          fill="url(#chromeGleam)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        {/* Recessed Grip Insert with Orange Accent Strip */}
        <rect
          x="65"
          y="31"
          width="95"
          height="8"
          rx="3"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="1"
        />
        <rect x="70" y="33" width="85" height="4" rx="2" fill="url(#orangeGrip)" />
        <text
          x="98"
          y="37.5"
          fill="#FFFFFF"
          fontSize="4"
          fontWeight="bold"
          letterSpacing="1.5"
          opacity="0.9"
        >
          MMR 17mm
        </text>

        {/* Open-Ended Spanner Head (Left) */}
        <path
          d="M 45 15 C 30 15 15 22 10 35 C 15 48 30 55 45 55 C 38 48 38 22 45 15 Z"
          fill="url(#chromeBody)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <path
          d="M 28 25 L 12 35 L 28 45 L 36 35 Z"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Ring-End Box Spanner Head (Right) */}
        <circle
          cx="198"
          cy="35"
          r="26"
          fill="url(#chromeBody)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        {/* 12-point internal star socket */}
        <polygon
          points="198,20 203,28 212,23 209,32 218,35 209,38 212,47 203,42 198,50 193,42 184,47 187,38 178,35 187,32 184,23 193,28"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="0.8"
        />
        <circle cx="198" cy="35" r="9" fill="#020617" />
        {/* Specular shine streak */}
        <line
          x1="50"
          y1="28"
          x2="175"
          y2="28"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

// Small Floating Metallic Chrome Bolt / Nut
export const MetallicBolt3D: React.FC<{
  className?: string;
  delay?: number;
  duration?: number;
}> = ({ className = '', delay = 0, duration = 6 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        y: [-6, 6, -6],
        rotate: [0, 45, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`pointer-events-none select-none ${className}`}
    >
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-md">
        <polygon
          points="20,4 34,12 34,28 20,36 6,28 6,12"
          fill="#94A3B8"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <polygon
          points="20,8 30,14 30,26 20,32 10,26 10,14"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="1"
        />
        <circle cx="20" cy="20" r="6" fill="#0F172A" stroke="#EA580C" strokeWidth="1" />
      </svg>
    </motion.div>
  );
};

// Small Floating Metallic Precision Socket
export const MetallicSocket3D: React.FC<{
  className?: string;
  delay?: number;
  duration?: number;
}> = ({ className = '', delay = 0, duration = 7 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0.6, 0.95, 0.6],
        y: [5, -5, 5],
        rotate: [15, -15, 15],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`pointer-events-none select-none ${className}`}
    >
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-lg">
        <rect
          x="12"
          y="8"
          width="24"
          height="32"
          rx="3"
          fill="#64748B"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <line x1="12" y1="16" x2="36" y2="16" stroke="#94A3B8" strokeWidth="1" />
        <line x1="12" y1="28" x2="36" y2="28" stroke="#94A3B8" strokeWidth="1" />
        <rect x="18" y="20" width="12" height="4" fill="#F97316" rx="1" />
        <circle cx="24" cy="38" r="4" fill="#0F172A" />
      </svg>
    </motion.div>
  );
};
