const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Burç hesaplama fonksiyonu
function getZodiacSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'koç';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'boğa';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'ikizler';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'yengeç';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'aslan';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'başak';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'terazi';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'akrep';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'yay';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'oğlak';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'kova';
  return 'balık'; // (month === 2 && day >= 19) || (month === 3 && day <= 20)
}

// Burçlara göre özel mesajlar
const zodiacMessages = {
  koç: {
    personality: "Cesur ve enerjik bir lider",
    message: "Senin ateşli ruhun ve liderlik özelliklerin, etrafındaki herkesi harekete geçiriyor. Senin cesaretin ve kararlılığın, başkalarına ilham veriyor.",
    strength: "Senin en büyük gücün, zorluklar karşısında asla pes etmemek ve her zaman ileriye doğru hareket etmek.",
    purpose: "Senin amacın, başkalarına cesaret vermek ve onların potansiyellerini keşfetmelerine yardım etmek."
  },
  boğa: {
    personality: "Güvenilir ve kararlı bir dost",
    message: "Senin sabırın ve güvenilirliğin, etrafındaki insanlara güven veriyor. Senin kararlılığın ve pratik yaklaşımın, herkesin güvendiği bir liman.",
    strength: "Senin en büyük gücün, zor zamanlarda bile sakin kalabilmek ve başkalarına destek olmak.",
    purpose: "Senin amacın, etrafındaki insanlara güvenli bir ortam yaratmak ve onların büyümelerine yardım etmek."
  },
  ikizler: {
    personality: "Meraklı ve iletişim becerileri yüksek bir öğrenci",
    message: "Senin merakın ve iletişim becerilerin, bilgiyi paylaşarak başkalarının hayatlarını zenginleştiriyor. Senin esnekliğin ve uyum yeteneğin, her ortamda değer yaratıyor.",
    strength: "Senin en büyük gücün, farklı bakış açılarını anlayabilmek ve insanları bir araya getirebilmek.",
    purpose: "Senin amacın, bilgiyi paylaşmak ve insanlar arasında köprüler kurmak."
  },
  yengeç: {
    personality: "Şefkatli ve koruyucu bir aile üyesi",
    message: "Senin şefkatin ve koruyucu doğan, etrafındaki herkesi güvende hissettiriyor. Senin sezgilerin ve duygusal zekan, başkalarının ihtiyaçlarını anlamanı sağlıyor.",
    strength: "Senin en büyük gücün, başkalarının duygularını anlayabilmek ve onlara destek olabilmek.",
    purpose: "Senin amacın, etrafındaki insanlara güvenli bir sığınak olmak ve onların duygusal ihtiyaçlarını karşılamak."
  },
  aslan: {
    personality: "Karizmatik ve yaratıcı bir lider",
    message: "Senin karizman ve yaratıcılığın, her ortamı aydınlatıyor. Senin cömertliğin ve liderlik özelliklerin, başkalarının en iyi versiyonlarını ortaya çıkarıyor.",
    strength: "Senin en büyük gücün, insanları bir araya getirebilmek ve onlara ilham verebilmek.",
    purpose: "Senin amacın, başkalarına ilham vermek ve onların potansiyellerini keşfetmelerine yardım etmek."
  },
  başak: {
    personality: "Dikkatli ve yardımsever bir organizatör",
    message: "Senin dikkatli yaklaşımın ve yardımsever doğan, herkesin hayatını daha düzenli ve anlamlı hale getiriyor. Senin pratik zekan ve detaylara olan dikkatin, mükemmelliği getiriyor.",
    strength: "Senin en büyük gücün, karmaşık durumları düzenleyebilmek ve başkalarına yardım edebilmek.",
    purpose: "Senin amacın, düzeni sağlamak ve başkalarının hayatlarını kolaylaştırmak."
  },
  terazi: {
    personality: "Adil ve uyumlu bir barışçı",
    message: "Senin adalet duygun ve uyum arayışın, her ortamda dengeyi sağlıyor. Senin diplomatik yaklaşımın ve güzellik anlayışın, dünyayı daha güzel bir yer yapıyor.",
    strength: "Senin en büyük gücün, farklı bakış açılarını birleştirebilmek ve uyum yaratabilmek.",
    purpose: "Senin amacın, adaleti sağlamak ve insanlar arasında uyum yaratmak."
  },
  akrep: {
    personality: "Güçlü ve sezgili bir araştırmacı",
    message: "Senin derin sezgilerin ve güçlü iraden, gerçeği ortaya çıkarıyor. Senin sadakatin ve yoğun duyguların, anlamlı bağlantılar yaratıyor.",
    strength: "Senin en büyük gücün, derinlemesine anlayış ve dönüştürücü değişim yaratabilmek.",
    purpose: "Senin amacın, gerçeği aramak ve başkalarının iç dünyalarını anlamalarına yardım etmek."
  },
  yay: {
    personality: "Özgür ruhlu ve filozofik bir gezgin",
    message: "Senin özgür ruhun ve filozofik yaklaşımın, başkalarına yeni perspektifler açıyor. Senin iyimserliğin ve macera ruhun, herkesi harekete geçiriyor.",
    strength: "Senin en büyük gücün, büyük resmi görebilmek ve başkalarına umut verebilmek.",
    purpose: "Senin amacın, bilgiyi paylaşmak ve başkalarına yeni ufuklar açmak."
  },
  oğlak: {
    personality: "Kararlı ve sorumluluk sahibi bir yönetici",
    message: "Senin kararlılığın ve sorumluluk duygun, güvenilir bir temel oluşturuyor. Senin pratik yaklaşımın ve uzun vadeli düşüncen, sürdürülebilir başarılar yaratıyor.",
    strength: "Senin en büyük gücün, hedeflere odaklanabilmek ve başkalarına rehberlik edebilmek.",
    purpose: "Senin amacın, sağlam temeller oluşturmak ve başkalarına güvenilir bir rehber olmak."
  },
  kova: {
    personality: "Yenilikçi ve insancıl bir vizyoner",
    message: "Senin yenilikçi düşüncelerin ve insancıl yaklaşımın, dünyayı daha iyi bir yer yapıyor. Senin özgünlüğün ve vizyonun, geleceği şekillendiriyor.",
    strength: "Senin en büyük gücün, farklı düşünebilmek ve toplumsal değişim yaratabilmek.",
    purpose: "Senin amacın, yenilikler yaratmak ve insanlığın ilerlemesine katkıda bulunmak."
  },
  balık: {
    personality: "Sezgili ve merhametli bir ruh",
    message: "Senin sezgilerin ve merhametli doğan, etrafındaki herkesi anlayışla karşılıyor. Senin yaratıcılığın ve ruhani derinliğin, dünyaya güzellik katıyor.",
    strength: "Senin en büyük gücün, başkalarının acılarını hissedebilmek ve onlara şifa verebilmek.",
    purpose: "Senin amacın, şifa vermek ve dünyaya güzellik katmak."
  }
};

// Doğum günü mesajları
const birthdayMessages = [
  "İyi ki doğdun! Senin varlığın bu dünyayı daha güzel bir yer yapıyor.",
  "Bugün senin günün! Her nefesin, her gülümsemen bir armağan.",
  "Doğum günün kutlu olsun! Seninle aynı zamanda yaşamak bir şans.",
  "İyi ki varsın! Senin gibi bir insanın bu dünyada olması bir mucize.",
  "Bugün senin özel günün! Senin varlığın birçok hayatı aydınlatıyor.",
  "Doğum günün kutlu olsun! Senin gibi değerli bir insanın varlığı bir lütuf.",
  "İyi ki doğdun! Senin gülümsemen dünyayı güzelleştiriyor.",
  "Bugün senin günün! Senin varlığın birçok kişiye ilham veriyor.",
  "Doğum günün kutlu olsun! Senin gibi özel bir insanın varlığı bir hediye.",
  "İyi ki varsın! Seninle aynı zamanda yaşamak bir ayrıcalık."
];

// Yaşam amacı mesajları
const lifePurposeMessages = [
  "Senin amacın başkalarına ilham vermek ve onların hayatlarını güzelleştirmek.",
  "Senin varlığın, etrafındaki insanlara umut ve güç veriyor.",
  "Senin amacın, dünyayı daha iyi bir yer yapmak için çaba göstermek.",
  "Senin varlığın, başkalarının hayatlarında pozitif değişim yaratıyor.",
  "Senin amacın, sevgi ve şefkatle dolu bir dünya yaratmaya katkıda bulunmak.",
  "Senin varlığın, etrafındaki insanlara güç ve cesaret veriyor.",
  "Senin amacın, başkalarının potansiyellerini keşfetmelerine yardım etmek.",
  "Senin varlığın, dünyayı daha güzel bir yer yapıyor.",
  "Senin amacın, sevgi ve anlayışla dolu ilişkiler kurmak.",
  "Senin varlığın, başkalarının hayatlarında anlamlı farklar yaratıyor."
];

// Hassasiyet türleri
const sensitivityTypes = [
  { id: 'religious', name: 'Dini Hassasiyetler', description: 'Dini inançlar ve değerler' },
  { id: 'cultural', name: 'Kültürel Hassasiyetler', description: 'Kültürel değerler ve gelenekler' },
  { id: 'psychological', name: 'Psikolojik Hassasiyetler', description: 'Duygusal ve psikolojik durumlar' },
  { id: 'personal', name: 'Kişisel Hassasiyetler', description: 'Kişisel tercihler ve sınırlar' },
  { id: 'none', name: 'Hassasiyet Yok', description: 'Özel bir hassasiyetim yok' }
];

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ message: 'Doğum Günü Web Sitesi API' });
});

// Hassasiyet türlerini getir
app.get('/api/sensitivities', (req, res) => {
  res.json(sensitivityTypes);
});

// Kişiselleştirilmiş doğum günü mesajı
app.post('/api/birthday-message', (req, res) => {
  const { name, birthDate, sensitivities } = req.body;
  
  if (!name || !birthDate) {
    return res.status(400).json({ error: 'İsim ve doğum tarihi gerekli' });
  }

  // Doğum tarihinden burç hesapla
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // JavaScript'te aylar 0'dan başlar
  const day = date.getDate();
  const zodiacSign = getZodiacSign(month, day);
  const zodiacInfo = zodiacMessages[zodiacSign];

  // Rastgele mesaj seç
  const randomBirthdayMessage = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
  const randomLifePurposeMessage = lifePurposeMessages[Math.floor(Math.random() * lifePurposeMessages.length)];

  // Kişiselleştirilmiş mesaj oluştur
  const personalizedMessage = {
    greeting: `Hoş geldin, ${name}! Bugün senin özel günün! 🎉`,
    birthdayMessage: randomBirthdayMessage,
    lifePurpose: randomLifePurposeMessage,
    zodiac: {
      sign: zodiacSign,
      name: zodiacInfo.personality,
      message: zodiacInfo.message,
      strength: zodiacInfo.strength,
      purpose: zodiacInfo.purpose
    },
    sensitivities: sensitivities || [],
    timestamp: new Date().toISOString()
  };

  res.json(personalizedMessage);
});

// Sürpriz mesajlar
app.get('/api/surprises/:name', (req, res) => {
  const { name } = req.params;
  
  const surprises = [
    {
      type: 'poem',
      title: 'Senin İçin Bir Şiir',
      content: `${name}, senin gülümsemen güneş gibi parlar,\nHer sabah yeni umutlar getirir,\nSenin varlığın bir armağan,\nBu dünyayı güzelleştiren bir hazine.`
    },
    {
      type: 'quote',
      title: 'Senin İçin Bir Alıntı',
      content: '"Her insan, dünyaya getirdiği özel bir armağandır." - Senin varlığın bu sözün en güzel örneği.'
    },
    {
      type: 'meditation',
      title: 'Bugün İçin Meditasyon',
      content: 'Bugün kendine 5 dakika ayır ve şunu düşün: Senin varlığın kaç kişinin hayatını güzelleştirdi?'
    }
  ];

  const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
  
  res.json({
    name,
    surprise: randomSurprise
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 