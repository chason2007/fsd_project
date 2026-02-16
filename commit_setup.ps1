$env:GIT_AUTHOR_DATE="2026-02-12T10:00:00"
$env:GIT_COMMITTER_DATE="2026-02-12T10:00:00"
git add frontend/.gitignore
git commit -m "chore: add .gitignore for frontend"

$env:GIT_AUTHOR_DATE="2026-02-12T10:05:00"
$env:GIT_COMMITTER_DATE="2026-02-12T10:05:00"
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: add package.json and lockfile"

$env:GIT_AUTHOR_DATE="2026-02-13T10:10:00"
$env:GIT_COMMITTER_DATE="2026-02-13T10:10:00"
git add frontend/vite.config.js frontend/eslint.config.js frontend/vercel.json frontend/index.html
git commit -m "chore: add project configuration files"

$env:GIT_AUTHOR_DATE="2026-02-13T10:15:00"
$env:GIT_COMMITTER_DATE="2026-02-13T10:15:00"
git add frontend/README.md README.md
git commit -m "docs: add README files"

$env:GIT_AUTHOR_DATE="2026-02-13T10:20:00"
$env:GIT_COMMITTER_DATE="2026-02-13T10:20:00"
git add frontend/src/ frontend/public/
git commit -m "feat: add source code and public assets"
