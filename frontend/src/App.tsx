import React, { useState, useEffect } from 'react';
import { 
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Music,
  Mail,
  Sun,
  Moon,
  Code,
  Briefcase,
  Menu,
  X,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayer from './components/MusicPlayer';
import DesktopMusicPlayer from './components/DesktopMusicPlayer';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentPage, setCurrentPage] = useState<'home' | 'projects'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null); // For underline animation

  // Function to handle play/pause that automatically pauses other player
  const handleGlobalPlayPause = (playerType: 'mobile' | 'desktop') => {
    if (playerType === 'mobile') {
      setIsPlaying(false); // Pause desktop player
    } else {
      setIsPlaying(!isPlaying);
      if (isPlaying) { // Dispatch event only if desktop player is actually playing
        window.dispatchEvent(new CustomEvent('desktopPlayerStart'));
      }
    }
  };

  // Function to handle page changes and track visited pages
  const handlePageChange = (page: 'home' | 'projects') => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Initialize real playlist from Cloudinary (same as MusicPlayer)
  useEffect(() => {
    const loadMusicFromCloudinary = async () => {
      try {
        // Your uploaded songs with Cloudinary URLs (same as MusicPlayer)
        const allSongs = [
          { title: "New Home (Slowed)", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418684/x7uiq0a0ztuqxnzkp6yl.mp3", filename: "New_Home_Slowed.mp3" },
          { title: "City Of Stars", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418705/pcxirwogzl1mhjwqmvec.mp3", filename: "City_Of_Stars.mp3" },
          { title: "Wind Song", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418732/tgsyhwm230uje0mv6hb0.mp3", filename: "Wind_Song.mp3" },
          { title: "Amore mio aiutami", artist: "Italian", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418751/hrqvt1a9esa6dszgzb1x.mp3", filename: "Amore_mio_aiutami.mp3" },
          { title: "Shingeki", artist: "Anime", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418772/v4dbyere7wzefpfh91ti.mp3", filename: "Shingeki.mp3" },
          { title: "Armstrong Cabin", artist: "Gaming", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418786/qbg3rahkx81ducrhpvmj.mp3", filename: "Armstrong_Cabin.mp3" },
          { title: "The Last of Us (Astray)", artist: "Gaming", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418847/g5wczzpslsd8phclmkr1.mp3", filename: "The_Last_of_Us_Astray.mp3" },
          { title: "Engagement Party", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418865/iuxpolgwhg2dcsi5b4b3.mp3", filename: "Engagement_Party.mp3" },
          { title: "Only", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419102/gasvwb1s6rzwkvg2xljy.mp3", filename: "Only.mp3" },
          { title: "Dolce Nonna", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419127/zscxnqkfiqzg0nv7gxkq.mp3", filename: "Dolce_Nonna.mp3" },
          { title: "Little Waltz", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419146/plqh2il8lgjkgyca6myo.mp3", filename: "Little_Waltz.mp3" },
          { title: "Nocturnal", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419169/rwlmkynathwsmgpgpiqg.mp3", filename: "Nocturnal.mp3" },
          { title: "Unshaken", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419192/wlkmuwkzzjyamdfbpbnj.mp3", filename: "Unshaken.mp3" },
          { title: "NEXT!", artist: "NCTS", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755445587/hy73ehsvspit7nleqfje.mp3", filename: "Unshaken.mp3" },
          { title: "Montagem Rugada", artist: "JXNDRO, Sayfalse, and cape", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1768565680/w8kcnf6atn6ka5hgegpp.mp3", filename: "Unshaken.mp3" }
        ];
        
        const availableSongs = allSongs.filter(song => song.url !== "");
        
        if (availableSongs.length > 0) {
          setPlaylist(availableSongs);
          const randomIndex = Math.floor(Math.random() * availableSongs.length);
          setCurrentTrack(randomIndex);
          console.log(`Loaded ${availableSongs.length} tracks from Cloudinary`);
        } else {
          console.log('No music files found');
        }
      } catch (error) {
        console.error('Error loading music:', error);
      }
    };

    loadMusicFromCloudinary();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/notlevi911' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/soubhagya-sadhukhan-910330270/' },
    { icon: Twitter, label: 'Twitter', url: 'https://x.com/Soubhag24825728' },
    { icon: MessageCircle, label: 'Discord', url: 'https://discord.com/users/506085467884879873' },
    { icon: Music, label: 'Spotify', url: 'https://open.spotify.com/user/c8p45jacg41ya71opu8dfcirh?si=b965c45235224bae' },
    { icon: Mail, label: 'Email', url: 'mailto:soubhagyasadhukhan@gmail.com' },
  ];

  const projects = [
    {
      title: "Avacado",
      description: "A privacy-focused cryptocurrency wallet that enables users to deposit, withdraw, and transfer funds privately. Built with zero-knowledge proofs (zk-SNARKs) and DeFi integration, Avacado ensures transaction privacy while maintaining security and decentralization.",
      tech: ["Web3", "ZK-Proofs", "DeFi", "Privacy",],
      github: "https://github.com/notlevi911/inkei",
      live: null
    },
    {
      title: "Inkei - AI-Powered Project Management",
      description: "Built during the Aignite Hackathon at Heritage College, Inkei is a Jira-inspired project management system powered by AI. Just describe what you want to build, and the chatbot breaks it down into a structured plan with story points. Features include real-time chat, JWT-based authentication, and a clean UI for managing tasks collaboratively.",
      tech: ["React", "AI Integration", "JWT", "Real-time Chat", "Project Management"],
      github: "https://github.com/notlevi911/inkei",
      live: null
    },
    {
      title: "PromptPilot",
      description: "A GPT-style chat platform that adds Git-like version control to prompt engineering. Save conversation snapshots as commits, view and navigate commit history, and roll back to earlier points when needed. Makes experimenting with prompts easier, reproducible, and more organized.",
      tech: ["React", "Version Control", "GPT Integration", "Chat Interface", "Prompt Engineering"],
      github: "https://github.com/notlevi911/leet-bot",
      live: null
    }
  ];

  const experience = [
    {
      title: "Full-Stack Developer Intern",
      company: "Oodser Technologies",
      location: "Rwanda",
      duration: "March 2024 - August 2024",
      description: [
        "Built and maintained scalable applications using MERN stack (React, Node.js, Express, MongoDB)",
        "Improved frontend load time by 25% and reduced API latency by 30%",
        "Integrated UI features and APIs, boosting team productivity by 40%",
        "Worked with CI/CD pipelines and agile, cross-timezone collaboration"
      ]
    }
  ];

  const achievements = [
    {
      title: "3rd Place - 1inch Track",
      event: "ETHGlobal New Delhi",
      description: "Won 3rd place in the 1inch track at ETHGlobal New Delhi hackathon, competing against teams from around the world."
    },
    {
      title: "1st Place Winner",
      event: "Avalanche Team 1 Hackathon",
      description: "Secured 1st place in the Avalanche Team 1 hackathon, demonstrating excellence in blockchain development and innovation."
    }
  ];

  return (
    <motion.div 
      className="h-screen bg-amber-50 dark:bg-neutral-800 text-gray-800 dark:text-white overflow-hidden"
      initial={false}
      animate={{
        backgroundColor: theme === 'light' ? '#fef3c7' : '#262626',
        color: theme === 'light' ? '#1f2937' : '#ffffff'
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Navigation */}
      <motion.nav 
        className="h-16 fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="max-w-6xl mx-auto px-6 h-full"
          initial={false}
          animate={{
            backgroundColor: theme === 'light' ? '#fef3c7' : '#262626'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex justify-between items-center h-full">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="text-xl font-semibold text-gray-800 dark:text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                soubhagya
              </motion.div>
              <motion.button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={() => handlePageChange('home')}
                onHoverStart={() => setHoveredNav('home')}
                onHoverEnd={() => setHoveredNav(null)}
                className={`text-sm transition-colors relative pb-1 ${
                  currentPage === 'home' 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Home
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-px bg-gray-800 dark:bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredNav === 'home' ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                />
              </motion.button>
              <motion.button
                onClick={() => handlePageChange('projects')}
                onHoverStart={() => setHoveredNav('projects')}
                onHoverEnd={() => setHoveredNav(null)}
                className={`text-sm transition-colors relative pb-1 ${
                  currentPage === 'projects' 
                    ? 'text-gray-800 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Projects
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-px bg-gray-800 dark:bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredNav === 'projects' ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                />
              </motion.button>
              <motion.a
                href="/Resume (1).pdf"
                target="_blank"
                rel="noopener noreferrer"
                onHoverStart={() => setHoveredNav('cv')}
                onHoverEnd={() => setHoveredNav(null)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors relative pb-1"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                CV
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-px bg-gray-800 dark:bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredNav === 'cv' ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ originX: 0 }}
                />
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-amber-50 dark:bg-neutral-800 border-t border-amber-200/50 dark:border-neutral-700/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex flex-col p-6 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <motion.button
                    onClick={() => handlePageChange('home')}
                    className={`text-base transition-colors text-left ${
                      currentPage === 'home' 
                        ? 'text-gray-800 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                    }`}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Home
                  </motion.button>
                  <motion.button
                    onClick={() => handlePageChange('projects')}
                    className={`text-base transition-colors text-left ${
                      currentPage === 'projects' 
                        ? 'text-gray-800 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                    }`}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Projects
                  </motion.button>
                  <motion.a
                    href="/Resume (1).pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    onHoverStart={() => setHoveredNav('cv-mobile')}
                    onHoverEnd={() => setHoveredNav(null)}
                    className="text-base text-left text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors relative pb-1"
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    CV
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-px bg-gray-800 dark:bg-white rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredNav === 'cv-mobile' ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ originX: 0 }}
                    />
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>

      {/* Main Content */}
      <motion.div 
        className="h-[calc(100vh-4rem)] overflow-y-auto pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {currentPage === 'home' ? (
          /* Home Page */
          <motion.div 
            className="min-h-[90%] flex flex-col md:flex-row justify-center items-start md:items-center px-4 md:px-8 md:py-0 pb-20 md:pb-0 pt-4 md:pt-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Left Side - Introduction */}
            <motion.div 
              className="flex-1 max-w-2xl md:pr-24 mb-8 md:mb-0"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-white"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                hello,
              </motion.h1>
              
              <motion.div 
                className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 dark:text-gray-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <motion.p 
                  className="leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                I'm just a developer trying to figure out what really clicks with me.
                currently in my 3rd year of b.tech.
                </motion.p>
                <motion.p 
                  className="leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                I tinker with full-stack stuff, devops, and lately web3 and genAI (still learning the ropes).
                outside of coding, I fall into gacha games (trying to keep it under control ehe)
                </motion.p>
                <motion.p 
                  className="leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                and I enjoy watching anime when I want to switch off.                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right Side - Social Links Box */}
            <motion.div 
              className="w-full md:w-80 px-2 md:px-0"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.div 
                className="bg-amber-100/50 dark:bg-neutral-700/50 p-4 md:p-6 rounded-3xl backdrop-blur-sm border border-black/20 dark:border-neutral-600/50"
                initial={false}
                animate={{
                  backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.5)' : 'rgba(38, 38, 38, 0.5)',
                  borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(82, 82, 82, 0.5)'
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col md:flex-row items-center md:space-x-3 p-2 md:p-3 rounded-2xl border text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200 group"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.8)' : 'rgba(82, 82, 82, 0.8)',
                        borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(107, 114, 128, 0.5)'
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <link.icon size={18} className="group-hover:scale-110 transition-transform duration-200 mb-1 md:mb-0" />
                      <span className="text-xs md:text-sm font-medium text-center">{link.label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* Projects Page */
          <motion.div 
            className="h-full p-4 md:p-12 pb-20 md:pb-12 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800 dark:text-white"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Projects & Experience
              </motion.h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Projects Section */}
                <motion.div 
                  className="space-y-6"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.h2 
                    className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-white flex items-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Code className="mr-2" size={24} />
                    Projects
                  </motion.h2>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <motion.div 
                        key={index} 
                        className="p-4 md:p-6 rounded-xl border"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.8)' : 'rgba(38, 38, 38, 0.5)',
                          borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(82, 82, 82, 0.5)'
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tech.map((tech) => (
                            <motion.span
                              key={tech}
                              className="px-2 py-1 text-xs rounded-lg border"
                              initial={false}
                              animate={{
                                backgroundColor: theme === 'light' ? 'rgba(253, 230, 138, 0.8)' : 'rgba(82, 82, 82, 0.5)',
                                color: theme === 'light' ? '#92400e' : '#d1d5db',
                                borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(107, 114, 128, 0.5)'
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-700 dark:text-amber-400 hover:underline"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          View on GitHub →
                        </motion.a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Experience Section */}
                <motion.div 
                  className="space-y-6"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <motion.h2 
                    className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-white flex items-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Briefcase className="mr-2" size={24} />
                    Experience
                  </motion.h2>
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <motion.div 
                        key={index} 
                        className="p-4 md:p-6 rounded-xl border"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ 
                          y: 0, 
                          opacity: 1,
                          backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.8)' : 'rgba(38, 38, 38, 0.5)',
                          borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(82, 82, 82, 0.5)'
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {exp.company}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                          {exp.duration}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.description.map((desc, i) => (
                            <span key={i}>
                              {desc}
                              {i < exp.description.length - 1 ? <br /> : ''}
                            </span>
                          ))}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Achievements Section */}
                  <motion.div 
                    className="mt-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <motion.h2 
                      className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-white flex items-center"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Trophy className="mr-2" size={24} />
                      Achievements
                    </motion.h2>
                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <motion.div 
                          key={index} 
                          className="p-4 md:p-6 rounded-xl border"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ 
                            y: 0, 
                            opacity: 1,
                            backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.8)' : 'rgba(38, 38, 38, 0.5)',
                            borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(82, 82, 82, 0.5)'
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                            {achievement.event}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Music Player */}
      <MusicPlayer isVisible={true} theme={theme} />

      {/* Desktop Music Player */}
      <DesktopMusicPlayer
        isVisible={true}
        isMinimized={isMinimized}
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        playlist={playlist}
        volume={volume}
        isMuted={isMuted}
        isShuffled={isShuffled}
        isRepeating={isRepeating}
        loadingTrack={null}
        theme={theme}
        onToggle={() => setIsMinimized(!isMinimized)}
        onClose={() => setIsMinimized(true)}
        onPlay={() => handleGlobalPlayPause('desktop')}
        onPrevious={() => setCurrentTrack(prev => (prev - 1 + playlist.length) % playlist.length)}
        onNext={() => setCurrentTrack(prev => (prev + 1) % playlist.length)}
        onShuffle={() => setIsShuffled(!isShuffled)}
        onRepeat={() => setIsRepeating(!isRepeating)}
        onMute={() => setIsMuted(!isMuted)}
        onIncreaseVolume={() => setVolume(prev => Math.min(1, prev + 0.1))}
        onDecreaseVolume={() => setVolume(prev => Math.max(0, prev - 0.1))}
      />
    </motion.div>
  );
};

export default App;
