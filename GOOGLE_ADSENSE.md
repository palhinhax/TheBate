# Como Configurar Google AdSense

## 📋 Pré-requisitos

- Ter um domínio próprio (Google AdSense não funciona em localhost ou codespaces diretamente)
- Aplicação publicada e acessível publicamente

## 🚀 Passos para Configurar

### 1. Criar Conta no Google AdSense

1. Acede a: **https://www.google.com/adsense/**
2. Clica em **"Começar"** e faz login com tua conta Google
3. Preenche os dados:
   - URL do teu website
   - Informações de pagamento
   - Aceita os termos de serviço

### 2. Adicionar o Site ao AdSense

1. No painel do AdSense, vai a **"Sites"**
2. Clica em **"Adicionar site"**
3. Insere o URL do teu site (ex: `thebate.com`)
4. Copia o código de verificação que o AdSense te dá

### 3. Obter o Publisher ID

No painel do AdSense, vai a **"Conta"** → **"Definições"**
O teu Publisher ID tem este formato: `ca-pub-XXXXXXXXXXXXXXXX`

### 4. Configurar no Projeto

Edita o ficheiro `.env` e adiciona o teu Publisher ID:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

### 5. Criar Blocos de Anúncios

1. No painel do AdSense, vai a **"Anúncios"** → **"Por unidade de anúncio"**
2. Clica em **"Criar anúncio"**
3. Escolhe o tipo:
   - **Display ads** (recomendado)
   - Responsive
4. Dá um nome ao bloco (ex: "Homepage Top")
5. Copia o **`data-ad-slot`** (ex: `1234567890`)

### 6. Usar nos Componentes

```tsx
// Exemplo na homepage
<AdContainer adSlot="1234567890" />

// Exemplo em páginas de tópico
<AdContainer adSlot="0987654321" />
```

## 🧪 Testar em Desenvolvimento

**⚠️ IMPORTANTE:** Google AdSense **não mostra anúncios reais** em:

- `localhost`
- IPs privados
- Subdomínios do GitHub Codespaces
- Sites não verificados

### Opções para testar:

#### Opção 1: Publicar o Site (Recomendado)

Deploy no Vercel/Netlify com domínio próprio:

```bash
# Deploy no Vercel
npx vercel --prod

# Ou via GitHub
# Push para GitHub e conecta ao Vercel
```

#### Opção 2: Usar Anúncios de Teste

Adiciona isto ao `.env` para ver anúncios de teste:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-test"
```

#### Opção 3: Verificar com Google Publisher Toolbar

1. Instala a extensão: [Google Publisher Toolbar](https://chrome.google.com/webstore/detail/google-publisher-toolbar/omioeahgfecgfpfldejlnideemfidugg)
2. Faz login com a conta do AdSense
3. Ativa o modo de teste

## 📊 Verificar se está a Funcionar

1. **Inspeciona a página** (F12)
2. Procura por elementos `<ins class="adsbygoogle">`
3. Verifica se há erros no console
4. O Google pode demorar **até 48h** para aprovar anúncios novos

## 🔍 Troubleshooting

### Anúncios não aparecem?

1. **Verifica o console:** Pode haver erros do AdSense
2. **Aguarda aprovação:** Sites novos podem demorar dias a ser aprovados
3. **Verifica políticas:** Certifica-te que o conteúdo respeita as [políticas do AdSense](https://support.google.com/adsense/answer/48182)
4. **Testa com domínio público:** Localhost não funciona

### Mensagens comuns:

- `"AdSense tag not verified"` → Site ainda não foi verificado
- `"No fill"` → Não há anúncios disponíveis para mostrar
- `"This site is not approved"` → Aguarda aprovação do Google

## 💰 Requisitos para Pagamento

- Mínimo de **$100 USD** em ganhos
- Conta bancária ou PayPal configurada
- Verificação de identidade completa

## 📚 Recursos

- [Central de Ajuda AdSense](https://support.google.com/adsense/)
- [Políticas do Programa](https://support.google.com/adsense/answer/48182)
- [Guia de Otimização](https://support.google.com/adsense/topic/3373519)

---

## 🎯 Estrutura Atual no Projeto

```
components/
  ├── google-adsense.tsx      # Componente individual do anúncio
  ├── adsense-script.tsx      # Script do Google AdSense
  └── ad-container.tsx        # Container estilizado

app/
  └── layout.tsx              # Script carregado globalmente
```

### Usar em qualquer página:

```tsx
import { AdContainer } from "@/components/ad-container";

export default function MinhaPage() {
  return (
    <div>
      <h1>Conteúdo</h1>

      {/* Anúncio no meio do conteúdo */}
      <AdContainer adSlot="SEU_AD_SLOT_AQUI" />

      <p>Mais conteúdo...</p>
    </div>
  );
}
```
