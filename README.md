# TypePurr 🐱 - Purrfect Typing Practice

A fun, cat-themed typing test application built with React and Tailwind CSS. Inspired by MonkeyType but with a delightful feline twist!

## ✨ Features

### 🎯 Core Features
- **Real-time typing test** with WPM and accuracy tracking
- **Multiple timer options** (15s, 30s, 60s)
- **Live typing feedback** with color-coded text
- **Green highlighting** for correctly typed words
- **Progress tracking** with visual progress bar
- **Typing history** with detailed statistics

### 🌟 Cat-Themed UI
- **Cat emojis and paw prints** throughout the interface
- **Cat-inspired color palette** (oranges, ambers)
- **Playful messaging** with cat puns and phrases
- **Animated elements** with cat-themed touches

### 🎨 Theme System
- **Dark/Light mode toggle** with smooth transitions
- **Persistent theme preference** stored in localStorage
- **Cat-themed colors** that adapt to both themes
- **Smooth animations** and transitions

### 📱 Mobile Responsive
- **Fully responsive design** works on all screen sizes
- **Touch-optimized** interface for mobile devices
- **Adaptive text sizing** for different screen sizes
- **Mobile-friendly** touch targets

### 🚀 Performance Optimized
- **React.memo** for component optimization
- **Efficient word fetching** with multiple API fallbacks
- **Smart text loading** to prevent interruptions
- **Smooth animations** with CSS transitions

### 📊 Enhanced Text Service
- **Multiple API sources** for diverse word sets
- **Cat-themed words** mixed into regular text
- **Programming terms** for technical practice
- **Fallback word pools** for offline use
- **Better error handling** and recovery

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TypePurr/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx      # Main header with theme toggle
│   │   ├── TypingArea.jsx  # Main typing interface
│   │   ├── Results.jsx     # Test results display
│   │   ├── History.jsx     # Typing history
│   │   └── ProgressBar.jsx # Progress indicator
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx # Theme management
│   ├── services/           # API services
│   │   └── textService.js  # Word fetching service
│   ├── utils/              # Utility functions
│   │   └── calculations.js # WPM/accuracy calculations
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles and animations
│   └── main.jsx           # App entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## 🎮 How to Use

1. **Choose your timer** (15s, 30s, or 60s)
2. **Click on the typing area** or press any key to start
3. **Type the displayed words** - correct words turn green!
4. **Watch your progress** with the progress bar
5. **View your results** when the timer runs out
6. **Check your history** to track improvement over time
7. **Toggle themes** with the sun/moon icon

## 🐱 Cat-Themed Features

- **Cat emoji favicon** 🐱
- **Paw print decorations** 🐾 throughout the UI
- **Cat-themed congratulations** based on your performance
- **Orange/amber color scheme** inspired by orange tabby cats
- **Playful cat puns** in messages and descriptions

## 🎯 Performance Features

- **Efficient re-rendering** with React.memo
- **Smart word fetching** from multiple APIs
- **Smooth animations** with CSS transitions
- **Optimized mobile experience**
- **Persistent user preferences**

## 🌈 Accessibility

- **High contrast colors** for better readability
- **Focus indicators** for keyboard navigation
- **Responsive text sizing** for different screens
- **Clear visual feedback** for typing status

## 🤝 Contributing

Feel free to contribute to TypePurr! Whether it's bug fixes, new features, or improvements to the cat theme, all contributions are welcome.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ and 🐱 for typing enthusiasts everywhere!

*Meow let's get typing!* 🐾
