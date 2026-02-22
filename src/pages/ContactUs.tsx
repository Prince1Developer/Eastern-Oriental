import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { settingsApi, type SettingsData } from '../api';

export const ContactUs = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    settingsApi.getAll().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated form submission
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

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

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: settings.phone,
      link: `tel:${settings.phone}`
    },
    {
      icon: Mail,
      title: 'Email',
      value: settings.email,
      link: `mailto:${settings.email}`
    },
    {
      icon: MapPin,
      title: 'Address',
      value: settings.address,
      link: '#'
    },
    {
      icon: Clock,
      title: 'Open Hours',
      value: 'Check our website',
      link: '#'
    }
  ];

  return (
    <section className="bg-zinc-950 min-h-screen pt-24">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20 bg-gradient-to-b from-background-dark to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 italic">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 border-l-4 border-primary pl-6">
                Contact Information
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Have questions or special requests? Our team is here to help. Feel free to reach out using any of the contact methods below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-5 rounded-lg bg-background-dark/50 border border-primary/10 hover:border-primary/30 transition-all hover:bg-background-dark/80"
                  >
                    <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {info.title}
                      </p>
                      <p className="text-white font-medium hover:text-primary transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Quick Response */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-8">
              <p className="text-sm text-slate-300">
                <span className="font-bold text-primary">Response Time:</span> We typically respond to inquiries within 2-4 hours during business hours.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-background-dark to-background-dark/50 border border-primary/20 rounded-2xl p-8 sm:p-10">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Message sent successfully!</p>
                    <p className="text-green-400/80 text-sm">We'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-dark/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-background-dark/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background-dark/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="+44 (0) 1234 567890"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background-dark/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-background-dark/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20 bg-background-dark/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Find Us On The Map</h2>
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

export default ContactUs;
