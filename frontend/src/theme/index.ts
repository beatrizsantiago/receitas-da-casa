import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Montserrat', sans-serif" },
        body:    { value: "'Montserrat', sans-serif" },
        mono:    { value: "'Montserrat', sans-serif" },
      },
      colors: {
        primary: {
          50:  { value: '#F9E9E6' },
          100: { value: '#F2C9C2' },
          200: { value: '#EAA69A' },
          300: { value: '#E28373' },
          400: { value: '#D96450' },
          500: { value: '#C44A2F' },
          600: { value: '#A63E27' },
          700: { value: '#88321F' },
          800: { value: '#6A2617' },
          900: { value: '#4D1B10' },
        },
        secondary: {
          50:  { value: '#EEF1E7' },
          100: { value: '#D7DEC8' },
          200: { value: '#BDCBA5' },
          300: { value: '#A3B882' },
          400: { value: '#869E5F' },
          500: { value: '#5E6F3A' },
          600: { value: '#4B5A2E' },
          700: { value: '#394522' },
          800: { value: '#273116' },
          900: { value: '#161D0B' },
        },
        beige: {
          50:  { value: '#FEFCF9' },
          100: { value: '#FAF4EC' },
          200: { value: '#F5EBDD' },
          300: { value: '#F0E2CE' },
          400: { value: '#E8D8C3' },
          500: { value: '#F3E7D8' },
          600: { value: '#D6C6B3' },
          700: { value: '#B8A58F' },
          800: { value: '#9B856C' },
          900: { value: '#7E654A' },
        },
        yellow: {
          50:  { value: '#FEF9E6' },
          100: { value: '#FDF0C2' },
          200: { value: '#FBE79B' },
          300: { value: '#F9DD75' },
          400: { value: '#F5D457' },
          500: { value: '#F2C94C' },
          600: { value: '#D4AE3F' },
          700: { value: '#B69332' },
          800: { value: '#977825' },
          900: { value: '#785E19' },
        },
        neutral: {
          50:  { value: '#F7F7F7' },
          100: { value: '#EDEDED' },
          200: { value: '#D6D6D6' },
          300: { value: '#BFBFBF' },
          400: { value: '#8F8F8F' },
          500: { value: '#5F5F5F' },
          600: { value: '#4A4A4A' },
          700: { value: '#2F2F2F' },
          800: { value: '#1D1D1D' },
          900: { value: '#0B0B0B' },
        },
      },
    },
    semanticTokens: {
      colors: {
        'chakra-body-bg':   { value: '{colors.beige.100}' },
        'chakra-body-text': { value: '{colors.neutral.800}' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
