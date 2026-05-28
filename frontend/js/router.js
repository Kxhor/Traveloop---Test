class Router {
  constructor() {
    this._routes = new Map();
    this._currentRoute = null;
    this._beforeNavigate = null;
    window.addEventListener('hashchange', () => this._resolve());
  }

  register(path, handler) {
    this._routes.set(path, handler);
    return this;
  }

  setGuard(fn) {
    this._beforeNavigate = fn;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  _resolve() {
    const hash = window.location.hash.slice(1) || '/login';
    const [path, ...paramParts] = hash.split('/').filter(Boolean);
    const routePath = '/' + path;

    if (this._beforeNavigate) {
      const allowed = this._beforeNavigate(routePath);
      if (!allowed) return;
    }

    const handler = this._routes.get(routePath);
    if (handler) {
      this._currentRoute = routePath;
      handler(paramParts.join('/'));
    }
  }

  start() {
    if (!window.location.hash) {
      window.location.hash = '#/login';
    }
    this._resolve();
  }
}

export const router = new Router();
