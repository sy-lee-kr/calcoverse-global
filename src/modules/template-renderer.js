/**
 * Template Renderer Module
 */

export class TemplateRenderer {
  constructor() {
    this.templates = new Map();
    this.cache = new Map();
  }

  async initialize() {
    console.log('TemplateRenderer initialized');
    this.loadTemplates();
  }

  loadTemplates() {
    // Load default templates
    this.templates.set('default', {
      html: '<div>{{content}}</div>'
    });
    
    this.templates.set('problem', {
      html: '<div class="problem"><h2>{{title}}</h2><p>{{question}}</p></div>'
    });
  }

  render(templateName, data) {
    const template = this.templates.get(templateName);
    
    if (!template) {
      console.warn(`Template ${templateName} not found`);
      return '';
    }
    
    // Simple template rendering
    let html = template.html;
    
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, value);
    });
    
    return html;
  }

  async start() {
    console.log('TemplateRenderer started');
  }

  async stop() {
    this.cache.clear();
    console.log('TemplateRenderer stopped');
  }
}

export default TemplateRenderer;
