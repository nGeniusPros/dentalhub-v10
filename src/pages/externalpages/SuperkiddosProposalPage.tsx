import React, { useState, useEffect, useCallback } from 'react';

// It's recommended to move these styles to a global CSS file (e.g., src/index.css)
// or a dedicated CSS module for this page.
const pageStyles = `
  :root {
    --navy-dark: #1B2B5B;
    --navy-mid: #2A407F;
    --gold-main: #C5A572;
    --gold-light: #E3D3B6;
    --turquoise-main: #4BC5BD;
    --turquoise-light: #A1E3DF;
    --green-main: #41B38A;
    --gray-lightest: #F8F9FA;
    --gray-light: #E9ECEF;
    --gray-mid: #CED4DA;
    --gray-dark: #6C757D;
  }

  .proposal-body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--gray-lightest);
  }
  .proposal-tab-btn {
    /* Base styles, active state handled by conditional classNames */
  }
  .proposal-tab-active {
    border-bottom: 2px solid var(--gold-main);
    color: var(--gold-main) !important; /* Important to override Tailwind if needed */
    font-weight: 600;
  }
  .proposal-gradient-bg {
    background-image: linear-gradient(to right, var(--turquoise-main), var(--navy-mid));
  }
  .proposal-card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .proposal-card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .proposal-loader {
    border: 4px solid var(--gray-light);
    border-top: 4px solid var(--navy-mid);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: proposal-spin 1s linear infinite;
  }
  @keyframes proposal-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuperkiddosProposalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('objective');
  const [newPatients, setNewPatients] = useState<number>(5);
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('$30,000');
  const [netProfit, setNetProfit] = useState<string>('$22,500');
  const [projectedROI, setProjectedROI] = useState<string>('+300%');
  const [profitColor, setProfitColor] = useState<string>('var(--green-main)');

  const [userQuestion, setUserQuestion] = useState<string>('');
  const [geminiAnswer, setGeminiAnswer] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const CASE_VALUE = 6000;
  const MARKETING_COST = 7500;

  const proposalContext = `
    Context from the Proposal for Superkiddos Dental & Orthodontics:
    - Objective: Expand from a pediatric-focused office to a full-family orthodontic practice.
    - Target Audience: Local families and adult prospects in Southern California (Woodland Hills, Calabasas, West Hills).
    - Core Strategy: Use Connected TV (CTV) advertising as a primary channel (40% of budget) to build brand awareness quickly.
    - Supporting Channels: Facebook/Instagram ads (15%), Display Retargeting (10%).
    - Budget (6-month plan): $7,500/month, with $3,800 allocated to CTV.
    - ROI Goal: Achieve 4-6 new ortho cases per month. Average case value is $6,000.
    - Key Message: "Your Family's Home for Beautiful Smiles – Exceptional Orthodontic Care for Kids, Teens, and Adults."
  `;

  const researchContext = `
    Context from market research on CTV/OTT Advertising:
    - CTV vs OTT: CTV is the TV device itself, offering a high-impact, lean-back viewing experience.
    - Targeting: CTV allows for hyper-local geographic targeting (zip codes), plus demographic, behavioral, and interest-based segmentation.
    - Measurement: CTV provides precise digital metrics, including impressions, video completion rates (VCRs), and can track website visits and conversions. 71% of marketers agree it drives measurable ROAS.
    - Engagement: Ads are often non-skippable, leading to very high VCRs (near 100%).
    - Comparison to Traditional TV: CTV is more precise, measurable, and cost-effective for reaching specific audiences than broad traditional cable TV ads.
    - Platforms: Platforms like Hulu, YouTube TV, Pluto TV, Peacock are common channels for CTV ads.
  `;

  useEffect(() => {
    document.title = 'Interactive Proposal: Superkiddos Family Practice Evolution';
    // Inject styles into the head. This is one way to handle component-specific global styles.
    // A better way is to add these to your main CSS file or use CSS Modules.
    const styleElement = document.createElement('style');
    styleElement.innerHTML = pageStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const calculateROI = useCallback(() => {
    const revenue = newPatients * CASE_VALUE;
    const profit = revenue - MARKETING_COST;
    const roi = (profit / MARKETING_COST) * 100;

    setMonthlyRevenue(`$${revenue.toLocaleString()}`);
    setNetProfit(`$${profit.toLocaleString()}`);
    setProjectedROI(`${roi >= 0 ? '+' : ''}${Math.round(roi)}%`);
    setProfitColor(profit >= 0 ? 'var(--green-main)' : '#ef4444');
  }, [newPatients, CASE_VALUE, MARKETING_COST]);

  useEffect(() => {
    calculateROI();
  }, [calculateROI]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatients(parseInt(event.target.value, 10));
  };

  const getGeminiResponse = async (questionToAsk: string) => {
    if (!questionToAsk.trim()) return;
    setIsThinking(true);
    setGeminiAnswer('');

    const payload = {
      question: questionToAsk,
      proposalContext: proposalContext,
      researchContext: researchContext,
    };

    const apiUrl = '/api/gemini-proposal-assist';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`API request failed (${response.status}):`, result.error, result.details);
        let errorMessage = `Sorry, an error occurred: ${result.error || response.statusText}`;
        if (result.details) {
          errorMessage += `<br/><pre style="white-space: pre-wrap; word-break: break-all;">Details: ${typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}</pre>`;
        }
        setGeminiAnswer(`<p class="text-red-600">${errorMessage}</p>`);
      } else {
        setGeminiAnswer(result.answer.replace(/\n/g, '<br/>'));
      }
    } catch (error) {
      console.error('Error calling Netlify function:', error);
      setGeminiAnswer(`<p class="text-red-600">Sorry, a network error occurred while trying to reach the AI assistant. Please check the console.</p>`);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAskGemini = () => {
    getGeminiResponse(userQuestion);
  };

  const handleCannedQuestionClick = (question: string) => {
    setUserQuestion(question);
    getGeminiResponse(question);
  };

  const tabs = [
    { id: 'objective', label: 'Objective' },
    { id: 'ctv', label: 'CTV Deep Dive' },
    { id: 'gemini', label: '✨ AI Proposal Assistant' },
    { id: 'roi', label: 'ROI & Timeline' },
    { id: 'payment', label: '✔ Proposal & Payment' },
  ];

  const cannedQuestions = [
    'Which specific streaming networks will our ads appear on?',
    'How do you ensure we don\'t waste money advertising outside our service area?',
    'What makes you confident CTV will outperform traditional TV ads for us?',
    'How will we actually measure the ROI from this campaign?',
  ];

  return (
    <div className="proposal-body antialiased">
      <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--navy-dark)' }}>
          <div className="text-white text-4xl font-bold mb-2">
            nGenius <span style={{ color: 'var(--gold-main)' }}>Pros</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">The Next Evolution of Marketing For Superkiddos</h1>
          <p className="text-lg text-gray-300 mt-2">An Interactive Proposal for Dr. Atoosa Nikaeen</p>
          <p className="text-sm text-gray-400 mt-1">Prepared by: nGenius Pros LLC</p>
        </header>

        <div className="mb-8 bg-white rounded-lg shadow-md">
          <nav className="flex flex-wrap justify-center border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`proposal-tab-btn p-4 text-gray-600 hover:text-gold-500 focus:outline-none ${activeTab === tab.id ? 'proposal-tab-active' : ''}`}
                style={activeTab !== tab.id ? {color: 'var(--gray-dark)'} : {color: 'var(--gold-main)'} }
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <main>
          {activeTab === 'objective' && (
            <div id="objective" className="tab-content">
              <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>From "Superkiddos" to a Super-Family Practice</h2>
                <p className="leading-relaxed" style={{ color: 'var(--gray-dark)' }}>Dr. Nikaeen, this interactive proposal builds upon our initial plan to expand your practice into a family-oriented orthodontic hub serving both children and adults. The market opportunity is clear: with roughly one in three orthodontic patients now being adults, this transition is a timely and strategic growth initiative.</p>
                <p className="leading-relaxed mt-4" style={{ color: 'var(--gray-dark)' }}>This document will provide a deeper dive into the high-impact marketing channels we've selected, based on extensive market research. The strategy is designed to maximize your return on investment and achieve your growth objectives.</p>
              </div>
            </div>
          )}

          {activeTab === 'ctv' && (
            <div id="ctv" className="tab-content">
              <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>Deep Dive: Connected TV (CTV) - Your Unfair Advantage</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--gray-dark)' }}>Our strategy allocates 40% of the marketing budget to Connected TV (CTV) advertising. This is our primary tool for rapidly building brand awareness and positioning your practice as the leading family orthodontist in your community.</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-mid)' }}>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--navy-dark)' }}>What is Connected TV (CTV)?</h3>
                    <p className="mt-2" style={{ color: 'var(--gray-dark)' }}>This refers to the television set itself when it's connected to the internet to stream content. Think Smart TVs or TVs with devices like Roku, Apple TV, or Hulu. Our focus is on CTV advertising because it guarantees your message appears on the most valuable screen in the house.</p>
                  </div>
                  <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-mid)' }}>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--navy-dark)' }}>What is Over-the-Top (OTT)?</h3>
                    <p className="mt-2" style={{ color: 'var(--gray-dark)' }}>This is the broader category of content delivered via the internet, bypassing traditional cable. Ads here can appear on TVs, phones, or tablets. While related, our focus is the high-impact CTV environment.</p>
                  </div>
                </div>
                <div className="p-6 rounded-lg border mb-8 proposal-card-hover" style={{ backgroundColor: 'var(--gold-light)', borderColor: 'var(--gold-main)' }}>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--navy-dark)' }}>Key Insight: The CTV Advantage</h3>
                  <p className="mt-2" style={{ color: 'var(--navy-dark)' }}>A focused CTV strategy delivers higher-impact ads with better brand recall and engagement, often in a non-skippable format. We leverage this to ensure your investment makes the strongest possible impression on the main household screen.</p>
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>Why CTV is the Right Choice for Your Practice:</h3>
                <div className="space-y-4">
                  <div className="flex items-start proposal-card-hover bg-white p-4 rounded-lg shadow">
                    <svg className="h-6 w-6 mr-4 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--gold-main)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--navy-dark)' }}>Reach Households, Not Just Individuals</h4>
                      <p style={{ color: 'var(--gray-dark)' }}>80% of U.S. households now stream content on their CTVs, making it a primary channel to reach engaged local families.</p>
                    </div>
                  </div>
                  <div className="flex items-start proposal-card-hover bg-white p-4 rounded-lg shadow">
                    <svg className="h-6 w-6 mr-4 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--gold-main)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--navy-dark)' }}>The Power of TV, The Precision of Digital</h4>
                      <p style={{ color: 'var(--gray-dark)' }}>Combine the compelling, storytelling power of a TV commercial with hyper-precise digital targeting to reach local parents and adults.</p>
                    </div>
                  </div>
                  <div className="flex items-start proposal-card-hover bg-white p-4 rounded-lg shadow">
                    <svg className="h-6 w-6 mr-4 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--gold-main)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--navy-dark)' }}>Proven Effectiveness</h4>
                      <p style={{ color: 'var(--gray-dark)' }}>Over two-thirds of senior marketing executives report that their CTV campaigns are effective or highly effective.</p>
                    </div>
                  </div>
                  <div className="flex items-start proposal-card-hover bg-white p-4 rounded-lg shadow">
                    <svg className="h-6 w-6 mr-4 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--gold-main)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: 'var(--navy-dark)' }}>Measurable ROI</h4>
                      <p style={{ color: 'var(--gray-dark)' }}>Unlike traditional TV, CTV provides clear data. 71% of marketers agree that CTV advertising drives a measurable return on ad spend (ROAS).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gemini' && (
            <div id="gemini" className="tab-content">
              <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>✨ AI Proposal Assistant</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--gray-dark)' }}>Have questions about the CTV advertising strategy? Our AI assistant, powered by Gemini, can provide detailed answers based on the proposal and our extensive market research. This tool is designed to give you confidence in our data-driven approach. Ask a question below or type your own.</p>
                
                <div className="p-6 border rounded-lg" style={{ borderColor: 'var(--gray-mid)' }}>
                  <div className="mb-4">
                    <label htmlFor="user-question" className="block text-md font-semibold mb-2" style={{ color: 'var(--navy-dark)' }}>Ask a question about our CTV strategy:</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        id="user-question" 
                        placeholder="e.g., How do we measure ROI on CTV ads?" 
                        className="w-full p-2 border rounded-lg" 
                        style={{ borderColor: 'var(--gray-mid)', backgroundColor: 'white' }}
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                      />
                      <button 
                        id="ask-gemini-btn" 
                        className="proposal-gradient-bg text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                        onClick={handleAskGemini}
                        disabled={isThinking}
                      >
                        {isThinking ? 'Asking...' : 'Ask Gemini'}
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--gray-dark)' }}>Or select a common question:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cannedQuestions.map((q, index) => (
                        <button 
                          key={index} 
                          className="text-sm text-left p-2 rounded-lg hover:opacity-80"
                          style={{ backgroundColor: 'var(--turquoise-light)', color: 'var(--navy-dark)' }}
                          onClick={() => handleCannedQuestionClick(q)}
                          disabled={isThinking}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {isThinking && (
                    <div id="gemini-thinking" className="flex items-center gap-3">
                      <div className="proposal-loader"></div>
                      <p style={{ color: 'var(--navy-mid)' }}>Our AI strategist is analyzing the data and crafting a response...</p>
                    </div>
                  )}
                  {geminiAnswer && (
                     <div 
                        id="gemini-answer" 
                        className="mt-4 p-4 rounded-lg border whitespace-pre-wrap" 
                        style={{ backgroundColor: 'var(--gray-lightest)', borderColor: 'var(--gray-mid)', color: 'var(--gray-dark)' }}
                        dangerouslySetInnerHTML={{ __html: geminiAnswer }}
                      />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div id="roi" className="tab-content">
              <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>Your Path to Growth: Realistic Projections & Accelerated ROI</h2>
                <p className="leading-relaxed mb-8" style={{ color: 'var(--gray-dark)' }}>Our implementation plan is designed for accelerated growth. While an initial proposal might outline a conservative baseline of 2-3 new cases per month, this updated forecast reflects a more realistic growth trajectory based on the full potential of an optimized multi-channel strategy. We are targeting a steady state of 4-6 new orthodontic case starts per month by Month 6.</p>
                
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--navy-dark)' }}>Interactive ROI Calculator</h3>
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-mid)' }}>
                  <div className="mb-6">
                    <label htmlFor="new-patients" className="block mb-2 text-md font-medium" style={{ color: 'var(--navy-dark)' }}>New Ortho Cases Per Month: <span id="patients-value" className="font-bold" style={{ color: 'var(--navy-mid)' }}>{newPatients}</span></label>
                    <input 
                      id="new-patients" 
                      type="range" 
                      min="1" 
                      max="15" 
                      value={newPatients} 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{ backgroundColor: 'var(--gray-mid)' }}
                      onChange={handleSliderChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm" style={{ color: 'var(--gray-dark)' }}>Monthly Revenue</p>
                      <p id="revenue-output" className="text-2xl font-bold" style={{ color: 'var(--navy-dark)' }}>{monthlyRevenue}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm" style={{ color: 'var(--gray-dark)' }}>Marketing Cost</p>
                      <p className="text-2xl font-bold" style={{ color: 'var(--navy-dark)' }}>${MARKETING_COST.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm" style={{ color: 'var(--gray-dark)' }}>Net Profit</p>
                      <p id="profit-output" className="text-2xl font-bold" style={{ color: profitColor }}>{netProfit}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm" style={{ color: 'var(--gray-dark)' }}>Projected ROI</p>
                      <p id="roi-output" className="text-2xl font-bold" style={{ color: 'var(--navy-mid)' }}>{projectedROI}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-4 text-center" style={{ color: 'var(--gray-dark)' }}>*Calculations are based on the 6-month plan marketing cost.</p>
                </div>
                
                <div className="mt-8 p-6 border rounded-lg" style={{ borderColor: 'var(--gold-main)', backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--navy-dark)' }}>Understanding the Calculation</h4>
                  <p className="mb-4" style={{ color: 'var(--gray-dark)' }}>To ensure full transparency, here is the breakdown of how the ROI figures are calculated:</p>
                  <ul className="space-y-3 text-sm" style={{ color: 'var(--gray-dark)' }}>
                    <li className="flex items-start">
                      <span className="font-bold text-left" style={{color:'var(--navy-mid)', minWidth: '140px'}}>Avg. Case Value:</span>
                      <span>${CASE_VALUE.toLocaleString()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-left" style={{color:'var(--navy-mid)', minWidth: '140px'}}>Monthly Revenue:</span>
                      <span>(Number of New Cases) x ${CASE_VALUE.toLocaleString()}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-left" style={{color:'var(--navy-mid)', minWidth: '140px'}}>Net Profit:</span>
                      <span>(Monthly Revenue) - ${MARKETING_COST.toLocaleString()} Marketing Cost</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-left" style={{color:'var(--navy-mid)', minWidth: '140px'}}>Projected ROI:</span>
                      <span>(Net Profit / ${MARKETING_COST.toLocaleString()} Marketing Cost) x 100%</span>
                    </li>
                  </ul>
                </div>

                <p className="leading-relaxed mt-8" style={{ color: 'var(--gray-dark)' }}>By leveraging a powerful combination of targeted CTV advertising and a multi-channel digital strategy, we are confident we can transform Superkiddos into the premier family orthodontic practice in your community. The projections outlined here represent a realistic path to achieving significant market share and a substantial return on your investment.</p>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div id="payment" className="tab-content">
              <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--navy-dark)' }}>Proposal Summary & Next Steps</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--gray-dark)' }}>This section summarizes the marketing plan and provides the next step to begin our partnership. We are excited to help you achieve your growth goals.</p>

                <div className="space-y-8">
                  <div className="p-6 border rounded-lg" style={{ borderColor: 'var(--gray-mid)' }}>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--navy-dark)' }}>Channel Strategy</h3>
                    <ul className="space-y-4 text-gray-700">
                      <li><strong>Connected TV (CTV) Advertising (40% of Budget):</strong> High-impact ads on services like Hulu and YouTube TV to build brand awareness with local families.</li>
                      <li><strong>Facebook & Instagram Advertising (15% of Budget):</strong> Targeted ads to drive consultations from local parents and adults interested in orthodontic care.</li>
                      <li><strong>Display Ads (Retargeting) (10% of Budget):</strong> Remind website visitors about your practice as they browse other sites, keeping you top-of-mind.</li>
                      <li><strong>Content Marketing:</strong> Regular social media posts (3/week) and YouTube Shorts (2/month) to build trust and engagement.</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 border rounded-lg" style={{ borderColor: 'var(--gray-mid)' }}>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--navy-dark)' }}>Budget & Contract Options</h3>
                    <h4 className="font-semibold mb-2 text-lg" style={{ color: 'var(--navy-mid)' }}>One-Time Production Costs</h4>
                    <ul className="list-disc list-inside mb-6 space-y-1 text-gray-700">
                      <li>Digital Avatar: $500</li>
                      <li>Website Redesign: $1,500 - $3,000</li>
                      <li>CTV Commercial (Basic): $500</li>
                      <li>CTV Commercial (Onsite Custom): $1,500</li>
                    </ul>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--gray-lightest)', border: '1px solid var(--gray-mid)' }}>
                        <h4 className="font-semibold text-lg" style={{ color: 'var(--navy-mid)' }}>6-Month Contract</h4>
                        <p className="text-2xl font-bold my-2" style={{ color: 'var(--navy-dark)' }}>$7,500 <span className="text-lg font-normal">/ month</span></p>
                        <p className="text-sm text-gray-600">Total investment of $45,000. Ideal for an initial trial period to demonstrate effectiveness.</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--gray-lightest)', border: '1px solid var(--gray-mid)' }}>
                        <h4 className="font-semibold text-lg" style={{ color: 'var(--navy-mid)' }}>12-Month Contract</h4>
                        <p className="text-2xl font-bold my-2" style={{ color: 'var(--navy-dark)' }}>$6,500 <span className="text-lg font-normal">/ month</span></p>
                        <p className="text-sm text-gray-600">Total investment of $78,000. A 13% discount, saving $12,000 over the year for compounding results.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--gold-light)' }}>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy-dark)' }}>Ready to Grow Your Practice?</h3>
                    <p className="text-gray-800 mb-6">Click the button below to securely complete the initial payment and kickstart your marketing campaign.</p>
                    <a 
                      href="https://invoice.stripe.com/i/acct_1PPzyLIdVAWoymDG/live_YWNjdF8xUFB6eUxJZFZBV295bURHLF9TUzJEWWhxNEFFZWVxdENCSU1BTGFseVpXckNkSDVRLDEzOTc4NzUyMw0200yMjGZla4?s=db" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proposal-gradient-bg inline-block text-white font-bold py-4 px-8 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105"
                    >
                      Proceed to Payment
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperkiddosProposalPage;
