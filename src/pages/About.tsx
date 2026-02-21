import { MapPin, Clock, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { settingsApi, type SettingsData } from '../api';

export const About = () => {
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

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-12 bg-zinc-950 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="space-y-10 sm:space-y-16">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold italic text-white mb-6 sm:mb-8 border-l-4 border-primary pl-4 sm:pl-6">Location & Hours</h2>
            <div className="space-y-8">
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
            </div>
          </div>
          <div className="h-64 rounded-xl overflow-hidden grayscale contrast-125 border border-primary/20">
            <img
              alt="Map location"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBilD7BYirOvOOoj2w5r3RHH4yuDt9joHbWNm6K9zbS1YOAJlPj8Bjfb3UKu6X9pOyMRDFyzynND5Go_dxcATzXg5eS4D-IOMUQgGPg5x2S72pG-3vPj8VpI9h9RvYzMNtORoKVB_zZ-lLkNyX1B8Yh1SGIci67wnMG_qN_xZO_4Xdq5QkPeseQEpdihTDAnWpGFRes3Dtbrv7beoXEQBlhUTOKWqeUeOOYsZ0cnfOfMm4_OXvnnbhV2DBjhFgYr6Q06dFh29QCQJeJ"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="bg-background-dark p-5 sm:p-10 rounded-2xl border border-primary/10 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 italic">Contact Us</h3>
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Phone</p>
              <a href={`tel:${settings.phone}`} className="text-primary hover:text-primary/80 transition-colors text-lg">
                {settings.phone}
              </a>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Email</p>
              <a href={`mailto:${settings.email}`} className="text-primary hover:text-primary/80 transition-colors">
                {settings.email}
              </a>
            </div>
            <div className="pt-6 border-t border-primary/10">
              <p className="text-slate-400 mb-4">We look forward to serving you! For special requests or group reservations, feel free to contact us directly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
