// src/pages/ChatSessionsListPage.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Link, useNavigate } from 'react-router-dom';
import { fetchChatSessions, createChatSession } from '../services/chatApiService';
import { FiPlusCircle, FiMessageSquare, FiInbox, FiLoader, FiArrowRight } from 'react-icons/fi'; // Added FiArrowRight
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; // Assuming you use react-toastify

// Helper to format date nicely (defined outside component or memoized)
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Animation variants (defined outside the component for performance)
const containerVariantsConfig = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Slightly faster stagger
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

// Skeleton loader component (defined outside or memoized)
const SkeletonCard = ({ itemKey }) => (
  <motion.div
    key={itemKey} // Ensure key is passed if mapping
    className="block p-5 sm:p-6 bg-darkAccent/50 rounded-2xl shadow-lg" // Slightly more opaque
    variants={itemVariantsConfig} // Use config
  >
    <div className="flex items-center animate-pulse">
      <div className="bg-gray-700/50 rounded-full mr-4 w-10 h-10 sm:w-12 sm:h-12"></div>
      <div className="flex-1 space-y-2.5">
        <div className="bg-gray-700/50 rounded h-4 w-3/4"></div>
        <div className="bg-gray-700/50 rounded h-3 w-1/2"></div>
      </div>
    </div>
  </motion.div>
);


const ChatSessionsListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memoize variants to prevent re-creation on every render
  const containerVariants = useMemo(() => containerVariantsConfig, []);
  const itemVariants = useMemo(() => itemVariantsConfig, []);


  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    setLoading(true);
    setError(null); // Clear previous errors on new fetch

    fetchChatSessions()
      .then(response => {
        if (isMounted) {
          const sortedSessions = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          setSessions(sortedSessions);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Failed to fetch chat sessions:", err);
          setError("Could not load your chats. Please try again later.");
          if (err.response && err.response.status === 401) {
              toast.error("Session expired. Please log in again.");
              navigate('/login', { replace: true });
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          // Optional delay for visual effect, can be removed for faster perceived load
          setTimeout(() => setLoading(false), 300); 
        }
      });

      return () => {
        isMounted = false; // Cleanup function to set flag
      };
  }, [navigate]);

  const handleNewChat = async () => {
    // Navigate to /chat and let ChatPage handle new session creation.
    // This is generally a smoother UX.
    navigate('/chat');
  };


  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen bg-primary text-textPrimary p-4 text-center"
      >
        <FiInbox size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-400 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
            onClick={() => { // Reload or attempt to refetch
                setLoading(true);
                setError(null);
                // Trigger the useEffect again by potentially changing a dep or calling a refetch func
                // For simplicity, a reload works, but a targeted refetch is better.
                // Let's make it attempt a refetch via state change if we were to add a refetch button
                // For now, reload is simplest from user perspective here.
                window.location.reload(); 
            }}
            className="mt-6 bg-accent text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
        >
            Try Again
        </button>
      </motion.div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-primary via-darkAccent/5 to-primary text-textPrimary p-4 sm:p-6 md:p-8" // Responsive padding
    >
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary mb-4 sm:mb-0">
            Your Conversations
          </h1>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0px 5px 15px rgba(var(--color-accent-rgb, 99, 102, 241), 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNewChat}
            className="bg-gradient-to-r from-accent to-secondary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent transition-all duration-200 ease-in-out flex items-center space-x-2 text-base sm:text-lg font-medium"
          >
            <FiPlusCircle size={20} strokeWidth={2.5}/>
            <span>Start New Chat</span>
          </motion.button>
        </motion.div>

        {/* Sessions List or Empty State/Loading */}
        {loading ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, i) => <SkeletonCard itemKey={`skeleton-${i}`} key={`skeleton-${i}`} />)}
            </motion.div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
            className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4 sm:px-6 bg-darkAccent/70 rounded-2xl shadow-2xl mt-10"
          >
            <FiInbox size={50} strokeWidth={1.5} className="text-accent mb-5" />
            <h2 className="text-2xl font-semibold mb-2.5 text-textPrimary">No Chats Yet!</h2>
            <p className="text-gray-400 max-w-sm mb-7">
              It's a bit quiet here. Start a new conversation to see your chat history.
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNewChat}
              className="bg-accent text-white px-7 py-2.5 rounded-lg shadow-md hover:bg-secondary hover:shadow-lg transition-all text-md font-semibold"
            >
              Create Your First Chat
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 sm:space-y-4"
          >
            <AnimatePresence>
              {sessions.map(session => (
                <motion.div
                  key={session.id}
                  variants={itemVariants}
                  exit="exit"
                  layout // Animate layout changes
                  className="group" // For group hover effects
                >
                  <Link
                    to={`/chat/${session.id}`}
                    className="block p-4 sm:p-5 bg-darkAccent rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:bg-secondary/10"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 p-2.5 sm:p-3 bg-accent/10 rounded-full group-hover:bg-accent transition-colors duration-200">
                        <FiMessageSquare className="text-accent group-hover:text-white transition-colors duration-200 text-xl sm:text-2xl" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-md sm:text-lg font-semibold text-textPrimary truncate group-hover:text-accent transition-colors">
                          {session.title || `Chat from ${new Date(session.created_at).toLocaleDateString()}`}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          Last active: {formatDate(session.updated_at)}
                        </p>
                      </div>
                      <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-accent transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 opacity-0 group-hover:opacity-100" /> 
                      {/* Replaced SVG with FiArrowRight for consistency, conditionally visible */}
                    </div>
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