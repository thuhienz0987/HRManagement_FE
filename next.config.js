/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },
  env: {
    CEO: "5150",
    HRManager: "1984",
    DepartmentManager: "3204",
    TeamManager: "5214",
    Employee: "2001",
  },
};

module.exports = {
  nextConfig,
  mode: "jit",
  darkMode: "class",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
};
