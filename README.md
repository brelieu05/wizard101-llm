# wizard101-llm

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Reload Functionality

This application includes several reload features for development:

- **Automatic Reload**: The renderer automatically reloads when files change during development (via electron-vite HMR)
- **Keyboard Shortcut**: Press `Ctrl+R` (or `Cmd+R` on macOS) to manually reload the application
- **Programmatic Reload**: Use the "Reload App" button in the UI or call `window.api.reload()` from the renderer process

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
