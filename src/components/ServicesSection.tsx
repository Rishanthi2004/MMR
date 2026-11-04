import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Wrench, ShieldAlert, Car, ArrowRight, Check } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  image: string;
  icon: React.ReactNode;
  badge: string;
}

interface ServicesSectionProps {
  maintenanceImg: string;
  repairImg: string;
  salesImg: string;
}

const ServiceCard: React.FC<{ service: ServiceItem; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);
  const glareOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative h-full bg-white rounded-2xl border border-neutral-200/90 hover:border-orange-500/50 shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Dynamic Glare Reflection Overlay */}
        <motion.div
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 bg-gradient-to-tr from-white via-orange-100/30 to-transparent pointer-events-none z-30 transition-opacity"
        />

        {/* Card Image with subtle zoom */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-neutral-100">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Floating Category Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs font-semibold px-3 py-1 bg-white/90 backdrop-blur-md text-neutral-800 rounded-md border border-neutral-200 shadow-xs">
              {service.badge}
            </span>
          </div>

          {/* Floating Service Icon */}
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-4 left-4 z-10 w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            {service.icon}
          </motion.div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">
              {service.title}
            </h3>

            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              {service.description}
            </p>

            {/* Checklist */}
            <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
              {service.details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                  <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Action Link */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors uppercase tracking-wider"
            >
              <span>Enquire Service</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>

            <span className="text-xs text-neutral-400 font-mono">
              0{index + 1}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  maintenanceImg,
  repairImg,
  salesImg,
}) => {
  const services: ServiceItem[] = [
    {
      id: 'maintenance',
      title: 'Vehicle Maintenance',
      badge: 'Scheduled Care',
      description:
        'Routine vehicle maintenance to help keep your vehicle in good working condition.',
      details: [
        'Oil, filter, and fluid level servicing',
        'Brake pad and disc safety examinations',
        'Battery condition and charging diagnostics',
        'Tire pressure and suspension check',
      ],
      image: maintenanceImg,
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      id: 'repairs',
      title: 'Vehicle Repair Services',
      badge: 'Mechanical & Safety',
      description:
        'Automotive repair services to address vehicle issues and maintenance requirements.',
      details: [
        'Braking system repair and replacement',
        'Exhaust and emission troubleshooting',
        'Steering, suspension, and alignment',
        'Engine diagnostic fault resolution',
      ],
      image: repairImg,
      icon: <ShieldAlert className="w-5 h-5" />,
    },
    {
      id: 'used-cars',
      title: 'Used Car Sales',
      badge: 'Vehicle Sales',
      description:
        'Explore used-car options and contact our team for enquiries about available vehicles.',
      details: [
        'Pre-sale multi-point vehicle checks',
        'Clear documentation and transparent history',
        'Viewing and test drive appointments',
        'Direct vehicle enquiries with our team',
      ],
      image: salesImg,
      icon: <Car className="w-5 h-5" />,
    },
  ];

  return (
    <section
      id="services"
      className="relative py-24 lg:py-32 bg-neutral-50/70 border-t border-neutral-200/60 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              What We Do
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Precision Automotive Services in Croydon
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-neutral-600"
          >
            MMR MOTORS LTD delivers thorough maintenance, honest repair services, and curated
            used car sales with transparent guidance every step of the way.
          </motion.p>
        </div>

        {/* 3D Animated Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
