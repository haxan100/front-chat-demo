# Simple Chat App - HTML Version

Aplikasi chat sederhana dan modern yang dikonversi dari React ke HTML, CSS, dan JavaScript murni. Cocok untuk dijalankan di server HTML seperti XAMPP.

## 🚀 Fitur

- **Landing Page** yang menarik dengan animasi
- **Login sederhana** tanpa password
- **Real-time chat simulation** dengan bot responses
- **User list** dengan status online/offline
- **Typing indicator** yang realistis
- **Responsive design** untuk mobile dan desktop
- **Toast notifications** untuk feedback user
- **Offline support** dengan Service Worker
- **Modern UI** dengan animasi smooth

## 📁 Struktur File

```
front-chat-demo/
├── index.html          # File HTML utama
├── style.css           # Styling CSS
├── script.js           # Logika JavaScript
├── sw.js              # Service Worker (optional)
└── README_HTML.md     # Dokumentasi ini
```

## 🛠️ Cara Menjalankan

### 1. Menggunakan XAMPP
1. Copy folder `front-chat-demo` ke `c:\xampp\htdocs\chat\`
2. Jalankan XAMPP dan aktifkan Apache
3. Buka browser dan akses: `http://localhost/chat/front-chat-demo/`

### 2. Menggunakan Server Lokal Lainnya
- **Live Server (VS Code)**: Klik kanan pada `index.html` → "Open with Live Server"
- **Python**: `python -m http.server 8000` lalu buka `http://localhost:8000`
- **Node.js**: `npx serve .` lalu buka URL yang ditampilkan

### 3. Buka Langsung di Browser
Double-click file `index.html` (beberapa fitur mungkin tidak berfungsi optimal)

## 🎨 Fitur UI/UX

### Landing Page
- Hero section dengan animasi icon
- Deskripsi aplikasi yang menarik
- Feature cards dengan hover effects
- Gradient background yang modern

### Login Page
- Form login sederhana
- Validasi username minimal 2 karakter
- Toast notification untuk feedback
- Tombol back ke landing page

### Chat Interface
- **Sidebar**: Daftar user dengan status online/offline
- **Header**: Info aplikasi dan tombol logout
- **Messages**: Bubble chat seperti WhatsApp
- **Input**: Form untuk mengirim pesan
- **Typing indicator**: Animasi titik-titik saat bot mengetik

## 🤖 Simulasi Bot

Aplikasi ini mensimulasikan percakapan real-time dengan:
- **Auto-response**: Bot akan membalas pesan Anda secara otomatis
- **Random delay**: Respon bot dengan delay 2-4 detik
- **Typing indicator**: Menampilkan indikator mengetik sebelum bot membalas
- **Random responses**: Bot memiliki berbagai macam balasan
- **Sample interactions**: Percakapan otomatis dimulai setelah 10 detik

## 📱 Responsive Design

- **Desktop**: Layout 2 kolom dengan sidebar
- **Tablet**: Sidebar tersembunyi, fokus pada chat
- **Mobile**: UI dioptimalkan untuk layar kecil
- **Touch-friendly**: Button dan input area yang mudah disentuh

## 🎯 Teknologi yang Digunakan

- **HTML5**: Struktur semantic dan modern
- **CSS3**: 
  - Flexbox dan Grid untuk layout
  - CSS Variables untuk theming
  - Animations dan transitions
  - Media queries untuk responsive
- **Vanilla JavaScript**:
  - ES6+ features
  - Local Storage untuk persistensi
  - Event handling
  - DOM manipulation
- **Font Awesome**: Icons yang modern
- **Service Worker**: Offline functionality

## 🔧 Kustomisasi

### Mengubah Warna Theme
Edit CSS variables di `style.css`:
```css
:root {
    --primary: #3b82f6;        /* Warna utama */
    --primary-dark: #2563eb;   /* Warna hover */
    --success: #10b981;        /* Warna online */
    --danger: #ef4444;         /* Warna error */
}
```

### Menambah User Dummy
Edit array `dummyUsers` di `script.js`:
```javascript
const dummyUsers = [
    { id: '4', name: 'Nama Baru', isOnline: true, avatar: 'N' },
    // tambah user lainnya...
];
```

### Mengubah Respon Bot
Edit array `responses` di function `simulateResponse()`:
```javascript
const responses = [
    'Respon baru 1',
    'Respon baru 2',
    // tambah respon lainnya...
];
```

## 🚀 Deployment

### GitHub Pages
1. Upload files ke GitHub repository
2. Aktifkan GitHub Pages di Settings
3. Akses via `https://username.github.io/repository-name/`

### Netlify
1. Drag & drop folder ke Netlify
2. Atau connect dengan GitHub repository
3. Deploy otomatis setiap ada perubahan

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` di folder project
3. Follow deployment steps

## 📝 Catatan Pengembangan

- **Local Storage**: Username disimpan di browser
- **No Backend**: Semua data di client-side
- **Simulasi Only**: Tidak ada koneksi real-time server
- **Progressive**: Bisa ditambah PWA features
- **Extensible**: Mudah ditambah fitur baru

## 🐛 Troubleshooting

### Font Awesome tidak muncul
- Pastikan koneksi internet untuk CDN
- Atau download dan host secara lokal

### Service Worker error
- Jalankan di HTTPS atau localhost
- Atau hapus kode service worker di `script.js`

### Layout rusak di mobile
- Pastikan viewport meta tag ada
- Test di berbagai device dan browser

## 📄 Lisensi

Free to use untuk pembelajaran dan pengembangan.

## 🤝 Kontribusi

Silakan fork dan submit pull request untuk perbaikan atau fitur baru!

---

**Happy Coding! 🎉**