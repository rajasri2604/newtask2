module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Your existing gradient animation
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },

        // New fade-in animation
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },

        // New slow fade-in animation
        fadeInSlow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },

        // Slide down animation for navbar
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },

      animation: {
        // Existing animation
        'gradient-x': 'gradient-x 10s ease infinite',

        // New animations
        fadeIn: 'fadeIn 0.6s ease-in-out',
        fadeInSlow: 'fadeInSlow 1s ease-in-out',
        slideDown: 'slideDown 0.5s ease-out',
      },

      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
};
