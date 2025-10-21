import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      setScrollProgress((prev) => {
        const delta = e.deltaY > 0 ? 0.3 : -0.3;
        return Math.max(0, Math.min(7.5, prev + delta));
      });
    };

    if (scrollProgress >= 1.5 && scrollProgress < 3) {
      setCurrentFeature(0);
    } else if (scrollProgress >= 3 && scrollProgress < 4.5) {
      setCurrentFeature(1);
    } else if (scrollProgress >= 4.5 && scrollProgress < 6) {
      setCurrentFeature(2);
    } else if (scrollProgress >= 6) {
      setCurrentFeature(3);
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollProgress]);

  const loginScale = scrollProgress >= 1 ? 0.25 : scrollProgress >= 0.3 ? 1 - (scrollProgress - 0.3) * 1.07 : 1;
  const loginTranslateY = scrollProgress >= 1 ? -42 : scrollProgress >= 0.3 ? -(scrollProgress - 0.3) * 60 : 0;
  const cardOpacity = scrollProgress >= 1.5 ? 0 : scrollProgress >= 1 ? 1 - (scrollProgress - 1) * 2 : 1;
  const buttonOpacity = scrollProgress >= 1.5 ? 1 : scrollProgress >= 1 ? (scrollProgress - 1) * 2 : 0;
  const featuresOpacity = scrollProgress >= 1.5 ? 1 : scrollProgress >= 1.3 ? (scrollProgress - 1.3) * 5 : 0;
  const featuresVisible = scrollProgress >= 1;

  return (
    <main className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className=" bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Careers Platform
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          {/* Hero Card - Shrinks and moves up, then fades out */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out z-10"
            style={{
              transform: `translateY(${loginTranslateY}%) scale(${loginScale})`,
              opacity: cardOpacity,
              pointerEvents: cardOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <Link to="/signup" className="max-w-4xl mx-auto text-center block">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Your Company's
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Careers Page
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Customize your branded careers page, manage job listings, and attract top talent.
              </p>
              <div className="w-96 mx-auto">
                <div className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:lue-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full"></div>
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Get Started Free</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Create your company's careers page in minutes. No credit card required.
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-semibold text-lg group-hover:gap-3 gap-2 transition-all">
                      <span>Create Your Careers Page</span>
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Button - fades in at top as card fades out */}
          <div
            className="absolute top-20 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out z-20"
            style={{
              opacity: buttonOpacity,
              pointerEvents: buttonOpacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-5 group cursor-pointer"
            >
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Sign Up Free</span>
            </Link>
          </div>

          {/* Features Carousel */}
          {featuresVisible && (
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
              style={{ opacity: featuresOpacity }}
            >
              <div className="max-w-4xl mx-auto w-240 px-8 relative">
                <div className="relative h-[280px]">
                  {/* Feature 1 */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      currentFeature === 0
                        ? 'translate-x-0 opacity-100'
                        : currentFeature > 0
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-8 shadow-2xl h-full flex items-center">
                      <div className="flex items-start gap-6 w-full">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">Fully Customizable</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            Brand your careers page with custom colors, logos, and content sections. Clean, modern UI that candidates love. Setup takes minutes, not hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      currentFeature === 1
                        ? 'translate-x-0 opacity-100'
                        : currentFeature > 1
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-8 shadow-2xl h-full flex items-center">
                      <div className="flex items-start gap-6 w-full">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">90% Complete Applications</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            Streamlined application process collects all data in minimum steps. Smart forms reduce drop-offs. Get quality candidates who actually finish applying.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      currentFeature === 2
                        ? 'translate-x-0 opacity-100'
                        : currentFeature > 2
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-8 shadow-2xl h-full flex items-center">
                      <div className="flex items-start gap-6 w-full">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">SEO Optimized for Recruiters</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            Your jobs appear in Google's job search results automatically. Built-in structured data and meta tags drive organic traffic. More visibility means more applicants.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      currentFeature === 3
                        ? 'translate-x-0 opacity-100'
                        : currentFeature > 3
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-8 shadow-2xl h-full flex items-center">
                      <div className="flex items-start gap-6 w-full">
                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">Live in Minutes</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            Get your careers page live in minutes, not days. No technical setup required. Add your branding, post jobs, and start receiving applications immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentFeature === index ? 'w-12 bg-blue-600' : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scroll Hint */}
          {scrollProgress === 0 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600 text-xs">
            <p>© 2025 Careers Platform • Scroll to explore features</p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Landing;
