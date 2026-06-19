import React, { useState, useEffect } from 'react';
import { trackRender } from '../utils/profiler';
import { useStore } from '../store/useStore';
import { CustomSelect } from '../components/CustomSelect';
import { 
  ShieldCheck, 
  Accessibility, 
  Database, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2,
  Volume2,
  AlertCircle,
  Shield,
  Key,
  AlertTriangle
} from 'lucide-react';

// Cookie Helpers

const setCookie = (name: string, val: string) => {
  document.cookie = `${name}=${val}; path=/; max-age=3600; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=-1; SameSite=Lax`;
};

export const A11yStorage: React.FC = () => {
  const { showAlertModal } = useStore();
  // JWT state
  const [jwtToken, setJwtToken] = useState('');
  const [jwtStorage, setJwtStorage] = useState<'state' | 'localStorage' | 'cookie'>('state');

  const generateToken = () => {
    const payload = { sub: 'shreesh-sde', role: 'intern', exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify(payload)) + '.mock_signature';
    setJwtToken(token);
    
    // Clear previous storage
    localStorage.removeItem('jwt_access_token');
    deleteCookie('jwt_access_token');
    
    // Apply initial storage
    if (jwtStorage === 'localStorage') {
      localStorage.setItem('jwt_access_token', token);
    } else if (jwtStorage === 'cookie') {
      setCookie('jwt_access_token', token);
    }
  };

  const handleJwtStorageChange = (dest: 'state' | 'localStorage' | 'cookie') => {
    setJwtStorage(dest);
    if (!jwtToken) return;

    // Clear previous
    localStorage.removeItem('jwt_access_token');
    deleteCookie('jwt_access_token');

    // Write to new
    if (dest === 'localStorage') {
      localStorage.setItem('jwt_access_token', jwtToken);
    } else if (dest === 'cookie') {
      setCookie('jwt_access_token', jwtToken);
    }
  };

  const simulateXss = () => {
    if (jwtStorage === 'localStorage') {
      showAlertModal(
        '💥 XSS Script Attack Successful!',
        `An attacker injected a malicious script and read your JWT from localStorage:\n\nValue: "${localStorage.getItem('jwt_access_token')}"\n\nLocalStorage has no scripting barrier! Cross-site scripts can read all localStorage payloads.`,
        'danger'
      );
    } else if (jwtStorage === 'cookie') {
      showAlertModal(
        '🛡️ XSS Script Attack Mitigated!',
        `An attacker script tried to access your cookies via "document.cookie", but it could NOT read the cookie "jwt_access_token".\n\nReason: The cookie is marked 'HttpOnly', meaning JavaScript has zero access!`,
        'success'
      );
    } else {
      showAlertModal(
        '🛡️ XSS Script Attack Mitigated!',
        `An attacker script tried to scan the storage tiers, but could NOT extract the JWT token.\n\nReason: The token is stored in memory closure (React state) and is invisible to standard global document queries!`,
        'success'
      );
    }
  };

  const simulateCsrf = () => {
    if (jwtStorage === 'cookie') {
      showAlertModal(
        '💥 CSRF Attack Successful!',
        `Because standard cookies are automatically attached by the browser to requests matching the origin, a malicious external site triggered an automatic state-modifying action on your behalf!\n\nMitigation: Ensure SameSite is set to 'Strict' or 'Lax', or include anti-CSRF request headers.`,
        'danger'
      );
    } else {
      showAlertModal(
        '🛡️ CSRF Attack Mitigated!',
        `An attacker site tried to auto-submit a cross-site request, but the attack failed!\n\nReason: The token is stored in LocalStorage or InMemory State. Since the browser does NOT automatically attach LocalStorage/State items to requests, the attacker request carried zero authorization credentials!`,
        'success'
      );
    }
  };

  const getSecurityMatrix = () => {
    switch (jwtStorage) {
      case 'state':
        return {
          xss: 'Safe',
          xssDesc: 'Memory variables are protected inside React closures and cannot be inspected by external XSS script inputs.',
          csrf: 'Safe',
          csrfDesc: 'InMemory tokens are not automatically transmitted by the browser, shielding requests from CSRF triggers.',
        };
      case 'localStorage':
        return {
          xss: 'Vulnerable',
          xssDesc: 'Any injected script can execute "localStorage.getItem()" and retrieve the access token instantly.',
          csrf: 'Safe',
          csrfDesc: 'Tokens in localStorage must be manually added to request headers, blocking CSRF auto-transmissions.',
        };
      case 'cookie':
        return {
          xss: 'Safe',
          xssDesc: 'Marking the cookie as HttpOnly blocks client-side scripts from reading the access token.',
          csrf: 'Vulnerable',
          csrfDesc: 'Browsers automatically append cookies to matching HTTP requests. Protect using SameSite constraints.',
        };
    }
  };

  const matrix = getSecurityMatrix();

  // Storage states
  const [storageType, setStorageType] = useState<'local' | 'session' | 'cookie'>('local');
  const [storeKey, setStoreKey] = useState('');
  const [storeValue, setStoreValue] = useState('');
  const [encrypt, setEncrypt] = useState(true);
  const [storageItems, setStorageItems] = useState<{ key: string; value: string; raw: string; isEncrypted: boolean }[]>([]);

  // Accessibility States
  const [announcement, setAnnouncement] = useState('');
  const [a11yName, setA11yName] = useState('');
  const [a11yRole, setA11yRole] = useState('Developer');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    trackRender('A11yStoragePage');
  });

  // Load storage list based on type
  const loadStorageItems = () => {
    const list: { key: string; value: string; raw: string; isEncrypted: boolean }[] = [];
    
    if (storageType === 'local') {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && !k.startsWith('presidio-')) { // Skip dashboard internals
          const rawVal = localStorage.getItem(k) || '';
          let isBase64 = false;
          let decrypted = rawVal;
          try {
            // Very simple check to see if it is base64 encoded by us
            if (rawVal.startsWith('sec:')) {
              decrypted = atob(rawVal.substring(4));
              isBase64 = true;
            }
          } catch (e) {
            // Not base64
          }
          list.push({ key: k, value: decrypted, raw: rawVal, isEncrypted: isBase64 });
        }
      }
    } else if (storageType === 'session') {
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k) {
          const rawVal = sessionStorage.getItem(k) || '';
          let isBase64 = false;
          let decrypted = rawVal;
          try {
            if (rawVal.startsWith('sec:')) {
              decrypted = atob(rawVal.substring(4));
              isBase64 = true;
            }
          } catch (e) {
            // Not base64
          }
          list.push({ key: k, value: decrypted, raw: rawVal, isEncrypted: isBase64 });
        }
      }
    } else {
      // Cookies
      document.cookie.split(';').forEach(c => {
        const trimStr = c.trim();
        if (trimStr) {
          const idx = trimStr.indexOf('=');
          const k = trimStr.substring(0, idx);
          const rawVal = trimStr.substring(idx + 1);
          let isBase64 = false;
          let decrypted = decodeURIComponent(rawVal);
          try {
            if (decrypted.startsWith('sec:')) {
              decrypted = atob(decrypted.substring(4));
              isBase64 = true;
            }
          } catch (e) {
            // Not base64
          }
          list.push({ key: k, value: decrypted, raw: rawVal, isEncrypted: isBase64 });
        }
      });
    }
    setStorageItems(list);
  };

  useEffect(() => {
    loadStorageItems();
  }, [storageType]);

  const handleSaveStorage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeKey.trim() || !storeValue.trim()) return;

    // Encrypt (Base64 Obfuscation demo)
    const finalVal = encrypt ? 'sec:' + btoa(storeValue) : storeValue;

    if (storageType === 'local') {
      localStorage.setItem(storeKey, finalVal);
    } else if (storageType === 'session') {
      sessionStorage.setItem(storeKey, finalVal);
    } else {
      setCookie(storeKey, encodeURIComponent(finalVal));
    }

    triggerAnnouncement(`Saved key "${storeKey}" to ${storageType} storage.`);
    setStoreKey('');
    setStoreValue('');
    loadStorageItems();
  };

  const handleDeleteItem = (key: string) => {
    if (storageType === 'local') {
      localStorage.removeItem(key);
    } else if (storageType === 'session') {
      sessionStorage.removeItem(key);
    } else {
      deleteCookie(key);
    }
    triggerAnnouncement(`Deleted key "${key}" from ${storageType} storage.`);
    loadStorageItems();
  };

  const triggerAnnouncement = (msg: string) => {
    setAnnouncement(msg);
    // Auto clear screen reader announcement after it fires
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};
    if (!a11yName.trim()) {
      newErrors.name = 'Full name is required to register.';
      setErrors(newErrors);
      triggerAnnouncement('Form submission failed due to validation errors.');
    } else {
      setErrors({});
      triggerAnnouncement(`Congratulations ${a11yName}, registration successful as ${a11yRole}!`);
      setA11yName('');
    }
  };

  // Keyboard navigation custom handler for card Focus
  const handleKeyInteraction = (e: React.KeyboardEvent, cardId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerAnnouncement(`Interacted with accessibility badge for ${cardId} using keyboard.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <ShieldCheck size={24} className="text-brand-500" />
          A11y & Secure Storage Manager
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Writing secure browser assets, implementing full ARIA accessible flows, and managing dynamic screen announcements.
        </p>
      </div>

      {/* Screen Reader Announcements live area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 text-slate-200">
        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Volume2 size={20} className={announcement ? 'animate-bounce' : ''} />
        </div>
        <div className="flex-1 space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">
            Screen Reader Announcer Console (aria-live)
          </span>
          <div 
            aria-live="polite" 
            className="text-xs font-mono text-indigo-400 font-semibold min-h-4"
          >
            {announcement || 'System idle. Trigger storage or form actions to emit announcements...'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Console Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Database size={18} className="text-brand-500" />
            Storage Console
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select a database tier, input values, and toggle obfuscation (Base64 encoding/decoding) to simulate database encryption standards.
          </p>

          <form onSubmit={handleSaveStorage} className="space-y-3 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-900">
            {/* Storage selectors */}
            <div className="flex bg-slate-200/50 dark:bg-zinc-900 p-1 rounded-xl text-xs gap-1 border border-slate-200/30 dark:border-zinc-850">
              {(['local', 'session', 'cookie'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setStorageType(type)}
                  className={`flex-1 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-all ${
                    storageType === type 
                      ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-650'
                  }`}
                >
                  {type} Storage
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="store-key" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Key Name</label>
                <input
                  id="store-key"
                  type="text"
                  placeholder="user_token"
                  value={storeKey}
                  onChange={e => setStoreKey(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label htmlFor="store-value" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Value Payload</label>
                <input
                  id="store-value"
                  type="text"
                  placeholder="secret123"
                  value={storeValue}
                  onChange={e => setStoreValue(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={encrypt}
                  onChange={() => setEncrypt(prev => !prev)}
                  className="rounded border-slate-350 text-brand-600 focus:ring-brand-500 mr-2 cursor-pointer h-4 w-4"
                />
                Obfuscate before storing
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-brand-500/10 transition-colors"
              >
                <Plus size={12} />
                Write Key
              </button>
            </div>
          </form>

          {/* Storage list display */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-display text-slate-500 uppercase tracking-wide text-[10px]">Database Records ({storageItems.length}):</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[160px] overflow-y-auto pr-1">
              {storageItems.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic">
                  No records stored under {storageType} storage.
                </div>
              ) : (
                storageItems.map(item => (
                  <div key={item.key} className="py-2.5 flex items-center justify-between text-xs group">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{item.key}</span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        {item.isEncrypted ? (
                          <span className="text-[10px] text-green-500 flex items-center gap-0.5">
                            <Lock size={10} />
                            Obfuscated:
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Unlock size={10} />
                            Plaintext:
                          </span>
                        )}
                        <span className="font-mono text-[10px] truncate max-w-[180px]">{item.raw}</span>
                        {item.isEncrypted && (
                          <span className="text-[10px] text-indigo-400 font-mono">({item.value})</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.key)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                      aria-label={`Delete storage key ${item.key}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Accessibility form */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Accessibility size={18} className="text-brand-500" />
            a11y Form Console
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This registration portal demonstrates standard accessibility patterns: custom outline focus borders, keyboard tab index tracking, and semantic ARIA details.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4 bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-100 dark:border-zinc-900">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                value={a11yName}
                onChange={e => setA11yName(e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder="Shreesh Gupta"
                className={`w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-zinc-800'
                }`}
              />
              {errors.name && (
                <p id="name-error" className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reg-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Intern Role
              </label>
              <CustomSelect
                id="reg-role"
                value={a11yRole}
                onChange={val => setA11yRole(val)}
                options={[
                  { value: 'SDE Intern', label: 'SDE Intern' },
                  { value: 'Frontend Specialist', label: 'Frontend Specialist' },
                  { value: 'QA Engineer', label: 'QA Engineer' },
                  { value: 'Security Analyst', label: 'Security Analyst' },
                ]}
                label="Intern Role"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-brand-500/10 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 transition-colors"
            >
              Submit Registration
            </button>
          </form>

          {/* Keyboard navigable element */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-display text-slate-500 uppercase tracking-wide text-[10px]">Keyboard Navigation Challenge:</h3>
            <div 
              tabIndex={0}
              onKeyDown={e => handleKeyInteraction(e, 'presidio-badge')}
              className="p-3 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs hover:border-brand-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Interactive status badge. Focus this element and press Space or Enter to test custom keyboard trigger."
            >
              <span className="font-semibold text-slate-650 dark:text-slate-300">Interactive Focus Badge</span>
              <span className="text-[10px] bg-slate-100 dark:bg-zinc-900 text-slate-400 px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider">
                Tab Target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JWT Security Arena */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Shield size={18} className="text-brand-500" />
            JWT Access Token Security Playground
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access tokens can be stored in multiple locations in the browser. Each location has security trade-offs concerning Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-3.5 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-900 flex flex-col justify-center">
            <div>
              <button
                onClick={generateToken}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                <Key size={12} /> {jwtToken ? 'Regenerate Mock JWT' : 'Generate Mock JWT'}
              </button>
              {jwtToken && (
                <div className="mt-2 text-[9px] font-mono bg-slate-900 text-brand-300 p-2 rounded-lg border border-slate-800 break-all select-all">
                  {jwtToken}
                </div>
              )}
              {jwtToken && (
                <div>
                  <label htmlFor="jwtStorage" className="block text-[10px] font-bold text-slate-455 uppercase tracking-wide mb-1.5">Select Storage Destination</label>
                  <CustomSelect
                    id="jwtStorage"
                    value={jwtStorage}
                    onChange={(val) => handleJwtStorageChange(val as any)}
                    options={[
                      { value: 'state', label: 'InMemory React State' },
                      { value: 'localStorage', label: 'LocalStorage' },
                      { value: 'cookie', label: 'HTTP-Only Cookie (Simulated)' },
                    ]}
                    label="Select Storage Destination"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Matrix & Explanations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* XSS Status Card */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/20 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">XSS Vector Threat</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    matrix.xss === 'Safe' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                  }`}>
                    {matrix.xss}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{matrix.xssDesc}</p>
              </div>

              {/* CSRF Status Card */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/20 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CSRF Vector Threat</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    matrix.csrf === 'Safe' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                  }`}>
                    {matrix.csrf}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{matrix.csrfDesc}</p>
              </div>
            </div>

            {/* Attack Simulators */}
            {jwtToken && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={simulateXss}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 text-xs font-semibold rounded-lg cursor-pointer border border-red-200/40"
                >
                  <AlertTriangle size={12} /> Simulate XSS Script Extraction
                </button>
                <button
                  onClick={simulateCsrf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 text-amber-650 dark:text-amber-400 text-xs font-semibold rounded-lg cursor-pointer border border-amber-200/40"
                >
                  <Shield size={12} /> Simulate CSRF Auto-Submit Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
