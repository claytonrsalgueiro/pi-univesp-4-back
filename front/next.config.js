/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true
            }
        ];
    },
    reactStrictMode: true
    // experimental: {
    //     staleTimes: { dynamic: 0, static: 0 }
    // }
};

module.exports = nextConfig;
