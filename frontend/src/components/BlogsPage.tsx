import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../lib/blogs';

const formatDate = (date: string) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="px-2 py-0.5 text-xs rounded-full border bg-amber-100/80 dark:bg-neutral-700/50 text-amber-800 dark:text-gray-300 border-amber-300/40 dark:border-neutral-600/50">
    {tag}
  </span>
);

const BlogsPage: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(blogPosts.flatMap((post) => post.tags))),
    []
  );
  const visiblePosts = useMemo(
    () => (activeTag ? blogPosts.filter((post) => post.tags.includes(activeTag)) : blogPosts),
    [activeTag]
  );
  const selectedPost = blogPosts.find((post) => post.slug === selectedSlug) ?? null;

  return (
    <motion.div
      className="h-full p-4 md:p-12 pb-20 md:pb-12 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.article
              key={selectedPost.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={() => setSelectedSlug(null)}
                className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:underline mb-8"
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft size={16} />
                All posts
              </motion.button>

              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white leading-tight">
                {selectedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-500">
                {selectedPost.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(selectedPost.date)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {selectedPost.readingTime} min read
                </span>
              </div>

              {selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-6 mb-6 border-b border-amber-300/40 dark:border-neutral-700/60">
                  {selectedPost.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              )}

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-amber-700 dark:prose-a:text-amber-400 prose-strong:text-gray-800 dark:prose-strong:text-white prose-code:text-amber-700 dark:prose-code:text-amber-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPost.content}</ReactMarkdown>
              </div>

              <motion.button
                onClick={() => setSelectedSlug(null)}
                className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:underline mt-12 pt-6 border-t border-amber-300/40 dark:border-neutral-700/60 w-full"
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft size={16} />
                Back to all posts
              </motion.button>
            </motion.article>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-800 dark:text-white"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Blogs
              </motion.h1>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                Notes on whatever I'm building, breaking, or learning.
              </p>

              {allTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      activeTag === null
                        ? 'bg-amber-200/80 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 border-amber-400/60 dark:border-amber-400/40'
                        : 'bg-transparent text-gray-600 dark:text-gray-400 border-amber-300/40 dark:border-neutral-600/50 hover:bg-amber-100/60 dark:hover:bg-neutral-700/40'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        activeTag === tag
                          ? 'bg-amber-200/80 dark:bg-amber-400/20 text-amber-900 dark:text-amber-300 border-amber-400/60 dark:border-amber-400/40'
                          : 'bg-transparent text-gray-600 dark:text-gray-400 border-amber-300/40 dark:border-neutral-600/50 hover:bg-amber-100/60 dark:hover:bg-neutral-700/40'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {visiblePosts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-500 py-12">
                  <BookOpen className="mx-auto mb-3" size={28} />
                  No posts yet — check back soon.
                </div>
              ) : (
                <div className="divide-y divide-amber-300/30 dark:divide-neutral-700/50">
                  {visiblePosts.map((post, index) => (
                    <motion.button
                      key={post.slug}
                      onClick={() => setSelectedSlug(post.slug)}
                      className="group w-full text-left py-7 first:pt-0"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeInOut' }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 mb-3 text-xs text-gray-500 dark:text-gray-500">
                            {post.date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(post.date)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.readingTime} min read
                            </span>
                          </div>
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2">
                            {post.tags.map((tag) => (
                              <TagPill key={tag} tag={tag} />
                            ))}
                          </div>
                        </div>
                        <motion.div
                          className="text-amber-700 dark:text-amber-400 mt-1 shrink-0"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight size={18} />
                        </motion.div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BlogsPage;
