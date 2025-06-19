# FocusNote

![FocusNote Logo](https://via.placeholder.com/256x128.png?text=FocusNote)  
*Minimalist note-taking application for focused learning*

FocusNote is a desktop application designed to help you capture and organize your learning notes, ideas, and project progress. With a clean and minimalist interface, FocusNote lets you concentrate on what truly matters: your content.

## 🚀 Features

- 📝 Create and edit notes quickly
- 🔍 Search and organize notes efficiently
- 🏷️ Tag system for better organization
- 💾 Auto-save functionality
- 🚀 Automatic updates
- 🖥️ Cross-platform (Windows, macOS, Linux)
- 🔒 Local storage for your notes
- 🎨 Dark/Light mode

## 💾 Download

### Pre-built Releases

Download the latest version for your operating system from the [Releases](https://github.com/erikivanmelo/focusnote/releases) page.

### System Requirements

- Windows 10/11, macOS 10.14+, or Linux
- 64-bit operating system
- At least 200MB of free disk space

## 🛠️ For Developers

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher
- Git

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/erikivanmelo/focusnote.git
   cd focusnote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Project Structure

- `src/main` - Electron main process code
- `src/renderer` - React application (UI)
- `src/preload` - Bridge scripts between main and renderer
- `electron.vite.config.ts` - Vite configuration for Electron

### Build Commands

- `npm run build` - Build for production
- `npm run build:win` - Build for Windows
- `npm run build:mac` - Build for macOS
- `npm run build:linux` - Build for Linux
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/)
- All open source contributors who make this possible

---

Built with ❤️ by [Erik Melo](https://github.com/erikivanmelo)

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
