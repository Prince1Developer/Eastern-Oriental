import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Hero = () => (
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

const WelcomeSection = () => (
  <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-12 bg-background-dark">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Image on Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1"
        >
          <div className="relative rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl">
            <img
              alt="Elegant restaurant interior"
              className="w-full h-auto object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBilD7BYirOvOOoj2w5r3RHH4yuDt9joHbWNm6K9zbS1YOAJlPj8Bjfb3UKu6X9pOyMRDFyzynND5Go_dxcATzXg5eS4D-IOMUQgGPg5x2S72pG-3vPj8VpI9h9RvYzMNtORoKVB_zZ-lLkNyX1B8Yh1SGIci67wnMG_qN_xZO_4Xdq5QkPeseQEpdihTDAnWpGFRes3Dtbrv7beoXEQBlhUTOKWqeUeOOYsZ0cnfOfMm4_OXvnnbhV2DBjhFgYr6Q06dFh29QCQJeJ"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
          </div>
        </motion.div>

        {/* Text Content on Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2 space-y-6 sm:space-y-8"
        >
          <div>
            <span className="text-primary uppercase tracking-widest text-sm font-bold mb-2 block">Welcome</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white italic mb-2">Eastern Oriental</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50"></div>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our mission is to recreate the traditional flavours, fun and enjoyment of an authentic Oriental celebration or gathering.
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Many of our dishes are served family-style, meant to be shared by the entire table. Nothing brings a group closer together than sharing the table experience with friends and guests.
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our combination of contemporary Cantonese dishes and traditional flavors are served in elegant and intimate surroundings.
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our food embodies the cuisine enjoyed for generations in villages throughout the Orient, prepared with passion and served with pride.
          </p>

          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-lg font-bold text-base hover:bg-primary/90 transition-all shadow-lg hover:scale-105"
            >
              Learn More About Us
              <ArrowDown className="w-4 h-4 rotate-270" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeSection />
    </>
  );
}
