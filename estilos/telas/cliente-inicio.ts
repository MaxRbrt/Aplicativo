import { AppColors } from "@/constantes/tema";
import { StyleSheet } from "react-native";

const C = AppColors;

export const estilosClienteInicio = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    gap: 20,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
    borderRadius: 12,
  },
  brandMarkText: {
    color: C.white,
    fontSize: 20,
    fontWeight: "900",
  },
  brand: {
    color: C.text,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },
  hero: {
    gap: 6,
  },
  kicker: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  subtitle: {
    color: C.mutedLight,
    fontSize: 14,
  },
  banner: {
    gap: 8,
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  bannerTag: {
    color: C.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bannerTitle: {
    color: C.text,
    fontSize: 22,
    fontWeight: "900",
  },
  bannerText: {
    color: C.mutedLight,
    fontSize: 13,
    lineHeight: 19,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "47%",
    gap: 5,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  summaryLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  summaryValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: "900",
  },
  sectionHeader: {
    marginTop: 2,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "900",
  },
  categoryRow: {
    gap: 10,
    paddingRight: 20,
  },
  categoryPill: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: "800",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
  },
  actionButtonText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
