#!/bin/bash

# GitHub 저장소 연결 및 배포 스크립트
echo "🚀 MATHKONG Dashboard GitHub 배포 시작..."

# 1. GitHub 원격 저장소 추가
git remote add origin https://github.com/anhyunjun/gpai-data.git

# 2. 브랜치 이름을 main으로 변경
git branch -M main

# 3. GitHub에 푸시
echo "📤 GitHub에 푸시 중..."
git push -u origin main

echo "✅ 푸시 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. https://github.com/anhyunjun/gpai-data/settings/pages 접속"
echo "2. Source에서 'Deploy from a branch' 선택"
echo "3. Branch: main, /(root) 선택 후 Save"
echo "4. 2-5분 후 https://anhyunjun.github.io/gpai-data/ 에서 확인"
echo ""
echo "🎉 배포 준비 완료!"