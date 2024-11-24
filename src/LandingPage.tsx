import { ArrowRight, Users, MessageSquareShare, Receipt, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-orange-500 transition-shadow hover:shadow-lg">NomadCrew</div>
          <a href="#waitlist" className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
            Join Waitlist <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Group Travel, <span className="text-orange-500">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Say goodbye to scattered WhatsApp groups and hello to seamless travel coordination. One app for locations, expenses, and plans.
          </p>
          <a 
            href="#waitlist"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Get Early Access <ArrowRight />
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Users className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Group Coordination</h3>
              <p className="text-gray-600">Keep everyone on the same page with real-time updates and shared itineraries</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <MessageSquareShare className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Live Location Sharing</h3>
              <p className="text-gray-600">Never lose track of your group with private, secure location sharing</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <Receipt className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
              <p className="text-gray-600">Split costs fairly and keep track of group expenses effortlessly</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
              <MapPin className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trip Planning</h3>
              <p className="text-gray-600">Create and share travel plans, destinations, and meeting points</p>
            </div>
          </div>
        </div>
      </div>


      {/* Waitlist Section */}
      <div id="waitlist" className="py-16 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Waitlist</h2>
          <p className="text-gray-600 mb-8">
            Be among the first to experience a better way to travel together. Get early access and exclusive updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Join Now
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 NomadCrew. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
