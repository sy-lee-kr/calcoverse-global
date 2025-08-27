/**
 * Calcoverse Main Application
 * Modularized version - Entry point only
 * 
 * Original: 29KB → Now: ~3KB
 * Modules: 4
 */

// Import all modules
import { CalcoverseCore } from './core/engine.js';
import { ProblemManager } from './core/problem-manager.js';
import { AnimationController } from './modules/animation-controller.js';
import { YouTubeUploader } from './modules/youtube-uploader.js';
import { TemplateRenderer } from './modules/template-renderer.js';
import { DataLoader } from './services/data-loader.js';
import { Logger } from './utils/logger.js';

/**
 * Main Application Class
 */
class CalcoverseApp {
  constructor() {
    this.logger = new Logger('CalcoverseApp');
    this.core = null;
    this.modules = new Map();
    this.isInitialized = false;
    
    console.log('🚀 Calcoverse App v2.0 - Modularized Edition');
  }

  /**
   * Initialize application
   */
  async initialize() {
    try {
      this.logger.info('Initializing Calcoverse...');
      
      // Core system
      this.core = new CalcoverseCore();
      
      // Register modules
      this.registerModules();
      
      // Initialize all modules
      await this.initializeModules();
      
      this.isInitialized = true;
      this.logger.success('✅ Calcoverse initialized successfully!');
      
      return true;
    } catch (error) {
      this.logger.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register all modules
   */
  registerModules() {
    const modules = [
      ['problemManager', new ProblemManager()],
      ['animation', new AnimationController()],
      ['youtube', new YouTubeUploader()],
      ['renderer', new TemplateRenderer()],
      ['dataLoader', new DataLoader()]
    ];

    modules.forEach(([name, instance]) => {
      this.modules.set(name, instance);
      this.core.register(name, instance);
      this.logger.debug(`Module registered: ${name}`);
    });
  }

  /**
   * Initialize all modules
   */
  async initializeModules() {
    for (const [name, module] of this.modules) {
      if (module.initialize) {
        await module.initialize();
        this.logger.debug(`Module initialized: ${name}`);
      }
    }
  }

  /**
   * Start application
   */
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    this.logger.info('Starting Calcoverse application...');
    
    // Start core system
    await this.core.start();
    
    // Start modules
    for (const [name, module] of this.modules) {
      if (module.start) {
        await module.start();
      }
    }
    
    this.logger.success('✨ Calcoverse is running!');
  }

  /**
   * Stop application
   */
  async stop() {
    this.logger.info('Stopping Calcoverse application...');
    
    // Stop modules
    for (const [name, module] of this.modules) {
      if (module.stop) {
        await module.stop();
      }
    }
    
    // Stop core
    if (this.core) {
      await this.core.stop();
    }
    
    this.logger.info('👋 Calcoverse stopped');
  }

  /**
   * Get module instance
   */
  getModule(name) {
    return this.modules.get(name);
  }
}

// Create and export app instance
const app = new CalcoverseApp();

// Auto-start in browser
if (typeof window !== 'undefined') {
  window.CalcoverseApp = app;
  window.addEventListener('DOMContentLoaded', () => {
    app.start().catch(console.error);
  });
}

// Node.js exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalcoverseApp, app };
}

export { CalcoverseApp, app };
export default app;
