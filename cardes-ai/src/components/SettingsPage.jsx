import React, { useState } from "react";
import themePresets from "../utils/themePresets";
import { setTheme } from "../utils/themeSwitcher";

const tabs = [
  { name: "Account", id: "account" },
  { name: "Profile", id: "profile" },
  { name: "Security", id: "security" },
  { name: "Appearance", id: "appearance" },
  { name: "Notifications", id: "notifications" },
  { name: "Billing", id: "billing" },
  { name: "Integrations", id: "integrations" },
];

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState("appearance"); // Default to Appearance
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme") || "Cardes"
  );

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-primary">
      {/* Top Navigation Tabs - Styled for better contrast */}
      <div className="w-full bg-secondary shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`p-4 text-lg font-medium flex-shrink-0 transition-colors ${
                  selectedTab === tab.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-200 hover:text-white"
                }`}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Improved contrast, width, and spacing */}
      <div className="flex-1 flex justify-center p-6 md:p-10">
        <div className="w-full max-w-5xl px-6 py-8 bg-white rounded-lg shadow-lg">
          {/* Tab Content */}
          <div className="w-full">
            {selectedTab === "appearance" && (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Appearance Settings</h3>

                {/* Theme Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Theme</h4>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-primary bg-gray-100"
                    value={selectedTheme}
                    onChange={handleThemeChange}
                  >
                    {Object.keys(themePresets).map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other Appearance Settings */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Dashboard Layout</h4>
                  <div className="flex flex-wrap gap-4">
                    <button className="p-3 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                      Default
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
                      Simplified
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg bg-gray-300 hover:bg-gray-400 transition">
                      Custom CSS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {selectedTab !== "appearance" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">{selectedTab} Settings</h3>
                <p className="text-gray-600">Content for {selectedTab} settings will be here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
