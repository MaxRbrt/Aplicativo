import { AppColors } from "@/constantes/tema";
import { StyleSheet } from "react-native";

const C = AppColors;

export const estilosCartoes = StyleSheet.create({
  painel: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  painelForte: {
    backgroundColor: C.surfaceHigh,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metrica: {
    width: "47%",
    gap: 5,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  metricaGrande: {
    gap: 8,
    backgroundColor: C.surface,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },
  metricaRotulo: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  metricaValor: {
    color: C.text,
    fontSize: 24,
    fontWeight: "900",
  },
  metricaValorAzul: {
    color: C.accent,
    fontSize: 26,
    fontWeight: "900",
  },
  metricaValorVerde: {
    color: C.green,
    fontSize: 26,
    fontWeight: "900",
  },
  metricaTexto: {
    color: C.mutedLight,
    fontSize: 12,
    lineHeight: 18,
  },
  listaItem: {
    gap: 8,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
});
