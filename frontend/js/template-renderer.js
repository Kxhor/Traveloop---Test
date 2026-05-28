/**
 * Template Renderer — Converts Stitch HTML screens to dynamic pages
 * Preserves original design while injecting backend data
 */

export const renderer = {
  // Store loaded template HTML
  templates: {},

  // Load template from Stitch screens
  async loadTemplate(screenName) {
    if (this.templates[screenName]) {
      console.log(`✅ Template cached: ${screenName}`);
      return this.templates[screenName];
    }

    try {
      console.log(`📥 Loading template: ${screenName}`);
      const response = await fetch(`/Stitch screens/${screenName}.html`);
      if (!response.ok) {
        throw new Error(`Template not found: ${screenName} (${response.status})`);
      }

      const html = await response.text();
      console.log(`✅ Template loaded: ${screenName} (${html.length} bytes)`);
      this.templates[screenName] = html;
      return html;
    } catch (error) {
      console.error('❌ Template load error:', error);
      throw error;
    }
  },

  // Render template with data injection
  render(html, data = {}) {
    let rendered = html;

    // Replace data placeholders: {{key}}
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{\s*${key}\s*}}`, 'g');
      rendered = rendered.replace(placeholder, value || '');
    });

    return rendered;
  },

  // Extract body content from full HTML template
  extractBody(html) {
    const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const body = match ? match[1] : html;
    console.log(`📦 Extracted body: ${body.length} bytes`);
    return body;
  },

  // Inject page into container while preserving scripts
  injectIntoDOM(container, htmlContent) {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    // Extract and run scripts
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src) {
        // Load external script
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        document.body.appendChild(newScript);
      } else {
        // Run inline script
        try {
          eval(script.textContent);
        } catch (e) {
          console.warn('Script eval error:', e);
        }
      }
    });

    // Clear scripts from temp HTML
    scripts.forEach(s => s.remove());

    // Insert into container
    container.innerHTML = temp.innerHTML;
  },
};
