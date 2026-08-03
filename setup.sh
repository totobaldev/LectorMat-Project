#!/usr/bin/env zsh
# LectorMat - Setup Script
# Compatible: macOS / zsh / ARM64 (Apple Silicon)

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "🚀 Inicializando LectorMat en: $ROOT_DIR"

# ─── DATABASE ────────────────────────────────────────────────────────────────
mkdir -p "$ROOT_DIR/database"
touch "$ROOT_DIR/database/schema.sql"

# ─── BACKEND ─────────────────────────────────────────────────────────────────
cd "$ROOT_DIR/backend"
npm init -y

# Directorios
mkdir -p src/{config,controllers,middlewares,models,routes,services,types,utils}
touch src/server.ts
touch src/config/.gitkeep
touch src/controllers/.gitkeep
touch src/middlewares/.gitkeep
touch src/models/.gitkeep
touch src/routes/.gitkeep
touch src/services/.gitkeep
touch src/types/.gitkeep
touch src/utils/.gitkeep

# Dependencias de producción
npm install express cors dotenv

# Dependencias de desarrollo
npm install -D typescript ts-node @types/node @types/express @types/cors nodemon

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# nodemon.json
cat > nodemon.json <<'EOF'
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/server.ts"
}
EOF

# Actualizar scripts en package.json
npx -y json -I -f package.json \
  -e 'this.scripts={"dev":"nodemon","build":"tsc","start":"node dist/server.js","lint":"tsc --noEmit"}'

# .env
cat > .env <<'EOF'
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://lectormat_user:secret@localhost:5432/lectormat_db
CORS_ORIGIN=http://localhost:5173
EOF

echo "✅ Backend inicializado"

# ─── FRONTEND ─────────────────────────────────────────────────────────────────
cd "$ROOT_DIR/frontend"

# Inicializar Vite con React + TypeScript
npm create vite@latest . -- --template react-ts --yes 2>/dev/null || \
  npx -y create-vite@latest . --template react-ts

npm install

# Dependencias adicionales
npm install zustand react-router-dom lucide-react

# Tailwind CSS v4
npm install -D tailwindcss @tailwindcss/vite

# Crear estructura src/
mkdir -p src/{assets,data,features,pages,store,styles,types}
mkdir -p src/components/{layout,ui}

touch src/store/useProgressStore.ts
touch src/pages/HomePage.tsx
touch src/pages/DashboardPage.tsx
touch src/pages/UnitPage.tsx
touch src/components/layout/MainLayout.tsx
touch src/types/index.ts
touch src/styles/globals.css

echo "✅ Frontend inicializado"

# ─── RAÍZ ────────────────────────────────────────────────────────────────────
cd "$ROOT_DIR"

cat > .gitignore <<'EOF'
# Node
node_modules/
dist/
.env
*.log

# OS
.DS_Store

# IDEs
.vscode/settings.json
.idea/
EOF

echo ""
echo "🎉 Setup completo. Estructura lista."
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
