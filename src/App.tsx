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
      <FullscreenVideoPlayer caption='Our Story ️️' videoSrc='https://www.youtube.com/watch?v=-YlgVCyb2yk'/>
      <About />
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
