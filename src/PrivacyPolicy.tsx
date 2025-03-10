export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Effective as of 2024-12-28</p>

        <div className="mb-8">
          <p>This privacy policy applies to the Nomad Crew app (hereby referred to as "Application") 
          for mobile devices that was created by Naqeebali Shamsi (hereby referred to as "Service Provider") 
          as an Open Source service. This service is intended for use "AS IS".</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Collection and Use</h2>
          <p>The Application collects information when you download and use it. This information may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your device's Internet Protocol address (e.g. IP address)</li>
            <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
            <li>The time spent on the Application</li>
            <li>The operating system you use on your mobile device</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Location Data</h2>
          <p>The Application collects your device's location, which helps the Service Provider:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Geolocation Services:</strong> Provide features such as personalized content, relevant recommendations, and location-based services.</li>
            <li><strong>Analytics and Improvements:</strong> Analyze user behavior, identify trends, and improve the overall performance.</li>
            <li><strong>Third-Party Services:</strong> Periodically transmit anonymized location data to external services for enhancement purposes.</li>
          </ul>
        </section>

        {/* Add all other sections similarly */}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third Party Services</h2>
          <p>The Application uses third-party services that have their own Privacy Policies:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><a href="https://www.google.com/policies/privacy/" className="text-orange-600 hover:text-orange-800">Google Play Services</a></li>
            <li><a href="https://expo.io/privacy" className="text-orange-600 hover:text-orange-800">Expo</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions regarding privacy while using the Application, please contact the Service Provider via email at:</p>
          <a href="mailto:nomadcrew5@gmail.com" className="text-orange-600 hover:text-orange-800">nomadcrew5@gmail.com</a>
        </section>

        <footer className="text-sm text-gray-600 dark:text-gray-400 mt-12 pt-8 border-t">
          <p>Generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" className="text-orange-600 hover:text-orange-800">App Privacy Policy Generator</a></p>
        </footer>
      </div>
    </div>
  );
}