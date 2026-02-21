import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Hero = () => (
  <section className="relative min-h-screen pt-20 flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark/60 via-background-dark/40 to-background-dark z-10"></div>
      <img
        alt="Elegant dark restaurant interior"
        className="w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH900AUCPHznVRoiIr-8sUAdbEKo6iOrOtlQxCg2o-i1rQH8ZjXOhqGO4FxSsToa5QSWRRjVQl53UpPFBVoBLwwOktvjN1huBAXNwVn8wWm4jK6_47bFGb3ph7c-t-KQLubCGdRnO94WkznmTxlKjFA8RFWdqlyP9ufGrML6n3_GFZuAPdKlnXwnjILfXhdYr_rnNvnYAwiw2m7uyCG4tG_AaUOIlW5M934_MPGLMhMIMnFx1I2kQsyUePXI-r8R0-qYQ0hpDtYhCV"
        referrerPolicy="no-referrer"
      />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 text-center px-4 max-w-4xl mx-auto"
    >
      <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4 sm:mb-6 drop-shadow-2xl">
        Culinary Excellence <br /><span className="text-primary italic">In Every Bite</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
        Experience a heritage of flavor in a sophisticated atmosphere where traditional techniques meet modern innovation.
      </p>
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
          <Link to="/reservations" className="w-full sm:w-auto bg-primary text-background-dark px-10 py-4 rounded-lg text-lg font-bold hover:scale-105 transition-transform shadow-lg">
            Restaurant Dining
          </Link>
          <a className="w-full sm:w-auto border-2 border-primary text-primary px-10 py-4 rounded-lg text-lg font-bold hover:bg-primary/10 transition-colors" href="#">
            Online Takeaway
          </a>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-4"
        >
          <Link to="/menu" className="text-primary hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase">
            <span>Explore Our Menu</span>
            <ArrowDown className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default Hero;
