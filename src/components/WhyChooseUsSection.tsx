import React from 'react';
import { motion } from 'motion/react';
import { Wrench, PhoneCall, Car, ShieldAlert } from 'lucide-react';
import { OrangeParticleNode } from './FloatingComponents';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      id: 'maintenance',
      title: 'Vehicle Maintenance',
      description:
        'Routine servicing, oil changes, brake inspections, and mechanical checks carried out with care.',
      icon: <Wrench className="w-6 h-6 text-orange-500" />,
      angle: 'Top Left',
    },
    {
      id: 'repair-enquiries',
      title: 'Repair Service Enquiries',
      description:
        'Prompt investigation and repair options for brakes, steering, suspension, and vehicle faults.',
      icon: <ShieldAlert className="w-6 h-6 text-orange-500" />,
      angle: 'Top Right',
    },
    {
      id: 'used-cars',
      title: 'Used Car Sales',
      description:
        'Explore pre-owned vehicle options with open communication and straightforward viewings.',
      icon: <Car className="w-6 h-6 text-orange-500" />,
      angle: 'Bottom Left',
    },
    {
      id: 'customer-contact',
      title: 'Direct Customer Contact',
      description:
        'Direct phone and email contact with our Croydon team for clear guidance on your vehicle.',
      icon: <PhoneCall className="w-6 h-6 text-orange-500" />,
      angle: 'Bottom Right',
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden border-t border-neutral-200/60">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-orange-100/30 via-neutral-100/40 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-16 left-20 pointer-events-none">
        <OrangeParticleNode size={14} delay={0.3} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Core Capabilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Built Around Automotive Quality
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-base text-neutral-600"
          >
            Discover the foundational services powering MMR MOTORS LTD in Croydon.
          </motion.p>
        </div>

        {/* Central 3D Element with 4 Orbital Cards Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Precision Orbital Hub for Desktop */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none -z-0">
            {/* Concentric orbital rings */}
            <div className="w-[420px] h-[420px] rounded-full border border-orange-500/15 border-dashed animate-spin [animation-duration:60s]" />
            <div className="absolute w-[290px] h-[290px] rounded-full border border-neutral-200/80" />

            {/* Central Precision Monogram Emblem */}
            <div className="absolute w-28 h-28 rounded-full bg-white border border-neutral-200/90 shadow-xl flex items-center justify-center p-4">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-orange-500/30">
                MMR
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-44 lg:gap-y-16 relative z-10">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white/95 backdrop-blur-md p-7 sm:p-8 rounded-2xl border border-neutral-200/90 hover:border-orange-500/50 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                {/* Subtle orange accent node */}
                <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-500 text-orange-500 group-hover:text-white flex items-center justify-center shadow-xs transition-colors duration-300 mb-5">
                  {pillar.icon}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    0{idx + 1}
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Bottom subtle progress line on hover */}
                <div className="mt-5 w-full h-0.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="w-0 group-hover:w-full h-full bg-orange-500 transition-all duration-500 ease-out" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
