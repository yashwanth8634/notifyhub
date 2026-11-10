/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || 'notifyhub-local',
};

export default nextConfig;
