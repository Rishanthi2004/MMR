import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, ExternalLink, Send, CheckCircle2, Clock } from 'lucide-react';

interface ContactSectionProps {
  workshopImg: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ workshopImg }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    contact: '',
    serviceType: 'Vehicle Maintenance',
    vehicleReg: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.contact) return;
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32 bg-neutral-900 text-white overflow-hidden"
    >
      {/* Background Workshop Image with Dark Vignette & Scrim */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={workshopImg}
          alt="MMR Motors Workshop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/90 to-neutral-950" />
      </div>

      {/* Ambient Orange Accents */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Get in Touch
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Let's Get You Back on the Road
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-neutral-300"
          >
            Reach out to MMR MOTORS LTD for vehicle maintenance, repair queries, or used car sales
            appointments in Croydon.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards & Quick Actions (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Company Info Box */}
            <div className="bg-neutral-800/80 backdrop-blur-md rounded-2xl p-7 border border-neutral-700/80 shadow-xl">
              <h3 className="text-xl font-bold text-white tracking-tight">
                MMR MOTORS LTD
              </h3>
              <p className="text-xs text-orange-400 font-medium uppercase tracking-wider mt-1">
                Vehicle Care & Used Car Sales
              </p>

              <div className="mt-6 space-y-5 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Location</span>
                    <span className="text-neutral-200 leading-snug">
                      Flat 9 Solar Court, 119 Sydenham Road, Croydon, CRO 2EZ, United Kingdom.
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Telephone</span>
                    <a
                      href="tel:+447735508394"
                      className="text-white font-semibold hover:text-orange-400 transition-colors"
                    >
                      07735 508394
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Email Address</span>
                    <a
                      href="mailto:mmrmotorsltd@gmail.com"
                      className="text-neutral-200 hover:text-orange-400 transition-colors break-all"
                    >
                      mmrmotorsltd@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours / Availability */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 block font-medium">Service Hours</span>
                    <span className="text-neutral-300 text-xs">
                      Monday – Saturday: 8:30 AM – 6:00 PM <br />
                      Sunday: By Appointment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons with 3D Hover Effect */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:+447735508394"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-orange-500/20 text-center transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us</span>
              </motion.a>

              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="mailto:mmrmotorsltd@gmail.com"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl border border-neutral-700 shadow-md text-center transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Us</span>
              </motion.a>

              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://www.google.com/maps/search/?api=1&query=Flat+9+Solar+Court%2C+119+Sydenham+Road%2C+Croydon%2C+CRO+2EZ%2C+United+Kingdom"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl border border-neutral-700 shadow-md text-center transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Direct Enquiry Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-neutral-800/90 backdrop-blur-md rounded-2xl p-7 sm:p-9 border border-neutral-700/80 shadow-2xl"
          >
            {formSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thank You for Your Enquiry</h3>
                <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
                  We have received your message regarding{' '}
                  <span className="text-orange-400 font-semibold">{formState.serviceType}</span>. A
                  member of the MMR MOTORS LTD team in Croydon will contact you shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormState({
                      name: '',
                      contact: '',
                      serviceType: 'Vehicle Maintenance',
                      vehicleReg: '',
                      message: '',
                    });
                  }}
                  className="mt-6 px-6 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white">Direct Enquiry Form</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fill out the form below or call us directly at 07735 508394.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Smith"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-hidden focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Phone Number or Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 07123 456789 or email"
                      value={formState.contact}
                      onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-hidden focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Service Required
                    </label>
                    <select
                      value={formState.serviceType}
                      onChange={(e) => setFormState({ ...formState, serviceType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-hidden focus:border-orange-500 transition-colors"
                    >
                      <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                      <option value="Vehicle Repair Services">Vehicle Repair Services</option>
                      <option value="Used Car Sales">Used Car Sales Enquiry</option>
                      <option value="General Vehicle Advice">General Vehicle Advice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Vehicle Registration / Model (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AB21 CDE / BMW 3 Series"
                      value={formState.vehicleReg}
                      onChange={(e) => setFormState({ ...formState, vehicleReg: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-hidden focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Message / Fault Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what your vehicle needs or your used car enquiry..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-hidden focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry to MMR MOTORS LTD</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
