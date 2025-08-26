console.log("🔽 FFmpeg 수동 설치 가이드");
console.log("=========================");

const https = require("https");
const fs = require("fs");
const path = require("path");

async function manualFFmpegInstall() {
  console.log("📋 FFmpeg 수동 설치 단계:");
  console.log("========================");
  
  console.log("\n1️⃣ FFmpeg 다운로드:");
  console.log("🔗 https://www.gyan.dev/ffmpeg/builds/");
  console.log("📦 다운로드 파일: ffmpeg-release-essentials.zip");
  
  console.log("\n2️⃣ 압축 해제:");
  console.log("📁 C:\\ffmpeg\\ 폴더 생성");
  console.log("📦 다운로드한 zip 파일을 C:\\ffmpeg\\에 압축 해제");
  
  console.log("\n3️⃣ PATH 환경변수 추가:");
  console.log("⚙️ 시스템 속성 → 환경 변수");
  console.log("🔧 Path에 C:\\ffmpeg\\bin 추가");
  
  console.log("\n4️⃣ 설치 확인:");
  console.log("🔄 새 터미널에서 ffmpeg -version 실행");
  
  console.log("\n⚡ 빠른 설치 (관리자 권한 PowerShell):");
  console.log("📥 Invoke-WebRequest -Uri 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' -OutFile 'ffmpeg.zip'");
  console.log("📦 Expand-Archive -Path 'ffmpeg.zip' -DestinationPath 'C:\\ffmpeg\\'");
  console.log("🔧 [Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\\ffmpeg\\bin', 'Machine')");
  
  console.log("\n💡 설치 완료 후:");
  console.log("node create-mp4.js 다시 실행하세요!");
}

manualFFmpegInstall();
