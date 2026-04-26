import { colors, componentRecipes, platforms, radii, shadows, spacing } from "@mirra/design";
import type { ChatMessage, PostDraft } from "@mirra/product";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  BriefcaseBusiness,
  CheckCheck,
  Copy,
  ExternalLink,
  Menu,
  MessageCircle,
  Mic,
  Paperclip,
  PenLine,
  Share2,
  Sparkles,
  UserRound,
  WandSparkles,
  Wrench
} from "lucide-react-native";
import { KeyboardAvoidingView, Platform as NativePlatform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MirraAvatar } from "@/components/MirraAvatar";
import { PatternBackground } from "@/components/PatternBackground";
import { fetchTodayThread } from "@/lib/mockApi";
import { useCreatorStore } from "@/state/creatorStore";

type IconComponent = typeof Bot;

const topicChips: Array<{
  label: string;
  Icon: IconComponent;
  color: string;
  backgroundColor: string;
  borderColor: string;
}> = [
  {
    label: "AI agents",
    Icon: Bot,
    color: "#2FAD84",
    backgroundColor: "#EEFFF8",
    borderColor: "#CDEFE2"
  },
  {
    label: "builder lesson",
    Icon: Wrench,
    color: "#8C63E6",
    backgroundColor: "#FAF5FF",
    borderColor: "#E4D6FF"
  },
  {
    label: "career note",
    Icon: BriefcaseBusiness,
    color: colors.amber,
    backgroundColor: "#FFF9EC",
    borderColor: "#F6DFC0"
  }
];

const draftActions: Array<{
  label: string;
  Icon: IconComponent;
  color: string;
  backgroundColor: string;
  borderColor: string;
}> = [
  {
    label: "rewrite",
    Icon: WandSparkles,
    color: "#9A6CEB",
    backgroundColor: "#FCF5FF",
    borderColor: "#ECD8FF"
  },
  {
    label: "edit",
    Icon: PenLine,
    color: colors.denim,
    backgroundColor: "#F4F8FF",
    borderColor: "#D9E6FF"
  },
  {
    label: "copy",
    Icon: Copy,
    color: "#2FAD84",
    backgroundColor: "#F0FFF8",
    borderColor: "#D1EFE3"
  },
  {
    label: "open linkedin",
    Icon: ExternalLink,
    color: colors.linkedin,
    backgroundColor: "#F2F8FF",
    borderColor: "#D8E9FF"
  }
];

export function ChatScreen() {
  const { setActivePower } = useCreatorStore();
  const { data } = useQuery({
    queryKey: ["today-thread"],
    queryFn: fetchTodayThread
  });

  const thread = data ?? {
    messages: [],
    drafts: [],
    suggestions: [],
    prompt: { label: "Today", streak: 0, focus: "Loading your writing rhythm.", nextReminder: "" }
  };

  const [introMessage, creatorMessage, refinementMessage] = thread.messages;
  const linkedinDraft = thread.drafts.find((draft) => draft.platform === "linkedin") ?? thread.drafts[0];
  const xDraft = thread.drafts.find((draft) => draft.platform === "x");

  return (
    <SafeAreaView style={styles.safeArea}>
      <PatternBackground />
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" style={styles.headerIconButton}>
          <Menu size={27} color={colors.text} strokeWidth={2.1} />
        </Pressable>

        <View style={[styles.modePill, shadows.soft]}>
          <View style={styles.headerAvatar}>
            <MirraAvatar size={64} />
          </View>
          <Pressable accessibilityRole="button" style={styles.mirraSegment}>
            <Text style={styles.mirraSegmentText}>mirra</Text>
            <View style={styles.onlineDot} />
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.chatSegment}>
            <MessageCircle size={19} color={colors.coral} strokeWidth={2.3} />
            <Text style={styles.chatSegmentText}>chat</Text>
            <View style={styles.chatDot} />
            <View style={styles.chatUnderline} />
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" style={styles.headerIconButton}>
          <Share2 size={25} color={colors.text} strokeWidth={2} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={NativePlatform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardWrap}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {introMessage ? <IntroMessage message={introMessage} /> : null}
          <DraftDivider count={thread.drafts.length} />
          <TopicPrompt />
          {linkedinDraft ? <FeaturedDraftCard draft={linkedinDraft} /> : null}
          {creatorMessage ? <MessageBubble message={creatorMessage} /> : null}
          {refinementMessage ? <MessageBubble message={refinementMessage} /> : null}
          {xDraft ? <XVersionCard draft={xDraft} /> : null}
        </ScrollView>

        <View style={styles.composerWrap}>
          <View style={[styles.composer, shadows.soft]}>
            <TextInput
              placeholder="Type an idea or paste a link"
              placeholderTextColor="#8C827A"
              style={styles.input}
              multiline
            />
            <View style={styles.composerControls}>
              <Pressable accessibilityRole="button" style={styles.attachButton}>
                <Paperclip size={23} color={colors.text} strokeWidth={2.2} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.powersButton}
                onPress={() => setActivePower("Rewrite")}
              >
                <Sparkles size={20} color={colors.card} strokeWidth={2.2} />
                <Text style={styles.powersText}>Powers</Text>
              </Pressable>
              <View style={styles.composerSpacer} />
              <Pressable accessibilityRole="button" style={styles.personaShortcut}>
                <UserRound size={23} color={colors.text} strokeWidth={2} />
                <Text style={styles.personaText}>Persona</Text>
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.micButton}>
                <Mic size={25} color={colors.text} strokeWidth={2.1} />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function IntroMessage({ message }: { message: ChatMessage }) {
  return (
    <View style={styles.introRow}>
      <MirraAvatar size={58} elevated={false} />
      <View style={[styles.introBubble, shadows.soft]}>
        <Text style={styles.introText}>{message.body}</Text>
        <Text style={styles.messageTime}>11:45 AM</Text>
      </View>
    </View>
  );
}

function DraftDivider({ count }: { count: number }) {
  return (
    <View style={styles.draftDivider}>
      <View style={styles.dashLine} />
      <Sparkles size={18} color="#F3A7B4" strokeWidth={2.2} />
      <Text style={styles.dividerText}>{count} new drafts</Text>
      <Sparkles size={18} color="#F3A7B4" strokeWidth={2.2} />
      <View style={styles.dashLine} />
    </View>
  );
}

function TopicPrompt() {
  return (
    <View style={[styles.topicCard, componentRecipes.surface, shadows.soft]}>
      <Text style={styles.topicTitle}>what do you want to talk about?</Text>
      <View style={styles.topicRow}>
        {topicChips.map(({ label, Icon, color, backgroundColor, borderColor }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            style={[styles.topicChip, { backgroundColor, borderColor }]}
          >
            <Icon size={22} color={color} strokeWidth={2.1} />
            <Text style={styles.topicChipText}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function FeaturedDraftCard({ draft }: { draft: PostDraft }) {
  return (
    <View style={[styles.draftCard, componentRecipes.surface, shadows.soft]}>
      <View style={styles.draftHeader}>
        <View style={styles.draftIcon}>
          <PenLine size={25} color="#8C63E6" strokeWidth={2.2} />
        </View>
        <View style={styles.draftTitleBlock}>
          <Text style={styles.draftTitle}>draft for linkedin + x</Text>
          <View style={styles.voiceMatchPill}>
            <Text style={styles.voiceMatchText}>voice match {draft.match}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.draftAvatar}>
        <MirraAvatar size={58} elevated={false} />
        <View style={styles.avatarSparkle}>
          <Sparkles size={13} color={colors.card} fill={colors.card} />
        </View>
      </View>

      <Text style={styles.draftBody}>{draft.body}</Text>
      <View style={styles.draftRule} />

      <View style={styles.actionRow}>
        {draftActions.map(({ label, Icon, color, backgroundColor, borderColor }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            style={[styles.actionButton, { backgroundColor, borderColor }]}
          >
            <Icon size={20} color={color} strokeWidth={2.1} />
            <Text style={styles.actionLabel}>{label}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: true }} style={styles.xToggleButton}>
          <Text style={styles.xToggleText}>for x</Text>
          <View style={styles.toggleTrack}>
            <View style={styles.toggleThumb} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isCreator = message.role === "creator";

  return (
    <View style={[styles.messageRow, isCreator && styles.creatorRow]}>
      {!isCreator ? <MirraAvatar size={52} elevated={false} /> : null}
      <View style={[styles.messageBubble, isCreator ? styles.creatorBubble : styles.mirraBubble]}>
        <Text style={[styles.messageText, isCreator && styles.creatorText]}>{message.body}</Text>
        <View style={styles.messageMetaRow}>
          <Text style={[styles.messageTime, isCreator && styles.creatorTime]}>11:45 AM</Text>
          {isCreator ? <CheckCheck size={16} color={colors.coral} strokeWidth={2.3} /> : null}
        </View>
      </View>
    </View>
  );
}

function XVersionCard({ draft }: { draft: PostDraft }) {
  const platform = platforms[draft.platform];

  return (
    <View style={[styles.xCard, componentRecipes.surface, shadows.soft]}>
      <View style={styles.xHeader}>
        <View style={[styles.platformBadge, { backgroundColor: platform.color }]}>
          <Text style={styles.platformShort}>{platform.shortLabel.toUpperCase()}</Text>
        </View>
        <Text style={styles.xTitle}>x version</Text>
        <View style={styles.optimizedPill}>
          <Text style={styles.optimizedText}>optimized for x</Text>
        </View>
      </View>
      <Text style={styles.xBody}>{draft.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream
  },
  topBar: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[1],
    paddingBottom: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center"
  },
  modePill: {
    width: 250,
    minHeight: 56,
    paddingLeft: 74,
    paddingRight: 5,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1]
  },
  headerAvatar: {
    position: "absolute",
    left: 4,
    bottom: -13
  },
  mirraSegment: {
    minHeight: 46,
    paddingHorizontal: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  mirraSegmentText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9AD7BA"
  },
  chatSegment: {
    minHeight: 46,
    paddingHorizontal: spacing[2],
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#F6EAE0",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    position: "relative"
  },
  chatSegmentText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  chatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral
  },
  chatUnderline: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: -1,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.coral
  },
  keyboardWrap: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: 210,
    gap: spacing[4]
  },
  introRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3]
  },
  introBubble: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 24,
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing[3]
  },
  introText: {
    flex: 1,
    color: colors.text,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "500"
  },
  messageTime: {
    color: "#8C827A",
    fontSize: 13,
    fontWeight: "600"
  },
  draftDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingHorizontal: spacing[3]
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#F3B6BF"
  },
  dividerText: {
    color: "#EC6381",
    fontSize: 20,
    fontWeight: "800"
  },
  topicCard: {
    padding: spacing[4],
    gap: spacing[3]
  },
  topicTitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "500"
  },
  topicRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3]
  },
  topicChip: {
    minHeight: 48,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  topicChipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  draftCard: {
    padding: spacing[4],
    gap: spacing[3],
    position: "relative"
  },
  draftHeader: {
    paddingRight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3]
  },
  draftIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: "#F1E7FF",
    alignItems: "center",
    justifyContent: "center"
  },
  draftTitleBlock: {
    flex: 1,
    gap: spacing[2],
    alignItems: "flex-start"
  },
  draftTitle: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "900"
  },
  voiceMatchPill: {
    minHeight: 36,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
    justifyContent: "center"
  },
  voiceMatchText: {
    color: "#DC4D73",
    fontSize: 13,
    fontWeight: "800"
  },
  draftAvatar: {
    position: "absolute",
    right: spacing[4],
    top: spacing[4]
  },
  avatarSparkle: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#A96BEA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.card
  },
  draftBody: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 27,
    fontWeight: "500"
  },
  draftRule: {
    height: 1,
    backgroundColor: colors.border
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2]
  },
  actionButton: {
    minHeight: 50,
    paddingHorizontal: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  actionLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  xToggleButton: {
    minHeight: 50,
    paddingHorizontal: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.coral,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3]
  },
  xToggleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  toggleTrack: {
    width: 34,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#FFD7C9",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 2
  },
  toggleThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.coral
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3]
  },
  creatorRow: {
    justifyContent: "flex-end"
  },
  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderRadius: 22,
    gap: spacing[2]
  },
  mirraBubble: {
    backgroundColor: "#ECFAF2",
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#CDEFE2"
  },
  creatorBubble: {
    backgroundColor: "#FFE9D9",
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#F8D6C0"
  },
  messageText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "500"
  },
  creatorText: {
    color: colors.text
  },
  messageMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing[1]
  },
  creatorTime: {
    color: "#90786A"
  },
  xCard: {
    marginLeft: 80,
    padding: spacing[5],
    gap: spacing[4]
  },
  xHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3]
  },
  platformBadge: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center"
  },
  platformShort: {
    color: colors.card,
    fontSize: 15,
    fontWeight: "900"
  },
  xTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  optimizedPill: {
    minHeight: 30,
    paddingHorizontal: spacing[3],
    borderRadius: 999,
    backgroundColor: "#F0FFF8",
    borderWidth: 1,
    borderColor: "#CDEFE2",
    justifyContent: "center"
  },
  optimizedText: {
    color: "#358D70",
    fontSize: 12,
    fontWeight: "800"
  },
  xBody: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "500"
  },
  composerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    backgroundColor: "rgba(251, 244, 234, 0.92)"
  },
  composer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    borderRadius: 30,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[4]
  },
  input: {
    minHeight: 30,
    maxHeight: 82,
    color: colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "500",
    paddingVertical: 0
  },
  composerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3]
  },
  attachButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card
  },
  powersButton: {
    minHeight: 48,
    paddingHorizontal: spacing[4],
    borderRadius: 999,
    backgroundColor: colors.coral,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  powersText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "900"
  },
  composerSpacer: {
    flex: 1
  },
  personaShortcut: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  personaText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "800"
  },
  micButton: {
    width: 42,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  }
});
