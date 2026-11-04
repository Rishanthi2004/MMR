import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ShowcaseSectionProps {
  showcaseImg: string;
  onEnquire: () => void;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({ showcaseImg, onEnquire }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const carScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.02, 0.96]);
  const carTranslateX = useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, 30]);
  const bgTranslateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      id="used-cars"
      ref={containerRef}
      className="relative py-24 lg:py-36 bg-gradient-to-b from-white via-neutral-100/50 to-white overflow-hidden border-t border-neutral-200/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Showroom Showcase
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Find Your Next Drive
          </motion.h2>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
          >
            Contact MMR MOTORS LTD to enquire about available used vehicles.
            We take pride in transparent vehicle histories and reliable guidance.
          </motion.p>
        </div>

        {/* Centerpiece Showcase Vehicle with Parallax & Motion */}
        <div className="relative max-w-5xl mx-auto" style={{ perspective: 1200 }}>
          {/* Subtle Ambient Orange Glow Aura behind vehicle */}
          <motion.div
            style={{ y: bgTranslateY }}
            className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-amber-400/15 to-orange-500/10 blur-3xl rounded-3xl -z-10"
          />

          {/* Vehicle Entrance Container with horizontal motion & scale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              scale: carScale,
              x: carTranslateX,
            }}
            className="relative rounded-3xl overflow-hidden border border-neutral-200/90 shadow-2xl bg-white"
          >
            {/* Showroom Image */}
            <div className="relative w-full h-[320px] sm:h-[460px] lg:h-[540px] overflow-hidden">
              <img
                src={showcaseImg}
                alt="MMR MOTORS LTD Used Car Sales Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Contrast Scrim at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

              {/* Showcase Banner Overlay */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-md text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                      Curated Inventory Enquiries
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Quality Vehicles Checked & Prepared
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Looking for a specific model or budget? Get in touch with our Croydon team
                    to discuss our current arrivals and arrange viewings.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={onEnquire}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>Enquire Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="tel:+447735508394"
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm rounded-xl border border-white/30 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    <span>07735 508394</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Soft shadow beneath */}
            <div className="absolute -bottom-8 inset-x-12 h-8 bg-neutral-950/25 blur-2xl rounded-full -z-10" />
          </motion.div>
        </div>

        {/* 3 Pillars of Used Car Sales */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-900">Direct Dealer Contact</h4>
            <p className="mt-1 text-xs text-neutral-500">
              Speak directly with our team with zero pressure or intermediaries.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-900">Mechanical Verification</h4>
            <p className="mt-1 text-xs text-neutral-500">
              Vehicles inspected in our Croydon workshop prior to customer handover.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-neutral-200/80 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-orange-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-900">Honest Documentation</h4>
            <p className="mt-1 text-xs text-neutral-500">
              Clear vehicle paperwork, service history, and MOT details on request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
