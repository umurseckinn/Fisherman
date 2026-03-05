📋 BÖLÜM 0: DOKÜMAN KULLANIM REHBERİ
Bu dosyayı okuyan AI (TRAE/Claude):
  1. Tüm sayısal değerleri bu dosyadan al
  2. Hiçbir değeri varsayımla doldurma
  3. Çelişki varsa bu dosya kazanır
  4. Her bölümü uygulamadan önce oku
  5. "Yaklaşık" değer kullanma, tam sayıları uygula

Bölüm sırası:
  0 → Kullanım rehberi (bu bölüm)
  1 → Oyun özeti ve felsefe
  2 → Temel mekanikler
  3 → Level sistemi (1-20)
  4 → Balık veritabanı
  5 → Element veritabanı
  6 → Ekonomi sistemi
  7 → Tekne & olta sistemi
  8 → Ada görselleri
  9 → Hava durumu
  10 → Game over sistemi
  11 → UI/UX kuralları
  12 → Booster & IAP

🌊 BÖLÜM 1: OYUN ÖZETİ & FELSEFE
1.1 Oyun Tanımı
Tür            : Hyper-casual arcade + strateji
Platform       : iOS & Android
Perspektif     : 2D yan görünüm
Kontrol        : Tek dokunuş (olta fırlatma)
Oturum süresi  : 8-15 dakika (tam oyun)
Hedef kitle    : 12+ yaş, casual-mid core arası
1.2 Temel Döngü
[BALIK TUT] → [ADA MARKETI] → [SAT/AL] → [SONRAKİ ADA]
      ↑                                         |
      └─────────────────────────────────────────┘
                   (game over yoksa)
1.3 İki Gerilim Ekseni
EKSen A — AĞIRLIK:
  "Ne kadar çok tutarsan o kadar çok para
   ama tekne batabilir"
  → Her balık bir karar

EKSen B — EKONOMİ:
  "Yeterli para kazanmak zorundasın
   ama her harcama bir trade-off"
  → Her satış bir karar

İKİ EKSENİN KESİŞİMİ:
  Ağır ama değerli balık = maksimum gerilim
  King Fish = oyunun en yoğun anı
1.4 Hedef Hissettirme (Her Level)
Level 1-4   : "Ah, zar zor geçtim"
Level 5-8   : "Bir daha böyle olmayacak"
Level 9-12  : "Az kalsın batıyordum"
Level 13-16 : "Kalp krizi geçirdim"
Level 17-19 : "Bu imkansız... ama geçtim"
Level 20    : "HAYATTA KALDIM!"

⚙️ BÖLÜM 2: TEMEL MEKANİKLER
2.1 Olta Mekaniği
HAREKET:
  Olta kayığın altında 180 derecelik
  yarım daire çizer (soldan sağa, aşağı
  doğru). Açı 0 = tam sol yatay,
  açı 90 = tam aşağı, açı 180 = tam
  sağ yatay.

FIRLATMA:
  Oyuncu ekrana bastığında olta o anki
  açı yönünde fırlar. Basma zamanlaması
  = hedefleme becerisi.

ROD_SPEED (salınım hızı):
  Level 1-4   : 0.018 rad/frame
  Level 5-8   : 0.020 rad/frame
  Level 9-12  : 0.022 rad/frame
  Level 13-16 : 0.025 rad/frame
  Level 17-20 : 0.028 rad/frame
  NOT: Olta yükseltmesi bu değerleri
  ayrıca etkiler (Bölüm 7'ye bak)

HOOK FİZİĞİ:
  Başlangıç hızı : Level + olta lv bazlı
                   (Bölüm 7'ye bak)
  Yerçekimi     : +0.4 px/frame²
  Max derinlik  : Su tabanından 10px üst
  Ekran dışı   : hookMoving = false,
                  hook = null
2.2 Ağırlık Sistemi
HESAPLAMA:
  Teknedeki her balığın ağırlık birimi
  toplanır. Toplam > kapasite = GAME OVER

BİRİM TANIMI:
  1 birim = 10px referans boyutu

GÖSTERGE DURUMLARI:
  0-50%   → Yeşil, sessiz
  51-70%  → Açık sarı, sessiz
  71-85%  → Koyu sarı, hafif titreme
  86-95%  → Turuncu, belirgin titreme
  96-99%  → Kırmızı, alarm sesi
  100%+   → GAME OVER (batma animasyonu)

ANLAMSIZ YÜKLER:
  Bazı elementler geçici ağırlık ekler
  (Lava Fish yangın etkisi, Whirlpool
  yanıltıcı gösterge). Bunlar gerçek
  değil, görsel stres aracı.
2.3 Yakıt Sistemi
KURAL 1: Yakıt sadece ada marketinde alınır
KURAL 2: Tek seferlik tam paket, kısmi yok
KURAL 3: Yakıt almadan "Sonraki Level" pasif
KURAL 4: Balık satmadan para yok, para yoksa
         yakıt yok, yakıt yoksa GAME OVER
KURAL 5: Yakıt fiyatı her level artar
         (Bölüm 3'te level başına değerler)
2.4 Balık Hareketi Sistemi
TÜM BALIKLAR SOLA GİDER.
Gerekçe: Tekne sağa hareket ediyor,
balıklar göreceli olarak sola kayıyor.

Ekranın sağından girer, solundan çıkar.
Soldan çıkınca sağdan yeniden spawn olur.

Derinlik zonları:
  YÜZEY  : Su yüzeyinden %0-20 aşağı
  ORTA   : %20-60 arası
  DERİN  : %60-90 arası
  DİP    : %90-100 (kum tabanı)

📊 BÖLÜM 3: LEVEL SİSTEMİ (1-20)
Level Yapısı
Her level = 1 yolculuk segmenti
4 level = 1 "Ada Bölgesi" (5 bölge = 20 level)
Her 4 level sonunda "Ada Marketi" açılır

ADA BÖLGELERİ:
  Bölge 1 (L1-4)   : Başlangıç Körfezi
  Bölge 2 (L5-8)   : Mercan Adaları
  Bölge 3 (L9-12)  : Derin Mavi
  Bölge 4 (L13-16) : Fırtına Geçidi
  Bölge 5 (L17-20) : Efsane Adası
Market Sistemi
Market her 4 level'da bir açılır:
  L4 biter  → Bölge 1 Marketi
  L8 biter  → Bölge 2 Marketi
  L12 biter → Bölge 3 Marketi
  L16 biter → Bölge 4 Marketi
  L20 biter → WİN ekranı (market yok)

Market'te yapılacaklar (sırasıyla):
  1. Envanteri gör
  2. Sat (tek tek veya toplu)
  3. Ekipman al (opsiyonel)
  4. Yakıt al (zorunlu, sonraki bölge için)
  5. Sonraki bölgeye geç

🏖 BÖLGE 1: BAŞLANGIÇ KÖRFEZİ (Level 1-4)
VİZYON: Güneşli, açık, öğretici.
Oyuncu mekanikleri burada öğrenir.
Ölmesi zor ama imkansız değil.
LEVEL 1
Süre            : 40 saniye
Tekne kapasitesi: 60 birim
Yakıt maliyeti  : Bu level sonunda yok
                  (bölge içi geçiş)
Olta hakkı      : 3
Balık spawn     : Bubble(%90), Sakura(%70)
                  Zap(%30)
Ekran balık sayı: 3-4 adet
Engeller        : Sea Kelp x1
Hava            : Güneşli
Baloncuk sayısı : 3

HEDEFLENEBİLİR GELİR: 30-60🪙
AÇIKLAMA: Öğretici level. Engel minimum,
balık bol, süre rahat. Oyuncu olta
mekaniğini öğrenir.
LEVEL 2
Süre            : 40 saniye
Tekne kapasitesi: 60 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : 3
Balık spawn     : Bubble(%80), Sakura(%65),
                  Zap(%40), Candy(%20)
Ekran balık sayı: 3-5 adet
Engeller        : Sea Kelp x1, Sea Rock x1
Hava            : Güneşli
Baloncuk sayısı : 2

HEDEFLENEBİLİR GELİR: 40-80🪙
AÇIKLAMA: İlk Sea Rock. Oyuncu takılma
ile tanışır. Candy Fish ilk kez çıkar.
LEVEL 3
Süre            : 42 saniye
Tekne kapasitesi: 60 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : 3
Balık spawn     : Bubble(%70), Sakura(%60),
                  Zap(%45), Candy(%30),
                  Moon(%10)
Ekran balık sayı: 4-5 adet
Engeller        : Sea Kelp x2, Sea Rock x1
Hava            : Güneşli
Baloncuk sayısı : 2
Shell           : %60 şansla 1 adet

HEDEFLENEBİLİR GELİR: 55-100🪙
AÇIKLAMA: Moon Fish ilk kez çıkar ama
nadir. Kabuk ilk kez spawn olur.
LEVEL 4
Süre            : 42 saniye
Tekne kapasitesi: 60 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : 3
Balık spawn     : Bubble(%65), Sakura(%55),
                  Zap(%50), Candy(%35),
                  Moon(%15)
Ekran balık sayı: 4-6 adet
Engeller        : Sea Kelp x2, Sea Rock x1
                  Anchor(%40 şans)
Hava            : Güneşli %80, Bulutlu %20
Baloncuk sayısı : 2
Shell           : %70 şansla 1 adet

HEDEFLENEBİLİR GELİR: 65-120🪙
AÇIKLAMA: Bölge 1 finali. Anchor ilk
kez olabilir. Sonunda market açılır.

════════════════════════════════════
BÖLGE 1 MARKETİ
════════════════════════════════════
Yakıt (Bölge 2 için) : 150🪙
Tekne Lv2            : 180🪙
Olta Lv2             : 100🪙
Olta tamiri +1       : 30🪙
Olta tamiri full     : 80🪙
2x Puan booster      : 90🪙
Mıknatıs booster     : 110🪙

BÖLGE 1 TOPLAM GELİR HEDEFİ: 150-300🪙
(4 level toplamı, iyi oynama ile)
Yakıtı karşılamak mümkün ama ekipman
almak için çok iyi oynamak gerekir.
════════════════════════════════════

🪸 BÖLGE 2: MERCAn ADALARI (Level 5-8)
VİZYON: Öğleden sonra ışığı, mercan
kayalıkları, ilk gerçek tehditler.
Oyuncu artık her balığı düşünerek tutar.
LEVEL 5
Süre            : 44 saniye
Tekne kapasitesi: Lv1=60, Lv2=90 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : Tekrar 3 (veya önceki
                  seviye korunur)
Balık spawn     : Bubble(%60), Sakura(%50),
                  Zap(%50), Candy(%35),
                  Moon(%25), Lava(%15),
                  Tide(%10)
Ekran balık sayı: 4-6 adet
Engeller        : Sea Kelp x2, Sea Rock x1,
                  Coral x1
Hava            : Güneşli %75, Bulutlu %25
Baloncuk sayısı : 2
Shell           : %60 şansla 1 adet

HEDEFLENEBİLİR GELİR: 80-160🪙
AÇIKLAMA: Coral ilk kez. Olta hakkı
artık önemli. Lava ve Tide ilk kez.
LEVEL 6
Süre            : 44 saniye
Tekne kapasitesi: Lv1=60, Lv2=90 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : Önceki korunur
Balık spawn     : Bubble(%55), Sakura(%45),
                  Zap(%50), Candy(%35),
                  Moon(%28), Lava(%20),
                  Tide(%15)
Ekran balık sayı: 4-6 adet
Engeller        : Sea Kelp x2, Sea Rock x2,
                  Coral x1, Anchor x1
Hava            : Güneşli %70, Bulutlu %30
Baloncuk sayısı : 2
Shell           : %55 şansla 1 adet
Sunken Boat     : %25 şansla 1 adet

HEDEFLENEBİLİR GELİR: 100-200🪙
AÇIKLAMA: Anchor eklendi. Sunken Boat
ilk kez çıkabilir. Dengeli zorluk.
LEVEL 7
Süre            : 46 saniye
Tekne kapasitesi: Lv1=60, Lv2=90 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : Önceki korunur
Balık spawn     : Bubble(%50), Sakura(%40),
                  Zap(%48), Candy(%32),
                  Moon(%30), Lava(%22),
                  Tide(%18), Leaf(%8)
Ekran balık sayı: 5-7 adet
Engeller        : Sea Kelp x3, Sea Rock x2,
                  Coral x1, Anchor x1,
                  Whirlpool(%20 şans)
Hava            : Güneşli %65, Bulutlu %35
Baloncuk sayısı : 2
Shell           : %50 şansla 1 adet
Treasure Chest  : %30 şansla 1 adet

HEDEFLENEBİLİR GELİR: 130-250🪙
AÇIKLAMA: Whirlpool ilk kez olabilir.
Leaf Fish ilk kez. Sandık ilk kez.
LEVEL 8
Süre            : 46 saniye
Tekne kapasitesi: Lv1=60, Lv2=90 birim
Yakıt maliyeti  : Bölge içi geçiş (yok)
Olta hakkı      : Önceki korunur
Balık spawn     : Bubble(%45), Sakura(%38),
                  Zap(%45), Candy(%30),
                  Moon(%30), Lava(%25),
                  Tide(%20), Leaf(%10)
Ekran balık sayı: 5-7 adet
Engeller        : Sea Kelp x3, Sea Rock x2,
                  Coral x1, Anchor x1,
                  Whirlpool(%30 şans)
Hava            : Güneşli %60, Bulutlu %40
Baloncuk sayısı : 1-2
Shell           : %45 şansla 1 adet
Treasure Chest  : %35 şansla 1 adet

HEDEFLENEBİLİR GELİR: 150-300🪙
AÇIKLAMA: Bölge 2 finali. İlk gerçek
ekonomik baskı. Market kritik.

════════════════════════════════════
BÖLGE 2 MARKETİ
════════════════════════════════════
Yakıt (Bölge 3 için) : 280🪙
Tekne Lv2            : 180🪙 (hâlâ alınabilir)
Tekne Lv3            : 380🪙
Olta Lv2             : 100🪙 (hâlâ alınabilir)
Olta Lv3             : 220🪙
Olta tamiri +1       : 30🪙
Olta tamiri full     : 80🪙
2x Puan booster      : 90🪙
Mıknatıs booster     : 110🪙
Yavaşlatıcı          : 70🪙

BÖLGE 2 TOPLAM GELİR HEDEFİ: 280-600🪙
Yakıtı karşılamak orta güçlükte.
Ekipman almak için çok iyi oynamak
veya Bölge 1'den para biriktirmek lazım.
════════════════════════════════════

🌊 BÖLGE 3: DERİN MAVİ (Level 9-12)
VİZYON: Akşam üstü, derin koyu su,
uzak adalar silueti. Artık her atış
hesaplı olmalı.
LEVEL 9
Süre            : 48 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%40), Sakura(%32),
                  Zap(%42), Candy(%28),
                  Moon(%28), Lava(%25),
                  Tide(%20), Leaf(%12),
                  Crystal(%8)
Ekran balık sayı: 5-7 adet
Engeller        : Sea Kelp x3, Sea Rock x2,
                  Coral x2, Anchor x1,
                  Shark Skeleton(%25 şans),
                  Whirlpool(%35 şans)
Hava            : Güneşli %50, Bulutlu %30,
                  Yağmurlu %20
Baloncuk sayısı : 1-2
Shell           : %40 şansla 1 adet

HEDEFLENEBİLİR GELİR: 180-380🪙
AÇIKLAMA: Crystal Fish ilk kez. Shark
Skeleton ilk kez. Yağmur ilk kez.
LEVEL 10
Süre            : 48 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%35), Sakura(%28),
                  Zap(%40), Candy(%26),
                  Moon(%27), Lava(%27),
                  Tide(%22), Leaf(%13),
                  Crystal(%10), Galaxy(%6)
Ekran balık sayı: 5-7 adet
Engeller        : Sea Kelp x4, Sea Rock x2,
                  Coral x2, Anchor x1,
                  Shark Skeleton(%30 şans),
                  Whirlpool(%40 şans)
Hava            : Güneşli %45, Bulutlu %35,
                  Yağmurlu %20
Baloncuk sayısı : 1
Shell           : %35 şansla 1 adet
Sunken Boat     : %30 şansla 1 adet

HEDEFLENEBİLİR GELİR: 220-450🪙
AÇIKLAMA: Galaxy Fish ilk kez. Kritik
milestone. İki tehlikeli engel birden
aktif olabilir.
LEVEL 11
Süre            : 50 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%30), Sakura(%25),
                  Zap(%38), Candy(%24),
                  Moon(%25), Lava(%28),
                  Tide(%23), Leaf(%14),
                  Crystal(%12), Galaxy(%8),
                  Mushroom(%5)
Ekran balık sayı: 6-8 adet
Engeller        : Sea Kelp x4, Sea Rock x3,
                  Coral x2, Anchor x2,
                  Shark Skeleton(%35 şans),
                  Whirlpool(%45 şans)
Hava            : Güneşli %40, Bulutlu %35,
                  Yağmurlu %25
Baloncuk sayısı : 1
Treasure Chest  : %35 şansla 1 adet

HEDEFLENEBİLİR GELİR: 280-550🪙
AÇIKLAMA: Mushroom Fish ilk kez ama
çok nadir. İkinci Anchor eklendi.
LEVEL 12
Süre            : 50 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%28), Sakura(%22),
                  Zap(%36), Candy(%22),
                  Moon(%24), Lava(%28),
                  Tide(%23), Leaf(%15),
                  Crystal(%13), Galaxy(%9),
                  Mushroom(%6)
Ekran balık sayı: 6-8 adet
Engeller        : Sea Kelp x4, Sea Rock x3,
                  Coral x2, Anchor x2,
                  Shark Skeleton(%38 şans),
                  Whirlpool(%48 şans)
Hava            : Güneşli %40, Bulutlu %30,
                  Yağmurlu %30
Baloncuk sayısı : 1

HEDEFLENEBİLİR GELİR: 300-600🪙
AÇIKLAMA: Bölge 3 finali. En zorlu
market kararı burada.

════════════════════════════════════
BÖLGE 3 MARKETİ
════════════════════════════════════
Yakıt (Bölge 4 için) : 450🪙
Tekne Lv3            : 380🪙
Olta Lv3             : 220🪙
Olta tamiri +1       : 30🪙
Olta tamiri full     : 80🪙
2x Puan booster      : 90🪙
Mıknatıs booster     : 110🪙
Olta Kalkanı         : 130🪙
Hafifletici          : 100🪙
Radar                : 120🪙

BÖLGE 3 TOPLAM GELİR HEDEFİ: 450-1000🪙
450🪙 yakıtı karşılar. Üstü ekipman.
Ama 450🪙 kazanmak için iyi oynamak
ve birden fazla nadir balık şart.
════════════════════════════════════

⛈ BÖLGE 4: FIRTINA GEÇİDİ (Level 13-16)
VİZYON: Alacakaranlık, kasvetli atmosfer,
tehditkâr su. Her karar hayati.
LEVEL 13
Süre            : 52 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%22), Sakura(%18),
                  Zap(%34), Candy(%20),
                  Moon(%22), Lava(%28),
                  Tide(%24), Leaf(%15),
                  Crystal(%14), Galaxy(%10),
                  Mushroom(%7), King(%2)
Ekran balık sayı: 6-8 adet
Engeller        : Sea Kelp x5, Sea Rock x3,
                  Coral x2, Anchor x2,
                  Shark Skeleton(%40 şans),
                  Whirlpool(%50 şans, 1-2 adet)
Hava            : Bulutlu %25, Fırtınalı %75
Baloncuk sayısı : 1 (nadir)
Shell           : %25 şansla 1 adet

HEDEFLENEBİLİR GELİR: 350-700🪙
AÇIKLAMA: King Fish ilk kez (%2).
Fırtına dominant. Her atış kritik.
Whirlpool artık neredeyse her zaman var.
LEVEL 14
Süre            : 52 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%18), Sakura(%15),
                  Zap(%32), Candy(%18),
                  Moon(%20), Lava(%28),
                  Tide(%24), Leaf(%15),
                  Crystal(%15), Galaxy(%11),
                  Mushroom(%8), King(%3)
Ekran balık sayı: 6-8 adet
Engeller        : Sea Kelp x5, Sea Rock x3,
                  Coral x3, Anchor x2,
                  Shark Skeleton(%44 şans),
                  Whirlpool(%55 şans, 1-2 adet)
Hava            : Bulutlu %20, Fırtınalı %80
Baloncuk sayısı : 1 (çok nadir)

HEDEFLENEBİLİR GELİR: 400-800🪙
AÇIKLAMA: Coral x3 birden. Olta hakkı
yönetimi kritik hale geldi.
LEVEL 15
Süre            : 54 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%15), Sakura(%12),
                  Zap(%30), Candy(%16),
                  Moon(%18), Lava(%28),
                  Tide(%24), Leaf(%15),
                  Crystal(%16), Galaxy(%12),
                  Mushroom(%9), King(%4)
Ekran balık sayı: 7-9 adet
Engeller        : Sea Kelp x5, Sea Rock x4,
                  Coral x3, Anchor x2,
                  Shark Skeleton(%48 şans),
                  Whirlpool(%60 şans, 1-2 adet)
Hava            : Fırtınalı %85, Bulutlu %15
Baloncuk sayısı : 0-1

HEDEFLENEBİLİR GELİR: 450-900🪙
AÇIKLAMA: Baloncuk neredeyse yok.
Ağırlık yönetimi tamamen oyuncuya kaldı.
King Fish artık gerçek bir seçenek.
LEVEL 16
Süre            : 54 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%12), Sakura(%10),
                  Zap(%28), Candy(%14),
                  Moon(%16), Lava(%27),
                  Tide(%23), Leaf(%15),
                  Crystal(%16), Galaxy(%13),
                  Mushroom(%10), King(%5)
Ekran balık sayı: 7-9 adet
Engeller        : Sea Kelp x6, Sea Rock x4,
                  Coral x3, Anchor x2,
                  Shark Skeleton(%50 şans),
                  Whirlpool(%65 şans, 2 adet)
Hava            : Fırtınalı %90, Bulutlu %10
Baloncuk sayısı : 0-1

HEDEFLENEBİLİR GELİR: 500-1000🪙
AÇIKLAMA: Bölge 4 finali. En kritik
market. 700🪙 yakıt için çok iyi
oynamak şart.

════════════════════════════════════
BÖLGE 4 MARKETİ
════════════════════════════════════
Yakıt (Bölge 5 için) : 700🪙
Tekne Lv3            : 380🪙 (son şans)
Olta Lv3             : 220🪙 (son şans)
Olta tamiri +1       : 30🪙
Olta tamiri full     : 80🪙
2x Puan booster      : 90🪙
Mıknatıs booster     : 110🪙
Olta Kalkanı         : 130🪙
Hafifletici          : 100🪙
Radar                : 120🪙

BÖLGE 4 TOPLAM GELİR HEDEFİ: 700-1500🪙
700🪙 yakıt. Bu zorluğu aşmak için
birden fazla King Fish, Crystal veya
Galaxy yakalamak gerekiyor.
Ekipman almak büyük lüks.
════════════════════════════════════

🌌 BÖLGE 5: EFSANE ADASI (Level 17-20)
VİZYON: Gece, büyülü, biyolüminesans,
aurora. Son büyük meydan okuma.
Market yok. Sadece hayatta kalmak var.
LEVEL 17
Süre            : 56 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%10), Sakura(%8),
                  Zap(%26), Candy(%12),
                  Moon(%16), Lava(%26),
                  Tide(%22), Leaf(%14),
                  Crystal(%17), Galaxy(%14),
                  Mushroom(%11), King(%8)
Ekran balık sayı: 7-9 adet
Engeller        : Sea Kelp x6, Sea Rock x4,
                  Coral x3, Anchor x2,
                  Shark Skeleton(%55 şans),
                  Whirlpool(%70 şans, 2 adet)
Hava            : Büyülü Gece (sabit)
Baloncuk sayısı : 0

HEDEFLENEBİLİR GELİR: Yok (son bölge,
market yok, sadece hayatta kal)
AÇIKLAMA: Baloncuk tamamen kalktı.
Ağırlık tamamen oyuncu kontrolünde.
Aurora efekti aktif.
LEVEL 18
Süre            : 58 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%8), Sakura(%6),
                  Zap(%24), Candy(%10),
                  Moon(%15), Lava(%26),
                  Tide(%22), Leaf(%14),
                  Crystal(%18), Galaxy(%15),
                  Mushroom(%12), King(%10)
Ekran balık sayı: 8-10 adet
Engeller        : Sea Kelp x7, Sea Rock x4,
                  Coral x3, Anchor x3,
                  Shark Skeleton(%58 şans),
                  Whirlpool(%75 şans, 2 adet)
Hava            : Büyülü Gece
Baloncuk sayısı : 0

AÇIKLAMA: King Fish artık %10. Her an
35 birim ağırlık baskısı gelebilir.
Üçüncü Anchor eklendi.
LEVEL 19
Süre            : 60 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : Bölge içi geçiş (yok)
Balık spawn     : Bubble(%5), Sakura(%4),
                  Zap(%22), Candy(%8),
                  Moon(%14), Lava(%25),
                  Tide(%21), Leaf(%13),
                  Crystal(%19), Galaxy(%16),
                  Mushroom(%13), King(%12)
Ekran balık sayı: 8-10 adet
Engeller        : Sea Kelp x7, Sea Rock x5,
                  Coral x4, Anchor x3,
                  Shark Skeleton(%62 şans),
                  Whirlpool(%80 şans, 2-3 adet)
Hava            : Büyülü Gece, Aurora yoğun
Baloncuk sayısı : 0

AÇIKLAMA: Oyunun en kritik leveli.
Whirlpool 2-3 adet olabilir. Skeleton
%62 şansla var. Her atış hayati.
LEVEL 20 — FİNAL
Süre            : 65 saniye
Tekne kapasitesi: Lv1=60, Lv2=90, Lv3=130
Yakıt maliyeti  : YOK (son level)
Balık spawn     : Bubble(%3), Sakura(%2),
                  Zap(%20), Candy(%6),
                  Moon(%13), Lava(%24),
                  Tide(%20), Leaf(%12),
                  Crystal(%20), Galaxy(%17),
                  Mushroom(%14), King(%15)
Ekran balık sayı: 9-12 adet
Engeller        : Sea Kelp x8, Sea Rock x5,
                  Coral x4, Anchor x3,
                  Shark Skeleton(%65 şans),
                  Whirlpool(%85 şans, 2-3 adet)
Hava            : Büyülü Gece, tam aurora
Baloncuk sayısı : 0
Özel            : Ekranın her köşesinde
                  biyolüminesans parlamaları,
                  King Fish spawn'da fanfar

AÇIKLAMA: King Fish %15. Crystal ve
Galaxy yüksek oran. Maksimum engel.
Level bitmeden batmamak = WİN.

WİN KOŞULU: Level 20'yi ağırlık
limitini aşmadan tamamlamak.

🐟 BÖLÜM 4: BALIK VERİTABANI
FORMAT: İsim | Değer | Ağırlık | Boyut |
         Hız | Derinlik | Min.Level | Nadirlik

─────────────────────────────────────────────────────────────────
Bubble Fish  | 8🪙   | 2  | 3x2.5 | 1.2/sn | Yüzey    | L1  | %90→%3
Sakura Fish  | 12🪙  | 3  | 3.5x3 | 1.5/sn | Yüzey-Or | L1  | %70→%2
Zap Fish     | 22🪙  | 4  | 4x2.5 | 3.5/sn | Tüm su   | L1  | %65→%20
Candy Fish   | 30🪙  | 5  | 3.5x4 | 1.8/sn | Orta     | L1  | %60→%6
Moon Fish    | 55🪙  | 8  | 5x3   | 0.8/sn | Orta-Der | L3  | %10→%13
Lava Fish    | 80🪙  | 12 | 4.5x4 | 2.0/sn | Derin    | L5  | %15→%24
Tide Fish    | 110🪙 | 9  | 5.5x3 | 3.8/sn | Yüzey-Or | L5  | %10→%20
Leaf Fish    | 160🪙 | 1  | 4x3.5 | 0.6/sn | Tüm su   | L7  | %8→%12
Crystal Fish | 240🪙 | 18 | 4x4   | 2.2/sn | Derin    | L9  | %8→%20
Galaxy Fish  | 380🪙 | 7  | 5x3.5 | 4.5/sn | Tüm su   | L10 | %6→%17
Mushroom F.  | 520🪙 | 15 | 4x5   | 1.5/sn | Orta-Der | L11 | %5→%14
King Fish    | 900🪙 | 35 | 7x4   | 5.5/sn | Orta     | L13 | %2→%15
─────────────────────────────────────────────────────────────────
NOT: Nadirlik "Min.Level oranı → L20 oranı" formatındadır.
Hareket Tipleri
Bubble Fish  : Sinüs dalgası, ±20px, 3sn periyod
Sakura Fish  : Düz + rastgele sapma, 4-7sn'de ±15px
Zap Fish     : Keskin zikzak, 0.8-1.2sn'de ±40px
Candy Fish   : Spiral, çap ±25px, 2.5sn tam tur
Moon Fish    : Yavaş dikey slalom, ±50px, 6sn periyod
Lava Fish    : Çapraz diyagonal, 45° yansımalı
Tide Fish    : Geniş sinüs, ±60px, 2.5sn periyod
Leaf Fish    : Sürüklenme, düzensiz S-curve, duraksama
Crystal Fish : Dikey slalom, keskin dönüş, 0.1sn
Galaxy Fish  : Warp, 1-2sn'de 90° ani sıçrama
Mushroom F.  : Pulse/sıçrama, 0.8sn bekle 0.2sn sıçra
King Fish    : Düz çizgi, yıldırım hızı, ±5px mikro
Özel Etkiler (Tutulunca)
Bubble Fish  : Görsel baloncuk patlaması, etkisiz
Sakura Fish  : Petal patlaması, etkisiz
Zap Fish     : 3sn elektrik, bu sürede %50 kaçma
Candy Fish   : Teknedeki tüm ağırlık -1 birim (max 3x)
Moon Fish    : 10sn tüm balıklar %40 yavaşlar
Lava Fish    : 5sn yangın, +1 birim/sn ağırlık = +5
Tide Fish    : Sallama, %20 şansla 1 balık düşer
Leaf Fish    : Tüm balık değeri +%10 (kalıcı, max %30)
Crystal Fish : Değer rastgele: +50🪙(%40) / sabit(%40)
               / -30🪙(%20)
Galaxy Fish  : Bonus: +100🪙(%30) / yakıt+%10(%30)
               / efekt(%40)
Mushroom F.  : Rastgele 1 balık 2x değer (bilinmez)
King Fish    : Tüm değerler +%20, ama 35 birim ağırlık

🌿 BÖLÜM 5: ELEMENT VERİTABANI
FORMAT: İsim | Tür | Boyut | Konum | Hareket |
         Olta Etkisi | Game Over Riski

──────────────────────────────────────────────────────────────────
Sea Kelp     | Engel   | 4x6  | Dip (sabit)  | Salınım ±3px
             | Olta takılır 0.8sn, hak kaybı yok | Hayır

Sea Rock     | Engel   | 5x4  | Dip+Orta(sabit)| Hareketsiz
             | Anında seker, hak kaybı yok | Hayır

Coral        | Engel   | 6x5  | Dip (sabit)  | Dallar ±2px
             | -1 olta hakkı, kırılma animasyonu | Dolaylı

Shell        | Bonus   | 2.5x2.5 | Dip(sabit)| Hareketsiz
             | +20🪙 anında, %25 balık, %10 hak | Hayır

Treasure     | Bonus   | 7x5  | Dip (sabit)  | Kapak ±5px
Chest        | 80-200🪙 + %60 nadir balık + %20 tamir | Olabilir

Anchor       | Engel   | 3x8  | Orta-Dip     | Sarkaç ±25px
             | Takılır 2sn, -2sn süre cezası | Hayır

Bubbles      | Power-up| 4x5  | Yüzey→Yukarı | Dikey yukarı
             | -3 birim ağırlık, +%30 olta hızı 5sn | Hayır

Sunken Boat  | Sürpriz | 9x4  | Dip (sabit)  | Hareketsiz
             | A:%35 balık / B:%25 nakit / C:%20 boş
               D:%15 nadir / E:%5 lanet | Olabilir

Shark Skel.  | Lanet   | 11x3 | Orta(yavaş)  | 0.3/sn sola
             | -10🪙, -1 hak, 5sn balıklar kaçar | Dolaylı

Whirlpool    | Tuzak   | 6x6  | Orta(gezgin) | Rastgele 0.8/sn
             | Kontrol kaybı, spiral, fırlatılma | Olabilir
──────────────────────────────────────────────────────────────────

💰 BÖLÜM 6: EKONOMİ SİSTEMİ
6.1 Bölge Bazlı Ekonomi Özeti
BÖLGE  LEVEL  YAKITMALIYET  GELİR HEDEFİ  ZORLUK
──────────────────────────────────────────────────
1      1-4    150🪙          150-300🪙      Kolay
2      5-8    280🪙          280-600🪙      Orta-kolay
3      9-12   450🪙          450-1000🪙     Orta-zor
4      13-16  700🪙          700-1500🪙     Zor
5      17-20  YOK (son)     Hayatta kal   Çok zor
──────────────────────────────────────────────────
TOPLAM ZORUNLU PARA: 1580🪙
6.2 Gelir Kaynakları
KAYNAK                    MİKTAR          SIKLIK
──────────────────────────────────────────────────
Balık satışı              8-900🪙          Her level
Shell bonusu              +20🪙 sabit      Rastgele
Treasure Chest nakit      80-200🪙         %40/level
Sunken Boat nakit         50-120🪙         %25/level
Galaxy Fish bonus         +100🪙           %30 şans
Leaf Fish değer bonusu    +%10/tüm balık  %14 nadirlik
Crystal Fish bonus        +50🪙            %40 şans
Mushroom spor etkisi      1 balık x2      %14 nadirlik
──────────────────────────────────────────────────
6.3 Gider Kalemleri
GİDER                   MİKTAR    ZORUNLU
──────────────────────────────────────────
Bölge 1→2 yakıt         150🪙     EVET
Bölge 2→3 yakıt         280🪙     EVET
Bölge 3→4 yakıt         450🪙     EVET
Bölge 4→5 yakıt         700🪙     EVET
Tekne Lv2               180🪙     HAYIR
Tekne Lv3               380🪙     HAYIR
Olta Lv2                100🪙     HAYIR
Olta Lv3                220🪙     HAYIR
Olta tamiri +1          30🪙      DURUMA GÖRE
Olta tamiri full        80🪙      DURUMA GÖRE
──────────────────────────────────────────
MIN. TOPLAM (sadece yakıt): 1580🪙

⛵ BÖLÜM 7: TEKNE & OLTA SİSTEMİ
7.1 Tekne Seviyeleri
┌─────────────────────────────────────────────┐
│ TEKNE LV1 — "Tahta Sandal"                  │
│ Kapasite   : 60 birim                       │
│ Fiyat      : Ücretsiz (başlangıç)           │
│ Özellik    : Yok                            │
│ Görsel     : Küçük yıpranmış tahta tekne    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TEKNE LV2 — "Fiber Tekne"                   │
│ Kapasite   : 90 birim                       │
│ Fiyat      : 180🪙                           │
│ Özellik    : Tide Fish sallama etkisi %50   │
│              azalır                         │
│ Görsel     : Büyük beyaz fiber, kabin var   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TEKNE LV3 — "Kaptan Teknesi"                │
│ Kapasite   : 130 birim                      │
│ Fiyat      : 380🪙                           │
│ Özellik    : Lava yangın 3sn'ye düşer.      │
│              Whirlpool yanıltıcı gösterge   │
│              devre dışı.                    │
│ Görsel     : Büyük renkli bayraklı tekne    │
└─────────────────────────────────────────────┘
7.2 Olta Seviyeleri
┌─────────────────────────────────────────────┐
│ OLTA LV1 — "Bambu Olta"                     │
│ ROD_SPEED      : Level bazlı (Bölüm 2.1)   │
│ Fırlatma hızı  : 9 birim/sn                 │
│ Yakalama alanı : 1.0x (base)                │
│ Atma hakkı     : 3                          │
│ Fiyat          : Ücretsiz (başlangıç)       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ OLTA LV2 — "Karbon Olta"                    │
│ ROD_SPEED      : +%15 hız ekler             │
│ Fırlatma hızı  : 11 birim/sn                │
│ Yakalama alanı : 1.2x                       │
│ Atma hakkı     : 4                          │
│ Özellik        : Coral çarpmada %30 şansla  │
│                  hak kaybetmez              │
│ Fiyat          : 100🪙                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ OLTA LV3 — "Titanium Olta"                  │
│ ROD_SPEED      : +%30 hız ekler             │
│ Fırlatma hızı  : 13 birim/sn                │
│ Yakalama alanı : 1.4x                       │
│ Atma hakkı     : 5                          │
│ Özellik        : Sea Kelp 0.4sn takılır.    │
│                  Coral çarpmada %60 şansla  │
│                  hak kaybetmez.             │
│ Fiyat          : 220🪙                       │
└─────────────────────────────────────────────┘
7.3 Olta Hakkı Kuralları
Başlangıç hakkı    : 3 (olta lv bazlı)
Tamir +1 hak       : 30🪙
Tamir full         : 80🪙
Tüm haklar biter   : Olta kullanılamaz
                     → Para kazanılamaz
                     → Yakıt alınamaz
                     → GAME OVER

Hak kaybettiren durumlar:
  Coral çarpması   : -1 hak (olta lv indirimi var)
  Shark Skeleton   : -1 hak (kesin)
  Sunken Boat E    : -1 hak (lanet senaryosu)

🏝 BÖLÜM 8: ADA GÖRSELLERİ
Bölge 1 (L1-4) — Başlangıç Körfezi
Gökyüzü     : Açık mavi (#87CEEB), beyaz bulutlar
Su rengi    : Açık turkuaz (#29B6F6)
Işık        : Parlak gündüz güneşi
Dip         : Açık kum, az yosun
Arka plan   : Palmiye ağaçlı küçük kum adası
Atmosfer    : Neşeli, tropik, davetkar
Su altı     : Net görünür, renkli
Bölge 2 (L5-8) — Mercan Adaları
Gökyüzü     : Açık mavi, hafif sarımsı ton
              (#87CEEB → #FFF9C4 geçiş)
Su rengi    : Orta mavi-yeşil (#0288D1)
Işık        : Öğleden sonra, hafif sıcak
Dip         : Mercan ve kaya karışımı
Arka plan   : Mercan kayalıkları silueti
Atmosfer    : Sıcak, renkli, hafif gizemli
Su altı     : İyi görünür, mercan renkleri
Bölge 3 (L9-12) — Derin Mavi
Gökyüzü     : Turuncu-mor gün batımı
              (#FF7043 → #7B1FA2 geçiş)
Su rengi    : Derin koyu mavi (#01579B)
Işık        : Alçak güneş, uzun gölgeler,
              altın-turuncu ton
Dip         : Karanlık, zar zor görünür
Arka plan   : Uzak kayalık adalar silueti
Atmosfer    : Dramatik, gerilimli, güzel
Su altı     : Az görünür, gizemli siluetler
Bölge 4 (L13-16) — Fırtına Geçidi
Gökyüzü     : Koyu gri-mor, dramatik bulutlar
              (#37474F → #4A148C karanlık)
Su rengi    : Koyu gri-mavi (#0D2137)
Işık        : Kasvetli, düşük kontrast
              Arada şimşek animasyonu
Dip         : Görünmez
Arka plan   : Kara bulutlar, uzak şimşekler
Atmosfer    : Tehditkâr, karanlık, epik
Su altı     : Neredeyse hiç görünmez
Özel efekt  : Tekne hafifçe sallanır
              (fırtına animasyonu)
Bölge 5 (L17-20) — Efsane Adası
Gökyüzü     : Gece, yıldızlı, aurora
              (#080C2B + yeşil-mor aurora bant)
Su rengi    : Derin lacivert + biyolüminesan
              (#080C2B + #7B1FA2 iç parlamalar)
Işık        : Sadece aurora ve biyolüminesan
Dip         : Parlayan kristal oluşumlar
Arka plan   : Dev kristal kayalıklar
Atmosfer    : Mistik, büyülü, final hissi
Su altı     : Biyolüminesan parlamalar
              (balıkların geçtiği yerde
              hafif ışık izi kalır)
Aurora efekt: Sürekli dalgalanan yeşil-mor
              ışık bandı gökyüzünde

🌦 BÖLÜM 9: HAVA DURUMU SİSTEMİ
HAVA       GÖRSEL                  OYUN ETKİSİ
──────────────────────────────────────────────────────
Güneşli    Normal görünüm          Etki yok

Bulutlu    Gökyüzü kararır,        Balık spawn
           ışık azalır, hafif       +%10 artar
           gri ton

Yağmurlu   Yağmur partikülleri,    Balık hızı
           su yüzeyi çalkantılı,    +%20 artar,
           splash efektleri         görüş -10%

Fırtınalı  Şimşek animasyonu,      Tüm balık hızları
           tekne sallanır,          +0.5 birim/sn,
           koyu atmosfer,           olta menzili
           dalga efektleri          -10px

Büyülü Gece Aurora dalgaları,      Nadir balık spawn
(L17-20)   biyolüminesan,          +%25 artar
           yıldız efektleri
──────────────────────────────────────────────────────

☠️ BÖLÜM 10: GAME OVER SİSTEMİ
10.1 Üç Game Over Türü
TÜR A — BATMA (Ağırlık Aşımı)
─────────────────────────────────────────────────
Tetikleyici : Toplam ağırlık > tekne kapasitesi
Zamanlama   : Yolculuk sırasında, anlık
Önlem       : Baloncuk topla, Candy Fish yararlan,
              King Fish tutma, tekne yükselt
Animasyon   :
  1. Tekne bir yana eğilir (0.5sn)
  2. Su içine girer (1sn)
  3. Balıklar tek tek kaçar (1.5sn)
  4. Tekne batar (1sn)
  5. GAME OVER ekranı
Mesaj       : "Tekne battı! Çok ağır yük."
İkinci şans : YOK

TÜR B — MAHSUR KALMA (Yakıt Yetersizliği)
─────────────────────────────────────────────────
Tetikleyici : Market'te yakıt parası yok
Zamanlama   : Market ekranında
Önlem       : Daha çok bal tut, skeleton/whirlpool'dan
              kaçın, Leaf Fish değer bonusu kullan
Animasyon   :
  1. "Sonraki Bölge" butonu kırmızıya döner
  2. Para yetersiz uyarısı titrer
  3. 3sn bekleme
  4. GAME OVER ekranı
Mesaj       : "Yakıt için para yetmedi!"
İkinci şans : Satılmamış envanter varsa ve
              satılınca yeterliyse devam eder

TÜR C — OLTA BİTMESİ (Tüm Haklar Tükendi)
─────────────────────────────────────────────────
Tetikleyici : Olta hakkı = 0
Zamanlama   : Yolculuk sırasında
Önlem       : Coral'dan kaçın, Skeleton'dan kaçın,
              market'te tamir yaptır
Animasyon   :
  1. Olta kırık animasyonu
  2. "Olta kullanılamaz" uyarısı
  3. 3sn bekleme
  4. GAME OVER (eğer market'te tamir parası yoksa)
Mesaj       : "Tüm kancalar kırıldı!"
İkinci şans : Market'te tamir parası varsa devam
10.2 Uyarı Sistemi
DURUM                    EŞİK      GÖSTERGE
────────────────────────────────────────────
Ağırlık sarı uyarı       %71 dolu  Sarı titreme
Ağırlık turuncu uyarı    %86 dolu  Turuncu alarm
Ağırlık kırmızı uyarı   %96 dolu  Kırmızı + ses
Olta hakkı az            1 hak     Olta ikonu kırmızı
Para tehlikeli az        <100🪙    Kumbara ikonu titrer
────────────────────────────────────────────

📱 BÖLÜM 11: UI/UX KURALLARI
11.1 Daima Görünür Elementler
- Ağırlık göstergesi (bar + "XX/YY birim")
- Süre sayacı (MM:SS formatı)
- Anlık coin miktarı (🪙 + sayı)
- Level göstergesi ("Level X / 20")
- Olta hakkı (kanca ikonu x5, dolu/boş)
- Bölge ilerleme noktaları (5 nokta)
11.2 Dokunmatik Kurallar
Tek dokunuş     : Olta fırlatma
Çift dokunuş    : (İleride: Booster aktifleştirme)
Basılı tut      : (İleride: Hızlı satış markette)
Kaydırma        : Market listesi
11.3 Market Ekranı Akışı
ZORUNLU SIRA:
  1. Envanteri incele (balık listesi, değerler)
  2. Sat (tek tek veya "Hepsini Sat")
  3. Ekipman al (opsiyonel)
  4. Yakıt al (zorunlu)
  5. "Sonraki Bölüm" (aktif olur)

"Sonraki Bölüm" butonu:
  → Yakıt alınmadan PASIF (gri)
  → Yakıt alındıktan sonra AKTİF (renkli)

⚡ BÖLÜM 12: BOOSTER & IAP SİSTEMİ
12.1 Oyun İçi Booster (🪙 ile)
BOOSTER          FİYAT   SÜRE     ETKİ
────────────────────────────────────────────
2x Puan          90🪙    60sn     Tüm gelir x2
Mıknatıs         110🪙   30sn     Balıklar yaklaşır
                                  (%80 yakalama alanı)
Yavaşlatıcı      70🪙    20sn     Tüm balıklar %40 yavaş
Olta Kalkanı     130🪙   1 bölüm  Coral/Skeleton hak
                                  kaybettirmez
Hafifletici      100🪙   1 bölüm  Tüm balıklar -2 birim
                                  ağırlık
Radar            120🪙   30sn     Nadir balık konumu
                                  gösterir (ikon)
────────────────────────────────────────────
12.2 IAP Paketleri (Gerçek Para)
Starter Pack   : 5 karışık booster
Lucky Pack     : 3x Radar + 2x 2x Puan
Safety Pack    : 2x Olta Kalkanı + 2x Hafifletici
Mega Pack      : Tüm booster 2'şer adet
Continue Pack  : Game over sonrası devam
                 (kaldığı yerden, 1 kullanım)

📐 BÖLÜM 13: SAYISAL ÖZET
PARAMETRE                    DEĞER
────────────────────────────────────────────────────
Toplam level sayısı          20
Toplam bölge sayısı          5 (her bölge 4 level)
Toplam balık türü            12
Toplam environment element   10
Başlangıç tekne kapasitesi   60 birim
Max tekne kapasitesi         130 birim
Başlangıç olta hakkı         3
Max olta hakkı               5
Min. zorunlu para (20 level) 1580🪙
Ağırlık birimi referansı     10px
En hafif balık               Leaf Fish (1 birim)
En ağır balık                King Fish (35 birim)
En hızlı balık               King Fish (5.5/sn)
En yavaş balık               Leaf Fish (0.6/sn)
En değerli balık             King Fish (900🪙)
En değersiz balık            Bubble Fish (8🪙)
L1 minimum kazanılabilir     ~30🪙
L20 maksimum kazanılabilir   ~3000🪙+ (King+nadir)
────────────────────────────────────────────────────