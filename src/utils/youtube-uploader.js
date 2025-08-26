const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const YouTubeAuth = require('./youtube-auth');

class YouTubeUploader {
  constructor() {
    this.auth = new YouTubeAuth();
    this.youtube = null;
  }

  async initialize() {
    const authClient = await this.auth.initialize();
    this.youtube = google.youtube({ version: 'v3', auth: authClient });
    return this;
  }

  async uploadVideo(videoData) {
    try {
      console.log('📤 YouTube 업로드 시작:', videoData.title);
      
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: videoData.title,
            description: videoData.description,
            tags: videoData.tags,
            categoryId: '27',
            defaultLanguage: videoData.language || 'ko',
            defaultAudioLanguage: videoData.language || 'ko'
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: fs.createReadStream(videoData.filePath)
        }
      });

      console.log('✅ 업로드 성공! 비디오 ID:', response.data.id);
      return {
        success: true,
        videoId: response.data.id,
        url: 'https://www.youtube.com/watch?v=' + response.data.id
      };
    } catch (error) {
      console.error('❌ 업로드 실패:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadShorts(shortsData) {
    const videoData = {
      ...shortsData,
      tags: [...(shortsData.tags || []), '#Shorts', '#수학', '#교육'],
      description: shortsData.description + '\n\n#Shorts #MathEducation #중학수학'
    };
    return await this.uploadVideo(videoData);
  }
}

module.exports = YouTubeUploader;
