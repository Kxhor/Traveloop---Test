import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../components.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="flex w-full min-h-screen flex-col md:flex-row bg-surface text-on-surface">
      <!-- Left Side: Login Form -->
      <div class="flex-1 flex flex-col items-center justify-center p-gutter z-10 md:bg-surface/40 md:backdrop-blur-xl">
        <div class="w-full max-w-[440px] flex flex-col gap-base">
          <!-- Logo Header -->
          <div class="flex flex-col items-center mb-8 gap-2">
            <h1 class="text-headline-lg font-headline-lg text-primary tracking-tight">Traveloop</h1>
            <p class="text-on-surface-variant font-body-md text-body-md">Your journey begins here.</p>
          </div>
          
          <!-- Login/Register Card -->
          <main class="bg-surface-container-lowest rounded-xl p-8 shadow-2xl border border-surface-container flex flex-col gap-gutter">
            <!-- Tabs to toggle sign in / create account -->
            <div class="flex bg-surface-container rounded-lg p-1 mb-2">
              <button id="tab-login" class="flex-grow py-2 rounded-md font-semibold text-sm transition-all bg-surface-container-lowest text-primary shadow-sm">Sign In</button>
              <button id="tab-register" class="flex-grow py-2 rounded-md font-semibold text-sm transition-all text-on-surface-variant">Create Account</button>
            </div>

            <!-- Login Form -->
            <form id="form-login" class="flex flex-col gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-sm text-label-sm text-on-surface-variant px-1" for="login-email">Email Address</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">mail</span>
                  <input class="w-full pl-10 pr-4 py-3 bg-surface-container/50 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" id="login-email" placeholder="explorer@zuno.travel" type="email" required/>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between items-center px-1">
                  <label class="font-label-sm text-label-sm text-on-surface-variant" for="login-password">Password</label>
                </div>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">lock</span>
                  <input class="w-full pl-10 pr-12 py-3 bg-surface-container/50 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" id="login-password" placeholder="••••••••" type="password" required/>
                </div>
              </div>
              
              <button type="submit" id="btn-login" class="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-md text-headline-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-xl">login</span>
                Initialize Journey
              </button>
              <div id="login-error" class="hidden text-error text-sm text-center"></div>
            </form>

            <!-- Register Form -->
            <form id="form-register" class="flex flex-col gap-5 hidden">
              <div class="flex flex-col gap-1.5">
                <label class="font-label-sm text-label-sm text-on-surface-variant px-1" for="reg-username">Username</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">person</span>
                  <input class="w-full pl-10 pr-4 py-3 bg-surface-container/50 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" id="reg-username" placeholder="Choose a username" type="text" required/>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="font-label-sm text-label-sm text-on-surface-variant px-1" for="reg-email">Email Address</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">mail</span>
                  <input class="w-full pl-10 pr-4 py-3 bg-surface-container/50 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" id="reg-email" placeholder="explorer@zuno.travel" type="email" required/>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="font-label-sm text-label-sm text-on-surface-variant px-1" for="reg-password">Password</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-secondary transition-colors">lock</span>
                  <input class="w-full pl-10 pr-12 py-3 bg-surface-container/50 border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-outline-variant" id="reg-password" placeholder="••••••••" type="password" required minlength="6"/>
                </div>
              </div>
              
              <button type="submit" id="btn-register" class="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-md text-headline-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-xl">person_add</span>
                Create Account
              </button>
              <div id="register-error" class="hidden text-error text-sm text-center"></div>
            </form>

            <!-- Bottom redirect hint -->
            <div class="flex flex-col items-center gap-4 pt-4 border-t border-outline-variant/30">
              <p class="font-body-md text-body-md text-on-surface-variant text-center" id="auth-hint">
                New to Traveloop? 
                <button id="switch-to-register" class="text-secondary font-semibold ml-1 hover:underline underline-offset-4">Create an account</button>
              </p>
            </div>
          </main>
        </div>
      </div>
      
      <!-- Right Side: Hero Section -->
      <div class="hidden md:block flex-[1.5] relative overflow-hidden group">
        <img alt="Serene mountain landscape" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnNtf3t-S4U6xcZdau2lHRfLKTXuN3mSvqSA2cLkEOETcon43AnRwIC9Oj5i-VLORIXlWApMrhtOIHqgliJr6hadwUNrbKWrntyj-WaDltaj1Cke6b72T4DfjEYyIRbasyCh7AKmwugW06audsmFkt8Q8J9baupMM109YPIHQZ0r7Dd46JoNFawzTyjKIduhmtvCtS7HEdoMr6UapC64mR2RkQw-5FzGu7Q-diKLUSrulDrLDo2X_px81SM2T4Uz8O_Co3GTM-wY2r"/>
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent"></div>
        <div class="absolute bottom-12 left-12 right-12 z-10 text-white">
          <h2 class="text-headline-xl font-headline-xl mb-4 drop-shadow-lg text-black font-bold">Explore the Unknown</h2>
          <p class="text-body-lg font-body-lg max-w-md drop-shadow-md text-on-surface">Discover breathtaking destinations and create memories that last a lifetime with Traveloop's premium travel concierge.</p>
        </div>
      </div>
    </div>
  `;

  // Tab switching elements
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const hint = document.getElementById('auth-hint');

  function showLogin() {
    tabLogin.className = 'flex-grow py-2 rounded-md font-semibold text-sm transition-all bg-surface-container-lowest text-primary shadow-sm';
    tabRegister.className = 'flex-grow py-2 rounded-md font-semibold text-sm transition-all text-on-surface-variant';
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    hint.innerHTML = 'New to Traveloop? <button id="switch-to-register" class="text-secondary font-semibold ml-1 hover:underline underline-offset-4">Create an account</button>';
    bindSwitch();
  }

  function showRegister() {
    tabRegister.className = 'flex-grow py-2 rounded-md font-semibold text-sm transition-all bg-surface-container-lowest text-primary shadow-sm';
    tabLogin.className = 'flex-grow py-2 rounded-md font-semibold text-sm transition-all text-on-surface-variant';
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    hint.innerHTML = 'Already have an account? <button id="switch-to-login" class="text-secondary font-semibold ml-1 hover:underline underline-offset-4">Sign In</button>';
    bindSwitch();
  }

  function bindSwitch() {
    document.getElementById('switch-to-register')?.addEventListener('click', showRegister);
    document.getElementById('switch-to-login')?.addEventListener('click', showLogin);
  }

  tabLogin.addEventListener('click', showLogin);
  tabRegister.addEventListener('click', showRegister);
  bindSwitch();

  // Login Form Submission
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');
    const errEl = document.getElementById('login-error');

    if (!email || !password) {
      errEl.textContent = 'Please fill in all fields';
      errEl.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Signing in...';
    errEl.classList.add('hidden');

    try {
      await api.auth.login(email, password);
      showToast('Welcome back!', 'success');
      router.navigate('/trips');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined">login</span> Initialize Journey';
    }
  });

  // Register Form Submission
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const btn = document.getElementById('btn-register');
    const errEl = document.getElementById('register-error');

    if (!username || !email || !password) {
      errEl.textContent = 'Please fill in all fields';
      errEl.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Creating account...';
    errEl.classList.add('hidden');

    try {
      await api.auth.register(username, email, password);
      showToast('Account created! Please sign in.', 'success');
      showLogin();
      document.getElementById('login-email').value = email;
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined">person_add</span> Create Account';
    }
  });
}
