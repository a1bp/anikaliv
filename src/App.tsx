import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Heart, Stars, Sparkles, ArrowDown, Quote, Calendar, MapPin, MessageCircle, Gift, User } from 'lucide-react';

export default function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const noPhrases = [
    "No", "Are you sure?", "Really sure??", "Think again!", "Last chance!",
    "Surely not?", "You might regret this!", "Give it another thought!",
    "Are you absolutely sure?", "This could be a mistake!", "Have a heart!",
    "Don't be so cold!", "Change of heart?", "Wouldn't you reconsider?",
    "Is that your final answer?", "You're breaking my heart ;("
  ];

  const handleNoClick = () => {
    setNoCount(noCount + 1);
    // Limit the movement range to avoid glitching off-screen
    const range = 200;
    const x = (Math.random() - 0.5) * range * 2;
    const y = (Math.random() - 0.5) * range * 2;
    setNoButtonPos({ x, y });
  };

  const handleYesClick = async () => {
    setYesPressed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: 'yes' }),
      });
    } catch (err) {
      console.error('Failed to send response', err);
    }
  };

  const getNoButtonText = () => noPhrases[Math.min(noCount, noPhrases.length - 1)];
  const yesButtonSize = noCount * 8 + 24; // Much faster scaling

  return (
    <div className="min-h-screen bg-[#080505] text-white font-body selection:bg-pink-500/50 overflow-x-hidden">
      {/* Immersive Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <img 
            src="https://i.postimg.cc/8k4bn1j1/Chat-GPT-Image-Mar-22-2026-08-57-24-AM.png" 
            className="w-full h-full object-cover opacity-30"
            alt="Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080505] via-transparent to-[#080505]" />
        </motion.div>
        
        {/* Floating Hearts */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: '110vh' }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: ['110vh', '-10vh'],
              x: (Math.random() * 100) + 'vw',
            }}
            transition={{ 
              duration: 20 + Math.random() * 15, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute text-pink-500/20"
          >
            <Heart size={Math.random() * 20 + 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-pink-500/50 origin-left z-50"
        style={{ scaleX: scaleProgress }}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl border-2 border-pink-500/30 overflow-hidden bg-pink-500/5 backdrop-blur-md shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <img 
                  src="https://mc-heads.net/avatar/coliste/100" 
                  alt="Minecraft Skin" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="px-6 py-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-pink-400 text-sm uppercase tracking-[0.4em] font-black">
                For You
              </span>
            </div>
          </motion.div>
          <h1 className="font-display font-black text-5xl md:text-8xl text-white mb-8 leading-tight tracking-tighter uppercase">
            Hey <span className="text-pink-500">Love</span>
          </h1>
          <p className="font-body text-xl md:text-4xl text-white/60 max-w-4xl mx-auto mb-16 leading-relaxed">
            I built this just for you. Every pixel, every line of code, and every heartbeat is yours.
          </p>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-4 text-white/30"
          >
            <ArrowDown size={48} />
          </motion.div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="relative py-48 px-4 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter">Our <span className="text-pink-500">Story</span></h2>
              <p className="text-xl md:text-3xl text-white/60 leading-relaxed">
                From the moment we met, everything changed. You're not just a person to me; you're my favorite place to go when my mind searches for peace.
              </p>
              <p className="text-lg md:text-2xl text-white/40 leading-relaxed italic">
                "I still wanted to hear your voice in my life for once... when you sent me those pictures, I thought it was two different people because I didn't know better lol :&lt;"
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-pink-500/30 transition-all duration-500">
                <Calendar className="text-pink-500 mb-4" size={32} />
                <h3 className="font-display font-black text-2xl uppercase mb-2">The Beginning</h3>
                <p className="text-sm text-white/40">Where our hearts first aligned.</p>
              </div>
              <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-pink-500/30 transition-all duration-500">
                <MapPin className="text-pink-500 mb-4" size={32} />
                <h3 className="font-display font-black text-2xl uppercase mb-2">The Journey</h3>
                <p className="text-sm text-white/40">Every step led me to you.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden border-2 border-white/10 group shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Love"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080505] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-12 left-12 right-12">
              <Quote className="text-pink-500 mb-4" size={48} fill="currentColor" />
              <p className="text-4xl font-script text-white">"You are the best thing that ever happened to me."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section className="relative py-48 bg-white/[0.01] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-32">
            <h2 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter mb-6">Why <span className="text-pink-500">You?</span></h2>
            <p className="text-white/40 text-sm uppercase tracking-[0.6em]">Because you're one in a billion.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Stars, title: "Your Aura", desc: "You bring light to every room you enter." },
              { icon: Sparkles, title: "Your Soul", desc: "The most beautiful thing I've ever known." },
              { icon: Heart, title: "Your Love", desc: "The only thing I ever want to keep." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-6"
              >
                <div className="w-32 h-32 rounded-[2rem] bg-pink-500/5 border border-pink-500/20 flex items-center justify-center mx-auto group hover:bg-pink-500 transition-all duration-700">
                  <item.icon className="text-pink-500 group-hover:text-white transition-colors" size={48} />
                </div>
                <h3 className="font-display font-black text-3xl uppercase">{item.title}</h3>
                <p className="text-lg text-white/50 leading-relaxed max-w-[300px] mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Proposal Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
        <AnimatePresence mode="wait">
          {!yesPressed ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center max-w-5xl w-full p-8 md:p-20 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-16 inline-block relative"
              >
                <div className="w-48 h-72 rounded-3xl border-2 border-pink-500/40 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.3)] bg-white/5">
                  <img 
                    src="https://mc-heads.net/body/coliste/right" 
                    alt="Minecraft Skin Full" 
                    className="w-full h-full object-contain p-4"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-pink-500 p-4 rounded-2xl shadow-2xl">
                  <Heart size={32} fill="white" className="text-white" />
                </div>
              </motion.div>
              
              <h2 className="font-display font-black text-4xl md:text-7xl text-white mb-20 leading-tight tracking-tighter uppercase break-words">
                Will you be my <span className="text-pink-500">Girlfriend?</span>
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 min-h-[60vh] relative w-full">
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: "0 0 60px rgba(236,72,153,0.6)",
                    backgroundColor: "#ec4899"
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYesClick}
                  style={{ 
                    fontSize: `${Math.min(yesButtonSize, 150)}px`,
                    padding: `${Math.max(1.5, yesButtonSize / 40)}rem ${Math.max(3, yesButtonSize / 20)}rem`
                  }}
                  className="relative group bg-white text-black font-display font-black rounded-3xl shadow-2xl transition-all z-20 uppercase tracking-tighter overflow-hidden flex-shrink-0 flex items-center justify-center min-w-max"
                >
                  <span className="relative z-10">Yes</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                </motion.button>

                <motion.button
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onMouseEnter={handleNoClick}
                  onClick={handleNoClick}
                  className="bg-white/5 hover:bg-white/10 text-white/50 font-display font-black py-8 px-24 rounded-3xl backdrop-blur-xl transition-all whitespace-nowrap border border-white/20 uppercase tracking-[0.4em] text-sm hover:text-white hover:border-white/40 flex-shrink-0"
                >
                  {getNoButtonText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-24 md:p-48 rounded-[5rem] bg-pink-500 text-white shadow-[0_0_80px_rgba(236,72,153,0.5)]"
            >
              <div className="mb-16">
                <div className="w-64 h-64 mx-auto rounded-full border-8 border-white overflow-hidden shadow-2xl">
                  <img 
                    src="https://mc-heads.net/avatar/coliste/200" 
                    alt="Happy Skin" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h2 className="font-display font-black text-5xl md:text-8xl mb-8 uppercase tracking-tighter">
                YAYYY! ❤️
              </h2>
              <p className="font-body text-2xl md:text-5xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                You just made me the luckiest person in the universe. I love you so much!
              </p>
              
              <div className="mt-24 flex justify-center gap-16">
                <Sparkles className="animate-pulse" size={64} />
                <Stars className="animate-bounce" size={64} />
                <Sparkles className="animate-pulse" size={64} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="py-20 text-center text-white/10 font-display font-bold text-xs tracking-[1em] uppercase">
        Forever & Always • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
