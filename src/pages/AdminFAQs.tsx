import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormData {
  question: string;
  answer: string;
  is_active: boolean;
}

export const AdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/faqs?all=1`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const data = await response.json();
      setFaqs(data.data || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', is_active: true });
    setShowForm(true);
  };

  const handleEditClick = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      is_active: faq.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Question and answer are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('auth_token');

      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/faqs/${editingId}`
        : `${import.meta.env.VITE_API_URL}/faqs`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save FAQ');
      }

      setSuccess(editingId ? 'FAQ updated successfully' : 'FAQ added successfully');
      setShowForm(false);
      setFormData({ question: '', answer: '', is_active: true });
      fetchFAQs();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError(err instanceof Error ? err.message : 'Failed to save FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }

      setSuccess('FAQ deleted successfully');
      fetchFAQs();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setError('Failed to delete FAQ');
    }
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const index = faqs.findIndex((f) => f.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === faqs.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedFaq] = faqs.splice(index, 1);
    faqs.splice(newIndex, 0, movedFaq);

    // Update sort orders
    const token = localStorage.getItem('auth_token');
    for (let i = 0; i < faqs.length; i++) {
      if (faqs[i].id === id) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/faqs/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ sort_order: i + 1 }),
          });
        } catch (err) {
          console.error('Error updating sort order:', err);
        }
      }
    }

    setFaqs([...faqs]);
    fetchFAQs();
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Manage FAQs</h1>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark font-bold py-2 px-4 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add FAQ
            </button>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-300 flex items-center justify-between"
            >
              {error}
              <button
                onClick={() => setError(null)}
                className="text-red-300 hover:text-red-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 text-green-300 flex items-center justify-between"
            >
              {success}
              <button
                onClick={() => setSuccess(null)}
                className="text-green-300 hover:text-green-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-background-dark border border-primary/20 rounded-lg p-6 mb-8"
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                      placeholder="Enter the question"
                      disabled={submitting}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-vertical min-h-[150px]"
                      placeholder="Enter the answer"
                      disabled={submitting}
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-slate-300">
                      Active
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save FAQ'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({ question: '', answer: '', is_active: true });
                      }}
                      disabled={submitting}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAQs List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-background-dark border border-slate-700 rounded-lg p-12 text-center text-slate-400">
              <p>No FAQs yet. Click "Add FAQ" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-background-dark border border-slate-700 rounded-lg p-6 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-300 mb-4 line-clamp-2">{faq.answer}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Sort Order: {faq.sort_order}</span>
                        <span className={`px-2 py-1 rounded ${
                          faq.is_active
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMove(faq.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-slate-300"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(faq.id, 'down')}
                          disabled={index === faqs.length - 1}
                          className="p-1 hover:bg-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-slate-300"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Edit button */}
                      <button
                        onClick={() => handleEditClick(faq)}
                        className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-300 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-2 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFAQs;
