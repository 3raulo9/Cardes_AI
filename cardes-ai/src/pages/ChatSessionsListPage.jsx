// src/pages/ChatSessionsListPage.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchChatSessions } from "../services/chatApiService";
import {
  FiPlusCircle,
  FiMessageSquare,
  FiInbox,
  FiArrowRight,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
} from "framer-motion";
import { toast } from "react-toastify";

/* ───────────────── helpers ───────────────── */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ───────────────── animation variants ───────────────── */
const containerVariantsConfig = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08, ease: "circOut" },
  },
};

const itemVariantsConfig = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 130, damping: 20, mass: 1 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const pageTransitionConfig = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

/* ───────────────── skeleton component ───────────────── */
const SkeletonCard = ({ id, variants }) => (
  <motion.div
    key={id}
    variants={variants}
    className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/[0.08]"
  >
    <div className="flex items-center gap-x-3 sm:gap-x-4 animate-pulse">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/[0.07]" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
      </div>
      <div className="w-5 h-5 rounded-full bg-white/[0.06] opacity-40" />
    </div>
  </motion.div>
);

/* ───────────────── main component ───────────────── */
export default function ChatSessionsListPage() {
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = useMemo(() => containerVariantsConfig, []);
  const itemVariants = useMemo(() => itemVariantsConfig, []);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchChatSessions();
      setSessions(
        [...data].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load chat sessions:", err);
      setError("Could not load conversations. Please try again.");
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", { theme: "colored", autoClose: 3000 });
        navigate("/login", { replace: true });
      } else {
        toast.error("Failed to load chats.", { theme: "colored", autoClose: 3000 });
      }
    } finally {
       setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  /* ───── error state ───── */
  if (error) {
    return (
      <motion.div
        {...pageTransitionConfig}
        className="flex flex-col items-center justify-center min-h-screen p-4 text-white
                   bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]
                   from-danger/10 via-darkAccent/30 to-primary"
      >
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/[0.08] shadow-xl text-center max-w-md w-full">
          <FiAlertTriangle size={48} className="text-danger mx-auto mb-5" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            Something Went Wrong
          </h2>
          <p className="mb-6 text-neutral-300 text-sm sm:text-base">{error}</p>
          <motion.button
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.03, transition: { duration: 0.15 } }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.97, transition: { duration: 0.15 } }}
            onClick={loadSessions}
            className="
              px-6 py-2.5 rounded-full font-medium text-sm sm:text-base
              bg-danger hover:bg-danger/80 text-white
              shadow-lg shadow-danger/20 hover:shadow-danger/30
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-danger/70 focus:ring-offset-2 focus:ring-offset-primary/50
            "
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  /* ───── normal render ───── */
  return (
    <motion.div
      {...pageTransitionConfig}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "circOut" }}
      className="
        min-h-screen flex flex-col text-white
        bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))]
        from-primary/20 via-darkAccent/40 to-primary
        overflow-x-hidden
      "
    >
      {/* ───────── header ───────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring", stiffness: 100, damping: 15, delay: 0.1,
          duration: prefersReducedMotion ? 0 : 0.4,
        }}
        className="
          w-full px-4 sm:px-6 py-5 sm:py-6 md:py-8
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-4 max-w-5xl mx-auto z-10
        "
      >
        <h1
          className="
            text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white
          "
        >
          Your Conversations
        </h1>

        <motion.button
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.04, transition: { duration: 0.15 } }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.96, transition: { duration: 0.15 } }}
          onClick={() => navigate("/chat")}
          className="
            group
            inline-flex items-center gap-2
            px-4 py-2 sm:px-5 sm:py-2.5 rounded-full
            bg-accent hover:bg-accent/80
            font-medium text-primary text-sm sm:text-base
            shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-accent/70 focus:ring-offset-2 focus:ring-offset-primary/50
          "
        >
          {/* CORRECTED ICON SIZING HERE */}
          <FiPlusCircle
            className="
              w-[1.125rem] h-[1.125rem] sm:w-[1.25rem] sm:h-[1.25rem]
              transition-transform duration-250 group-hover:rotate-[135deg]"
          />
          {/* Alternatively, using text sizes if icons scale with em:
          <FiPlusCircle
            className="text-lg sm:text-xl transition-transform duration-250 group-hover:rotate-[135deg]"
          />
          (1.125rem = 18px, 1.25rem = 20px)
          This w/h approach is more direct for SVG dimensions.
          */}
          <span>New Chat</span>
        </motion.button>
      </motion.header>

      {/* ───────── list container ───────── */}
      <div className="flex-1 w-full overflow-hidden">
        <LayoutGroup>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative mx-auto w-full max-w-5xl h-full px-4 sm:px-6"
          >
            <div className="absolute inset-0 overflow-y-auto pt-1 pb-16 pr-0.5 
                            scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent 
                            hover:scrollbar-thumb-accent/50 transition-colors duration-300">
              
              {loading && sessions.length === 0 && (
                <motion.div
                  className="space-y-3 sm:space-y-4 pt-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[...Array(4)].map((_, i) => (
                    <SkeletonCard
                      key={`skeleton-${i}`}
                      id={`skeleton-id-${i}`}
                      variants={itemVariants}
                    />
                  ))}
                </motion.div>
              )}

              {!loading && sessions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.15, type: "spring", stiffness: 100, damping: 16,
                    duration: prefersReducedMotion ? 0 : 0.4,
                  }}
                  className="
                    mt-8 sm:mt-12 mb-16 py-8 sm:py-10 px-5 sm:px-6 text-center
                    bg-white/[0.04] backdrop-blur-sm ring-1 ring-white/[0.08]
                    rounded-2xl shadow-xl max-w-md mx-auto
                  "
                >
                  <FiInbox size={48} className="mb-5 text-accent/80 mx-auto" />
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white"> 
                    No Chats Yet
                  </h2>
                  <p className="mb-6 text-neutral-300 text-sm sm:text-base">
                    Start a new conversation, and it will appear here.
                  </p>
                  <motion.button
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.03, transition: { duration: 0.15 } }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.97, transition: { duration: 0.15 } }}
                    onClick={() => navigate("/chat")}
                    className="
                      group inline-flex items-center gap-2
                      px-5 py-2.5 sm:px-6 sm:py-3 rounded-full
                      bg-accent hover:bg-accent/80
                      text-primary font-medium text-sm sm:text-base
                      shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30
                      transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-accent/70 focus:ring-offset-2 focus:ring-offset-primary/50
                    "
                  >
                    {/* CORRECTED ICON SIZING HERE */}
                    <FiPlusCircle
                       className="
                         w-[1.125rem] h-[1.125rem] sm:w-[1.25rem] sm:h-[1.25rem]
                         transition-transform duration-250 group-hover:rotate-[135deg]"
                    />
                    <span>Start Chatting</span>
                  </motion.button>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {!loading && sessions.length > 0 && sessions.map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      variants={itemVariants}
                      className="mb-3 sm:mb-4 last:mb-16"
                    >
                      <Link
                        to={`/chat/${s.id}`}
                        className="
                          block p-4 sm:p-5 rounded-2xl group
                          bg-white/[0.03] backdrop-blur-sm ring-1 ring-white/[0.07]
                          hover:bg-white/[0.06] hover:ring-accent/50 
                          focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none
                          shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10
                          transition-all duration-250 ease-out
                        "
                      >
                        <div className="flex items-center gap-x-3 sm:gap-x-4">
                          <div className="
                            flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12
                            rounded-lg flex items-center justify-center
                            bg-accent/10 group-hover:bg-accent/20
                            ring-1 ring-white/5 group-hover:ring-accent/30
                            transition-all duration-250 ease-out
                          ">
                            {/* Icon size controlled by parent div or could use text-lg etc. */}
                            <FiMessageSquare className="text-accent/90 group-hover:text-accent text-lg sm:text-xl 
                                                        transition-colors duration-250" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold truncate text-white 
                                           group-hover:text-accent transition-colors duration-250">
                              {s.title || `Chat from ${formatDate(s.created_at)}`}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-300
                                          transition-colors duration-250">
                              Active: {formatDate(s.updated_at)}
                            </p>
                          </div>

                          {/* This icon was already using responsive w/h classes correctly */}
                          <FiArrowRight className="
                            w-5 h-5 sm:w-6 sm:h-6 text-neutral-500
                            group-hover:text-accent group-hover:translate-x-1
                            group-focus-visible:text-accent group-focus-visible:translate-x-1
                            transition-all duration-250 ease-out
                          " />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </motion.div>
  );
}