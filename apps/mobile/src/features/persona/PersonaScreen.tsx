import { colors, componentRecipes, platforms, radii, shadows, spacing } from "@mirra/design";
import type { PlatformDifference, PersonaSection, PersonaTrait } from "@mirra/product";
import { useQuery } from "@tanstack/react-query";
import { Brain, Layers3, Quote, ShieldCheck, Sparkles, TrendingUp } from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/Chip";
import { MirraAvatar } from "@/components/MirraAvatar";
import { PatternBackground } from "@/components/PatternBackground";
import { SegmentedPill } from "@/components/SegmentedPill";
import { fetchPersonaSnapshot } from "@/lib/mockApi";
import { useCreatorStore } from "@/state/creatorStore";

const filterLabels = [
  { id: "all" as const, label: "All" },
  { id: "linkedin" as const, label: "LinkedIn" },
  { id: "x" as const, label: "X" }
];

export function PersonaScreen() {
  const { personaPlatform, setPersonaPlatform } = useCreatorStore();
  const { data: persona } = useQuery({
    queryKey: ["persona-snapshot"],
    queryFn: fetchPersonaSnapshot
  });

  if (!persona) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <PatternBackground />
      </SafeAreaView>
    );
  }

  const platformDifferences =
    personaPlatform === "all"
      ? persona.platformDifferences
      : persona.platformDifferences.filter((item) => item.platform === personaPlatform);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PatternBackground />
      <View style={styles.topBar}>
        <SegmentedPill active="persona" />
        <MirraAvatar size={58} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Persona memory</Text>
          <Text style={styles.title}>Mirra is learning how your writing sounds.</Text>
          <Text style={styles.summary}>{persona.summary}</Text>
        </View>

        <View style={styles.filterRow}>
          {filterLabels.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              selected={personaPlatform === filter.id}
              onPress={() => setPersonaPlatform(filter.id)}
            />
          ))}
        </View>

        <View style={styles.metricGrid}>
          <MetricCard
            icon={<Layers3 size={17} color={colors.denim} />}
            value={String(persona.analyzedPosts)}
            label="posts analyzed"
            accent={colors.denim}
          />
          <MetricCard
            icon={<Sparkles size={17} color={colors.coral} />}
            value={`${persona.voiceMatch}%`}
            label="voice match"
            accent={colors.coral}
          />
          <MetricCard
            icon={<ShieldCheck size={17} color={colors.success} />}
            value={`${persona.confidence}%`}
            label="confidence"
            accent={colors.success}
          />
        </View>

        <SectionShell title="Writing Traits" icon={<Brain size={18} color={colors.coral} />}>
          <View style={styles.traitStack}>
            {persona.traits.map((trait) => (
              <TraitRow key={trait.label} trait={trait} />
            ))}
          </View>
        </SectionShell>

        {persona.sections.map((section) => (
          <View key={section.title}>
            <PersonaList section={section} />
          </View>
        ))}

        <SectionShell title="Platform Differences" icon={<TrendingUp size={18} color={colors.denim} />}>
          <View style={styles.platformStack}>
            {platformDifferences.map((difference) => (
              <PlatformDifferenceCard key={difference.platform} difference={difference} />
            ))}
          </View>
        </SectionShell>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  value,
  label,
  accent
}: {
  icon: ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <View style={[styles.metricCard, shadows.soft]}>
      <View style={[styles.metricIcon, { backgroundColor: `${accent}1F` }]}>{icon}</View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function SectionShell({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <View style={[styles.sectionShell, componentRecipes.surface, shadows.soft]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>{icon}</View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function TraitRow({ trait }: { trait: PersonaTrait }) {
  return (
    <View style={styles.traitRow}>
      <View style={styles.traitCopy}>
        <Text style={styles.traitLabel}>{trait.label}</Text>
        <Text style={styles.traitValue}>{trait.value}</Text>
      </View>
      <View style={styles.traitMeter}>
        <View style={[styles.traitFill, { width: `${trait.strength}%` }]} />
      </View>
    </View>
  );
}

function PersonaList({ section }: { section: PersonaSection }) {
  return (
    <SectionShell title={section.title} icon={<Quote size={18} color={colors.lavender} />}>
      <View style={styles.tagWrap}>
        {section.items.map((item) => (
          <View key={item} style={styles.memoryTag}>
            <Text style={styles.memoryTagText}>{item}</Text>
          </View>
        ))}
      </View>
    </SectionShell>
  );
}

function PlatformDifferenceCard({ difference }: { difference: PlatformDifference }) {
  const platform = platforms[difference.platform];

  return (
    <View style={styles.platformCard}>
      <View style={styles.platformHeader}>
        <View style={[styles.platformBadge, { backgroundColor: platform.color }]}>
          <Text style={styles.platformShort}>{platform.shortLabel}</Text>
        </View>
        <View style={styles.platformCopy}>
          <Text style={styles.platformTitle}>{platform.label}</Text>
          <Text style={styles.platformSummary}>{difference.summary}</Text>
        </View>
      </View>
      <View style={styles.platformTraits}>
        {difference.traits.map((trait) => (
          <Text key={trait} style={styles.platformTrait}>
            {trait}
          </Text>
        ))}
      </View>
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
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[10],
    gap: spacing[5]
  },
  hero: {
    gap: spacing[2]
  },
  kicker: {
    color: colors.coral,
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900"
  },
  summary: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600"
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing[2]
  },
  metricGrid: {
    flexDirection: "row",
    gap: spacing[3]
  },
  metricCard: {
    flex: 1,
    minHeight: 116,
    padding: spacing[3],
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "space-between"
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800"
  },
  sectionShell: {
    padding: spacing[4],
    gap: spacing[4]
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2]
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF2E8",
    alignItems: "center",
    justifyContent: "center"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  traitStack: {
    gap: spacing[4]
  },
  traitRow: {
    gap: spacing[2]
  },
  traitCopy: {
    gap: spacing[1]
  },
  traitLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  traitValue: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  traitMeter: {
    height: 8,
    borderRadius: 99,
    overflow: "hidden",
    backgroundColor: "#F4E9DC"
  },
  traitFill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: colors.mint
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2]
  },
  memoryTag: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 999,
    backgroundColor: "#F7EFE5",
    borderWidth: 1,
    borderColor: colors.border
  },
  memoryTagText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  platformStack: {
    gap: spacing[3]
  },
  platformCard: {
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: "#FFF8EF",
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[3]
  },
  platformHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3]
  },
  platformBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  platformShort: {
    color: colors.card,
    fontSize: 13,
    fontWeight: "900"
  },
  platformCopy: {
    flex: 1,
    gap: spacing[1]
  },
  platformTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  platformSummary: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700"
  },
  platformTraits: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2]
  },
  platformTrait: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    backgroundColor: colors.card,
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2]
  }
});
