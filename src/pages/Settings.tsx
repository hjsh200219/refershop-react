import React, { useState } from "react";

const Settings = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        language: "en",
    });

    const handleSettingChange = (setting: string, value: any) => {
        setSettings(prev => ({ ...prev, [setting]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Dark Mode</h3>
                        <p className="text-sm text-gray-500">Enable dark mode for better viewing at night</p>
                    </div>
                    <button
                        onClick={() => handleSettingChange("darkMode", !settings.darkMode)}
                        className={`${settings.darkMode ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${settings.darkMode ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications about search results</p>
                    </div>
                    <button
                        onClick={() => handleSettingChange("notifications", !settings.notifications)}
                        className={`${settings.notifications ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                        <span
                            className={`${settings.notifications ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>
                <div>
                    <label htmlFor="language" className="block text-lg font-medium text-gray-900">Language</label>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                    <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => handleSettingChange("language", e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="en">English</option>
                        <option value="ko">한국어</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
