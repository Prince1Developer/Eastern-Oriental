import React, { useState } from 'react';
import { reservationsApi, ApiError } from '../api';

export const Reservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      await reservationsApi.create(data);
      setSuccess(true);
      (e.currentTarget as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to submit reservation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-12 bg-zinc-950">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold italic text-white mb-4">Reserve a Table</h1>
          <p className="text-slate-400 text-lg">Secure your dining experience. We will confirm your request via email within 2 hours.</p>
        </div>

        <div className="bg-background-dark p-6 sm:p-10 rounded-2xl border border-primary/10 shadow-2xl">
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg text-center">
              ✓ Reservation request sent! We will contact you shortly.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary/80 uppercase tracking-tighter">Full Name</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-zinc-900 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 outline-none transition-all" 
                  placeholder="John Doe" 
                  type="text" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary/80 uppercase tracking-tighter">Email Address</label>
                <input 
                  name="email" 
                  required 
                  className="w-full bg-zinc-900 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 outline-none transition-all" 
                  placeholder="john@example.com" 
                  type="email" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary/80 uppercase tracking-tighter">Date</label>
                <input 
                  name="date" 
                  required 
                  className="w-full bg-zinc-900 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 outline-none transition-all" 
                  type="date" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary/80 uppercase tracking-tighter">Number of Guests</label>
                <select 
                  name="guests" 
                  className="w-full bg-zinc-900 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 outline-none appearance-none transition-all"
                >
                  <option>2 People</option>
                  <option>4 People</option>
                  <option>6 People</option>
                  <option>8+ People</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary/80 uppercase tracking-tighter">Special Requirements</label>
              <textarea 
                name="requirements" 
                className="w-full bg-zinc-900 border border-primary/20 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 outline-none transition-all" 
                placeholder="Any allergies or special occasions?" 
                rows={4}
              ></textarea>
            </div>

            <button 
              className="w-full bg-primary text-background-dark py-4 rounded-lg font-black text-lg uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_10px_30px_-10px_rgba(249,212,6,0.3)] disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Confirm Reservation Request'}
            </button>

            <p className="text-center text-xs text-slate-500 italic">
              By clicking confirm, you agree to our terms of service regarding no-shows.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reservations;
