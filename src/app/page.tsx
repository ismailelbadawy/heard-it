import Image from "next/image";
import Header from "./components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                Turn Your 
                <span className="text-gray-700"> Voice </span>
                Into Action
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your voice notes into organized key points and actionable tasks instantly. 
                Never lose track of important ideas again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  Start Free Trial
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 hover:shadow-md transition-all duration-200">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-200 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6">
                  <Image
                    src="/tasks.svg"
                    alt="Voice to Tasks Illustration"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              How HeardIt Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes it effortless to capture, organize, and act on your ideas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Record</h3>
              <p className="text-gray-600">
                Simply speak your thoughts, ideas, or meeting notes. Our app captures everything with crystal-clear quality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Analyze</h3>
              <p className="text-gray-600">
                Our AI instantly processes your voice and extracts key points, insights, and important information.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Organize</h3>
              <p className="text-gray-600">
                Get organized task lists and key points that you can easily manage, prioritize, and act upon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Stop Forgetting. Start Achieving.
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Save 2+ Hours Daily</h3>
                    <p className="text-gray-600">Eliminate manual note-taking and organization. Focus on what matters most.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Never Miss Important Tasks</h3>
                    <p className="text-gray-600">AI ensures every actionable item is captured and organized automatically.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">Works Anywhere</h3>
                    <p className="text-gray-600">Record during meetings, commutes, or whenever inspiration strikes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-8 shadow-xl">
              <div className="bg-black rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-4">Try it now!</h3>
                <p className="text-gray-200 mb-6">
                  Experience the magic of voice-to-task conversion in seconds.
                </p>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-200">
                  Start Free Trial →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who never miss an important task again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Start Your Free Trial
            </button>
            <button className="border-2 border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-300 hover:bg-gray-800 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/logo.png"
                  alt="HeardIt Logo"
                  width={32}
                  height={32}
                  className="mr-3 invert-100"
                />
                <h3 className="text-2xl font-bold">HeardIt</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your voice into organized tasks and never miss important actions again.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HeardIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
