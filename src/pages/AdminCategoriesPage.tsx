import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { adminAPI, Category } from '../services/api';
import { Plus, Trash2, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const rowVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCategories();
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      await adminAPI.createCategory(newCategory.trim());
      setNewCategory('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"? This cannot be undone.`)) {
      try {
        await adminAPI.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-brutal-cream">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onToggle={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title="Manage Categories"
          subtitle="Add or remove academic domain categories"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Add Category Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-3 border-brutal-black shadow-brutal p-4 sm:p-6"
          >
            <h3 className="font-serif text-base sm:text-lg font-bold text-brutal-black mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Add New Category
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-brutal-red/10 border-2 border-brutal-red text-xs text-brutal-red font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Law & Legal Studies"
                className="brutal-input flex-1"
                required
                minLength={2}
              />
              <button
                type="submit"
                disabled={submitting || !newCategory.trim()}
                className="brutal-btn-primary text-xs flex-shrink-0"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Add Category</span>
              </button>
            </form>
          </motion.div>

          {/* Categories List */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="bg-white border-3 border-brutal-black shadow-brutal overflow-hidden"
          >
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
                <p className="text-xs font-bold text-brutal-black/50">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 border-3 border-brutal-black bg-brutal-cream flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-brutal-black/30" />
                </div>
                <p className="text-sm font-bold text-brutal-black">No categories yet</p>
                <p className="text-xs text-brutal-black/50 mt-1">Add your first academic category above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="brutal-table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Slug</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {categories.map((cat, idx) => (
                        <motion.tr
                          key={cat._id}
                          custom={idx}
                          variants={rowVariant}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <td className="font-bold text-brutal-black text-sm">{cat.name}</td>
                          <td className="text-brutal-black/50 text-xs font-mono">{cat.slug}</td>
                          <td className="text-brutal-black/60 text-xs">
                            {new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDelete(cat._id, cat.name)}
                              title="Delete Category"
                              className="inline-flex p-1.5 text-brutal-red hover:bg-brutal-red/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
