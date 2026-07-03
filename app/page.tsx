"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";
import {
  Folder,
  Sliders,
  Activity,
  Check,
  Shield,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function Home() {
  // Mock interactive showcase states
  const [activeTab, setActiveTab] = useState<"files" | "filters" | "settings" | "activity">("files");
  const [activeFilter, setActiveFilter] = useState<"none" | "grayscale" | "blur" | "sepia">("none");
  const [storageUsed, setStorageUsed] = useState(2.3);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Hero Outer Wrapper */}
      <div className="max-w-6xl w-full mx-auto px-4 md:px-6 pb-10">
        
        {/* Eyebrow Label Pill */}
        <div className="flex flex-col items-center gap-10 pt-24 pb-10 md:pb-20 text-center">
          <a
            href="/dashboard"
            className="flex bg-white hover:bg-stone-100 border border-stone-800 rounded-lg overflow-hidden w-fit mx-auto"
          >
            <p className="text-stone-50 font-medium text-xs font-mono flex items-center justify-center px-4 py-2 bg-stone-800 uppercase leading-4">
              New
            </p>
            <div className="flex items-center">
              <p className="text-stone-800 font-medium text-sm pl-4 pr-3 leading-5">
                <span className="hidden md:inline">Folder Sharing:</span> DropX now supports group folders.
              </p>
            </div>
          </a>

          {/* Cooper Serif Display Title */}
          <div className="flex flex-col gap-4">
            <h1 className="font-cooper text-[40px] lg:text-[80px] leading-[1.1] text-stone-900 tracking-tight">
              Secure storage for <br className="hidden md:inline" />all your visual <em>media</em>
            </h1>
            <h2 className="text-stone-500 text-base md:text-xl max-w-3xl leading-7 mx-auto font-sans">
              DropX is the simplest way to store, organize, and preview your creative assets.
              <br className="hidden md:inline" />
              Built for modern teams with secure folders, instant sharing, and beautiful photo filters.
            </h2>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Button variant="secondary" href="#features" size="lg">
                View interactive demo
              </Button>
              <Button variant="primary" href="/dashboard" size="lg">
                Get Started Free
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="secondary" href="#features" size="lg">
                Explore Features
              </Button>
              <Button variant="primary" href="/dashboard" size="lg">
                Go to Dashboard
              </Button>
            </SignedIn>
          </div>
        </div>

        {/* Banner with Mountain Background Only */}
        <div className="relative border-x border-t border-stone-200 overflow-hidden h-[300px] md:h-[400px] bg-stone-100">
          <img 
            src="/bg-mountains.jpg" 
            alt="Scenic mountain landscape" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3-Column Top Feature Grids */}
        <div className="mb-10 md:mb-20 border-x border-stone-200">
          <ul className="grid grid-cols-1 sm:grid-cols-3 sm:border-b border-t border-stone-200">
            {/* Box 1 */}
            <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-white">
                <p className="text-stone-800 font-medium text-base font-mono">5GB Free Storage</p>
                <p className="text-stone-500 font-normal text-base leading-6">
                  Get 5GB of cloud space for all your media, photos, and assets. Store your files in one secure and organized location.
                </p>
              </div>
              <ul className="grid grid-cols-1 border-t border-stone-200">
                <li>
                  <a
                    href="/dashboard"
                    className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors"
                  >
                    <p className="text-stone-800 font-medium text-xs font-mono uppercase">Open Storage</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vector-effect="non-scaling-stroke"
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </li>

            {/* Box 2 */}
            <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-white">
                <p className="text-stone-800 font-medium text-base font-mono">Instant Previews</p>
                <p className="text-stone-500 font-normal text-base leading-6">
                  View and edit your images right in your browser. Apply filters, crop, and resize files instantly without downloading them.
                </p>
              </div>
              <ul className="grid grid-cols-1 border-t border-stone-200">
                <li>
                  <a
                    href="/dashboard"
                    className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors"
                  >
                    <p className="text-stone-800 font-medium text-xs font-mono uppercase">Try Previews</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vector-effect="non-scaling-stroke"
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </li>

            {/* Box 3 */}
            <li className="flex flex-col border-b border-stone-200 sm:border-b-0 [&:not(:last-child)]:sm:border-r">
              <div className="flex flex-col gap-2 px-4 sm:px-6 py-6 flex-1 bg-white">
                <p className="text-stone-800 font-medium text-base font-mono">Secure Access</p>
                <p className="text-stone-500 font-normal text-base leading-6">
                  Keep your work safe with secure authentication. Access your folders safely from any device with your team workspace.
                </p>
              </div>
              <ul className="grid grid-cols-1 border-t border-stone-200">
                <li>
                  <a
                    href="/dashboard"
                    className="flex items-center text-stone-500 justify-between gap-4 px-6 py-3 hover:bg-stone-100 transition-colors"
                  >
                    <p className="text-stone-800 font-medium text-xs font-mono uppercase">Manage Access</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vector-effect="non-scaling-stroke"
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Credibility Stats Bar */}
        <div className="my-10 md:my-20 border-x border-stone-200">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-t border-stone-200">
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">15,402,890</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Files stored safely
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">99.99%</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Upload success rate
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">&lt; 1.0s</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Average preview load time
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 px-4 sm:px-6 py-6 border-stone-200 odd:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0 md:[&:nth-child(-n+3)]:border-r">
              <p className="text-stone-800 font-normal text-2xl font-datatype text-center">100k+</p>
              <p className="text-stone-500 dark:text-stone-600 font-normal text-sm leading-5 text-center">
                Creative teams onboarded
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center p-6 bg-white border-b border-stone-200">
            <p className="text-stone-800 font-medium text-sm font-mono uppercase leading-5 text-center">
              MEDIA STORAGE AND WORKSPACES TRUSTED BY MODERN CREATIVES WORLDWIDE
            </p>
          </div>

          {/* Greyscale Logo Strip */}
          <div className="grid border-b border-stone-200 overflow-hidden h-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center justify-items-center py-6 px-4 divide-x divide-stone-200/50">
              <img
                alt="Peerlist"
                loading="lazy"
                width="112"
                height="24"
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                src="https://dqy38fnwh4fqs.cloudfront.net/autosend/website/company-logos/peerlist-light.webp"
              />
              <img
                alt="Supermemory"
                loading="lazy"
                width="140"
                height="24"
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                src="https://dqy38fnwh4fqs.cloudfront.net/autosend/website/company-logos/supermemory-light.webp"
              />
              <img
                alt="gistr"
                loading="lazy"
                width="67"
                height="24"
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                src="https://dqy38fnwh4fqs.cloudfront.net/autosend/website/company-logos/gistr-light.webp"
              />
              <img
                alt="GuideJar"
                loading="lazy"
                width="120"
                height="24"
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                src="https://dqy38fnwh4fqs.cloudfront.net/autosend/website/company-logos/guidejar-light.webp"
              />
            </div>
          </div>
        </div>

        {/* INTERACTIVE PRODUCT SHOWCASE SECTION */}
        <section id="features" className="flex my-10 md:my-20 flex-col gap-20">
          <div className="flex flex-col border-x border-t border-b-0 md:border-b border-stone-200">
            
            {/* Title Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b gap-4 border-stone-200 px-4 md:px-6 py-6 bg-white">
              <div className="flex flex-col gap-2 md:gap-4">
                <p className="text-[#615FFF] font-medium text-sm font-mono uppercase leading-4">
                  #01 - Workspace features
                </p>
                <h2 className="text-[32px] md:text-[40px] leading-[1.2] tracking-tight">
                  Organize your media assets in one place.
                </h2>
              </div>
            </div>

            {/* Split Screen interactive view */}
            <div className="hidden md:grid md:grid-cols-2 md:h-[520px] md:overflow-hidden bg-white">
              
              {/* Left Column: Tab list */}
              <div className="md:border-r border-stone-200 flex flex-col justify-stretch">
                <div className="flex divide-y divide-stone-200 flex-col h-full">
                  
                  {/* Tab 1 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("files")}
                    className={`relative isolate flex items-center gap-4 p-6 text-left cursor-pointer flex-grow focus:outline-none transition-colors duration-150 ${activeTab === "files" ? "bg-stone-50" : "bg-white"}`}
                  >
                    <div className="flex gap-4">
                      {activeTab === "files" && (
                        <div className="absolute left-0 inset-y-0 w-1 overflow-hidden">
                          <div className="absolute inset-0 bg-[#615FFF]"></div>
                        </div>
                      )}
                      <span className="shrink-0 text-stone-800 mt-1">
                        <Folder className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-stone-800 font-medium text-base font-mono uppercase leading-4">All Files</p>
                        <p className="text-stone-500 font-normal text-sm leading-relaxed">
                          Browse all your uploaded images, search by name, or organize them into folders.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 2 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("filters")}
                    className={`relative isolate flex items-center gap-4 p-6 text-left cursor-pointer flex-grow focus:outline-none transition-colors duration-150 ${activeTab === "filters" ? "bg-stone-50" : "bg-white"}`}
                  >
                    <div className="flex gap-4">
                      {activeTab === "filters" && (
                        <div className="absolute left-0 inset-y-0 w-1 overflow-hidden">
                          <div className="absolute inset-0 bg-[#615FFF]"></div>
                        </div>
                      )}
                      <span className="shrink-0 text-stone-800 mt-1">
                        <Sliders className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-stone-800 font-medium text-base font-mono uppercase leading-4">Quick Filters</p>
                        <p className="text-stone-500 font-normal text-sm leading-relaxed">
                          Preview and adjust your files instantly. Add quick filters in one click.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 3 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className={`relative isolate flex items-center gap-4 p-6 text-left cursor-pointer flex-grow focus:outline-none transition-colors duration-150 ${activeTab === "settings" ? "bg-stone-50" : "bg-white"}`}
                  >
                    <div className="flex gap-4">
                      {activeTab === "settings" && (
                        <div className="absolute left-0 inset-y-0 w-1 overflow-hidden">
                          <div className="absolute inset-0 bg-[#615FFF]"></div>
                        </div>
                      )}
                      <span className="shrink-0 text-stone-800 mt-1">
                        <Shield className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-stone-800 font-medium text-base font-mono uppercase leading-4">Workspace Limit</p>
                        <p className="text-stone-500 font-normal text-sm leading-relaxed">
                          Track storage volume or customize team folders for client projects.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Tab 4 */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("activity")}
                    className={`relative isolate flex items-center gap-4 p-6 text-left cursor-pointer flex-grow focus:outline-none transition-colors duration-150 ${activeTab === "activity" ? "bg-stone-50" : "bg-white"}`}
                  >
                    <div className="flex gap-4">
                      {activeTab === "activity" && (
                        <div className="absolute left-0 inset-y-0 w-1 overflow-hidden">
                          <div className="absolute inset-0 bg-[#615FFF]"></div>
                        </div>
                      )}
                      <span className="shrink-0 text-stone-800 mt-1">
                        <Activity className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-stone-800 font-medium text-base font-mono uppercase leading-4">Activity Logs</p>
                        <p className="text-stone-500 font-normal text-sm leading-relaxed">
                          Review file history, access logs, and team changes as they happen.
                        </p>
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Right Column: Interactive Mockup Canvas */}
              <div className="relative overflow-hidden bg-stone-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full h-full flex flex-col border border-stone-200">
                  
                  {/* Header bar */}
                  <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2.5 border-b border-stone-200 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className="ml-auto font-mono text-[10px] text-stone-400 uppercase tracking-wider">DropX Workspace Manager</span>
                  </div>

                  {/* Canvas Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    {activeTab === "files" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-stone-800 uppercase font-mono tracking-wider">All Assets</h3>
                          <span className="text-xs text-stone-400">3 Files</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded overflow-hidden bg-stone-200 border border-stone-200 shrink-0">
                                <img src="/bg-mountains.jpg" className="w-full h-full object-cover" alt="mountains" />
                              </div>
                              <div>
                                <p className="text-xs font-mono font-medium text-stone-800">bg-mountains.jpg</p>
                                <p className="text-[10px] text-stone-400">138 KB • Image</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Stored</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded overflow-hidden bg-stone-200 border border-stone-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="profile" />
                              </div>
                              <div>
                                <p className="text-xs font-mono font-medium text-stone-800">avatar-profile.webp</p>
                                <p className="text-[10px] text-stone-400">24 KB • Image</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono uppercase">Stored</span>
                          </div>

                          <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                <Folder className="w-5 h-5 text-[#615FFF]" />
                              </div>
                              <div>
                                <p className="text-xs font-mono font-medium text-stone-800">Marketing Assets</p>
                                <p className="text-[10px] text-stone-400">0 KB • Folder</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-mono uppercase">Shared</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "filters" && (
                      <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-stone-800 uppercase font-mono tracking-wider">Quick Filters</h3>
                          <span className="text-xs text-stone-400 font-mono">Active: {activeFilter}</span>
                        </div>
                        <div className="flex-1 min-h-[160px] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 relative flex items-center justify-center">
                          <img 
                            src="/bg-mountains.jpg" 
                            alt="Filter preview" 
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              activeFilter === "grayscale" ? "grayscale" : 
                              activeFilter === "blur" ? "blur-[2px]" : 
                              activeFilter === "sepia" ? "sepia" : ""
                            }`} 
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                          {(["none", "grayscale", "blur", "sepia"] as const).map((filter) => (
                            <button
                              key={filter}
                              type="button"
                              onClick={() => setActiveFilter(filter)}
                              className={`py-1.5 rounded border text-[10px] font-mono uppercase font-semibold transition-all ${
                                activeFilter === filter 
                                  ? "bg-stone-900 border-stone-900 text-white" 
                                  : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold text-stone-800 uppercase font-mono tracking-wider">Workspace Limits</h3>
                          <p className="text-stone-400 text-xs mt-1">Manage storage limits for your active space.</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-stone-600">Storage Used</span>
                            <span className="text-stone-800 font-bold">{storageUsed.toFixed(1)} GB / 5.0 GB</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                            <div 
                              className="bg-[#615FFF] h-full transition-all duration-500 rounded-full" 
                              style={{ width: `${(storageUsed / 5.0) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setStorageUsed(2.3)}
                            className="flex-1 py-2 px-3 bg-stone-100 border border-stone-200 text-stone-600 hover:bg-stone-200 transition-colors text-xs font-mono uppercase font-semibold rounded-lg"
                          >
                            Reset Files
                          </button>
                          <button
                            type="button"
                            onClick={() => setStorageUsed(0)}
                            className="flex-1 py-2 px-3 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors text-xs font-mono uppercase font-semibold rounded-lg flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear Space
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "activity" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-stone-800 uppercase font-mono tracking-wider">Activity History</h3>
                          <span className="text-xs text-stone-400">Real-time</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2.5 text-xs">
                            <span className="text-stone-400 mt-0.5">●</span>
                            <div>
                              <p className="text-stone-800 font-mono"><span className="font-semibold">Saurabh Sharma</span> uploaded avatar-profile.webp</p>
                              <p className="text-[10px] text-stone-400">2 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex gap-2.5 text-xs">
                            <span className="text-stone-400 mt-0.5">●</span>
                            <div>
                              <p className="text-stone-800 font-mono"><span className="font-semibold">Alex Rivera</span> applied quick filter: sepia</p>
                              <p className="text-[10px] text-stone-400">1 hour ago</p>
                            </div>
                          </div>
                          <div className="flex gap-2.5 text-xs">
                            <span className="text-[#615FFF] mt-0.5">●</span>
                            <div>
                              <p className="text-stone-800 font-mono"><span className="font-semibold">System</span> optimized bg-mountains.jpg (138 KB saved)</p>
                              <p className="text-[10px] text-stone-400">3 hours ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile Accordion View */}
            <div className="md:hidden flex flex-col bg-white">
              {(["files", "filters", "settings", "activity"] as const).map((tab) => (
                <div key={tab} className="border-b border-stone-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === tab ? "files" : tab)}
                    className="flex justify-between items-center w-full p-4 font-mono font-bold text-sm uppercase text-stone-800 text-left bg-stone-50"
                  >
                    <span>{tab === "files" ? "All Files" : tab === "filters" ? "Quick Filters" : tab === "settings" ? "Workspace Limit" : "Activity Logs"}</span>
                    <span>{activeTab === tab ? "−" : "+"}</span>
                  </button>
                  {activeTab === tab && (
                    <div className="p-4 bg-white space-y-4">
                      <p className="text-xs text-stone-500">
                        {tab === "files" && "Browse all your uploaded images, search by name, or organize them into folders."}
                        {tab === "filters" && "Preview and adjust your files instantly. Add quick filters in one click."}
                        {tab === "settings" && "Track storage volume or customize team folders for client projects."}
                        {tab === "activity" && "Review file history, access logs, and team changes as they happen."}
                      </p>
                      
                      {/* Mobile mockup detail renders */}
                      <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
                        {tab === "files" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-semibold">bg-mountains.jpg</span>
                              <span className="text-stone-400">138 KB</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-semibold">avatar-profile.webp</span>
                              <span className="text-stone-400">24 KB</span>
                            </div>
                          </div>
                        )}

                        {tab === "filters" && (
                          <div className="space-y-3">
                            <div className="w-full h-32 rounded bg-stone-200 overflow-hidden relative">
                              <img 
                                src="/bg-mountains.jpg" 
                                className={`w-full h-full object-cover ${
                                  activeFilter === "grayscale" ? "grayscale" : 
                                  activeFilter === "blur" ? "blur-[2px]" : 
                                  activeFilter === "sepia" ? "sepia" : ""
                                }`} 
                                alt="mobile filter" 
                              />
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {(["none", "grayscale", "blur", "sepia"] as const).map((filter) => (
                                <button
                                  key={filter}
                                  type="button"
                                  onClick={() => setActiveFilter(filter)}
                                  className={`py-1 rounded text-[9px] font-mono uppercase ${
                                    activeFilter === filter ? "bg-stone-900 text-white" : "bg-white border text-stone-500"
                                  }`}
                                >
                                  {filter}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {tab === "settings" && (
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs font-mono">
                              <span>Used space</span>
                              <span>{storageUsed.toFixed(1)} GB / 5.0 GB</span>
                            </div>
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => setStorageUsed(2.3)}
                                className="flex-1 py-1 text-[10px] font-mono uppercase bg-white border rounded"
                              >
                                Reset
                              </button>
                              <button 
                                onClick={() => setStorageUsed(0)}
                                className="flex-1 py-1 text-[10px] font-mono uppercase bg-red-50 text-red-600 border border-red-100 rounded"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        )}

                        {tab === "activity" && (
                          <div className="space-y-2 text-[10px] font-mono">
                            <p>👤 Saurabh uploaded profile.webp</p>
                            <p>👤 Alex applied: sepia filter</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom link */}
            <a
              className="flex items-center justify-center border-t border-stone-200 px-4 py-4 transition-colors duration-200 bg-white hover:bg-stone-100"
              href="/dashboard"
            >
              <span className="flex items-center gap-2 text-indigo-600 font-mono font-bold text-xs uppercase tracking-wider">
                Go to your Workspace Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19.5833M19.5833 12L12.5833 5M19.5833 12L12.5833 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </a>

          </div>
        </section>

        {/* MULTIPLE PROJECTS ROW SECTION */}
        <section className="my-10 md:my-20 border border-stone-200 rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left side text */}
            <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-16 bg-white border-b md:border-b-0 md:border-r border-stone-200">
              <span className="text-rose-500 font-medium text-xs uppercase font-mono tracking-wider block mb-4">
                workspace folders
              </span>
              <h2 className="text-[32px] md:text-[40px] leading-[1.2] font-semibold text-stone-900 tracking-tight mb-6">
                Multiple Folders, One Account.
              </h2>
              <p className="text-stone-500 text-sm md:text-base leading-relaxed mb-8">
                Create shared folders for every client, team, or project you manage. Give each folder its own member permissions, shared links, and custom storage limits under a single unified account.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-stone-800 text-[13px]">
                  <Check className="h-4 w-4 text-[#615fff]" />
                  <span>Organize files cleanly by client or project</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-[13px]">
                  <Check className="h-4 w-4 text-[#615fff]" />
                  <span>Control who can view, edit, or upload files</span>
                </li>
              </ul>
            </div>

            {/* Right side image backdrop */}
            <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden">
              <img src="/bg-mountains.jpg" alt="Mountains" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-950/20" />
              
              {/* project sidebar card wrapper mock */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-72 bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden p-3 font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <span className="text-[11px] text-stone-400 uppercase tracking-widest font-bold">Active Folders</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="py-3 space-y-2">
                    <div className="flex items-center justify-between text-xs px-2 py-1 bg-stone-50 border border-stone-200 rounded">
                      <span className="font-semibold text-stone-800">Marketing Campaign</span>
                      <span className="text-stone-400">1.2 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-xs px-2 py-1 bg-white hover:bg-stone-50 cursor-pointer rounded border border-transparent">
                      <span className="text-stone-500">Product Photos</span>
                      <span className="text-stone-400">840 MB</span>
                    </div>
                  </div>
                  <a href="/dashboard" className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-stone-300 hover:border-stone-800 text-[11px] uppercase tracking-wider font-bold rounded text-stone-600 transition-colors">
                    <span>+ New Folder</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-8 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-stone-800">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 13-2-3-2 3" vector-effect="non-scaling-stroke"></path>
              <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" vector-effect="non-scaling-stroke" d="M14.5 5.5C14.5 8 12 10 12 10S9.5 8 9.5 5.5 10.62 2 12 2s2.5 1 2.5 3.5ZM18.5 15.5C16 15.5 14 13 14 13s2-2.5 4.5-2.5S22 11.62 22 13s-1 2.5-3.5 2.5ZM5.5 15.5C8 15.5 10 13 10 13s-2-2.5-4.5-2.5S2 11.62 2 13s1 2.5 3.5 2.5Z"></path>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 22s-3-6-6-9" vector-effect="non-scaling-stroke"></path>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" vector-effect="non-scaling-stroke" d="M8 22s3-6 6-9"></path>
            </svg>
            <span className="font-mono text-xs font-semibold tracking-[0.08em] text-stone-800 uppercase">
              DROPX
            </span>
          </div>
          <p className="text-[10px] font-mono text-stone-400">
            &copy; {new Date().getFullYear()} DropX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
