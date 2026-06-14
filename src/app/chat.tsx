import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { useStore, ChatMessage } from '../store';
import { Spacing, Radius } from '../constants/theme';
import { useThemeColor } from '../hooks/useThemeColor';
import { ArrowUp, Bot, User, Sparkles, ChevronLeft } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import { router } from 'expo-router';
import { generateAssistantResponse } from '../features/chat/aiAssistant';
import { generateUserContext } from '../features/insights/contextEngine';
import { sanitizeChatInput } from '../utils/validation';

const SUGGESTED_PROMPTS = [
  "Analyze my footprint",
  "How can I reduce emissions?",
  "What is my eco score?"
];

// Memoize Message Component for Performance
const MessageItem = React.memo(({ item, primaryColor, cardColor }: { item: ChatMessage, primaryColor: string, cardColor: string }) => {
  const isUser = item.role === 'user';
  return (
    <Animated.View 
      entering={FadeInDown.duration(300).springify()} 
      layout={Layout.springify()}
      style={[
        styles.messageWrapper,
        isUser ? styles.messageWrapperUser : styles.messageWrapperAssistant
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${isUser ? 'You' : 'EcoTrack AI'} said: ${item.text}`}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: 'rgba(0, 200, 100, 0.2)' }]}>
          <Bot size={16} color={primaryColor} />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        isUser ? [styles.messageUser, { backgroundColor: primaryColor }] : [styles.messageAssistant, { backgroundColor: cardColor }]
      ]}>
        <ThemedText style={{ color: isUser ? '#000' : '#FFF' }}>{item.text}</ThemedText>
      </View>
    </Animated.View>
  );
});

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'surface');
  
  const chatHistory = useStore((state) => state.chatHistory);
  const addChatMessage = useStore((state) => state.addChatMessage);
  const verifiedActivities = useStore(state => state.verifiedActivities);
  const carbonScore = useStore(state => state.carbonScore);
  const ecoScore = useStore(state => state.ecoScore);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const userContext = useMemo(() => generateUserContext(verifiedActivities, carbonScore, ecoScore), [verifiedActivities, carbonScore, ecoScore]);

  useEffect(() => {
    // Scroll to bottom when history changes
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatHistory]);

  const handleSend = useCallback((rawText: string) => {
    const text = sanitizeChatInput(rawText);
    if (!text) return;

    // Add user message
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString()
    });

    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking and response based on intents
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = generateAssistantResponse(text, userContext);

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiResponse,
        timestamp: new Date().toISOString()
      });
    }, 1200);
  }, [addChatMessage, userContext]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <MessageItem item={item} primaryColor={primaryColor} cardColor={cardColor} />
  ), [primaryColor, cardColor]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Sparkles size={20} color={primaryColor} />
          <ThemedText type="default" weight="bold" style={{ marginLeft: Spacing.sm }}>EcoTrack AI</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={chatHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <Animated.View entering={FadeIn} style={[styles.messageWrapper, styles.messageWrapperAssistant]} accessibilityRole="text" accessibilityLabel="EcoTrack AI is typing">
                <View style={[styles.avatar, { backgroundColor: 'rgba(0, 200, 100, 0.2)' }]}>
                  <Bot size={16} color={primaryColor} />
                </View>
                <View style={[styles.messageBubble, styles.messageAssistant, { backgroundColor: cardColor }]}>
                  <ThemedText style={{ color: '#888' }}>Typing...</ThemedText>
                </View>
              </Animated.View>
            ) : null
          }
        />

        <View style={styles.suggestedContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.lg }}>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.suggestedPill, { borderColor: primaryColor }]} 
                onPress={() => handleSend(prompt)}
                accessibilityRole="button"
                accessibilityLabel={`Suggested prompt: ${prompt}`}
              >
                <ThemedText type="small" colorName="primary">{prompt}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
          <View style={[styles.inputBox, { backgroundColor: cardColor }]}>
            <TextInput
              style={styles.input}
              placeholder="Ask about your footprint..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend(inputText)}
              accessibilityLabel="Type your message to EcoTrack AI"
            />
            <TouchableOpacity 
              style={[
                styles.sendBtn, 
                { backgroundColor: inputText.trim() ? primaryColor : '#333' }
              ]}
              disabled={!inputText.trim() || isTyping}
              onPress={() => handleSend(inputText)}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <ArrowUp size={20} color={inputText.trim() ? '#000' : '#888'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flexDirection: 'row', alignItems: 'center' },
  keyboardAvoid: { flex: 1 },
  chatContent: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  messageWrapper: { flexDirection: 'row', marginBottom: Spacing.md, alignItems: 'flex-end' },
  messageWrapperUser: { justifyContent: 'flex-end' },
  messageWrapperAssistant: { justifyContent: 'flex-start' },
  avatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.sm },
  messageBubble: { maxWidth: '80%', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radius.lg },
  messageUser: { borderBottomRightRadius: 4 },
  messageAssistant: { borderBottomLeftRadius: 4 },
  suggestedContainer: { paddingVertical: Spacing.sm },
  suggestedPill: { borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, marginRight: Spacing.sm, backgroundColor: 'rgba(0,255,163,0.05)' },
  inputContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 6 },
  input: { flex: 1, color: '#FFF', fontSize: 16, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm },
  sendBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.sm }
});
