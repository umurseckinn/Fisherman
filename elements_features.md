🎮 Oyun Mekaniği & Balık/Element Veri Rehberi
Önce Temel Sistemler
Ağırlık sistemi:

Teknenin max kapasitesi başlangıçta 100 birim
Her yolculukta teknede biriken ağırlık toplamı bu limiti geçerse GAME OVER (batma)
Tekne yükseltmesi kapasiteyi artırır: Lv1=100, Lv2=150, Lv3=220
Ekranda sürekli görünür: ağırlık göstergesi (örn. 67/100)

Yakıt sistemi:

Her adaya varışta balıkları sat → yakıt al → sonraki adaya geç
Yeterli para yoksa yakıt alınamaz → GAME OVER (mahsur kalma)
Yolculuk süresi sabittir, süre bitince ada market ekranı açılır

Zorluk skalası:

Ada 1→2: kolay, Ada 2→3: orta, Ada 3→4: zor, Ada 4→5: çok zor
İlerledikçe ağır/hızlı balıklar artar, fiyatlar yükselir ama yakıt da pahalılaşır

Boyut birimi: 1 birim = 10px

🐟 BALIKLAR

1. BUBBLE FISH 🫧 — "Baloncu"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 15 🪙
Ağırlık         : 2 birim
Boyut           : 3x2.5 birim (küçük)
Hız             : 1.2 birim/sn (çok yavaş)
Derinlik Zonu   : Yüzey (su yüzeyinden
                  0-25% aşağı)
Spawn Adası     : Ada 1'den itibaren
Nadirlik        : Çok yaygın (%100)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Yumuşak sinüs dalgası
Yatay           : Sabit sola
Dikey           : ±20px sinüs, periyod 3sn
Özel            : Her 5-8 saniyede bir
                  0.5sn duraksama (nefes
                  alıyormuş gibi), durduğu
                  anda baloncuk efekti
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca hafif patlar gibi küçük
  baloncuk partikülleri saçar (görsel)
- Tutulunca teknede hiçbir etkisi yok,
  tamamen zararsız
- Diğer balıkları yemez
- Çok hafif olduğu için ağırlık limiti
  üzerinde minimal etkisi var
- Game over ettirmez
─────────────────────────────────────────

2. SAKURA FISH 🌸 — "Kiraz"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 25 🪙
Ağırlık         : 3 birim
Boyut           : 3.5x3 birim (küçük-orta)
Hız             : 1.5 birim/sn (yavaş)
Derinlik Zonu   : Yüzey-Orta (0-40%)
Spawn Adası     : Ada 1'den itibaren
Nadirlik        : Yaygın (%80)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Düz yatay + rastgele sapma
Yatay           : Sabit sola
Dikey           : Her 4-7sn'de bir ±15px
                  yumuşak sapma (ease in-out
                  tween, 1.5sn sürer)
Özel            : Hareket ederken arkasından
                  küçük petal partikülleri
                  düşer (sadece görsel)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca petal patlaması efekti
- Teknede hiçbir etkisi yok, zararsız
- Diğer balıkları yemez
- Game over ettirmez
- Düşük değeri nedeniyle erken adalarda
  para kazanmak için toplu tutulmalı
─────────────────────────────────────────

3. ZAP FISH ⚡ — "Elektro"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 40 🪙
Ağırlık         : 4 birim
Boyut           : 4x2.5 birim (orta)
Hız             : 3.5 birim/sn (hızlı)
Derinlik Zonu   : Tüm su (0-90%)
Spawn Adası     : Ada 1'den itibaren
Nadirlik        : Orta (%65)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Keskin zikzak
Yatay           : Sabit sola, yüksek hız
Dikey           : Her 0.8-1.2sn'de bir ani
                  ±40px dikey sıçrama,
                  sıçrama süresi sadece
                  0.15sn (neredeyse anlık)
Özel            : Sıçrama noktalarında
                  küçük elektrik spark
                  efekti bırakır
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca teknede 3 saniye boyunca
  elektrik çarpar: ağırlık göstergesi
  titrer (görsel), o 3sn içinde başka
  balık tutulursa %50 şansla kaçar
- Diğer balıkları yemez
- Yüksek hızı nedeniyle yakalamak zor,
  timing odaklı bir hedef
- Game over ettirmez
- Olta ile çarpışma alanı küçüktür
  (hızından dolayı dar hitbox)
─────────────────────────────────────────

4. CANDY FISH 🍭 — "Şekerci"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 55 🪙
Ağırlık         : 5 birim
Boyut           : 3.5x3.5 birim (orta,kare)
Hız             : 1.8 birim/sn (orta)
Derinlik Zonu   : Orta (20-60%)
Spawn Adası     : Ada 1'den itibaren
Nadirlik        : Orta (%60)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Spiral/kendi etrafında
                  dönerek ilerleme
Yatay           : Sabit sola
Dikey           : Küçük dairesel hareket,
                  merkez noktası da yavaşça
                  ilerler, çap ±25px,
                  tam tur süresi 2.5sn
Özel            : Dönerken şeker partikülleri
                  saçar (küçük renkli
                  noktalar, görsel)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca teknedeki TÜM BALIKLAR'ın
  ağırlığını 1 birim azaltır (şekerin
  neşesi hafifletir, oyun mantığı)
- Bu özellik teknede max 3 kez işe yarar
  (3 candy fish sonrası etki sıfır)
- Diğer balıkları yemez
- Game over ettirmez
- Erken adalarda ağırlık yönetimi için
  stratejik değer taşır
─────────────────────────────────────────

5. MOON FISH 🌙 — "Ay Balığı"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 80 🪙
Ağırlık         : 8 birim
Boyut           : 5x3 birim (orta-büyük,
                  yassı disk)
Hız             : 0.8 birim/sn (çok yavaş)
Derinlik Zonu   : Orta-Derin (40-80%)
Spawn Adası     : Ada 2'den itibaren
Nadirlik        : Orta-nadir (%45)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Yavaş dikey slalom
Yatay           : Çok yavaş sola
Dikey           : Geniş ve yavaş S-curve,
                  periyod 6sn, amplitüd
                  ±50px, her dalganın
                  tepesinde 1sn duraksama
Özel            : Geceleri (oyun içi ilerleyen
                  adalarda) parlama efekti
                  artar, daha kolay görünür
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca 10 saniye boyunca ekranda
  TÜM BALIKLAR yavaşlar (%40 hız düşüşü)
  (ay ışığı büyüsü)
- Bu yavaşlama etkisi üst üste binmez,
  birden fazla tutulursa süre uzar
- Diğer balıkları yemez
- Ağırlığı orta-yüksek, dikkatli tutulmalı
- Game over ettirmez
─────────────────────────────────────────

6. LAVA FISH 🔥 — "Magma"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 110 🪙
Ağırlık         : 12 birim
Boyut           : 4.5x3.5 birim (büyük,
                  kama şekli)
Hız             : 2.0 birim/sn (orta-hızlı)
Derinlik Zonu   : Derin (60-95%)
Spawn Adası     : Ada 2'den itibaren
Nadirlik        : Nadir (%35)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Çapraz diyagonal slalom
Yatay           : Sabit sola
Dikey           : 45 derece açıyla yukarı
                  hareket, üst zona çarpınca
                  45 derece aşağı yansır,
                  sanki duvardan sekiyor,
                  periyod değişken (2-4sn)
Özel            : Geçtiği yerde 0.5sn boyunca
                  küçük kor partikülleri
                  kalır (görsel iz)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca teknede 5 saniye YANAR:
  bu sürede teknedeki ağırlık göstergesi
  kırmızıya döner ve her saniye +1 birim
  ağırlık eklenir (sıcaktan şişme)
- Yani tutmak 5 birim ekstra ağırlık
  getirir, gerçek ağırlığı 12+5=17 birim
- Ağırlık limitine yakın durumlarda
  game over tetikleyebilir
- Diğer balıkları yakmaz/yemez
- Ada 4-5'te sık spawn olur, tehlike artar
─────────────────────────────────────────

7. TIDE FISH 🌊 — "Dalgacı"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 150 🪙
Ağırlık         : 9 birim
Boyut           : 5.5x3 birim (büyük,
                  torpido)
Hız             : 3.8 birim/sn (çok hızlı)
Derinlik Zonu   : Yüzey-Orta (0-50%)
Spawn Adası     : Ada 2'den itibaren
Nadirlik        : Nadir (%30)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Geniş sinüs, yüksek hız
Yatay           : Çok hızlı sola
Dikey           : Geniş amplitüd ±60px,
                  periyod 2.5sn, dalga
                  hızı yatay hıza bağlı
                  (hızlandıkça daha sık
                  dalgalanır)
Özel            : Arkasında kısa su izi
                  bırakır (beyaz streak,
                  0.3sn kaybolur)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca tekneyi sallar: ağırlık
  göstergesi anlık +5 birim görünür
  ama 2 saniye sonra normale döner
  (sadece görsel sallantı, gerçek
  ağırlık artmaz)
- ANCAK bu sallantı anında teknede
  başka balık varsa %20 şansla
  rastgele bir balık denize düşer
  (envanter kaybı)
- Çok hızlı olduğu için yakalamak
  timing açısından en zor balıklardan
- Game over ettirmez (direkt)
─────────────────────────────────────────

8. LEAF FISH 🍃 — "Yaprak"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 200 🪙
Ağırlık         : 1 birim (en hafif!)
Boyut           : 4x3.5 birim (orta,
                  yaprak formu)
Hız             : 0.6 birim/sn (en yavaş)
Derinlik Zonu   : Tüm su (0-95%)
                  rastgele spawn
Spawn Adası     : Ada 2'den itibaren
Nadirlik        : Nadir (%28)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Sürüklenen yaprak hareketi
Yatay           : Çok yavaş sola, ara ara
                  hafifçe sağa da kayar
                  (akıntıya bağlı)
Dikey           : Düzensiz S-curve, her 3-5sn
                  rastgele yeni bir hedef
                  nokta seçer ve oraya
                  ease-in-out ile kayar,
                  duraksama anları olur
                  (0.5-1.5sn hareketsiz)
Özel            : Bazen su akıntısıyla birden
                  hızlanır (2sn boyunca 3x
                  hız, sonra tekrar yavaşlar)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- En hafif balık (1 birim), tutulunca
  ağırlık limitine neredeyse etki etmez
- Tutulunca teknedeki TÜM BALIKLAR'ın
  market değeri %10 artar (yaprak şansı)
  bu sefer geçici değil, o yolculuk için
  kalıcıdır, max 3 kez birikir (%30)
- Yüksek değer + düşük ağırlık = ideal
  balık, ama yakalamak için sabır gerekir
- Diğer balıkları yemez
- Game over ettirmez
─────────────────────────────────────────

9. CRYSTAL FISH 💎 — "Kristal"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 300 🪙
Ağırlık         : 18 birim (çok ağır!)
Boyut           : 4x4 birim (orta, kare)
Hız             : 2.2 birim/sn (orta)
Derinlik Zonu   : Derin (55-90%)
Spawn Adası     : Ada 3'ten itibaren
Nadirlik        : Çok nadir (%20)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Dikey slalom, keskin dönüş
Yatay           : Orta hızda sola
Dikey           : Yukarı-aşağı dik hatlar,
                  ±45px, dönüşler neredeyse
                  anlık (0.1sn), dönüş
                  noktasında kristal parıltı
                  efekti
Özel            : Işığı kırar, etrafındaki
                  küçük bir alanda diğer
                  balıkların görünümü
                  hafif bozulur (prizma efekti,
                  sadece görsel)
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Ağırlığı çok yüksek (18 birim),
  dikkatli düşünmeden tutmak ağırlık
  limitini zorlayabilir
- Tutulunca teknede PARLAK bir ışık efekti,
  ardından market değeri rastgele değişir:
  %40 şansla +50🪙 bonus
  %40 şansla değişmez
  %20 şansla -30🪙 (kristal çatlamış)
- Diğer balıkları yemez
- Tek başına game over tetikleyebilir
  (eğer kapasite doluysa)
─────────────────────────────────────────

10. GALAXY FISH 🌌 — "Galaksi"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 450 🪙
Ağırlık         : 7 birim (değerine göre
                  hafif, bu bilinçli)
Boyut           : 5x3.5 birim (büyük)
Hız             : 4.5 birim/sn (çok hızlı)
Derinlik Zonu   : Tüm su (0-95%)
Spawn Adası     : Ada 3'ten itibaren
Nadirlik        : Çok nadir (%15)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Warp hareketi
Yatay           : Çok hızlı sola
Dikey           : Her 1-2sn'de ani 90°
                  dikey sıçrama (yukarı
                  veya aşağı, rastgele),
                  sıçrama ANında 0.1sn
                  görünmez olur (warp),
                  sonra yeni konumda
                  belirir
Özel            : Sıçrama noktasında
                  yıldız patlaması efekti,
                  yeni konumda belirince
                  ripple halkası
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Görünmez olduğu 0.1sn'de olta ile
  yakalanamaz (hitbox yok)
- Tutulunca teknede yıldız yağmuru
  efekti, ardından rastgele bir bonus:
  %30 şansla ekstra 100🪙 nakit düşer
  %30 şansla yakıt %10 dolar
  %40 şansla sadece görsel efekt
- Değer/ağırlık oranı en yüksek balık
- Game over ettirmez
- Yakalamak için warp pattern'ini
  öğrenmek gerekir
─────────────────────────────────────────

11. MUSHROOM FISH 🍄 — "Mantarcık"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 600 🪙
Ağırlık         : 15 birim
Boyut           : 4x5 birim (büyük, dikey)
Hız             : 1.5 birim/sn (yavaş-orta)
Derinlik Zonu   : Orta-Derin (35-85%)
Spawn Adası     : Ada 3'ten itibaren
Nadirlik        : Çok nadir (%12)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Pulse/sıçrama (zıplayan)
Yatay           : Yavaşça sola
Dikey           : 0.8sn boyunca hareketsiz,
                  ardından 0.2sn'de ani
                  ±30px sıçrama (yukarı
                  veya aşağı rastgele),
                  tekrar 0.8sn bekler
                  (mantar sporları gibi
                  patlar ve durur)
Özel            : Her sıçramada spor
                  partikülleri saçar,
                  bu sporlar 2sn yaşar
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- Tutulunca teknede SPOR ETKİSİ:
  teknedeki rastgele bir balığın market
  değeri 2 katına çıkar (mantar büyüsü)
  hangi balık olduğu belirtilmez, sürpriz
- Ağırlığı yüksek (15 birim), ama spor
  etkisi sayesinde stratejik değer var
- Diğer balıkları yemez
- Ada 4-5'te değer/risk dengesi kritik
- Game over ettirmez (direkt)
─────────────────────────────────────────

12. KING FISH 👑 — "Kral"
TEMEL VERİLER
─────────────────────────────────────────
Market Değeri   : 1000 🪙
Ağırlık         : 35 birim (devasa!)
Boyut           : 7x4 birim (çok büyük)
Hız             : 5.5 birim/sn (en hızlı)
Derinlik Zonu   : Orta (30-70%)
Spawn Adası     : Ada 4'ten itibaren
Nadirlik        : Efsanevi (%5)
Ekran Süresi    : 8 saniye (sonra kaybolur)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Yıldırım düz geçiş
Yatay           : Son derece hızlı sola,
                  ekranı 3sn'de geçer
Dikey           : Neredeyse sıfır sapma,
                  tam yatay çizgide ilerler
                  sadece ±5px mikro titreme
Özel            : Geçerken tüm küçük balıklar
                  (değer <100🪙) panikler ve
                  rastgele yön değiştirir
                  (3sn boyunca), kral geçtikten
                  sonra altın iz bırakır
─────────────────────────────────────────

UNIQUE ÖZELLİKLER
─────────────────────────────────────────
- 35 birim ağırlık — tek başına tutmak
  neredeyse kesin GAME OVER (batma)
  başlangıç teknesiyle imkânsız
- Lv3 tekne (kapasite 220) ve tekne
  boşken tutulursa güvenli
- Tutulunca ekranda KRAL FANFARISI
  efekti, ardından tüm balıkların
  market değeri o yolculukta %20 artar
- Diğer balıkları yemez ama panikletir
- En yüksek ödül en yüksek risk dengesi
- Oyunun en kritik karar anı:
  "Tutayım mı, batayım mı?"
─────────────────────────────────────────

🌿 Çevre Elementleri Veri Rehberi — Part 2
Konum Sistemi Açıklaması
Dikey zonlar:

Yüzey Zonu: Su yüzeyinden %0–20 arası
Orta Zon: %20–60 arası
Derin Zon: %60–90 arası
Dip Zonu: %90–100 (kum tabanı üzeri)

Yatay konum: Elementler ekran genişliğine rastgele dağılır, sabit elementler spawn anında konum seçer ve o yolculuk boyunca orada kalır.

E1. 🌿 SEA KELP — "Deniz Yosunu"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Engel (sabit)
Ağırlık Etkisi  : Yok
Boyut           : 4x6 birim (dikey uzun)
Konum           : DİP ZONU — tabanа yapışık,
                  alt kenarı kum çizgisine
                  tam oturur, asla hareket
                  etmez
Yatay Dağılım   : Ekranda aynı anda 2-4 adet,
                  aralarında min 60px boşluk,
                  spawn konumu yolculuk
                  başında rastgele seçilir
                  ve sabit kalır
Nadirlik        : Her yolculukta kesinlikle
                  var (%100), ada ilerledikçe
                  adet artar (Ada1: 2 adet,
                  Ada5: 5 adet)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Sabit konum, sadece idle
Yatay           : Hiç hareket etmez
Dikey           : Hafif salınım animasyonu,
                  ±3px, periyod 2.5sn,
                  su akıntısını simüle eder
                  (sadece görsel, hitbox
                  sabit kalır)
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : TAKILMA
Ne olur         : Olta yosuna çarptığında
                  anında durur, hookMoving
                  false olur, hook null olur
Kurtulma        : Otomatik, 0.8sn sonra
                  olta kendiliğinden çözülür
                  ve geri döner, atış hakkı
                  kaybedilmez
Görsel          : Takılma anında yosun
                  titrer, küçük baloncuk
                  partikülleri çıkar
Ses             : Hafif "boing" sesi
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR — olta takılır
                  ama yosun envantera
                  girmez, sadece zaman
                  kaybettirir
Game Over       : HAYIR
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- Dip zonundaki değerli balıklara
  ulaşmayı engelleyen ana bariyer
- Ada ilerledikçe daha yoğun, dip
  zonuna erişim giderek zorlaşır
- Olta yükseltmesi yosunda takılma
  süresini kısaltmaz, sadece dikkat
  gerektirir
─────────────────────────────────────────

E2. 🪨 SEA ROCK — "Deniz Kayası"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Engel (sabit, sert)
Ağırlık Etkisi  : Yok
Boyut           : 5x4 birim (geniş, alçak)
Konum           : DİP ZONU + ORTA ZON
                  karışık — bazıları tabana
                  oturur, bazıları orta
                  zonda tek başına yüzer
                  (deniz içi kayalık)
Yatay Dağılım   : Ekranda aynı anda 1-3 adet,
                  Ada1: 1 adet, Ada5: 4 adet
Nadirlik        : %85 (neredeyse her
                  yolculukta var)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : TAM SABİT
Yatay           : Hiç hareket etmez
Dikey           : Hiç hareket etmez,
                  idle animasyonu bile yok
                  (kaya sonuçta kayadır)
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : SERT ÇARPMA
Ne olur         : Olta kayaya çarptığında
                  anında durur ve GERİ
                  SEKME — hook 3-4px geri
                  zıplar, hookMoving false,
                  hook null
Kurtulma        : Anında, kurtulma süresi
                  yok, olta hemen geri döner
Atış hakkı      : Kaybedilmez ama zaman
                  kaybolur
Görsel          : Çarpma anında taş kıvılcımı
                  partikülleri (3-4 küçük
                  sarı-turuncu nokta)
Ses             : Sert "tank" sesi
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR
Game Over       : HAYIR
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- Yosundan farklı olarak kurtulma
  süresi yoktur, daha az zaman kaybı
  ama konumu önceden görmek gerekir
- Orta zondaki yüzen kayalar özellikle
  sinir bozucu çünkü beklenmedik yerde
  olabilir
- Arkasında balık saklanabilir (kaya
  balığın önünde engel oluşturur)
─────────────────────────────────────────

E3. 🪸 CORAL — "Mercan"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Engel (sabit, kırılgan)
Ağırlık Etkisi  : Yok
Boyut           : 6x5 birim (geniş, orta boy)
Konum           : DİP ZONU — tabana yapışık,
                  yosundan daha geniş yer
                  kaplar, ikisi yan yana
                  spawn olabilir
Yatay Dağılım   : Ada1: 0-1 adet,
                  Ada3: 1-2 adet,
                  Ada5: 2-3 adet
Nadirlik        : %55 (orta sıklıkta)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Sabit konum, hafif idle
Yatay           : Hiç hareket etmez
Dikey           : Dallar çok hafif salınır,
                  ±2px, sadece dal uçları,
                  periyod 3sn (su akıntısı)
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : KILIF KIRIĞI (en sert engel)
Ne olur         : Olta mercanа çarptığında
                  1 ATMA HAKKI KAYBOLUR —
                  hook null, hookMoving false,
                  olta görsel olarak "kırılır"
                  (2 parçaya bölünmüş animasyon)
                  ardından normal oltaya döner
Kurtulma        : Yok, direkt hak kaybı
Görsel          : Mercan parıltı efekti,
                  kırılan olta animasyonu,
                  küçük mercan kırık parçaları
                  partikülleri
Ses             : Keskin "crack" sesi
Atış hakkı      : -1 (kaybedilir!)
─────────────────────────────────────────

ATMA HAKKI SİSTEMİ
─────────────────────────────────────────
- Oyuncu başlangıçta sonsuz atma hakkına
  sahip değil, her mercan çarpması
  bir hak eksiltir
- Başlangıç hakkı: 3 (olta yükseltmesi
  ile artar: Lv2=4 hak, Lv3=5 hak)
- Haklar ada marketinde yenilenir
  (olta tamiri ücreti: 20🪙/hak)
- Tüm haklar bitince olta kullanılamaz
  → bu durum dolaylı game over yaratır
  çünkü balık tutulamaz → para yok →
  yakıt alınamaz → GAME OVER
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR
Game Over       : DOLAYLI (olta hakları
                  tükenirse)
─────────────────────────────────────────

E4. 🐚 SHELL — "Deniz Kabuğu"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Toplanabilir (bonus)
Ağırlık Etkisi  : +1 birim (çok hafif)
Boyut           : 2.5x2.5 birim (küçük)
Konum           : DİP ZONU — kuma gömülü
                  halde durur, sadece üst
                  yarısı görünür, sanki
                  kumun içinden çıkmış
Yatay Dağılım   : Ekranda 0-3 adet,
                  spawn tamamen rastgele
Nadirlik        : %70
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : TAM SABİT
Yatay           : Hiç hareket etmez
Dikey           : Hiç hareket etmez
Özel            : Hafif parıltı pulse
                  animasyonu (ışık yansıması
                  simülasyonu, 1.5sn periyod)
                  oyuncuya "al beni" der gibi
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : TOPLAMA
Ne olur         : Olta değdiğinde anında
                  toplanır, envantera girer
Bonus içeriği   : Temel: +20🪙 nakit (direkt,
                  envantera değil, anında
                  coins'e eklenir)
                  %25 şansla: içinden küçük
                  bir balık çıkar (Bubble
                  veya Sakura Fish, otomatik
                  envantera girer)
                  %10 şansla: olta tamiri
                  (+1 atma hakkı)
Görsel          : Kabuk açılır animasyonu,
                  içinden ışık fışkırır,
                  para partikülleri
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : EVET (nakit olarak)
Ağırlık         : +1 birim (kabuk teknede
                  fiziksel yer tutmaz,
                  sadece içindeki balık
                  varsa o ağırlık sayılır)
Game Over       : HAYIR
─────────────────────────────────────────

E5. 📦 TREASURE CHEST — "Batık Sandık"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Toplanabilir (büyük bonus)
Ağırlık Etkisi  : +8 birim
Boyut           : 7x5 birim (büyük)
Konum           : DİP ZONU — tabana tam
                  oturmuş, kısmen kuma
                  gömülü (alt 20% görünmez)
Yatay Dağılım   : Ekranda max 1 adet,
                  her yolculukta %40 şansla
                  spawn olur (nadir sürpriz)
Nadirlik        : %40 (her yolculukta yok)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : TAM SABİT
Yatay           : Hiç hareket etmez
Dikey           : Hiç hareket etmez
Özel            : Kapak hafifçe yukarı-aşağı
                  yavaş salınır (3sn periyod,
                  ±5px kapak açısı değişimi)
                  içinden altın ışık sızar
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : TOPLAMA (ağır)
Ne olur         : Olta değdiğinde açılır,
                  içerik envantera girer
Bonus içeriği   : Nakit: 80-200🪙 (rastgele)
                  +%60 şansla 1 nadir balık
                  (Crystal veya Galaxy Fish
                  direkt envantere düşer,
                  ağırlıklarıyla birlikte!)
                  +%20 şansla full olta
                  tamiri (tüm haklar yenilenir)
Görsel          : Sandık dramatik açılış
                  animasyonu, altın yağmuru
                  partikülleri, fanfar efekti
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : EVET
Ağırlık         : +8 birim (sandığın kendisi)
                  + içindeki balığın ağırlığı
                  (eğer nadir balık çıktıysa)
                  toplam potansiyel: +8+18=26
                  birim (crystal çıkarsa)
Game Over       : OLABİLİR — içinden nadir
                  balık çıkıp ağırlık limitini
                  aşarsa GAME OVER (batma)
                  Oyuncu kapasite boş değilse
                  sandığı toplamamalı
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- En riskli toplanabilir element
- Kapasite doluyken sandık toplamak
  çok tehlikeli, içinden ne çıkacağı
  bilinmez
- Ağırlık limitinin en az 30 birim
  altındayken toplanması önerilir
─────────────────────────────────────────

E6. ⚓ ANCHOR — "Eski Çapa"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Engel (dinamik ağırlık)
Ağırlık Etkisi  : ÖZEL (aşağıda)
Boyut           : 3x8 birim (dar, çok uzun)
Konum           : ORTA ZON + DİP ZONU
                  bağlantılı — çapa tepeden
                  sarkıyor gibi, üst ucu
                  orta zonda alt ucu dip
                  zonunda, sanki bir zincire
                  bağlı sallanıyor
Yatay Dağılım   : Ekranda 0-2 adet
Nadirlik        : %50
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : Sarkıt hareketi (sarkaç)
Yatay           : ±25px yavaş sarkaç,
                  periyod 4sn, tam yatay
                  salınım
Dikey           : Sabit konum, sadece
                  yatay salınır
Özel            : Salınırken zincir sesi
                  efekti (görsel zincir
                  animasyonu üst kısımda)
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : YAVALASMA + YAVAŞLATMA
Ne olur         : Olta çapaya değdiğinde
                  takılır, hookMoving devam
                  eder ama hız %70 düşer,
                  hook çapaya "asılı" kalır
                  2 saniye, sonra kurtulur
Kurtulma        : 2 saniye bekle VEYA
                  oyuncu tekrar ekrana
                  basarsa 0.5sn'de erken
                  kurtulur (silkele hareketi)
Görsel          : Olta çapaya sarılmış gibi
                  görünür, titreme animasyonu
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR (olta çözülür,
                  çapa envantera girmez)
Ağırlık etkisi  : Dolaylı — çapaya takılan
                  süre boyunca tekne yavaşlar
                  (yolculuk süresi uzar gibi
                  hissettirmek için timer
                  o 2sn daha hızlı akar,
                  yani -2sn ceza)
Game Over       : HAYIR (direkt değil)
─────────────────────────────────────────

E7. 🫧 BUBBLES — "Hava Baloncukları"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Power-up (pozitif)
Ağırlık Etkisi  : -3 birim (ağırlık AZALTIR)
Boyut           : 4x5 birim (dikey cluster)
Konum           : YÜZEY + ORTA ZON —
                  aşağıdan yukarıya doğru
                  hareket eder, dipten
                  yüzeye çıkar ve kaybolur
Yatay Dağılım   : Ekranda 1-3 adet,
                  sürekli yenileri doğar
                  (dipten spawn, yüzeyde
                  kaybolur, loop)
Nadirlik        : Her zaman var, ama
                  hızla geçer (yakalanması
                  timing gerektirir)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : DİKEY YUKARI (sürekli)
Yatay           : ±10px hafif sürüklenme,
                  sanki su akıntısıyla
Dikey           : Sabit yukarı, hız
                  1.5 birim/sn, dipten
                  çıkıp yüzeyde patlar
Özel            : Yüzeye ulaşınca "pop"
                  efekti ile kaybolur,
                  hemen alttan yeni cluster
                  spawn olur
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : TOPLAMA (anlık)
Ne olur         : Olta baloncuğa değince
                  anında toplanır
Efekt           : Teknenin anlık ağırlığı
                  -3 birim (mevcut yük
                  hafifler, sanki balıklar
                  şişerek yüzüyor)
                  + olta hızı 5sn boyunca
                  %30 artar (balon gibi
                  hafifler)
Görsel          : Büyük baloncuk patlaması,
                  küçük parçalar dağılır,
                  tekne üzerinde yukarı
                  çıkan baloncuk efekti
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : EVET (efekt olarak)
Ağırlık         : -3 birim (azaltır!)
Game Over       : HAYIR, aksine game over'ı
                  önlemeye yardımcı olur
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- Ağırlık limitine yaklaşıldığında
  bilinçli olarak toplanmalı
- Hızlı geçtiği için dikkat gerektirir
- Ada ilerledikçe spawn hızı artar
  (daha çok ihtiyaç duyulan yerde
  daha çok çıkar, balancing amaçlı)
─────────────────────────────────────────

E8. 🚤 SUNKEN BOAT — "Batık Tekne"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Toplanabilir (sürpriz kutu)
Ağırlık Etkisi  : +5 birim (tekne kendisi)
Boyut           : 9x4 birim (çok geniş)
Konum           : DİP ZONU — tabana yatık,
                  hafif sol tarafa eğimli,
                  kum çizgisine değiyor
Yatay Dağılım   : Ekranda max 1 adet,
                  %30 şansla spawn
Nadirlik        : %30
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : TAM SABİT
Yatay           : Hiç hareket etmez
Dikey           : Hiç hareket etmez
Özel            : Lomboz penceresinden
                  sarı ışık pulse efekti
                  (1sn periyod parlama-
                  sönme), merak uyandırır
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : ARAŞTIRMA (özel mekanik)
Ne olur         : Olta değince kapı açılır,
                  içinden NE ÇIKACAĞI
                  tamamen rastgele:

  Senaryo A (%35): 1-3 adet Hamsi veya
    Çipura direkt envantera girer
    (+bu balıkların ağırlıkları)

  Senaryo B (%25): 50-120🪙 nakit +
    1 adet rastgele orta balık

  Senaryo C (%20): İÇERİDE HIÇBIR ŞEY YOK
    sadece +5 birim ağırlık eklenir
    (enkaz çöpü toplandı)

  Senaryo D (%15): Nadir balık çıkar
    (Moon Fish veya Lava Fish,
    ağırlıklarıyla birlikte)

  Senaryo E (%5): LANET — içeriden
    Shark Skeleton efekti çıkar,
    10🪙 kayıp + 1 olta hakkı kaybı

Görsel          : Kapı kırılma animasyonu,
                  içerik spawn efekti,
                  her senaryonun kendine
                  özel partikül rengi
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : EVET
Ağırlık         : +5 (enkaz) + içerikler
Game Over       : OLABİLİR — D senaryosu
                  nadir balık + enkaz
                  ağırlığı tehlikeli
                  olabilir, E senaryosu
                  dolaylı zarar verir
─────────────────────────────────────────

E9. 💀 SHARK SKELETON — "Köpekbalığı İskeleti"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Engel (lanet, tehlikeli)
Ağırlık Etkisi  : ÖZEL (aşağıda)
Boyut           : 11x3 birim (en geniş
                  element, yatay dev)
Konum           : ORTA ZON — serbest
                  yüzer, sabit değil,
                  yavaşça sola kayar
                  (tek hareket eden
                  engel element)
Yatay Dağılım   : Ada3'ten itibaren
                  %25 şansla 1 adet
Nadirlik        : %25 (geç adalarda)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : YATAY KAYIŞ (çok yavaş)
Yatay           : 0.3 birim/sn sola,
                  balıklar gibi ama çok
                  daha yavaş, ekranı
                  30sn'de geçer
Dikey           : ±8px çok yavaş salınım,
                  periyod 5sn (batan
                  enkaz gibi hafif iner-
                  çıkar)
Özel            : Göz yuvalarından mint
                  yeşili ışık sürekli
                  pulse eder
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : LANET (en kötü engel)
Ne olur         : Olta iskelete değince
                  üç kötü şey birden:
                  1. -10🪙 nakit kayıp
                     (lanet ücreti)
                  2. -1 olta atma hakkı
                     (kemik kırdı)
                  3. 5sn boyunca tüm
                     balıklar KAÇAR —
                     ekrandaki balıklar
                     panikleyerek hız
                     2x artar, yakalamak
                     neredeyse imkânsız
Kurtulma        : Anında (olta serbest
                  kalır) ama ceza verilmiş
Görsel          : Kırmızı flash ekran,
                  iskelet titrer, göz
                  yuvaları parlar,
                  korku partikülleri
Ses             : Uğursuz ses efekti
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR (olta geçer ama
                  iskelet envantera girmez,
                  sadece ceza verir)
Ağırlık etkisi  : Yok (direkt ağırlık
                  eklemez)
Game Over       : DOLAYLI — para eksilir,
                  olta hakkı azalır,
                  balıklar kaçar → gelir
                  düşer → yakıt alınamaz
                  → GAME OVER (mahsur)
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- Oyunun en tehlikeli elementi
- Ada 3-5 arası kritik düşman
- Geniş boyutu (11 birim) nedeniyle
  kaçınmak zordur
- Olta yükseltmesi cezayı azaltmaz,
  tek çözüm kaçınmak
- Yavaş hareket ettiği için önceden
  görülüp planlanabilir
─────────────────────────────────────────

E10. 🌀 WHIRLPOOL — "Girdap"
TEMEL VERİLER
─────────────────────────────────────────
Tür             : Dinamik engel (en tehlikeli
                  çevre elementi)
Ağırlık Etkisi  : ÖZEL (aşağıda)
Boyut           : 6x6 birim (kare, dairesel)
Konum           : ORTA ZON — sabit değil,
                  yavaşça rastgele hareket
                  eder, öngörülemez
Yatay Dağılım   : Ada2'den itibaren,
                  Ada2: %20 şans 1 adet
                  Ada4-5: %50 şans 1-2 adet
Nadirlik        : Ada bazlı (yukarıda)
─────────────────────────────────────────

HAREKETİ
─────────────────────────────────────────
Tip             : RASTGELE GEZİNME
Yatay           : Her 3-5sn'de yeni rastgele
                  hedef nokta seçer, oraya
                  ease-in-out ile kayar,
                  yatay hız max 0.8 birim/sn
Dikey           : Aynı sistem, yatay ve
                  dikey hareket bağımsız
Özel            : Döner animasyonu sürekli
                  aktif, hareket hızına
                  bağlı olarak dönüş hızı
                  da artar
─────────────────────────────────────────

OLTA ETKİLEŞİMİ
─────────────────────────────────────────
Temas tipi      : EMİŞ (en karmaşık mekanik)
Ne olur         : Olta girdaba girince
                  içine çekilir, hookMoving
                  devam eder ama kontrol
                  oyuncudan alınır:
                  hook girdap merkezine
                  doğru spiral çizer,
                  3 tam tur sonra fırlatılır

Fırlatılma sonucu (rastgele):
  %40: Olta girdabın karşı tarafına
       fırlar, oradan normal devam eder
       (şanslı kaçış, balık tutabilir)
  %35: Olta yüzeye fırlar, yolculuk
       süresi -3sn cezası
  %25: Olta tekneye geri döner,
       bu turda o atış tamamen boşa
       gider + teknedeki rastgele
       bir balık -5🪙 değer kaybeder
       (girdap hasarı)

Girdap içindeyken:
  — Etraftaki balıklar da etkilenir,
    küçük balıklar (değer <100🪙)
    girdaba çekilir ve KAYBOLUR
    (envantera girmez, yutulur)
  — Büyük balıklar panikler ama
    kurtulurlur
Görsel          : Spiral çeken olta
                  animasyonu, etraftaki
                  balıkların çekilmesi,
                  fırlatılma efekti
─────────────────────────────────────────

TEKNEDEKİ ETKİSİ
─────────────────────────────────────────
Tutulabilir mi  : HAYIR
Ağırlık etkisi  : DOLAYLI — girdap yakın
                  geçerse teknedeki
                  balıklara titreme
                  animasyonu, ağırlık
                  göstergesi +3 birim
                  YANLIŞ okur (2sn boyunca
                  yanıltıcı gösterge,
                  sonra düzelir)
Game Over       : OLABİLİR — küçük balıklar
                  yutulursa para kaybı,
                  dolaylı yakıt alamama
                  riski artar
─────────────────────────────────────────

STRATEJİK NOT
─────────────────────────────────────────
- Hareket ettiği için önceden
  konumunu tahmin etmek zordur
- Ada 4-5'te iki girdap varsa ve
  aralarından geçmek gerekiyorsa
  kritik risk bölgesi oluşur
- Girdabın %40 şanslı fırlatması
  stratejik kullanılabilir: zor bir
  konumdaki balığa ulaşmak için
  kasıtlı girdaba girilebilir
  (risk/ödül kararı)
- Yanıltıcı ağırlık göstergesi
  oyuncuyu sahte game over korkusuyla
  paniğe sokabilir (tasarım gereği)
─────────────────────────────────────────