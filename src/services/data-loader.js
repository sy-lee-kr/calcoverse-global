/**
 * Data Loader Module - Enhanced version
 */

export class DataLoader {
  constructor() {
    this.cache = new Map();
    this.data = null;
  }

  async initialize() {
    console.log('DataLoader initialized');
    await this.loadData();
  }

  async loadData() {
    try {
      // 파일이 존재하는지 확인
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.default.join(process.cwd(), 'data', 'math_curriculum_roadmap.json');
      
      if (fs.existsSync(dataPath)) {
        const content = fs.readFileSync(dataPath, 'utf8');
        this.data = JSON.parse(content);
        console.log('✅ Data loaded successfully');
      } else {
        console.log('⚠️ Data file not found, using default data');
        this.data = this.getDefaultData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = this.getDefaultData();
    }
  }

  getDefaultData() {
    return {
      problems: [
        {
          id: 1,
          title: '정수의 덧셈',
          question: '(-3) + 5 = ?',
          answer: '2'
        }
      ]
    };
  }

  getData() {
    return this.data;
  }

  async start() {
    console.log('DataLoader started');
  }

  async stop() {
    this.cache.clear();
    console.log('DataLoader stopped');
  }
}

export default DataLoader;
