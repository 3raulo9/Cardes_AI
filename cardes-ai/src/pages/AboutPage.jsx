import React from "react";
import { motion } from "framer-motion";
// Replace these with the actual paths to your images
// Import your images
import firstImage from "../static/images/firstimage.jpg";
import secondImage from "../static/images/secondImage.png";
import thirdImage from "../static/images/thirdImage.jpg";
import Footer from "../components/Footer"; // Adjust the path as needed
import Header from "../components/Header"; // Extracted header component

const AboutPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-primary to-accent text-white flex flex-col relative">
      <Header />

        {/* Spacer to account for the fixed header */}
        <div className="h-10 sm:h-10 md:h-13"></div>

        {/** ABOUT / ORIGIN SECTIONS */}
        
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-darkAccent text-white">
        <div className="h-10 sm:h-10 md:h-13"></div>

          {/** Reversed wave on top */}
          <div className="pointer-events-none absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 -mt-px">
            <svg
              className="relative block w-full h-14 sm:h-20 md:h-32"
              viewBox="0 0 120 28"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 C40,40 80,0 120,20 L120,30 L0,30 Z"
                fill="currentColor"
                className="text-darkAccent"
              />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-center">
            How This Website Came to Life
          </h2>

          {/** 1st Block (Image left, Text right) */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 flex justify-center"
            >
              <img
                src={firstImage}
                alt="Raul the Dev and Language Learner"
                className="w-full max-w-sm h-auto rounded shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Meet Raul Asadov
              </h3>
              <p className="text-gray-200 leading-relaxed">
                From the time I first discovered the beauty of foreign scripts
                and sounds, I felt an insatiable hunger to learn new languages.
                Nothing brings me more joy than exploring how people communicate
                around the globe and how words shape our thoughts. Over the
                years, I envisioned a single hub that could combine{" "}
                <strong>personalized flashcards</strong>, harness the power of{" "}
                <strong>AI-driven learning</strong>, and provide incredibly{" "}
                <strong>natural text-to-speech</strong> capabilities. My goal
                has always been to make language acquisition an exciting,
                dynamic, and downright magical experience. With AI-generated
                decks tailored to each learner’s specific needs, we’re diving
                into a future where every user can progress at their own pace,
                guided by advanced technology that understands and adapts to
                them. And the best part? We’re just getting started—soon, we’ll
                be rolling out <em>AI-generated courses</em> that use your
                level, interests, and goals to create a truly one-of-a-kind
                journey!
              </p>
            </motion.div>
          </div>

          {/** 2nd Block (Text left, Image right) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 flex justify-center"
            >
              <img
                src={secondImage}
                alt="Raul's Developer Experience"
                className="w-full max-w-sm h-auto rounded transition-transform transform hover:-translate-y-1"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                5+ Years of Dev Expertise
              </h3>
              <p className="text-gray-200 leading-relaxed">
                Crafting user-centric applications and pushing creative
                boundaries has been my calling throughout my 5+ years in
                software development. My formal journey took off with two
                immersive years at John Brice Bootcamp, where I dove headfirst
                into front-end design, back-end architecture, databases,
                APIs—you name it. Picking up multiple programming languages
                along the way, I’ve always believed in the power of merging
                clean code with an engaging user experience. Every project I
                tackle aims to bridge the gap between people and technology.
                Seeing real users benefit from what I build—the very tools that
                simplify and enrich their daily lives—is, in my mind, the best
                reward a developer could ask for!
              </p>
            </motion.div>
          </div>

          {/** 3rd Block (Image left, Text right) */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 flex justify-center"
            >
              <img
                src={thirdImage}
                alt="How Yazyk was born"
                className="w-full max-w-sm h-auto rounded shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                The Birth of Yazyk
              </h3>
              <p className="text-gray-200 leading-relaxed">
                During my second year at John Brice, the gears really started
                turning—I wanted to build a space that fulfilled a growing need:
                an all-in-one tool for mastering new languages. That’s how
                “Yazyk” came to be, a name drawn from a Slavic word meaning
                “tongue.” It’s a nod to both the anatomical part of our speech
                mechanism and the linguistic diversity we aim to celebrate. In
                honor of my very first orange cat, our adorable mascot embodies
                the spirit of curiosity, warmth, and a playful approach to
                learning. My hope is that, as you explore Yazyk, you’ll feel
                just as excited discovering new expressions and cultures as I
                did while creating this platform. Here’s to a vibrant community
                of learners who continue pushing the boundaries of language
                study—together, we’ll write the next chapter in the global
                conversation!
              </p>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
