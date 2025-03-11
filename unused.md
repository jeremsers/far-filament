# Unused Code in the Project

## HTML Files

### src/pages/test.astro

- **Description**: Empty file
- **Status**: Completely unused
- **Lines**: All (file is empty)

### src/pages/alt.astro

- **Description**: Alternative version of the homepage
- **Status**: Not referenced anywhere in the codebase
- **Lines**: All (1-22)

## Components

### src/layouts/Values.astro

- **Description**: Component imported in index.astro but not used in the page
- **Status**: Imported but not used
- **Lines**: All (1-46)
- **Referenced in**: src/pages/index.astro (line 10)

### src/layouts/EventSec.astro

- **Description**: Component for displaying events
- **Status**: Not referenced or used anywhere in the codebase
- **Lines**: All (1-409)

## CSS

### src/layouts/Header.astro

- **Description**: Unused CSS styles in the mobile menu toggle
- **Status**: Potentially redundant styles
- **Lines**: 77-79 (The `left: 0;` property is redundant as it's already set in the parent selector)

### src/layouts/Headeralt.astro

- **Description**: Unused CSS styles in the mobile menu toggle
- **Status**: Potentially redundant styles
- **Lines**: 252-254 (The `left: 0;` property is redundant as it's already set in the parent selector)

### src/layouts/baselayout/MainLayout.astro

- **Description**: Unused CSS class
- **Status**: Defined but not used in the HTML
- **Lines**: 89-98 (The `.cta-btn` class is defined in the global styles but might be better placed in a component-specific style)

### src/styles/global.scss

- **Description**: Potentially problematic CSS
- **Status**: May cause layout issues
- **Lines**: 11-17 (Setting `height: 100vh` on all sections may cause layout issues on mobile devices)

## JavaScript

### src/layouts/Headeralt.astro

- **Description**: Redundant event listener code
- **Status**: Potentially inefficient
- **Lines**: 82-86 (The check for `target.tagName === "A"` could be improved to also check for elements inside links like in Header.astro)

## Images

### src/images/logo.png

- **Description**: Old logo file
- **Status**: Not referenced anywhere in the codebase
- **Lines**: N/A (binary file)

### src/images/logo1.png, src/images/logo2.png, src/images/logo3.png, src/images/logo4.png

- **Description**: Alternative logo files
- **Status**: Not referenced anywhere in the codebase
- **Lines**: N/A (binary files)

### src/images/.about.jpg

- **Description**: Image file with a dot prefix
- **Status**: Not referenced anywhere in the codebase
- **Lines**: N/A (binary file)
