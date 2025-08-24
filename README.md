# Puffman - Platform Oyunu

Modern, modüler JavaScript ile yazılmış bir platform oyunu. PIXI.js kullanılarak geliştirilmiştir.

## 🎮 Oyun Açıklaması

Puffman, karakterinizi kontrol ederek bombaları patlatmaya çalıştığınız bir platform oyunudur. Hedefiniz zamanın dolmadan önce mümkün olduğunca çok bomba patlatmaktır.

## 🕹️ Kontroller

- **W**: Zıplama
- **A**: Sola hareket
- **D**: Sağa hareket
- **Sol Tık**: Rüzgar gönderme (bomba patlatma)
- **Space**: Oyunu duraklat/devam ettir

## 📁 Proje Yapısı

```
pffman/
├── assets/                 # Oyun varlıkları
│   ├── images/            # Görseller
│   └── fonts/             # Fontlar
├── src/                   # Kaynak kodlar
│   ├── css/               # Stil dosyaları
│   └── js/                # JavaScript modülleri
│       ├── game/          # Oyun mantığı
│       │   ├── Game.js    # Ana oyun sınıfı
│       │   ├── Player.js  # Oyuncu sınıfı
│       │   ├── Bomb.js    # Bomba sınıfı
│       │   ├── Platform.js # Platform yöneticisi
│       │   └── PuffManager.js # Puff yöneticisi
│       ├── ui/            # Kullanıcı arayüzü
│       │   └── UIComponents.js # UI bileşenleri
│       ├── utils/         # Yardımcı fonksiyonlar
│       │   └── helpers.js # Genel yardımcılar
│       ├── config.js      # Oyun konfigürasyonu
│       ├── main.js        # Ana başlangıç dosyası
│       └── pixi.min.js    # PIXI.js kütüphanesi
├── index.html             # Ana HTML dosyası
└── README.md              # Bu dosya
```

## 🔧 Teknik Özellikler

### Modüler Yapı

- **ES6 Modülleri**: Her bileşen ayrı dosyalarda organize edilmiş
- **Sınıf Tabanlı**: Modern JavaScript sınıfları kullanılmış
- **Ayrılmış Sorumluluklar**: Her sınıf tek bir sorumluluğa sahip

### Kod Düzenlemeleri

- **Tekrar Kodların Eliminasyonu**: Ortak fonksiyonlar UI Components'te birleştirildi
- **Konfigürasyon**: Tüm sabit değerler config.js'te merkezi olarak yönetiliyor
- **Utility Fonksiyonları**: Çarpışma kontrolü, timer gibi genel fonksiyonlar ayrıldı

### Bileşenler

#### Game.js

Ana oyun mantığı ve akışını yöneten sınıf

#### Player.js

Oyuncu karakteri, animasyonları ve fizik hesaplarını yöneten sınıf

#### Bomb.js

Bomba objelerini oluşturan ve yöneten sınıf

#### Platform.js

Oyun platformlarını oluşturan ve yöneten sınıf

#### PuffManager.js

Rüzgar efektlerini (puff) yöneten sınıf

#### UIComponents.js

Tüm UI bileşenlerini oluşturan static metodları içeren sınıf

## 🚀 Çalıştırma

1. Projeyi bir web sunucusunda çalıştırın (ES6 modülleri nedeniyle)
2. `index.html` dosyasını açın
3. "Start" butonuna tıklayarak oyunu başlatın

## 🎯 Performans İyileştirmeleri

- Asset yükleme optimize edildi
- Memory leak'ler önlendi (cleanup fonksiyonları eklendi)
- Gereksiz DOM manipülasyonları azaltıldı
- Tick bazlı update sistemi optimize edildi

## 🐛 Hata Düzeltmeleri

- Çarpışma kontrolü iyileştirildi
- Platform physics bugs düzeltildi
- Pause/resume sistem kararlılığı artırıldı
- Asset yol sorunları çözüldü
