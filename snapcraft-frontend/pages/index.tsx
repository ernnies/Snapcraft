import Link from "next/link";

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-semibold text-blue-700">FlowSnap</div>
          <div className="space-x-6">
            <Link href="/features" className="text-blue-600 hover:text-gold-500 transition duration-300">
              Features
            </Link>
            <Link href="/create" className="text-blue-600 hover:text-gold-500 transition duration-300">
              Create
            </Link>
            <Link href="/connect" className="text-blue-600 hover:text-gold-500 transition duration-300">
              Connect Wallet
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-100 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to FlowSnap</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-700">
            A no-code DeFi automation app built on Aleo&apos;s decentralized
            blockchain, empowering users with AI-driven trading workflows.
          </p>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {/* What it does */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">What it does</h2>
              <p className="text-base text-gray-700">
                FlowSnap is a no-code, drag-and-drop DeFi automation app built on
                Aleo&apos;s decentralized blockchain. It empowers users to
                craft sophisticated crypto trading and DeFi workflows
                effortlessly, leveraging AI-driven analytics, real-time market
                data, and secure onchain execution to optimize strategies like
                yield farming, arbitrage, and automated swaps.
              </p>
            </div>

            {/* The problem it solves */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">The problem it solves</h2>
              <p className="text-base text-gray-700">
                Traditional DeFi platforms require coding expertise, high costs,
                and centralized AI, limiting accessibility and transparency.
                FlowSnap eliminates these barriers by offering a user-friendly
                interface, affordable decentralized AI via 0G Compute, and
                verifiable onchain workflows, making advanced financial
                automation a public good for all crypto enthusiasts.
              </p>
            </div>

            {/* Challenges I ran into */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Challenges I ran into</h2>
              <p className="text-base text-gray-700">Nothing serious for now</p>
            </div>

            {/* Technologies I used */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">Technologies I used</h2>
              <ul className="text-base text-gray-700 list-disc pl-6 space-y-2">
                <li>Next.js: For a fast, scalable front-end with dynamic routing.</li>
                <li>TypeScript: To ensure type-safe, maintainable code.</li>
                <li>Tailwind CSS: For a responsive, customizable drag-and-drop interface.</li>
                <li>
                  Aleo&apos;s Blockchain Services: Chain for smart contracts, Compute for
                  AI, Storage for data, and DA for scalability.
                </li>
                <li>IPFS: For decentralized asset storage (e.g., workflow visuals).</li>
              </ul>
            </div>

            {/* How we built it */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">How we built it</h2>
              <p className="text-base text-gray-700">
                We started with a prototype using Next.js and Tailwind CSS to
                design an intuitive drag-and-drop interface. Smart contracts were
                developed and deployed on Aleo Chain to handle workflow execution.
                0G Compute powered AI models for market analysis, while 0G
                Storage secured user data. Iterative UI/UX refinements and
                subgraph integration for data querying completed the platform,
                with real-time analytics tied to 0G DA for scalability.
              </p>
            </div>

            {/* What we learned */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">What we learned</h2>
              <p className="text-base text-gray-700">
                We gained deep insights into Aleo&apos;s modular architecture, mastering
                the synergy of its Chain, Compute, and Storage layers. Balancing
                AI accuracy with blockchain constraints taught us optimization
                techniques, and user feedback highlighted the need for simpler
                onboarding. Collaboration across AI and blockchain domains also
                sharpened our interdisciplinary skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-center text-white">
        <div className="space-x-6">
          <Link href="/documentation" className="hover:text-gold-300">
            Documentation
          </Link>
          <Link href="/privacy-policy" className="hover:text-gold-300">
            Privacy Policy
          </Link>
          <Link href="/faq" className="hover:text-gold-300">
            FAQ
          </Link>
        </div>
        <p className="mt-2 text-sm">&copy; {getCurrentYear()} Infinio. All rights reserved.</p>
      </footer>
    </div>
  );
}