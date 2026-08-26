import path from 'path';
import fs from 'fs';

function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;
        
        const match = trimmedLine.match(/^([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (err) {
    console.error(`Failed to load env file at ${filePath}:`, err);
  }
}

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from root and Backend before defining NextConfig
loadEnvFile(path.resolve(__dirname, '..', '.env'));
loadEnvFile(path.resolve(__dirname, '..', 'Backend', '.env'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', '@react-three/fiber', '@react-three/drei'],
  },
};

export default nextConfig;
