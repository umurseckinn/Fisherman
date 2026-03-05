🎮 Antigravity'e Olta Mekaniği & Feedback Rehberi
Önce sorunları kategorize edelim, sonra her birine çözüm:

🔍 Muhtemel Sorunların Analizi
SORUN A — MEKANİK HİSSİ:
  Olta fırlatma "ağırlıksız" hissettiriyor
  Hook hareketi robotik, fizik yok
  Yakalama anı tatminsiz (sadece kaybolma)
  Miss (kaçırma) anında feedback yok

SORUN B — ANİMASYON:
  Balık yakalanınca direkt yok oluyor
  Olta geri dönüşü lineer/anlık
  Su girişi/çıkışı efekti yok
  Zincirleme feedback eksik

SORUN C — JUICE (Oyun Hissi):
  Ekran shake yok
  Partikül efektleri yetersiz
  Ses ile görsel sync yok
  "Impact frame" yok

🎯 Antigravity'e Verilecek Komut (Kopyala-Yapıştır)
Aşağıdaki animasyon ve feedback sistemlerini 
fishing game'e uygula. Her madde bağımsız 
bir görev olarak ele al ve sırasıyla uygula.

KOMUT BLOĞU 1: Olta Fırlatma Hissi
GÖREV: Olta fırlatma mekaniğini premium 
hissettir. Şu anda hook fırlatılınca 
direkt hareket ediyor. Bunu değiştir:

1. FIŞKIRMA ANİMASYONU (hook spawn):
   Hook başlangıç noktasında 0.08sn 
   boyunca scale 0→1.4→1.0 yap
   (overshoot spring effect)
   
2. MISINA SALINIM:
   Hook uçarken arkasında kalan misina
   gerçek fizik gibi salınmalı. Bunu
   şöyle simüle et: misinayı 4-5 noktalı
   bir bezier curve olarak çiz. Her frame
   önceki frame'e %60 lerp uygula.
   (Elastic trailing effect)

3. SU GİRİŞİ:
   Hook suya girdiği anda (Y > su yüzeyi):
   — Splash partikül: 6-8 küçük beyaz 
     daire, dışa doğru 0.3sn içinde fade
   — Su yüzeyinde halka: 2 concentric 
     circle, dışa genişleyerek 0.4sn fade
   — Hook scale: 1.0→0.8 ani (su direnci)
   
4. SU ALTI HAREKET:
   Hook su altındayken:
   — Hafif yavaşlama: her frame vx*=0.98
   — Küçük su baloncukları: her 8 frame'de
     bir 2px beyaz daire yukarı float eder
     ve 0.5sn'de kaybolur

KOMUT BLOĞU 2: Balık Yakalama Feedback
GÖREV: Balık yakalandığında zincirleme 
feedback sistemi kur. Her balık değerine 
göre farklı yoğunlukta olmalı.

FEEDBACK KATEGORİLERİ:

KÜÇÜK BALIK (değer < 50🪙):
Bubble Fish, Sakura Fish gibi

  A. HOOK TITREME:
     Yakalama anında hook position:
     +3px sağ → -3px sol → 0px
     0.12sn içinde (quick wiggle)
  
  B. BALONA ÇEKILME:
     Balık 0.2sn içinde hook pozisyonuna
     doğru lerp ile çekilir, sonra ikisi
     birden yukarı hareket eder
  
  C. PARTİKÜL:
     4 küçük renkli yıldız (6px, balığın
     rengiyle eşleşen) dışa doğru patlar,
     0.4sn fade out
  
  D. KART:
     Mevcut kart popup (zaten var, koru)

ORTA BALIK (değer 50-200🪙):
Moon Fish, Lava Fish, Tide Fish gibi

  A. EKRAN SHAKE:
     Tüm canvas: random offset
     X: ±4px, Y: ±4px
     3 frame boyunca, sonra smooth return
  
  B. HOOK TITREME:
     Daha güçlü: ±6px, 0.18sn, 3 salınım
  
  C. IŞIK FLAŞI:
     Canvas üzerine balığın rengiyle
     eşleşen overlay (#RRGGBB at 30%),
     0.06sn görünür, 0.15sn fade out
     (impact frame effect)
  
  D. PARTİKÜL:
     8 yıldız + 3 büyük daire (12px),
     daha hızlı ve dağınık, 0.5sn fade
  
  E. BALONA ÇEKILME:
     Balık önce 0.1sn counter-direction
     gider (direniyor), sonra hook'a çekilir
     (balığın direnmesi hissi)

BÜYÜK/NADİR BALIK (değer 200🪙+):
Crystal, Galaxy, Mushroom, King Fish gibi

  A. DONDURMA FRAME:
     Yakalama anında oyun 0.06sn durur
     (time scale = 0), sonra devam eder
     (hit-stop effect — en önemli madde)
  
  B. GÜÇLÜ EKRAN SHAKE:
     X: ±8px, Y: ±6px, 5 frame, 
     decaying amplitude (her frame %70'e düşer)
  
  C. ZOOM PULSE:
     Canvas scale: 1.0 → 1.04 → 1.0
     0.25sn içinde (ease in-out)
  
  D. RENK FLAŞİ:
     Balığa özel renk:
       Crystal  → #AB47BC (mor)
       Galaxy   → #E040FB (kozmik pembe)  
       Mushroom → #E53935 (kırmızı)
       King     → #FFD700 (altın)
     Overlay opacity: 40%, 0.08sn→0sn fade
  
  E. PARTİKÜL PATLAMASI:
     12 yıldız + 6 daire + 4 büyük parlama
     360 derece eşit dağılım
     Büyük parlama: 20px beyaz circle,
     0.1sn'de scale 1→3, opacity 1→0
  
  F. KING FISH ÖZEL:
     Yukarıdakilere ek olarak:
     — Ekran tamamen 1 frame gold flash
     — "LEGENDARY!" text 0.5sn görünür,
       scale 0→1.5→1.2 ile, altın rengi
     — 16 partikül (taç şekilli dağılım)

KOMUT BLOĞU 3: Miss (Kaçırma) Feedback
GÖREV: Balık kaçtığında veya olta boşa 
gittiğinde de feedback ver. Şu an hiçbir
şey olmuyor, bu yüzden hissiz geliyor.

MISS TİPLERİ:

TİP A — BOŞA ATMA (balık yokken suya girer):
  — Hook suya girince normal splash
  — 1.5sn sonra otomatik geri çekilir
  — Geri çekilirken su damlası efekti:
    3 küçük mavi daire yukarı fırlar
  — Ses: "splash" (hafif, tatminsiz ton)

TİP B — NEREDEYSE YAKALADIM (balık çok yakın):
  Bu durumu tespit et: hook balığa 
  30px'den yakın geçip çarpmadıysa
  — Hook hafif titrer (2px, 0.1sn)  
  — Balık hızlanır (1sn için +50% hız)
  — Kısa "whoosh" efekti: balığın 
    hareket yönünde 3 çizgi (motion blur)
    0.2sn görünür
  — Ses: "swoosh" (kaçış hissi)

TİP C — ENGELE ÇARPMA (kelp, kaya, coral):
  Sea Kelp:
  — Hook "boing" gibi durur
  — Kelp sağa-sola 3 kez sallanır
    (±15px, 0.4sn decay)
  — Yeşil yaprak partikülleri: 3 adet
  
  Sea Rock:
  — Sert "klank" hissi
  — Ekran micro-shake: ±2px, 2 frame
  — Kıvılcım partikülleri: 4 sarı nokta
    dışa fırlar, 0.2sn kaybolur
  
  Coral:
  — En dramatik miss efekti
  — Kırmızı flash overlay: %25 opacity
    0.1sn (tehlike rengi)
  — Ekran shake: ±5px, 3 frame
  — Mercan kırık partikülleri: 5 turuncu
    küçük parça
  — Olta hakkı -1 animasyonu:
    HUD'daki kanca ikonu titreyerek
    grileşir (scale 1→1.3→0.6, 0.3sn)

KOMUT BLOĞU 4: Olta Geri Dönüş Animasyonu
GÖREV: Hook geri dönerken de animasyon 
olmalı. Şu an lineer geri geliyor.

GERI DÖNÜŞ FİZİĞİ:

1. SU ÇIKIŞ ANI:
   Hook su yüzeyini geçerken:
   — Küçük su sıçraması: 4 su damlası
     (teardrop şekil, mavi-beyaz)
     yukarı-dışa fırlar, 0.35sn arc
   — Su yüzeyinde çıkış halkası:
     1 circle dışa genişler, fade out

2. HAVA'DA GERI DÖNÜŞ:
   Hook havadayken misina gergi hissi:
   — Hook önce overshoot eder:
     hedef noktayı 10px geçer
   — Sonra geri yay gibi döner (spring)
   — Toplam süre: 0.3sn
   — Easing: ease-out-back

3. BALIKLI DÖNÜŞ:
   Balık yakalandıysa hook+balık birlikte:
   — Balık scale: normal → 0.6
     (uzaklaşıyor gibi görünür)
   — Yukarı çıkarken kısa joy trail:
     3-4 küçük balığın rengiyle eşleşen
     daire, her 4 frame'de bir spawn,
     yerinde kalıp fade out
   — Tekneye ulaşınca:
     Balık scale 0.6→0 (tekneye girer)
     Tekne hafif aşağı-yukarı bob:
     +4px Y, 0.2sn, bounce back
     (ağırlık bindi hissi)

KOMUT BLOĞU 5: Sürekli Oyun İçi Juice
GÖREV: Oyun idle anlarında da canlı 
hissettirmeli. Aşağıdaki ambient 
animasyonları ekle:

1. TEKNENİN SU SALINTISI:
   Tekne Y pozisyonu:
   sin(time * 0.04) * 2.5 px
   (zaten var gibi, kontrol et)
   Tekne rotation de ekle:
   sin(time * 0.035) * 0.8 derece
   (hafif yalpalama)

2. OLTANİN SALINTISI:
   Olta çubuğu ucu hafif titrer:
   tipX += sin(time * 3) * 1.5px
   tipY += cos(time * 2.3) * 1px
   (canlı olta hissi)

3. SU YÜZEYİ:
   Her 3-4 saniyede rastgele pozisyonda
   küçük "blip" efekti: 
   Küçük daire (8px) belirir, dışa 
   genişler (8→20px), 0.6sn fade out
   (Balık yüzeye vuruyor hissi)

4. BALIK HAREKET İZİ:
   Hızlı balıklar (Zap, Tide, King)
   geçerken 3 frame'lik motion trail:
   Her frame balığın önceki pozisyonunda
   opacity 0.3, 0.15, 0.05 kopyası
   (hız hissi)

5. AĞIRLIK ALARMI PULSE:
   Kapasite %85+ olduğunda:
   Ağırlık bar her 1sn'de
   scale 1→1.05→1 pulse yapar
   Rengi: yeşil → sarı → turuncu → kırmızı
   (kalp atışı gibi)

6. ZAMANLAYICI GERİLİMİ:
   Son 10 saniyede:
   Timer text her saniyede scale 1→1.2→1
   Renk: normal → kırmızı
   Hafif ekran vignette: kenarlar 
   kararır (%15 opacity siyah gradient)

KOMUT BLOĞU 6: Ses Sync (Görsel-Ses Eşleşmesi)
GÖREV: Ses olmasa bile görsel timing'i 
ses olacakmış gibi ayarla. Ses eklenince
otomatik sync olsun.

GÖRSEL TİMING REFERANSLARI:
(Ses eklendiğinde bu frame'lerde çalmalı)

Frame 0  : Hook fırlatma → "fwoosh"
Frame X  : Hook suya giriş → "splash"  
Frame X+8: Balık yakalama → "catch thud"
Frame X+9: Partikül patlaması → "sparkle"
Frame X+10: Kart popup → "ding"
Frame X+30: Hook geri dönüş → "whoosh"
Frame X+38: Tekne bob → "thud" (hafif)

Coral çarpma Frame 0 → "crack"
Coral çarpma Frame 1 → "pain sting"
Kelp takılma Frame 0 → "boing"
Rock çarpma Frame 0 → "clank"

KOMUT BLOĞU 7: Antigravity'e Özet Komut
Yukarıdaki tüm sistemleri şu öncelik 
sırasıyla uygula:

ÖNCELİK 1 (en önemli, hemen uygula):
  ✓ Hit-stop effect (0.06sn dondurma)
  ✓ Ekran shake (balık büyüklüğüne göre)
  ✓ Su giriş/çıkış splash efekti
  ✓ Tekneye ulaşma bob animasyonu

ÖNCELİK 2 (sonra uygula):
  ✓ Balık direniş animasyonu
  ✓ Impact frame renk flaşı
  ✓ Miss feedback (kelp/kaya/coral)
  ✓ Olta misina fizik (bezier trailing)

ÖNCELİK 3 (son olarak):
  ✓ Ambient juice efektleri
  ✓ Motion trail hızlı balıklar
  ✓ Timer gerilim animasyonu
  ✓ King Fish LEGENDARY efekti

Her öncelik grubunu bitirince test et,
sonra sıradakine geç.