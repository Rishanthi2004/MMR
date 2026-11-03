import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, Car } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white border-t border-neutral-200/80 pt-16 pb-12 overflow-hidden text-neutral-600">
      {/* Subtle Automotive Track Line Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neutral-200 via-orange-500 to-neutral-200" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-100">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shadow-orange-500/30">
                M
              </div>
              <span className="text-lg font-bold text-neutral-950 tracking-wider">
                MMR <span className="text-orange-500">MOTORS</span> LTD
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm">
              Vehicle maintenance, repair services and used car sales based in Croydon, United
              Kingdom. Dedicated to dependable service and customer satisfaction.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs text-neutral-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Workshop & Enquiries Open</span>
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-orange-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-orange-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-orange-600 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#used-cars" className="hover:text-orange-600 transition-colors">
                  Used Cars
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-orange-600 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-500">
              <li>Vehicle Maintenance</li>
              <li>Brake & Disc Servicing</li>
              <li>Suspension & Steering</li>
              <li>Vehicle Repairs</li>
              <li>Used Car Sales</li>
            </ul>
          </div>

          {/* Direct Contact Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Croydon Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-neutral-600">
                  Flat 9 Solar Court, 119 Sydenham Road, Croydon, CRO 2EZ, UK
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a
                  href="tel:+447735508394"
                  className="text-neutral-900 font-semibold hover:text-orange-600 transition-colors"
                >
                  07735 508394
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a
                  href="mailto:mmrmotorsltd@gmail.com"
                  className="hover:text-orange-600 transition-colors break-all"
                >
                  mmrmotorsltd@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} MMR MOTORS LTD. All rights reserved. Registered in
            England & Wales.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Flat+9+Solar+Court%2C+119+Sydenham+Road%2C+Croydon%2C+CRO+2EZ%2C+United+Kingdom"
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-600 transition-colors"
            >
              Google Maps Location
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-orange-600 font-medium transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
