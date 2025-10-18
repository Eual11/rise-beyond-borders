import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Hub from './components/Hub';
import Impact from './components/Impact';
import Partnerships from './components/Partnerships';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FullscreenVideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {
         <Header />
      //      <PixelHeroPage/>
    }

      <Hero />
      <About />
      <FullscreenVideoPlayer caption='Our Story ️️' videoSrc='https://youtu.be/b21RG0JmA4I?si=TtLVdsyBnV8deqjv'/>
      <Programs />
      <Hub />
      <Impact />
      <Partnerships />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
