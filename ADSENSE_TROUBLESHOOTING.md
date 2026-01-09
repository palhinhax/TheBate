# 🔧 Google AdSense - Resolução de Problemas

## 🚨 Quadrado em Branco? Eis os Motivos Mais Comuns:

### 1. **Estás em Ambiente de Desenvolvimento (MAIS COMUM)**

O Google AdSense **NÃO FUNCIONA** em:

- ❌ `localhost`
- ❌ `127.0.0.1`
- ❌ GitHub Codespaces (`.github.dev`, `.app.github.dev`)
- ❌ IPs privados
- ❌ Subdomínios de teste

**Solução:** Faz deploy em produção com domínio público (ex: Vercel, Netlify).

### 2. **Site Não Verificado no AdSense**

Após adicionar o site ao Google AdSense, demora **24-48 horas** para:

- ✅ Verificação do site
- ✅ Aprovação da conta
- ✅ Primeiros anúncios aparecerem

**Solução:**

1. Vai ao [painel do AdSense](https://www.google.com/adsense/)
2. Verifica se o site está "Aprovado" e não "Pendente"
3. Aguarda 24-48h após aprovação

### 3. **Ad Blocker Ativo**

Extensões como uBlock Origin, AdBlock Plus bloqueiam anúncios.

**Solução:**

- Desativa temporariamente o ad blocker
- Testa em modo anónimo/incógnito
- Testa noutro browser

### 4. **Slot ID Inválido**

O `adSlot` precisa de ser o ID correto da unidade de anúncio.

**Verificar:**

```tsx
// ❌ ERRADO
<AdContainer adSlot="0000000000" />

// ✅ CORRETO (exemplo)
<AdContainer adSlot="5814797320" />
```

**Como obter o Slot ID:**

1. [Painel AdSense](https://www.google.com/adsense/) → "Anúncios"
2. Clica numa unidade de anúncio
3. Copia o número no campo `data-ad-slot`

### 5. **Variável de Ambiente Não Configurada**

Verifica se o `.env` tem:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-9458046359698653"
```

**Verificar no terminal:**

```bash
grep NEXT_PUBLIC_GOOGLE_ADSENSE_ID .env
```

Se não aparecer nada, adiciona a variável e **reinicia o servidor**.

### 6. **Restrições Geográficas**

O Google pode não ter anúncios disponíveis para:

- Certos países
- Certos conteúdos
- Tráfego muito baixo

**Solução:** Testa com VPN noutra localização (EUA, UK, etc.)

### 7. **Conteúdo Não Aprovado**

O AdSense pode não mostrar anúncios em:

- Conteúdo adulto
- Violência explícita
- Spam
- Sites vazios (< 10 páginas)

**Solução:** Verifica as [Políticas do AdSense](https://support.google.com/adsense/answer/48182)

---

## 🔍 Como Depurar (Debug)

### 1. Abre a Consola do Browser (F12)

Procura por mensagens do AdSense:

```
✅ Google AdSense: Anúncio carregado com sucesso!
⚠️ Google AdSense: Anúncios não aparecem em localhost/codespaces
⚠️ Google AdSense: Nenhum anúncio disponível para mostrar
❌ AdSense error: ...
```

### 2. Inspeciona o Elemento

1. Clica direito no quadrado vazio → "Inspecionar"
2. Procura por:
   ```html
   <ins class="adsbygoogle" data-ad-status="unfilled"></ins>
   ```

**Significados:**

- `data-ad-status="filled"` → ✅ Anúncio carregado
- `data-ad-status="unfilled"` → ⚠️ Sem anúncios disponíveis
- Sem `data-ad-status` → ⚠️ Script não executou ou bloqueado

### 3. Verifica Erros de Rede

1. F12 → Aba "Network"
2. Filtra por "adsbygoogle"
3. Verifica se há erros 404, 403, ou bloqueios

---

## ✅ Checklist de Verificação Rápida

Antes de entrar em pânico, verifica:

- [ ] Estou a testar em **produção** (não localhost)?
- [ ] O site está **verificado e aprovado** no AdSense?
- [ ] Passaram **24-48h** desde a aprovação?
- [ ] O **ad blocker** está desativado?
- [ ] A variável `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` está no `.env`?
- [ ] O `adSlot` é um ID válido (não "0000000000")?
- [ ] Há mensagens de erro na consola (F12)?
- [ ] O site tem conteúdo suficiente (> 10 páginas)?

---

## 🧪 Como Testar Corretamente

### Opção 1: Deploy em Produção (Recomendado)

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod
```

Aguarda 5-10 minutos após deploy e testa no domínio público.

### Opção 2: Usar a Google Publisher Toolbar

1. Instala: [Google Publisher Toolbar](https://chrome.google.com/webstore/detail/google-publisher-toolbar/omioeahgfecgfpfldejlnideemfidugg)
2. Faz login com a conta do AdSense
3. Ativa "Overlay" para ver debug info
4. Visita a página e vê se deteta anúncios

### Opção 3: Testar com Anúncios de Demonstração

No `.env`, **temporariamente** muda para:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-test"
```

⚠️ Isto mostra anúncios fictícios para testar o layout, mas **NÃO são anúncios reais**.

---

## 📞 Suporte Adicional

Se nenhuma solução funcionar:

1. **Fórum AdSense:** https://support.google.com/adsense/community
2. **Chat de Suporte:** https://support.google.com/adsense/gethelp
3. **Verifica o Status:** Painel AdSense → "Conta" → vê se há avisos

---

## 💡 Dicas Finais

1. **Paciência:** Após aprovação, pode demorar dias até anúncios consistentes
2. **Tráfego:** Sites com < 100 visitas/dia têm menos anúncios
3. **Conteúdo:** Quanto mais páginas e conteúdo original, mais anúncios
4. **Hora do dia:** Alguns horários têm menos inventário de anúncios
5. **Logs:** Ativa sempre a consola (F12) para ver mensagens de debug

---

## 🎯 Resumo Rápido

**90% dos casos o problema é:**

1. ❌ Testar em localhost/codespaces
2. ⏳ Site recém-aprovado (< 48h)
3. 🚫 Ad blocker ativo

**Solução:** Deploy em produção + aguarda 48h + desativa ad blocker.
