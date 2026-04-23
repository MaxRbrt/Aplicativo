import { AppColors } from "@/constantes/tema";
import { StyleSheet } from "react-native";

const C = AppColors;

const baseInput = {
  backgroundColor: C.inputBg,
  borderColor: C.border,
  borderRadius: 12,
  borderWidth: 1,
  color: C.text,
  fontSize: 15,
  paddingHorizontal: 14,
  paddingVertical: 13,
};

export const estilosAdminProdutos = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  kicker: {
    color: C.amber,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "900",
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
  tabActive: {
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
  },
  tabText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: "800",
  },
  tabTextActive: {
    color: C.accent,
  },
  content: {
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    gap: 14,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  input: baseInput,
  inputMultiline: {
    minHeight: 86,
    paddingTop: 13,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  rowItem: {
    flex: 1,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },
  imageBlock: {
    gap: 12,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  imagePicker: {
    alignItems: "center",
    borderColor: C.border,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    paddingVertical: 26,
  },
  imagePickerTitle: {
    color: C.mutedLight,
    fontSize: 14,
    fontWeight: "800",
  },
  imagePickerSub: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    backgroundColor: C.inputBg,
    borderColor: C.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  categoryPillActive: {
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
  },
  categoryText: {
    color: C.mutedLight,
    fontWeight: "700",
  },
  categoryTextActive: {
    color: C.accent,
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
  smallButton: {
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  smallButtonText: {
    color: C.white,
    fontWeight: "900",
  },
  dangerButton: {
    alignItems: "center",
    backgroundColor: C.dangerSoft,
    borderColor: C.danger,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
  },
  dangerButtonText: {
    color: C.danger,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryAction: {
    flex: 1,
    alignItems: "center",
    borderColor: C.accent,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
  secondaryActionText: {
    color: C.accent,
    fontWeight: "800",
  },
  dangerAction: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.dangerSoft,
    borderColor: C.danger,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
  dangerActionText: {
    color: C.danger,
    fontWeight: "800",
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  searchInput: {
    ...baseInput,
    marginBottom: 8,
  },
  emptyBox: {
    alignItems: "center",
    gap: 8,
    paddingTop: 60,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "900",
  },
  emptySub: {
    color: C.muted,
    fontSize: 14,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  productImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
  },
  productImagePlaceholder: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surfaceHigh,
    borderRadius: 12,
  },
  productImageText: {
    color: C.mutedLight,
    fontSize: 22,
    fontWeight: "900",
  },
  productInfo: {
    flex: 1,
    gap: 3,
  },
  productActions: {
    gap: 8,
  },
  productName: {
    color: C.text,
    fontSize: 15,
    fontWeight: "900",
  },
  productPrice: {
    color: C.accent,
    fontSize: 15,
    fontWeight: "800",
  },
  productMeta: {
    color: C.muted,
    fontSize: 12,
  },
  editButton: {
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  editButtonText: {
    color: C.accent,
    fontSize: 12,
    fontWeight: "900",
  },
  removeButton: {
    backgroundColor: C.dangerSoft,
    borderColor: C.danger,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: C.danger,
    fontSize: 12,
    fontWeight: "900",
  },
});
