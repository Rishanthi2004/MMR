import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MapPin, Wrench, Shield, Car, Sparkles } from 'lucide-react';
import { OrangeParticleNode } from './FloatingComponents';

interface AboutSectionProps {
  workshopImgSrc: string;
  maintenanceImgSrc?: string;
  showroomImgSrc?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  workshopImgSrc,
  maintenanceImgSrc,
  showroomImgSrc,
}) => {
  return (
    <section
      id="about"
      className="relative py-24 lg:py-32 bg-white overflow-hidden border-t border-neutral-100"
    >
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-12 right-12 pointer-events-none">
        <OrangeParticleNode size={12} delay={1.5} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Rich Multi-Image Automotive Gallery (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 relative">
              {/* Main Feature Image: Clean British Workshop Bay (Spans 12 cols, or 8 cols on tablet+) */}
              <div className="sm:col-span-8 relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-100">
                <img
                  src={workshopImgSrc}
                  alt="MMR MOTORS LTD Modern Automotive Workshop & Service Bay in Croydon"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] sm:h-[400px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Scrim Overlay & Facility Tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                    <MapPin className="w-3 h-3" />
                    <span>Croydon Workshop Bay</span>
                  </div>
                  <h4 className="text-base font-bold leading-tight">
                    Equipped for Complete Mechanical Servicing
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Hydraulic lifts, diagnostics, and multi-point checks
                  </p>
                </div>
              </div>

              {/* Side Stacked Detail Images (4 cols on tablet+) */}
              <div className="sm:col-span-4 flex flex-col gap-4">
                {/* Detail Image 1: Technician Maintenance & Engine Diagnostics */}
                {maintenanceImgSrc && (
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-neutral-200/80 bg-neutral-100 flex-1 min-h-[180px]">
                    <img
                      src={maintenanceImgSrc}
                      alt="MMR Motors Precision Engine Maintenance & Diagnostics"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-300">
                        <Wrench className="w-3 h-3" />
                        <span>Diagnostics & Care</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5">
                        Certified Procedures
                      </p>
                    </div>
                  </div>
                )}

                {/* Detail Image 2: Used Car Showroom & Handover */}
                {showroomImgSrc && (
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-neutral-200/80 bg-neutral-100 flex-1 min-h-[180px]">
                    <img
                      src={showroomImgSrc}
                      alt="MMR Motors Used Car Sales Showroom"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-300">
                        <Car className="w-3 h-3" />
                        <span>Used Car Sales</span>
                      </div>
                      <p className="text-xs font-bold text-white mt-0.5">
                        Quality Inspected Cars
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Facility Trust Strip */}
            <div className="mt-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-medium">Flat 9 Solar Court, 119 Sydenham Road, Croydon</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open for Appointments</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                  About MMR MOTORS LTD
                </span>
                <span className="w-8 h-px bg-orange-400" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Driven by Care.{' '}
                <span className="text-orange-500">Built Around Your Vehicle.</span>
              </h2>

              <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
                MMR MOTORS LTD provides vehicle maintenance and repair services alongside used car
                sales. We aim to help customers find practical automotive solutions for their
                vehicle needs.
              </p>

              <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
                Based in Croydon, we work with attention to detail and honest communication. Whether
                your car requires scheduled servicing, diagnosis, or you are looking for your next
                reliable car, our team is ready to assist.
              </p>

              {/* Service Highlights */}
              <div className="mt-8 space-y-3.5 border-t border-neutral-100 pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-neutral-900">
                      Comprehensive Diagnostics & Maintenance
                    </span>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      From routine oil & brake checks to complete mechanical servicing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-neutral-900">
                      Handpicked Used Vehicle Selection
                    </span>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Clear vehicle histories and straightforward enquiries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-neutral-900">
                      Direct Local Croydon Support
                    </span>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Direct telephone and email assistance whenever you need advice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  <span>Visit Our Workshop</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>

                <a
                  href="tel:+447735508394"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-orange-600 transition-colors"
                >
                  <span>Call 07735 508394</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
