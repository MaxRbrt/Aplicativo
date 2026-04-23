# Aplicativo Mobile

Projeto mobile em Expo Router com fluxo de loja, painel administrativo, usuários via API PHP/MySQL e dados da loja em AsyncStorage.

## Funcionalidades

- Login e criação de conta usando API PHP/MySQL, com perfis de admin e cliente.
- Painel admin para produtos, usuários e faturamento.
- Vitrine, carrinho, histórico de compras e nota fiscal para cliente.
- Carrinho e pedidos separados por usuário logado.
- Limpeza automática de dados quando usuários são removidos.

## Estrutura

- `app`: rotas do Expo Router.
- `componentes`: componentes reutilizáveis.
- `constantes`: tema e valores globais.
- `estilos`: estilos separados das telas e componentes.
- `ganchos`: hooks reutilizáveis.
- `servicos/api`: integração com a API PHP/MySQL de usuários.
- `servicos/armazenamento`: regras locais de produtos, carrinho, pedidos, categorias e sessão.

## Como rodar

```bash
npm install
npm start
```

Também é possível abrir direto em plataformas específicas:

```bash
npm run android
npm run ios
npm run web
```

## Qualidade

```bash
npm run lint
npx tsc --noEmit
```
