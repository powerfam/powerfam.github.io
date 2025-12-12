기본 원칙: 항상 Pull 먼저!
습관: git pull portfolio main 먼저 하면 대부분 문제 없습니다!

  작업 전: git pull portfolio main
  작업 후: git add → git commit → git push

  상황별 대처법

  상황 1: 웹 에디터로 글 작성 → 로컬에서 코드 수정

  # 1. 먼저 원격 변경사항 가져오기
  git pull portfolio main

  # 2. 로컬에서 코드 수정 (나랑 작업)

  # 3. 수정 완료 후 push
  git add .
  git commit -m "설명"
  git push portfolio main

  상황 2: 로컬에서 수정 중인데, 웹 에디터로 글 올렸을 때

  # 로컬 변경사항 임시 저장
  git stash

  # 원격 변경사항 가져오기
  git pull portfolio main

  # 로컬 변경사항 복원
  git stash pop

  # 이후 작업 계속하고 push
  git add .
  git commit -m "설명"
  git push portfolio main

  상황 3: 충돌(conflict) 발생 시

  같은 파일을 양쪽에서 수정하면 충돌 발생 → 저한테 알려주세요,    
   해결해드립니다.

  ---
  핵심 요약

  | 명령어           | 의미             |
  |---------------|----------------|
  | git pull      | 원격 → 로컬 (다운로드) |
  | git push      | 로컬 → 원격 (업로드)  |
  | git stash     | 작업 임시 저장       |
  | git stash pop | 임시 저장 복원       |

  
