import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { AbaComVibracao } from '@/componentes/navegacao/AbaComVibracao';
import { AppColors } from '@/constantes/tema';

export default function LayoutAbasCliente() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: AbaComVibracao,
        tabBarActiveTintColor: AppColors.accent,
        tabBarInactiveTintColor: AppColors.mutedLight,
        tabBarStyle: {
          backgroundColor: AppColors.surface,
          borderTopColor: AppColors.border,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vitrine"
        options={{
          title: 'Vitrine',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="compras"
        options={{
          title: 'Compras',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
