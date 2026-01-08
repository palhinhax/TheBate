# Assets da Aplicação

## 📁 Estrutura de Pastas

```
public/
├── images/
│   ├── logo.svg          # Logo principal (formato vetorial)
│   ├── logo.png          # Logo em PNG (fallback)
│   ├── logo-dark.svg     # Logo para modo escuro (opcional)
│   └── og-image.png      # Imagem para Open Graph (1200x630px)
├── favicon.ico           # Favicon 
├── apple-touch-icon.png  # Ícone para iOS (180x180px)
└── robots.txt            # Gerado automaticamente
```

## 🎨 Como Adicionar o Logo

### 1. Coloca os ficheiros de logo aqui:

- **Logo principal**: `/public/images/logo.svg` ou `/public/images/logo.png`
- **Favicon**: `/public/favicon.ico`
- **Apple Touch Icon**: `/public/apple-touch-icon.png`
- **Open Graph Image**: `/public/images/og-image.png` (para shares no Facebook, Twitter, etc.)

### 2. Usar o Logo nos Componentes

#### Na Navbar:

```tsx
// components/navbar.tsx
import Image from "next/image";

<Link href="/" className="flex items-center gap-2">
  <Image 
    src="/images/logo.svg" 
    alt="Thebate" 
    width={32} 
    height={32}
  />
  <span className="text-xl font-bold">Thebate</span>
</Link>
```

#### Como Favicon:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "Thebate",
  description: "...",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
```

#### Para Open Graph (redes sociais):

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "Thebate",
  openGraph: {
    images: ['/images/og-image.png'],
  },
};
```

## 📐 Tamanhos Recomendados

- **Logo SVG**: Formato vetorial (ideal)
- **Logo PNG**: Mínimo 512x512px (transparente)
- **Favicon**: 32x32px ou 16x16px (.ico ou .png)
- **Apple Touch Icon**: 180x180px
- **Open Graph**: 1200x630px
- **Twitter Card**: 1200x600px

## 🚀 Acessar os Arquivos

Todos os arquivos em `/public/` são acessíveis diretamente:

- `/images/logo.svg` → https://thebatee.com/images/logo.svg
- `/favicon.ico` → https://thebatee.com/favicon.ico

## ✅ Próximos Passos

1. **Adiciona o teu logo** em `/public/images/logo.svg` ou `.png`
2. **Atualiza a Navbar** para usar a imagem
3. **Adiciona o favicon** em `/public/favicon.ico`
4. **Atualiza metadata** no `app/layout.tsx`
5. **Commit e deploy**:
   ```bash
   git add public/
   git commit -m "feat: add logo and brand assets"
   git push
   ```
