# Context-Aware Carbon Intelligence Assistant

EcoTrack is a React Native Expo application that acts as an intelligent, context-aware carbon tracking assistant. This project has been heavily refactored to meet production-grade engineering standards, demonstrating robust architecture, high security, and intelligent feature execution.

## 🚀 Problem Statement & Solution
Static carbon trackers fail because they lack context and adaptability. This project solves that by introducing a **Context Engine** that analyzes verified activities, detects behavioral habits, and injects this data into an **Intelligent Suggestion Engine** and an **AI Assistant**.

The app dynamically learns from user verification, adjusting detection confidence, and offering highly personalized offset suggestions in a Dynamic Market.

## 🏗 Architecture
We use a feature-based modular architecture designed for scalability.

```text
src/
├── app/                 # Expo Router UI entry points
├── components/          # Reusable, accessible UI components
├── features/            # Isolated feature domains
│   ├── carbon/          # Carbon calculation logic
│   ├── detection/       # Confidence learning engine
│   ├── gamification/    # Challenges, streaks, scores
│   ├── insights/        # Context & Suggestion engines
│   ├── offsets/         # Dynamic marketplace
│   └── chat/            # AI assistant and NLP heuristics
├── store/               # Zustand state management (Slices pattern)
├── types/               # Centralized TypeScript definitions
└── utils/               # Zod validation and helpers
```

### Data Flow
1. **Activity Detection**: Simulated activities enter `activitySlice`.
2. **User Verification**: User confirms/rejects, which updates `carbonSlice` and triggers the `learningEngine` to adjust confidence.
3. **Context Generation**: `contextEngine` derives dominant sources, trends, and habits.
4. **Insight Delivery**: `suggestionEngine` and `aiAssistant` use this context to deliver personalized advice.

## 🧠 AI Intelligence
The AI Assistant goes beyond generic text generation:
- **Intent Detection**: Parses user messages to categorize intents (`reduce`, `feedback`, `compare`, `explain`).
- **Context Injection**: Uses the output of the Context Engine to provide answers specifically tailored to the user's habits (e.g., suggesting transport alternatives to a `frequent_cab` user).
- **Feedback Loop**: When users report detection errors, the assistant acknowledges and the `learningEngine` penalizes the confidence model dynamically.

## 🔒 Security Practices
- **Strict Typing**: TypeScript is configured with `strict`, `noUnusedLocals`, and `noUnusedParameters` to eliminate runtime ambiguities.
- **Runtime Validation**: We use `Zod` (`src/utils/validation.ts`) to validate all incoming data payloads (activities, chat messages).
- **Sanitization**: Basic XSS/script injection sanitization is applied to all user chat inputs before processing.
- **Data Safety**: All state is persisted locally using `AsyncStorage`. No sensitive data is transmitted to external servers for this POC.

## 🧪 Testing Approach (Premium Standards)
We implement a multi-layered testing strategy using `Jest` and `@testing-library/react-native`:
- **Unit Tests**: Pure functions (`contextEngine`, `learningEngine`, `storeSlices`) are rigorously tested for mathematical and logical correctness.
- **Component Tests**: Interaction and rendering tests ensure that UI components respond correctly to gestures and data changes.
- **Integration Tests**: `detectionFlow.test.tsx` validates the entire pipeline from detection to insight generation.
- **Accessibility Tests**: Automated checks ensure all elements possess the necessary `accessibilityLabels` and `roles`.

## ♿ Accessibility
This app is designed to be fully accessible:
- All interactive elements (Cards, Buttons, Banners) have explicit `accessibilityRole` and descriptive `accessibilityLabel` props.
- High contrast themes are implemented using the central `useThemeColor` hook.
- Keyboard navigation is fully supported for Web and Simulator testing.

## 🎮 Gamification & Smart Market
- **Dynamic Offset Market**: Offsets are dynamically sorted and recommended based on the user's highest emission source.
- **Weekly Challenges**: A lightweight, non-intrusive challenge system encourages streak building and positive habit reinforcement.
- **Smart Device Banner**: A contextual, dismissible banner prompts users to connect wearables for better detection accuracy.
