// src/pages/ChatSessionsListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchChatSessions } from '../services/chatApiService';
import { FiPlusCircle, FiMessageSquare, FiInbox, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const formatDate = dateString =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

// Animation variants
const containerVariantsConfig = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariantsConfig = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.15 }
  }
};

const SkeletonCard = ({ itemKey }) => (
  <motion.div
    key={itemKey}
    variants={itemVariantsConfig}
    className="
      block p-6 
      bg-white/10 backdrop-blur-2xl
      border border-white/20 
      rounded-3xl 
      shadow-lg hover:shadow-2xl
      transition-shadow
    "
  >
    <div className="flex items-center animate-pulse">
      <div className="bg-slate-700/60 rounded-full mr-4 w-12 h-12"></div>
      <div className="flex-1 space-y-3">
        <div className="bg-slate-700/60 rounded h-5 w-3/4"></div>
        <div className="bg-slate-700/60 rounded h-4 w-1/2"></div>
      </div>
    </div>
  </motion.div>
);

const ChatSessionsListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const containerVariants = useMemo(() => containerVariantsConfig, []);
  const itemVariants      = useMemo(() => itemVariantsConfig, []);

  useEffect(() => {
    let mounted = true;
    fetchChatSessions()
      .then(res => {
        if (!mounted) return;
        const sorted = res.data.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
        setSessions(sorted);
      })
      .catch(err => {
        if (!mounted) return;
        setError("Could not load chats. Try again later.");
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate('/login', { replace: true });
        }
      })
      .finally(() => {
        if (!mounted) return;
        setTimeout(() => setLoading(false), 300);
      });
    return () => { mounted = false; };
  }, [navigate]);

  const handleNewChat = () => navigate('/chat');

  if (error) {
    return (
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 text-white"
      >
        <FiInbox size={48} className="text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="mb-6 text-neutral-300">{error}</p>
        <button
          onClick={()=>window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.3 }}
      className="
        min-h-screen p-6 
        bg-gradient-to-r from-primary via-[-10%] via-darkAccent 
        text-white
      "
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y:-30, opacity:0 }}
          animate={{ y:0, opacity:1 }}
          transition={{ type:'spring', stiffness:120, damping:20, delay:0.1 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-10"
        >
          <h1 className="
            text-4xl font-extrabold 
            bg-clip-text text-transparent
            bg-gradient-to-r text-white
          ">Your Conversations</h1>
          <motion.button
            whileHover={{ scale:1.05 }}
            whileTap={{ scale:0.95 }}
            onClick={handleNewChat}
            className="
              inline-flex items-center space-x-2
              px-6 py-3 rounded-full 
              bg-gradient-to-r 
              shadow-lg
              text-white font-medium
              focus:outline-none ring-2 
            "
          >
            <FiPlusCircle size={20}/>
            <span>New Chat</span>
          </motion.button>
        </motion.div>

        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {[0,1,2].map(i => <SkeletonCard key={i} itemKey={i} />)}
          </motion.div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.2, type:'spring', stiffness:100, damping:15 }}
            className="
              mt-12 py-12 px-6 text-center
              bg-white/10 backdrop-blur-2xl border border-white/20
              rounded-3xl shadow-lg
            "
          >
            <FiInbox size={48} className="mb-4 text-yellow-400" />
            <h2 className="text-2xl font-semibold mb-2">No Chats Yet!</h2>
            <p className="mb-6 text-neutral-300">
              Your chat list is empty—kick things off with a new conversation.
            </p>
            <button
              onClick={handleNewChat}
              className="px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
            >Start Chatting</button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {sessions.map(session => (
                <motion.div key={session.id} variants={itemVariants} exit="exit" layout>
                  <Link
                    to={`/chat/${session.id}`}
                    className="
                      flex items-center space-x-4
                      p-5
                      bg-white/10 backdrop-blur-2xl border-l-4 border-yellow-400 border-opacity-80
                      rounded-3xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1
                    "
                  >
                    <div className="
                      flex-shrink-0 p-3
                      bg-yellow-500/20 rounded-full
                      group-hover:bg-yellow-500 transition-colors
                    ">
                      <FiMessageSquare className="text-yellow-400 text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {session.title || `Chat on ${formatDate(session.created_at)}`}
                      </h3>
                      <p className="text-sm text-neutral-300">Last active: {formatDate(session.updated_at)}</p>
                    </div>
                    <FiArrowRight className="w-5 h-5 text-neutral-300 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatSessionsListPage;
