// Design configuration for resume generation
export const DesignConfig = {
  // Fonts
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold'
  },

  // Colors
  colors: {
    accent: 'blue',
    primary: 'black'
  },

  // Font sizes
  fontSize: {
    large: 22,
    header: 12,
    subheader: 11,
    body: 10,
    sectionHeader: 10
  },

  // Line gaps
  lineGap: {
    body: 5,
    bullet: 5
  },

  // Character spacing
  characterSpacing: {
    default: 0.3,
    sectionHeader: 2
  },

  // Layout
  layout: {
    margin: 40,
    pageWidth: 520 // 600 - (40 * 2)
  },

  // Spacing
  spacing: {
    lineSpacing: 0.5,
    sectionSpacing: 1
  }
} as const; 