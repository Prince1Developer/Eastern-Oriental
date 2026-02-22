import { ChevronDown, HelpCircle, Loader } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQs = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/faqs`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      
      const data = await response.json();
      setFaqItems(data.data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-zinc-950 min-h-screen pt-24">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20 bg-gradient-to-b from-background-dark to-zinc-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white italic">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-300">
              Please feel free to take a look over our frequently asked questions for more information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-300 text-center">
              {error}
            </div>
          )}

          {!loading && !error && faqItems.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>No FAQs available at the moment.</p>
            </div>
          )}

          {!loading && !error && faqItems.length > 0 && (
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full flex items-center justify-between bg-background-dark/50 hover:bg-background-dark/80 px-6 py-4 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white text-left">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                        expandedId === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-primary/20 bg-background-dark/30"
                      >
                        <p className="px-6 py-4 text-slate-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 sm:py-20 bg-background-dark/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our team is here to help. Get in touch with us through our contact page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-wider"
            >
              Contact Us
            </Link>
            <Link
              to="/reservations"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-background-dark font-bold py-3 px-8 rounded-lg transition-all uppercase tracking-wider"
            >
              Make a Reservation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
