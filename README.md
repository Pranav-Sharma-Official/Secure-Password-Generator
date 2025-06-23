# 🔐 Cybersecurity Password Generator

A military-grade, cybersecurity-themed password generator with encrypted history vault and terminal-inspired aesthetics. Built with Next.js, featuring cryptographically secure password generation and AES-GCM encrypted local storage.

![Cybersecurity Password Generator](https://img.shields.io/badge/Security-Military%20Grade-green?style=for-the-badge&logo=shield)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### 🛡️ **Security First**
- **Cryptographically Secure**: Uses `crypto.getRandomValues()` for true randomness
- **AES-GCM Encryption**: 256-bit encryption for password history storage
- **PBKDF2 Key Derivation**: 100,000 iterations for secure key generation
- **Local Storage Only**: No data transmission, everything stays on your device
- **Zero Dependencies**: No external password libraries or APIs

### ⚡ **Advanced Generation**
- **Configurable Length**: 8-64 character passwords
- **Character Set Control**: Uppercase, lowercase, digits, special characters
- **Similar Character Exclusion**: Avoid confusing characters (I, l, 1, O, 0)
- **Real-time Strength Analysis**: Visual security level indicator
- **Instant Generation**: Sub-second password creation

### 🗄️ **Encrypted History Vault**
- **Secure Storage**: Up to 50 encrypted passwords with metadata
- **Timestamp Tracking**: Generation time and configuration details
- **Privacy Controls**: Show/hide individual passwords
- **Quick Actions**: Copy, delete, or clear all with one click
- **Auto-cleanup**: Automatic rotation of oldest entries

### 🎨 **Cybersecurity Aesthetics**
- **Matrix-inspired Design**: Scrolling grid background effects
- **Glitch Text Effects**: Dynamic title animations
- **Terminal Styling**: Monospace fonts and scan line overlays
- **Neon Color Scheme**: Green/cyan cyberpunk palette
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cybersec-password-generator.git
   cd cybersec-password-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Password Generation

1. **Configure Settings**
   - Adjust password length using the slider (8-64 characters)
   - Select character types: uppercase, lowercase, digits, special
   - Toggle "Exclude Similar" to avoid confusing characters

2. **Generate Password**
   - Click "GENERATE PASSWORD" button
   - Password appears with security level indicator
   - Automatically saved to encrypted history

3. **Copy & Use**
   - Click "COPY TO CLIPBOARD" to copy password
   - Toggle visibility with the eye icon
   - Password is ready for immediate use

### History Vault Management

1. **Access History**
   - Click "HISTORY" button in the top-right
   - View all previously generated passwords
   - See generation timestamps and configurations

2. **Manage Passwords**
   - **View**: Click eye icon to show/hide password
   - **Copy**: Click copy icon to copy to clipboard
   - **Delete**: Click trash icon to remove individual password
   - **Clear All**: Remove entire history with one click

3. **Security Features**
   - All passwords encrypted with AES-GCM
   - Automatic 50-password limit
   - Local storage only - never transmitted

## 🔒 Security Architecture

### Encryption Details

- **Algorithm**: AES-GCM with 256-bit keys
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: Static application salt for consistency
- **IV**: Random 12-byte initialization vector per encryption
- **Storage**: Base64-encoded encrypted data in localStorage

### Password Generation

- **Entropy Source**: `crypto.getRandomValues()` Web Crypto API
- **Character Pool**: Configurable character sets
- **No Predictable Patterns**: True cryptographic randomness
- **Strength Analysis**: Real-time security level calculation

### Privacy & Data Protection

- **No Network Requests**: Completely offline operation
- **No Analytics**: Zero tracking or data collection
- **Local Storage Only**: Data never leaves your device
- **Secure Deletion**: Proper cleanup of sensitive data

## 🛠️ Technical Stack

### Core Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible component library

### Security Libraries
- **Web Crypto API**: Native browser cryptography
- **No External Dependencies**: Reduced attack surface

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🎨 Customization

### Theme Modifications

The cybersecurity theme can be customized by modifying:

- **Colors**: Edit `app/globals.css` for color scheme changes
- **Animations**: Modify CSS animations in the main component
- **Effects**: Adjust matrix background and scan line effects
- **Typography**: Change font families and sizes

### Feature Extensions

Easy to extend with additional features:

- **Export Functionality**: Add encrypted file export
- **Password Categories**: Implement tagging system
- **Strength Policies**: Add custom strength requirements
- **Backup/Restore**: Cloud backup integration

## 🚨 Security Considerations

### Best Practices

1. **Regular History Cleanup**
   - Clear password history periodically
   - Don't store passwords indefinitely
   - Use generated passwords immediately

2. **Device Security**
   - Ensure device is secure and encrypted
   - Use strong device authentication
   - Keep browser updated

3. **Password Management**
   - Don't rely solely on browser storage
   - Use dedicated password managers for long-term storage
   - Enable two-factor authentication where possible

### Limitations

- **Local Storage**: Data lost if browser data is cleared
- **Device Dependent**: No synchronization across devices
- **Browser Security**: Relies on browser's security model

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Test thoroughly, especially security features
5. Commit with descriptive messages
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- **TypeScript**: All code must be properly typed
- **Security**: Security-related changes require extra review
- **Testing**: Include tests for new functionality
- **Documentation**: Update README for new features

### Security Contributions

- **Responsible Disclosure**: Report security issues privately first
- **Code Review**: Security changes require multiple reviewers
- **Testing**: Extensive testing required for crypto-related changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Web Crypto API**: For providing secure cryptographic primitives
- **Next.js Team**: For the excellent React framework
- **shadcn/ui**: For beautiful, accessible components
- **Tailwind CSS**: For utility-first styling approach

## 📞 Support

### Getting Help

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Email security@yourproject.com for security issues

### FAQ

**Q: Is this secure enough for production use?**
A: Yes, it uses industry-standard cryptography, but consider dedicated password managers for critical applications.

**Q: Can I use this offline?**
A: Yes, once loaded, the application works completely offline.

**Q: What happens if I clear my browser data?**
A: All password history will be lost. Export or backup important passwords first.

**Q: Can I sync across devices?**
A: Currently no, but this could be added as a future feature with proper encryption.

---

**⚠️ Security Notice**: This tool generates cryptographically secure passwords and stores them with military-grade encryption. However, always follow security best practices and consider using dedicated password managers for critical accounts.

**🔐 Remember**: The most secure password is one that's unique, complex, and properly stored. Stay cyber-safe!