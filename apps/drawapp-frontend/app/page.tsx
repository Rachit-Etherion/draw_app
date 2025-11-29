import { Pencil, Zap, Share2, Layers, Download, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Pencil className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">DrawFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
                Sketch Your Ideas
                <span className="block text-blue-600 mt-2">Into Reality</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                A powerful, intuitive drawing tool for creating diagrams, wireframes, and visual concepts.
                Collaborate in real-time and bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={"/signin"}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl" >
                    Sign In
                  </button>
                </Link>
                <Link href={"/signup"}>
                  <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 border-slate-200 hover:border-slate-300">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-20">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Layers className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Canvas Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
              <p className="text-xl text-slate-600">Powerful features for creative minds</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 leading-relaxed">
                  Instant rendering and smooth interactions. No lag, just pure creative flow.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Collaboration</h3>
                <p className="text-slate-600 leading-relaxed">
                  Work together with your team. See changes instantly as they happen.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center mb-6">
                  <Share2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Easy Sharing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Share your work with a link. Export to PNG, SVG, or JSON formats.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Download className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Multiple Export Options</h3>
                <p className="text-slate-600 leading-relaxed">
                  Download your drawings in various formats for any use case.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Layer Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  Organize complex drawings with intuitive layer controls and grouping.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-slate-200 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <Pencil className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Infinite Canvas</h3>
                <p className="text-slate-600 leading-relaxed">
                  Never run out of space. Pan and zoom freely across unlimited space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Creating?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators, designers, and teams using DrawFlow every day.
            </p>
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              Get Started Now
            </button>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Pencil className="w-6 h-6 text-blue-500" />
                  <span className="text-xl font-bold text-white">DrawFlow</span>
                </div>
                <p className="text-sm">
                  The modern drawing tool for everyone.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-sm text-center">
              <p>&copy; 2024 DrawFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
