import { AppColors } from "@/constantes/tema";
import { StyleSheet } from "react-native";

const C = AppColors;

export const estilosCriarConta = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    gap: 18,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
  },
  brandBlock: {
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
    borderRadius: 14,
  },
  brandIconText: {
    color: C.white,
    fontSize: 24,
    fontWeight: "900",
  },
  brandName: {
    color: C.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 5,
  },
  header: {
    gap: 5,
  },
  title: {
    color: C.text,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: C.mutedLight,
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 6,
  },
  label: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: C.inputBg,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    color: C.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
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
  linkButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  linkButtonText: {
    color: C.accent,
    fontSize: 14,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.65,
  },
});
