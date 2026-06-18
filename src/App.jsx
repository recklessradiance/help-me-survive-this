import { useState, useEffect, useRef } from 'react'

function App() {
  const [languageMode, setLanguageMode] = useState("English");
  const [scenario, setScenario] = useState("Zombie Apocalypse");
  const [location, setLocation] = useState("Home Office");
  const [inventory, setInventory] = useState(["Half-eaten sandwich", "Lint", "USB Cable"]);
  const [itemInput, setItemInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState("");
  const [statusType, setStatusType] = useState("system");
  const [displayedStatus, setDisplayedStatus] = useState("");
  const [guide, setGuide] = useState(null);

  const [uplinkMode, setUplinkMode] = useState(() => localStorage.getItem("survival_uplink_mode") || "cloud");

  useEffect(() => {
    localStorage.setItem("survival_uplink_mode", uplinkMode);
  }, [uplinkMode]);
  useEffect(() => {
    setGuide(null);
    setSystemStatus("");
    setDisplayedStatus("");
  }, [languageMode, scenario, location, inventory]);
  useEffect(() => {
    if (!systemStatus) return;
    setDisplayedStatus("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedStatus(prev => prev + systemStatus.charAt(index));
      index++;
      if (index >= systemStatus.length) {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [systemStatus]);
  
  const logDisplayRef = useRef(null);
  const guideRef = useRef(null);

  useEffect(() => {
    if (guide && guideRef.current) {
      // Small timeout to allow element to render fully in DOM before focus
      setTimeout(() => {
        guideRef.current.focus();
      }, 50);
    }
  }, [guide]);

  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const handleClose = () => {
    window.location.href = "https://recklessradiance.github.io/";
  };

  const handleMinimize = () => {
    setMinimized(prev => !prev);
  };

  const handleMaximize = () => {
    setMaximized(prev => !prev);
  };

  useEffect(() => {
    // Print initial boot diagnostics log based on language
    const readyMessages = {
      English: "SYSTEM READY. CHOOSE YOUR HAZARD TO PROCEED.",
      Tenglish: "SYSTEM READY GA UNDI. HAZARD CHOOSE CHEYANDI.",
      Hinglish: "SYSTEM READY HAI. HAZARD SPECIFY KAREIN."
    };
    updateStatus(readyMessages[languageMode] || "SYSTEM READY.");
  }, [languageMode]);

  useEffect(() => {
    // Auto-scroll log display to bottom
    if (logDisplayRef.current) {
      logDisplayRef.current.scrollTop = logDisplayRef.current.scrollHeight;
    }
  }, [displayedStatus, guide]);

  const updateStatus = (text, type = "system") => {
    const prefix = type === "error" ? "[ERR]" : "[SYS]";
    setSystemStatus(`${prefix} ${new Date().toLocaleTimeString()}: ${text}`);
    setStatusType(type);
  };



  const handleAddItem = (e) => {
    e.preventDefault();
    if (itemInput.trim()) {
      setInventory(prev => [...prev, itemInput.trim()]);
      setItemInput("");
    }
  };

  const handleRemoveItem = (index) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  const typeStatus = async (text, type = "system") => {
    updateStatus(text, type);
    // Prefix '[SYS] HH:MM:SS: ' is 15 characters. 
    // Multiply total length by 15ms typing interval, then add 3000ms pause.
    const typingDuration = (15 + text.length) * 15;
    await sleep(typingDuration + 3000);
  };

  const getStatusLines = (mode) => {
    return [
      "Calculating telemetry data...",
      "Analyzing inventory items...",
      "Generating guide output..."
    ];
  };

  const buildClientMockGuide = (scenario, location, inventory, mode) => {
    const gearList = inventory.join(" and ") || "your bare hands";
    
    const guidesByLanguage = {
      English: {
        scenarioName: `[OFFLINE] NO ONE CAN HELP YOU.`,
        threatLevel: "ABSOLUTE ZERO",
        steps: [
          {
            title: "Panic and Accept Fate",
            description: `Your current disaster "${scenario}" is absolute. The network links are dead, the satellites are fried, and frankly, no one can help you.`,
            survivalRateMultiplier: 0.00
          },
          {
            title: "Assess Your Trash",
            description: `You are stuck at "${location}" with: [${gearList}]. Think about how this junk is going to save you. Hint: it won't.`,
            survivalRateMultiplier: 0.05
          },
          {
            title: "Shed Some Tears",
            description: "When all else fails, a good crying session can temporarily relieve stress. Do it now.",
            survivalRateMultiplier: 0.10
          },
          {
            title: "Make Peace With the Universe",
            description: "Sit back and think of all your life regrets. You'll have plenty of time for that.",
            survivalRateMultiplier: 0.25
          },
          {
            title: "Prepare for Impact",
            description: "Find a comfortable spot, sit down, and wait for the inevitable doom.",
            survivalRateMultiplier: 1.00
          }
        ],
        recommendedGear: "A working internet connection or an active paid AI account",
        humorousQuote: "Uplinks offline. Telemetry lost. No one can help you."
      },
      Tenglish: {
        scenarioName: `[OFFLINE] INKA EVADU NINNU KAPADALEDU.`,
        threatLevel: "ASALU KANAPADATLEDU",
        steps: [
          {
            title: "Kangaaru Padi Sachipo",
            description: `Nee badhalu chusi navvukodaaniki AI devullu kuda offline poyaru. Satellites anni fasak. Inka evadu ninnu kapadaledu.`,
            survivalRateMultiplier: 0.00
          },
          {
            title: "Cheddi Chetta Vethuko",
            description: `Nuvvu "${location}" daggara stuck ayyav, adi kuda nee sanchi lo unna [${gearList}] tho. Ee chetta tho em chesthav ra nanna? Emi cheyalev.`,
            survivalRateMultiplier: 0.05
          },
          {
            title: "Deeni Valla Chala Nastam",
            description: "Prathi chinna vishayaniki stress ayyi em labham ledhu. Gunde aagipoye risk undhi.",
            survivalRateMultiplier: 0.10
          },
          {
            title: "Devudni Thaluchuko",
            description: "Inka ninnu aa paina unna devude kapadaali. Gudi metlu ekki dhandam pettuko.",
            survivalRateMultiplier: 0.25
          },
          {
            title: "Pranathaalu Vadhilesi Paduko",
            description: "Prasanthamga kurchuni goyya thavvuko. Poye kaalam vacchindi.",
            survivalRateMultiplier: 1.00
          }
        ],
        recommendedGear: "Pani chese wifi signal ledha dabbulunna developer account",
        humorousQuote: "Network ledhu. Key ledhu. Inka chusi chavu!"
      },
      Hinglish: {
        scenarioName: `[OFFLINE] AB KOI TUMHARI MADAD NAHI KAR SAKTA.`,
        threatLevel: "BILKUL ZERO",
        steps: [
          {
            title: "Ghabrao aur Haar Mano",
            description: `Sare AI devta offline chale gaye hain. Satellites ka dabba gul ho gaya hai. Ab koi tumhari madad nahi kar sakta.`,
            survivalRateMultiplier: 0.00
          },
          {
            title: "Apna Kachra Dekho",
            description: `Tum "${location}" par stuck ho aur tumhare jhole mein [${gearList}] hai. Is kachre se kya hi hoga? Kuch nahi.`,
            survivalRateMultiplier: 0.05
          },
          {
            title: "Rona Shuru Karo",
            description: "Aise situation mein rona hi ek aakhri option bachta hai. Aansu bahaao.",
            survivalRateMultiplier: 0.10
          },
          {
            title: "Bhagwan ko Yaad Karo",
            description: "Bhagwan ke darbaar mein arzi lagao aur shanti se baithe raho.",
            survivalRateMultiplier: 0.25
          },
          {
            title: "Aakhri Dua Mango",
            description: "Shanti se baitho aur aaram se apna khel khatam hone ka wait karo.",
            survivalRateMultiplier: 1.00
          }
        ],
        recommendedGear: "Chalta hua internet connection ya paid AI account",
        humorousQuote: "Uplink gayab. Gyaan khatam. Ab dekho aur maro!"
      }
    };

    return guidesByLanguage[mode] || guidesByLanguage.English;
  };

  const runSimulation = async () => {
    setLoading(true);
    setGuide(null);
    const activeScenario = scenario;
    const inventoryStr = inventory.join(", ");
    
    const lines = getStatusLines(languageMode);
    
    await typeStatus(lines[0]);
    await typeStatus(lines[1]);
    await typeStatus(lines[2]);
    await typeStatus(lines[3]);
    await typeStatus(lines[4]);
    await typeStatus(lines[5]);
    
    try {
      let data;
      const providerHeader = uplinkMode === "local" ? "local" : "cloud";
      updateStatus(`Directing payload telemetry to central core processor (Spring Boot @ port 8080)...`, "system");

      try {
        throw new Error("offline");
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Provider": providerHeader,
            "X-Language": languageMode
          },
          body: JSON.stringify({
            scenario: activeScenario,
            location: location,
            inventory: inventory
          })
        });

        if (!response.ok) {
          throw new Error(`Central core returned status ${response.status}`);
        }

        data = await response.json();
        updateStatus("Successfully retrieved core guidance response.", "system");

      } catch (backendError) {
        updateStatus(`Central core link failure: ${backendError.message}. Engaging browser-side offline doomsday fallback...`, "system");
        await sleep(1500);
        data = buildClientMockGuide(activeScenario, location, inventory, languageMode);
      }

      await typeStatus(lines[6]);
      await typeStatus(lines[7]);
      setGuide(data);
    } catch (err) {
      logErrorDiagnostics(err.message);
    } finally {
      setLoading(false);
    }
  };


  const logErrorDiagnostics = (message) => {
    updateStatus(`!!! SYSTEM ALERT: CRITICAL CORE FAILURE !!!\n${message}\n[TIPS] Verify Gemini API Key configuration.`, "error");
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <>
      <div 
        className={`terminal-window ${maximized ? 'maximized' : ''} ${minimized ? 'minimized' : ''}`}
      >
      <div 
        className="title-bar" 
        onClick={minimized ? handleMinimize : undefined} 
        style={{ cursor: minimized ? 'pointer' : 'default' }}
        title={minimized ? "Click to restore window" : ""}
      >
        <div className="controls">
          <button className="close" onClick={handleClose} title="Reset Terminal" aria-label="Reset Terminal"></button>
          <button className="minimize" onClick={handleMinimize} title="Minimize Terminal" aria-label="Minimize Terminal"></button>
          <button className="maximize" onClick={handleMaximize} title="Maximize Terminal" aria-label="Maximize/Restore Terminal"></button>
        </div>
        <h1 className="title">Help me survive this</h1>
        <div className="title-languages" role="group" aria-label="Console Language Mode Selection">
          <button 
            className={`lang-btn ${languageMode === 'English' ? 'pressed' : ''}`}
            onClick={(e) => { e.stopPropagation(); setLanguageMode('English'); }}
            disabled={loading}
            aria-pressed={languageMode === 'English'}
            aria-label="Set language to English"
          >
            ENG
          </button>
          <button 
            className={`lang-btn ${languageMode === 'Tenglish' ? 'pressed' : ''}`}
            onClick={(e) => { e.stopPropagation(); setLanguageMode('Tenglish'); }}
            disabled={loading}
            aria-pressed={languageMode === 'Tenglish'}
            aria-label="Set language to Tenglish"
          >
            TEL
          </button>
          <button 
            className={`lang-btn ${languageMode === 'Hinglish' ? 'pressed' : ''}`}
            onClick={(e) => { e.stopPropagation(); setLanguageMode('Hinglish'); }}
            disabled={loading}
            aria-pressed={languageMode === 'Hinglish'}
            aria-label="Set language to Hinglish"
          >
            HIN
          </button>
        </div>
      </div>
      
      <div className="terminal-body">
        {/* Input parameters panel */}
        <div className="config-panel">
          <div className="form-group">
            <label>Uplink Mode</label>
            <div className="toggle-switch-container" role="group" aria-label="Satellite Uplink Mode">
              <button 
                type="button"
                className={`toggle-btn ${uplinkMode === 'cloud' ? 'active' : ''}`}
                onClick={() => setUplinkMode('cloud')}
                disabled={loading}
                aria-pressed={uplinkMode === 'cloud'}
                aria-label="Use Cloud Satellite Uplink"
              >
                CLOUD
              </button>
              <button 
                type="button"
                className={`toggle-btn ${uplinkMode === 'local' ? 'active' : ''}`}
                onClick={() => setUplinkMode('local')}
                disabled={loading}
                aria-pressed={uplinkMode === 'local'}
                aria-label="Use Local Engine"
              >
                LOCAL
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="scenario-input">what do you need help with?</label>
            <textarea 
              id="scenario-input"
              placeholder="Describe your doom in 2-3 sentences..." 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={loading}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location-input">where are you right now?</label>
            <input 
              id="location-input"
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-input">what do you have with you</label>
            <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '5px' }}>
              <input 
                id="item-input"
                type="text" 
                placeholder="Add gear..." 
                value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={loading} style={{ width: '40px' }} aria-label="Add inventory item">+</button>
            </form>
            <div className="inventory-list">
              {inventory.map((item, idx) => (
                <div key={idx} className="inventory-item">
                  {item}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItem(idx)} 
                    disabled={loading}
                    aria-label={`Remove ${item}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="action-btn"
            disabled={loading || !scenario.trim() || inventory.length === 0}
            onClick={runSimulation}
            aria-label="Run doom survival simulation"
          >
            {loading ? "..." : "RUN"}
          </button>
        </div>

        {/* Live log feed panel */}
        <div className="log-display" ref={logDisplayRef}>
          <div className={`log-entry log-${statusType}`} style={{ whiteSpace: 'pre-wrap' }}>
            {displayedStatus}
          </div>

          {guide && (
            <div className="log-entry" ref={guideRef} tabIndex={-1} style={{ outline: 'none' }}>
              <div className="log-guide-title">{guide.scenarioName}</div>
              <div className="threat-banner">THREAT LEVEL: {guide.threatLevel}</div>
              
              {guide.steps && guide.steps.map((step, idx) => (
                <div className="step-card" key={idx}>
                  <div className="step-header">
                    <span>STEP {idx + 1}: {step.title}</span>
                    <span className="step-rate">Surv. Mult: x{step.survivalRateMultiplier}</span>
                  </div>
                  <div>{step.description}</div>
                </div>
              ))}

              <div className="gear-box">
                <strong>Recommended Gear:</strong> {guide.recommendedGear}
              </div>

              <div className="quote-box">
                <strong>Quote of the Day:</strong> "{guide.humorousQuote}"
              </div>
            </div>
          )}

          {loading && <div className="cursor"></div>}
        </div>
      </div>
    </div>
    <div className="mac-dock-container">
      <div className="mac-dock">
        <div 
          className={`dock-item-wrapper ${minimized ? 'minimized' : ''}`}
          onClick={() => setMinimized(prev => !prev)}
        >
          <div className="dock-tooltip">Help me survive this</div>
          <div className="dock-item">
            🛡️
          </div>
          <div className="dock-indicator"></div>
        </div>
        
        <div className="dock-separator"></div>

        <div 
          className="dock-item-wrapper"
          onClick={() => window.location.href = "https://recklessradiance.github.io/"}
        >
          <div className="dock-tooltip">Portfolio Website</div>
          <div className="dock-item" style={{ background: 'linear-gradient(135deg, #475569, #1e293b)' }}>
            🌐
          </div>
        </div>

        <div 
          className="dock-item-wrapper"
          onClick={() => window.location.href = "https://linkedin.com/in/rcreddyn"}
        >
          <div className="dock-tooltip">LinkedIn Profile</div>
          <div className="dock-item" style={{ background: 'linear-gradient(135deg, #0a66c2, #004b8d)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
            </svg>
          </div>
        </div>

        <div 
          className="dock-item-wrapper"
          onClick={() => window.location.href = "mailto:rcreddy1997@gmail.com"}
        >
          <div className="dock-tooltip">Email Me</div>
          <div className="dock-item" style={{ background: 'linear-gradient(135deg, #5fc3f3, #0a84ff)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" fill="rgba(255, 255, 255, 0.15)"/>
              <path d="M2 5l10 7.5L22 5" />
              <path d="M2 19l7-5.5" />
              <path d="M22 19l-7-5.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>

  </>
);
}

export default App;

// OS window layout and dock controls active
