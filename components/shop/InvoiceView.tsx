import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/app-theme';
import { formatarMoeda, Pedido, precoParaNumero } from '@/services/storage';

const C = AppColors;

export function InvoiceView({ pedido }: { pedido: Pedido }) {
  const data = new Date(pedido.criadoEm).toLocaleString('pt-BR');

  return (
    <View style={styles.invoice}>
      <View style={styles.header}>
        <View>
          <Text style={styles.company}>FAST STORE</Text>
          <Text style={styles.caption}>Nota fiscal simplificada</Text>
        </View>
        <View style={styles.numberBox}>
          <Text style={styles.numberLabel}>NF</Text>
          <Text style={styles.number}>{pedido.numero}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <Info label="Cliente" value={pedido.compradorEmail} />
        <Info label="Emissão" value={data} />
      </View>

      <View style={styles.items}>
        {pedido.itens.map((item) => {
          const subtotal = precoParaNumero(item.produto.preco) * item.quantidade;

          return (
            <View key={item.produto.id} style={styles.itemRow}>
              <View style={styles.itemText}>
                <Text style={styles.itemName}>{item.produto.nome}</Text>
                <Text style={styles.itemMeta}>{item.produto.categoria ?? 'Sem categoria'}</Text>
                <Text style={styles.itemMeta}>Qtd: {item.quantidade} x {formatarMoeda(precoParaNumero(item.produto.preco))}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatarMoeda(subtotal)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.totalBox}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatarMoeda(pedido.subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.grandLabel}>Total pago</Text>
          <Text style={styles.grandValue}>{formatarMoeda(pedido.total)}</Text>
        </View>
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  invoice: {
    gap: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  company: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  caption: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  numberBox: {
    alignItems: 'flex-end',
  },
  numberLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
  },
  number: {
    color: C.accent,
    fontSize: 16,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    gap: 3,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  items: {
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
  },
  itemMeta: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  itemPrice: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  totalBox: {
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  totalValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  grandLabel: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  grandValue: {
    color: C.accent,
    fontSize: 18,
    fontWeight: '900',
  },
});