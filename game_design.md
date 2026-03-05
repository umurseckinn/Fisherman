🎮 ISLAND HOPPER FISHING — GAME DESIGN DOCUMENT v1.0
Önsöz
Island Hopper Fishing, oyuncunun küçük bir balıkçı teknesiyle 5 farklı ada arasında yolculuk ettiği, her adada balık tutup sattığı, kazandığı parayla yakıt ve ekipman alarak ilerlemesini sağladığı bir hyper-casual strateji-arcade oyunudur.
Oyunun kalbi iki gerilim ekseninde atar:

Ağırlık ekseninde: Ne kadar çok balık tutarsan o kadar çok para — ama tekne batabilir
Ekonomi ekseninde: Yeterince para kazanmak zorundasın — ama her karar bir trade-off

Oyuncu ne kadar hızlı ne kadar çok tutacağına değil, neyi ne zaman tutacağına karar verir. Basit görünür, derin hissettirmelidir.

📐 BÖLÜM 1: TEMEL OYUN DÖNGÜSÜ
┌─────────────────────────────────────────────────┐
│                                                 │
│   BAŞLANGIÇ                                     │
│   Ada 1 → Balık Tut → Süre Dolar               │
│              ↓                                  │
│   ADA MARKETI AÇILIR                            │
│   Balık Sat → Ekipman Al → Yakıt Al            │
│              ↓                                  │
│   YETERLİ YAKIT VAR MI?                         │
│   EVET → Sonraki Ada    HAYIR → GAME OVER       │
│              ↓                                  │
│   TEKNE DOLU MU? (ağırlık)                      │
│   DOLMADAN → Devam      DOLARSA → GAME OVER     │
│              ↓                                  │
│   Ada 5'e Ulaş → WİN                           │
│                                                 │
└─────────────────────────────────────────────────┘

🏝 BÖLÜM 2: ADA SİSTEMİ
2.1 Ada Profilleri
Her ada görsel olarak birbirinden tamamen farklıdır. Oyuncu hangi adada olduğunu UI'dan değil, arka plan ve atmosferden anlamalıdır.

ADA 1 — Başlangıç Körfezi
Görsel Tema     : Açık mavi gökyüzü, berrak
                  turkuaz su, güneşli ve sığ
                  görünüm, arka planda palmiye
                  ağaçlarıyla küçük kum adası
Su Rengi        : Açık turkuaz (#29B6F6)
Gökyüzü         : Açık mavi, beyaz bulutlar
Işık            : Parlak gündüz güneşi
Dip             : Açık kum, az yosun
Müzik Tonu      : Neşeli, hafif tropik
Zorluk          : Başlangıç
Yolculuk Süresi : 60 saniye
Spawn Balıkları : Bubble, Sakura, Zap, Candy
Engeller        : Sea Kelp (2), Sea Rock (1)
Yakıt Maliyeti  : 50🪙 (Ada 2'ye geçiş)
Hava Durumu     : Her zaman güneşli

ADA 2 — Mercan Körfezi
Görsel Tema     : Öğleden sonra ışığı, daha
                  derin su tonu, arka planda
                  mercan kayalıkları görünür,
                  su altında renkli mercan
                  gölgeleri
Su Rengi        : Orta mavi-yeşil (#0288D1)
Gökyüzü         : Açık mavi, hafif sarımsı
                  gün batımı tonu başlıyor
Işık            : Öğleden sonra, hafif sıcak
Dip             : Mercan ve kaya karışımı,
                  daha karanlık zemin
Müzik Tonu      : Biraz daha gizemli, hâlâ
                  neşeli
Zorluk          : Orta-kolay
Yolculuk Süresi : 65 saniye
Spawn Balıkları : Tüm Ada 1 balıkları +
                  Moon Fish, Lava Fish,
                  Tide Fish
Engeller        : Sea Kelp (3), Coral (1),
                  Anchor (1), Whirlpool (%20)
Yakıt Maliyeti  : 80🪙 (Ada 3'e geçiş)
Hava Durumu     : %80 güneşli, %20 bulutlu
                  (bulutlu: balık spawn +%10)

ADA 3 — Derin Mavi
Görsel Tema     : Akşam üstü, su belirgin
                  şekilde daha koyu ve derin
                  görünür, arka planda uzak
                  kayalık adalar silueti,
                  su altı daha az görünür
Su Rengi        : Derin koyu mavi (#01579B)
Gökyüzü         : Turuncu-mor gün batımı
                  geçişi, birkaç dramatik
                  bulut
Işık            : Alçak güneş, uzun gölgeler,
                  altın-turuncu ışık
Dip             : Karanlık, zar zor görünür,
                  gizemli siluetler
Müzik Tonu      : Daha gerilimli, epik
                  undertone başlıyor
Zorluk          : Orta
Yolculuk Süresi : 70 saniye
Spawn Balıkları : Tüm Ada 2 balıkları +
                  Leaf Fish, Crystal Fish,
                  Galaxy Fish
Engeller        : Sea Kelp (3), Coral (1-2),
                  Sea Rock (2), Anchor (1),
                  Shark Skeleton (%25),
                  Whirlpool (%35)
Yakıt Maliyeti  : 120🪙 (Ada 4'e geçiş)
Hava Durumu     : %50 güneşli, %30 bulutlu,
                  %20 yağmurlu
                  (yağmurlu: görüş azalır,
                  balıklar daha hızlı)

ADA 4 — Fırtına Geçidi
Görsel Tema     : Alacakaranlık, kasvetli
                  atmosfer, su koyu ve
                  tehditkâr görünür, arka
                  planda kara bulutlar ve
                  uzak şimşekler, tekne
                  hafifçe sallanır
Su Rengi        : Koyu gri-mavi (#0D2137)
Gökyüzü         : Koyu gri-mor, dramatik
                  bulut katmanları, arada
                  şimşek animasyonu
Işık            : Kasvetli, düşük kontrast,
                  su altı neredeyse karanlık
Dip             : Görünmez, sadece yakın
                  nesneler seçilebilir
Müzik Tonu      : Gerilimli, epik, davullu
Zorluk          : Zor
Yolculuk Süresi : 75 saniye
Spawn Balıkları : Tüm Ada 3 balıkları +
                  Mushroom Fish,
                  King Fish (%5 şans)
Engeller        : Sea Kelp (4), Coral (2),
                  Sea Rock (2-3),
                  Shark Skeleton (%40),
                  Whirlpool (%50, 1-2 adet),
                  Anchor (2)
Yakıt Maliyeti  : 180🪙 (Ada 5'e geçiş)
Hava Durumu     : %20 bulutlu, %80 fırtınalı
                  (fırtına: su sarsılır,
                  tüm balık hızları +0.5,
                  olta menzili -10px)

ADA 5 — Efsane Adası
Görsel Tema     : Gece, büyülü ve mistik,
                  su biyolüminesanlı parlar,
                  arka planda dev kristal
                  kayalıklar, gökyüzünde
                  kuzey ışıkları (aurora)
Su Rengi        : Derin lacivert, içinde
                  turkuaz-mor parlamalar
                  (#080C2B + #7B1FA2 glow)
Gökyüzü         : Gece, yıldızlı, aurora
                  animasyonu (yeşil-mor
                  dalgalanan ışık bandı)
Işık            : Sadece biyolüminesan ve
                  aurora ışığı, dramatik
Dip             : Parlayan kristal oluşumlar,
                  mistik derinlik
Müzik Tonu      : Epik, orkestral, final hissi
Zorluk          : Çok zor
Yolculuk Süresi : 80 saniye
Spawn Balıkları : Tüm balıklar + King Fish
                  spawn oranı %12'ye çıkar
Engeller        : Maksimum yoğunluk, tüm
                  elementler aktif
Yakıt Maliyeti  : YOK (son ada, ulaşmak
                  kazanmak demek)
Hava Durumu     : Büyülü gece, sabit
                  (hava efekti yok ama
                  aurora parlamaları
                  zaman zaman ekranı
                  hafif aydınlatır)

⛵ BÖLÜM 3: TEKNE SİSTEMİ
3.1 Tekne Seviyeleri
┌──────────────────────────────────────────────────────┐
│ SEVİYE 1 — "Tahta Sandal"                            │
│ Ağırlık Kapasitesi : 100 birim                       │
│ Görsel             : Küçük, yıpranmış tahta tekne    │
│ Özellik            : Yok                             │
│ Fiyat              : Başlangıç teknesi (ücretsiz)    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ SEVİYE 2 — "Fiber Tekne"                             │
│ Ağırlık Kapasitesi : 150 birim                       │
│ Görsel             : Daha büyük, beyaz fiber,        │
│                      küçük kabin var                 │
│ Özellik            : Tide Fish'in sallama efekti     │
│                      %50 azalır                      │
│ Fiyat              : 100🪙                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ SEVİYE 3 — "Kaptan Teknesi"                          │
│ Ağırlık Kapasitesi : 220 birim                       │
│ Görsel             : Büyük, renkli, bayraklı,        │
│                      iki katlı kabin                 │
│ Özellik            : Lava Fish yangın süresi 3sn'ye  │
│                      düşer, Whirlpool yanıltıcı      │
│                      ağırlık göstergesi devre dışı   │
│ Fiyat              : 200🪙                            │
└──────────────────────────────────────────────────────┘
3.2 Ağırlık Göstergesi
DURUM              RENK          SES
─────────────────────────────────────────
0-60% doluluk    : Yeşil        Sessiz
61-80% doluluk   : Sarı         Hafif uyarı
81-95% doluluk   : Turuncu      Belirgin uyarı
96-99% doluluk   : Kırmızı      Alarm
100%+ doluluk    : GAME OVER    Batma sesi
─────────────────────────────────────────
3.3 Batma Animasyonu (Game Over — Ağırlık)
1. Tekne bir yana eğilir (0.5sn)
2. Su içine girmeye başlar (1sn)
3. Balıklar envanterden tek tek "kaçar"
   (her biri su yüzeyine çıkar, 1.5sn)
4. Tekne tamamen batar (1sn)
5. GAME OVER ekranı açılır

🎣 BÖLÜM 4: OLTA SİSTEMİ
4.1 Olta Seviyeleri
┌──────────────────────────────────────────────────────┐
│ SEVİYE 1 — "Bambu Olta"                              │
│ Salınım Hızı    : Normal (ROD_SPD: 0.022)            │
│ Fırlatma Hızı   : 9 birim/sn                         │
│ Yakalama Alanı  : 1.0x (base)                        │
│ Atma Hakkı      : 3                                  │
│ Fiyat           : Başlangıç oltası (ücretsiz)        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ SEVİYE 2 — "Karbon Olta"                             │
│ Salınım Hızı    : %15 hızlı (ROD_SPD: 0.025)        │
│ Fırlatma Hızı   : 11 birim/sn                        │
│ Yakalama Alanı  : 1.2x                               │
│ Atma Hakkı      : 4                                  │
│ Özellik         : Coral çarpmasında %30 şansla        │
│                   hak kaybetmez (sert karbon)        │
│ Fiyat           : 60🪙                                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ SEVİYE 3 — "Titanium Olta"                           │
│ Salınım Hızı    : %30 hızlı (ROD_SPD: 0.029)        │
│ Fırlatma Hızı   : 13 birim/sn                        │
│ Yakalama Alanı  : 1.4x                               │
│ Atma Hakkı      : 5                                  │
│ Özellik         : Sea Kelp'te takılma süresi         │
│                   0.4sn'ye düşer, Coral çarpmasında  │
│                   %60 şansla hak kaybetmez           │
│ Fiyat           : 120🪙                               │
└──────────────────────────────────────────────────────┘
4.2 Olta Hakkı Tamiri
Ada marketinde olta tamiri:
  +1 hak  : 20🪙
  +2 hak  : 35🪙
  Full    : 50🪙 (tüm haklar yenilenir)

Tüm haklar biterse:
  → Olta kullanılamaz
  → Balık tutulamaz
  → Para kazanılamaz
  → Yakıt alınamaz
  → GAME OVER (mahsur kalma)

💰 BÖLÜM 5: EKONOMİ SİSTEMİ
5.1 Gelir Kaynakları
KAYNAK                    TUTAR         SIKLIK
──────────────────────────────────────────────
Balık satışı              Değişken      Her ada
Kabuk bonusu              +20🪙 sabit   Rastgele
Sandık nakit              80-200🪙       %40/yolculuk
Batık tekne içeriği       50-120🪙       %25/yolculuk
Galaxy Fish bonusu        +100🪙         %30 şans
Leaf Fish değer bonusu    +%10/balık    %28 nadirlik
Mushroom Fish spor etkisi 1 balık x2   %12 nadirlik
Crystal Fish bonus        +50🪙          %40 şans
──────────────────────────────────────────────
5.2 Gider Kalemleri
GİDER                     TUTAR         ZORUNLU
──────────────────────────────────────────────
Ada 1→2 yakıt             50🪙           EVET
Ada 2→3 yakıt             80🪙           EVET
Ada 3→4 yakıt             120🪙          EVET
Ada 4→5 yakıt             180🪙          EVET
Tekne Lv2                 100🪙          HAYIR
Tekne Lv3                 200🪙          HAYIR
Olta Lv2                  60🪙           HAYIR
Olta Lv3                  120🪙          HAYIR
Olta tamiri (+1)          20🪙           DURUMA GÖRE
Olta tamiri (full)        50🪙           DURUMA GÖRE
──────────────────────────────────────────────
TOPLAM MIN. ZORUNLU GİDER : 430🪙
(sadece yakıtlar, ekipmansız bitiş)
──────────────────────────────────────────────
5.3 Yakıt Alma Mekaniği (Ada Marketi)
KURAL 1: Yakıt sadece ada marketinde alınır,
         yolculuk sırasında alınamaz.

KURAL 2: Yakıt tek seferlik tam dolar,
         kısmi yakıt alımı yoktur.
         ("Sonraki Ada Yakıtı" tek paket)

KURAL 3: Yakıt almadan "Sonraki Ada" butonu
         aktif olmaz.

KURAL 4: Balık satmadan yakıt alınamaz
         (para yoksa buton gri kalır).

KURAL 5: Yakıt fiyatı her adada artar:
         Ada 1→2 : 50🪙
         Ada 2→3 : 80🪙
         Ada 3→4 : 120🪙
         Ada 4→5 : 180🪙

KILIT SENARYO — "Mahsur Kalma" Game Over:
  → Balık sattıktan sonra hâlâ yeterli
    para yoksa GAME OVER ekranı açılır
  → Ekranda mesaj: "Yakıt için yetersiz
    altın — yolculuk burada bitti"
  → Bu durum ağırlık game over'ından
    daha sık karşılaşılan son senaryodur
5.4 Ada Marketi Sıralaması
Oyuncu ada marketinde şu SIRADA işlem yapar:

1. ENVANTERİ İNCELE
   — Tutulan balıklar listelenir
   — Her birinin değeri görülür
   — Tek tek veya toplu satış seçeneği

2. SATIŞI YAP
   — "Hepsini Sat" veya tek tek seç
   — Satılan balıklar envanterden çıkar
   — Para anında eklenir

3. EKİPMAN AL (opsiyonel)
   — Tekne yükseltmesi
   — Olta yükseltmesi
   — Olta tamiri
   — Booster satın alımları

4. YAKIT AL (zorunlu)
   — Sonraki ada yakıtı tek buton
   — Yeterli para varsa aktif

5. SONRAKI ADA (sadece yakıt alındıysa aktif)

⚠️ BÖLÜM 6: GAME OVER SİSTEMİ
6.1 Game Over Türleri
TÜR A: BATMA (Ağırlık Aşımı)
───────────────────────────────────────────
Tetikleyici  : Teknedeki toplam ağırlık
               tekne kapasitesini geçer
Ne zaman     : Yolculuk sırasında, anlık
Önlenebilir  : EVET — baloncuk topla,
               candy fish yararlan,
               king fish tutma,
               tekne yükselt
Ekran mesajı : "Tekne battı! Çok ağır
               yük altında ezildi."
İkinci şans  : HAYIR (anlık)

TÜR B: MAHSUR KALMA (Yakıt Yetersizliği)
───────────────────────────────────────────
Tetikleyici  : Ada marketinde yeterli para
               olmadan yakıt alınamaz
Ne zaman     : Ada marketi ekranında
Önlenebilir  : EVET — daha çok balık tut,
               değerli balıkları kaçırma,
               skeleton/whirlpool'dan kaçın
Ekran mesajı : "Yakıt için para yetmedi!
               Bir sonraki adaya geçilemez."
İkinci şans  : Eğer hiç envanteri satmadıysa
               ve satınca yeterliyse devam
               edebilir (market açık kalır)

TÜR C: OLTA BİTMESİ (Tüm Haklar Tükendi)
───────────────────────────────────────────
Tetikleyici  : Olta atma hakkı 0'a düşer
Ne zaman     : Yolculuk sırasında
Önlenebilir  : EVET — coral'dan kaçın,
               skeleton'dan kaçın,
               market'te tamir yaptır
Ekran mesajı : "Olta kullanılamaz! Tüm
               kancalar kırıldı."
İkinci şans  : Markette tamir yapılabilirse
               (para varsa) devam eder
6.2 Yaklaşan Tehlike Uyarıları
UYARI                    EŞİK      GÖSTERGE
──────────────────────────────────────────
Ağırlık tehlikesi        %80 dolu  Sarı titreme
Ağırlık kritik           %95 dolu  Kırmızı alarm
Olta hakkı az            1 hak     Olta kırmızı
Para yetersiz (tahmin)   <50🪙     Kumbara ikonu
──────────────────────────────────────────

🎯 BÖLÜM 7: ZORLUK SKALASI & BALANCING
7.1 Ada Bazlı Zorluk Artışı
          BALIK   ENGEL   YAKIT    SÜRE
ADA 1  :   6      3       50🪙     60sn
ADA 2  :   9      5       80🪙     65sn
ADA 3  :  12      8      120🪙     70sn
ADA 4  :  14     11      180🪙     75sn
ADA 5  :  16     14      YOK      80sn
7.2 Ekonomik Denge Hedefleri
Ada 1 bitişinde ideal gelir  : 80-150🪙
Ada 2 bitişinde ideal gelir  : 150-280🪙
Ada 3 bitişinde ideal gelir  : 250-420🪙
Ada 4 bitişinde ideal gelir  : 380-600🪙

Sıkı ama mümkün eşik        : Tüm adalarda
                               ortalama 3-4
                               balık yeterli
                               yakıtı karşılar

Konfor eşiği                 : 6-8 balık/ada
                               ekipman da alınır

Optimal oyun                 : 10+ balık/ada
                               tüm yükseltmeler
                               yapılır
7.3 Booster Sistemi (IAP Adayları)
BOOSTER              SÜRE    FİYAT(🪙)  IAP ADEDİ
──────────────────────────────────────────────
2x Puan             60sn     40🪙       3 kullanım
Balık Mıknatısı     30sn     50🪙       3 kullanım
Yavaşlatıcı         20sn     35🪙       3 kullanım
Olta Kalkanı        1 ada    60🪙       olta hasar almaz
Hafifletici         1 ada    45🪙       tüm balıklar -2kg
Radar               30sn     55🪙       nadir balık konumu
──────────────────────────────────────────────

IAP PAKETLERİ (gerçek para):
  Starter Pack   : 5 adet karışık booster
  Lucky Pack     : 3x Radar + 2x 2x Puan
  Safety Pack    : 2x Olta Kalkanı +
                   2x Hafifletici

🌦 BÖLÜM 8: HAVA DURUMU SİSTEMİ
HAVA          GÖRSEL EFEKTİ           OYUN ETKİSİ
─────────────────────────────────────────────────
Güneşli       Normal görünüm          Etki yok
Bulutlu       Gökyüzü kararır,        Balık spawn
              ışık azalır             +%10 artar
Yağmurlu      Yağmur partikülleri,    Balık hızı
              su yüzeyi çalkantılı    +%20 artar,
                                      görüş -10%
Fırtınalı     Şimşek, tekne sallanır, Tüm hızlar
              koyu atmosfer           +0.5, olta
                                      menzili -10px
Büyülü Gece   Aurora, biyolüminesan  Nadir balık
(Ada 5 özel)  parlamalar              spawn +%25
─────────────────────────────────────────────────

📱 BÖLÜM 9: UI/UX KURALLARI
9.1 Daima Görünür Olacaklar
- Ağırlık göstergesi (bar + sayı)
- Süre sayacı
- Anlık coin miktarı
- Ada ilerleme noktaları
- Olta atma hakkı (kalp/kanca ikonu x5)
9.2 Dokunmatik Kurallar
- Tek parmak: olta at
- Çift parmak: (şimdilik boş, booster'a reserve)
- Basılı tut: (şimdilik boş)
- Kaydır: Market ekranında liste kaydırma
9.3 Feedback Kuralları
- Her balık tutma: popup + ses + partikül
- Ağırlık %80+: sürekli görsel uyarı
- Olta takılma: titreme feedback
- Para kazanma: coin animasyonu
- Game over: özel animasyon (tür bazlı)

🔢 BÖLÜM 10: SAYISAL ÖZET TABLOSU
PARAMETRE                    DEĞER
──────────────────────────────────────────────────
Toplam ada sayısı            5
Toplam balık türü            12
Toplam environment element   10
Başlangıç tekne kapasitesi   100 birim
Max tekne kapasitesi         220 birim
Başlangıç olta hakkı         3
Max olta hakkı               5
Min. zorunlu para (5 ada)    430🪙
Ağırlık birimi               10px
En hafif balık               Leaf Fish (1 birim)
En ağır balık                King Fish (35 birim)
En hızlı balık               King Fish (5.5/sn)
En yavaş balık               Leaf Fish (0.6/sn)
En değerli balık             King Fish (1000🪙)
En değersiz balık            Bubble Fish (15🪙)
Tek seferde max ideal gelir  ~3000🪙 (Ada 5, full)
──────────────────────────────────────────────────