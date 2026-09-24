const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Cargar también las variables compartidas del .env en la raíz del proyecto.
loadEnvConfig(path.resolve(__dirname, '..'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
