import { MapPin, Clock, Phone, Users, Award, Heart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { settingsApi, type SettingsData } from '../api';

export const AboutUs = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.getAll().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return (
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-12 bg-zinc-950 min-h-screen pt-24">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-400 text-lg">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  const features = [
    {
      icon: Users,
      title: 'Family Owned',
      description: 'Running with passion for over decades with family values at our heart'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: '5-star food hygiene rating and recognized for authentic cuisine'
    },
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We use only the finest ingredients in all our dishes'
    }
  ];

  return (
    <section className="bg-zinc-950 min-h-screen pt-24">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-24 bg-gradient-to-b from-background-dark to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 italic">
              About <span className="text-primary">Eastern Oriental</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
              Discover our heritage, passion for authentic cuisine, and commitment to excellence
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 border-l-4 border-primary pl-6">
                Our Story
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Eastern Oriental has been a cornerstone of authentic Asian cuisine, bringing traditional flavors and modern dining experiences to our community for many years.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                We believe that great food starts with passion, quality ingredients, and respect for culinary traditions. Every dish we serve is prepared with care and attention to detail.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Our team of experienced chefs combines time-honored recipes with contemporary techniques to create an unforgettable dining experience for every guest.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1540959375944-7049f642e9b5?w=600&h=400&fit=crop"
              alt="Restaurant ambiance"
              className="rounded-2xl border border-primary/20 shadow-2xl w-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20 bg-background-dark/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 sm:mb-16">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background-dark/80 border border-primary/10 rounded-xl p-8 hover:border-primary/30 transition-all"
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location & Hours Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white border-l-4 border-primary pl-6">
              Visit Us
            </h2>

            <div className="flex items-start gap-4">
              <MapPin className="text-primary w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-white mb-1">{settings.address.split(',')[0]}</p>
                <p className="text-slate-400">{settings.address.split(',').slice(1).join(',')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-primary w-6 h-6 mt-1 flex-shrink-0" />
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                <p className="text-slate-400">Mon - Thu</p>
                <p className="text-white font-medium">{settings.hours_mon_thu}</p>
                <p className="text-slate-400">Fri - Sat</p>
                <p className="text-white font-medium">{settings.hours_fri_sat}</p>
                <p className="text-slate-400">Sunday</p>
                <p className="text-white font-medium italic">{settings.hours_sun}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-primary w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-white mb-1">{settings.phone}</p>
                <p className="text-slate-400">{settings.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl h-96"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.9123412341234!2d0.7331!3d51.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a1b1b1b1b1b1%3A0x1b1b1b1b1b1b1b1b!2sEastern%20Oriental!5e0!3m2!1sen!2suk!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
