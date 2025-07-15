// dva-frontend/src/components/PlaybookPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Removed MenuBook import as we are now using an image file for the icon
// import { MenuBook } from '@mui/icons-material';

// Define the sections for the table of contents and dynamic content rendering
const SECTIONS = [
  "Executive Summary",
  "Data Monetization Overview",
  "Strategic Assessment Framework",
  "Prioritization of Use Cases",
  "Financial Modeling & ROI Assessment",
  "Data Utilization & Readiness",
  "Technology Implementation Roadmap",
  "Regulatory and Compliance Framework",
  "Go-to-Market Strategy",
  "Risk Mitigation Plan",
  "Actionable Playbook Outputs",
  "Tools and Resources",
  "Appendices"
];

const PlaybookPage = () => {
  const [playbookData, setPlaybookData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaybook = async () => {
      try {
        // Make sure this URL is correct for your deployed Cloud Function
        const response = await axios.post(
          'https://us-central1-cs-poc-pr0n8qqumo0fl7jqn1n8qhk.cloudfunctions.net/generate_playbook_content',
          { clientId: 100, useCaseId: 10 } // Use your desired client and use case IDs
        );
        // Assuming response.data contains the content structured by section names
        setPlaybookData(response.data);
      } catch (err) {
        console.error('Error fetching playbook data:', err);
        setError('Failed to load playbook data. Please check Cloud Function logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybook();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-dva-blue text-lg">Loading Playbook...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]"> {/* Adjusted min-height to account for header, bg-gray-50 for consistency */}
      {/* Reduced top padding to minimize space below header */}
      <div className="pt-2"> {/* Use pt-2 to control top spacing */}
        <div className="flex items-center mb-4">
          {/* Using an image file for the icon, assuming it's in the public folder */}
          <img src="/dpp_icon.png" alt="Playbook Icon" className="h-10 w-10 mr-3" /> {/* Updated image source */}
          <h1 className="text-[26px] font-bold text-dva-blue"> {/* Font size and color set */}
            Data Product Playbook for ABC Health System
          </h1>
        </div>
        {/* Thin grey line separating subheader from content */}
        <div className="border-b border-gray-300 mb-6"></div> {/* Added thin grey line */}
        <p className="text-gray-700 mb-6">
          ABC Health System possesses a wealth of valuable data, including patient records, clinical assets, and operational data. By strategically leveraging these assets, you can unlock new revenue streams, improve patient care, and enhance operational efficiency.
        </p>

        <div className="flex"> {/* Changed from grid to flex for main layout */}
          {/* Table of Contents (Left Column) */}
          <nav className="w-1/4 pr-6 border-r border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {SECTIONS.map((section, idx) => (
                <li key={idx}>
                  <a href={`#section-${idx}`} className="text-dva-blue hover:underline transition-colors"> {/* Updated text color */}
                    {section}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Playbook Content (Right Main Column) */}
          <main className="w-3/4 pl-8 overflow-y-auto">
            {/* Two-column layout for Strategic Recommendations and Use Case Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"> {/* Adjusted to md:grid-cols-2 for responsiveness */}
              {/* Left Column: Strategic Recommendations */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Top 5 Strategic Recommendations:</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Prioritize Data Governance:</strong> Implement robust data governance policies and procedures.</li>
                  <li><strong>Implement Predictive Analytics for Population Health:</strong> Leverage your strong primary care network.</li>
                  <li><strong>Optimize Value-Based Payment Models:</strong> Enhance analytics for cost tracking and outcome measurement.</li>
                  <li><strong>Develop a Data Product for Regional Providers:</strong> Subscription-based predictive analytics service.</li>
                  <li><strong>Strengthen Data Governance and Security:</strong> Establish a cross-functional committee.</li>
                </ol>
              </div>

              {/* Right Column: Top 5 Use Case Opportunities */}
              <div>
                <div className="bg-dva-blue text-white py-2 px-4 rounded-t-md"> {/* Updated background color */}
                  <h2 className="font-semibold">Top 5 Use Case Opportunities</h2>
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-md">
                  <ol className="divide-y divide-gray-200 text-gray-700"> {/* Consistent text color */}
                    <li className="p-1"><strong>1.</strong> <a href="#" className="text-dva-blue hover:underline">Precision Medicine Initiatives</a></li>
                    <li className="p-1"><strong>2.</strong> <a href="#" className="text-dva-blue hover:underline">Health Data Marketplace Integration</a></li>
                    <li className="p-1"><strong>3.</strong> <a href="#" className="text-dva-blue hover:underline">Interoperable Health Data Exchange Platform</a></li>
                    <li className="p-1"><strong>4.</strong> <a href="#" className="text-dva-blue hover:underline">Predictive Analytics for Population Health Management</a></li>
                    <li className="p-1"><strong>5.</strong> <a href="#" className="text-dva-blue hover:underline">Predictive Analytics for Utilization Management and Cost Reduction</a></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Dynamically rendered sections from API */}
            {SECTIONS.map((section, idx) => (
              <section key={idx} id={`section-${idx}`} className="mb-10 pb-4 border-b border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{section}</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {playbookData[section] || "Detailed content coming soon..."}
                </p>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PlaybookPage;
