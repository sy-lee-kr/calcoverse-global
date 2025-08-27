/**
 * CalcoverseCore Engine
 * Core system for Calcoverse application
 */

export class CalcoverseCore {
  constructor() {
    this.modules = new Map();
    this.state = {
      currentProblem: null,
      score: 0,
      progress: 0,
      history: []
    };
    this.isRunning = false;
  }

  register(name, module) {
    this.modules.set(name, module);
    module.core = this;
    console.log(`Module registered: ${name}`);
  }

  getModule(name) {
    return this.modules.get(name);
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('Starting Calcoverse Core...');
    this.isRunning = true;
    
    // Initialize all modules
    for (const [name, module] of this.modules) {
      if (module.initialize) {
        await module.initialize();
      }
    }
    
    console.log('✅ Core started successfully');
  }

  async stop() {
    if (!this.isRunning) return;
    
    console.log('Stopping Calcoverse Core...');
    
    // Cleanup all modules
    for (const [name, module] of this.modules) {
      if (module.cleanup) {
        await module.cleanup();
      }
    }
    
    this.isRunning = false;
    console.log('Core stopped');
  }
}

export default CalcoverseCore;
