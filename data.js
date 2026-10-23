/* ============================================================
   Nepal Spice — menu data & translations  (classroom demo)
   Real dish names / descriptions in English, Japanese, Nepali.
   Prices in JPY, typical of Nepali restaurants in Japan.
   ============================================================ */

var CATEGORIES = [
  { id: "momo",   name: { en: "Momo & Dumplings",  ja: "モモ・餃子",            ne: "मःमः" } },
  { id: "rice",   name: { en: "Rice & Curry Sets", ja: "ご飯・カレーセット",     ne: "भात र करी" } },
  { id: "noodle", name: { en: "Noodles & Soup",    ja: "麺・スープ",             ne: "नुडल र सुप" } },
  { id: "snack",  name: { en: "Snacks & Grill",    ja: "スナック・グリル",       ne: "खाजा र सेकुवा" } },
  { id: "drink",  name: { en: "Drinks & Sweets",   ja: "ドリンク・スイーツ",     ne: "पेय र मिठाई" } }
];

/* spice: 0 mild .. 3 hot | veg: true = vegetarian | kcal per serving | time in minutes
   rating / reviews are sample demo values shown in the UI                        */
var FOODS = [
  {
    id: "chicken_momo", cat: "momo", img: "images/chicken_momo.jpg",
    price: 780, kcal: 320, time: 15, spice: 1, veg: false,
    rating: 4.8, reviews: 412, tags: ["popular"], allergens: ["gluten", "sesame"],
    name: { en: "Chicken Momo (6 pcs)", ja: "チキンモモ（6個）", ne: "चिकेन मःमः (६ वटा)" },
    desc: {
      en: "Six hand-folded steamed dumplings filled with minced chicken, onion and ginger, served with tomato-sesame achar.",
      ja: "鶏ひき肉と玉ねぎ、生姜を包んで蒸した手包み餃子。トマトとゴマのアチャール（つけダレ）付き。",
      ne: "कुखुराको किमा, प्याज र अदुवा भरेर हातले बेरेर बाफमा पकाइएका मःमः। टमाटर-भटमासको अचारसँग।"
    }
  },
  {
    id: "veg_momo", cat: "momo", img: "images/veg_momo.jpg",
    price: 700, kcal: 280, time: 14, spice: 1, veg: true,
    rating: 4.6, reviews: 268, tags: ["veg"], allergens: ["gluten"],
    name: { en: "Veg Momo (6 pcs)", ja: "ベジモモ（6個）", ne: "सादा मःमः (६ वटा)" },
    desc: {
      en: "Steamed dumplings stuffed with cabbage, carrot, onion and spring onion — a light, fully vegetarian classic.",
      ja: "キャベツ、にんじん、ねぎを包んだ蒸し餃子。あっさりした野菜だけの定番。",
      ne: "काउली, गार्जर, प्याज र सलायुक्त बाफेको मःमः। शाकाहारीका लागि हल्का र लोकप्रिय।"
    }
  },
  {
    id: "buff_momo", cat: "momo", img: "images/buff_momo.jpg",
    price: 820, kcal: 340, time: 15, spice: 2, veg: false,
    rating: 4.7, reviews: 356, tags: ["authentic"], allergens: ["gluten"],
    name: { en: "Buff Momo (6 pcs)", ja: "バフモモ（水牛・6個）", ne: "भेंसीको मःमः (६ वटा)" },
    desc: {
      en: "The original Kathmandu street-food momo, filled with lean buffalo meat and timur (Nepali pepper). Juicy and bold.",
      ja: "カトマンズの屋台発祥、水牛肉とティムール（ネパール山椒）入りの元祖モモ。ジューシーで力強い味。",
      ne: "काठमाडौंको खाजा घरबाट सुरु भएको भेंसीको मासु र तिमुर हालेको मौलिक मःमः। रसिलो र बलियो स्वाद।"
    }
  },
  {
    id: "jhol_momo", cat: "momo", img: "images/jhol_momo.jpg",
    price: 880, kcal: 390, time: 18, spice: 2, veg: false,
    rating: 4.9, reviews: 301, tags: ["popular", "seasonal"], allergens: ["gluten", "sesame"],
    name: { en: "Jhol Momo (6 pcs)", ja: "ジョルモモ（6個）", ne: "झोल मःमः (६ वटा)" },
    desc: {
      en: "Steamed momos bathed in a warm, tangy broth of tomato, sesame and local spices — Kathmandu's winter favourite.",
      ja: "蒸しモモをトマトとゴマ、スパイスの温かい酸味あるスープに浸した一品。冬の定番。",
      ne: "बाफेको मःमःलाई टमाटर, भटमास र मसलाको न्यानो, अमिलो झोलमा डुबाइएको। जाडोयामको विशेष।"
    }
  },
  {
    id: "chilli_momo", cat: "momo", img: "images/chilli_momo.jpg",
    price: 920, kcal: 430, time: 16, spice: 3, veg: false,
    rating: 4.5, reviews: 189, tags: ["spicy"], allergens: ["gluten", "soy"],
    name: { en: "Chilli Momo (C-Momo)", ja: "チリモモ（Cモモ）", ne: "चिल्ली मःमः" },
    desc: {
      en: "Pan-fried momos tossed with capsicum, onion and a sticky hot chilli-garlic glaze. Fiery and addictive.",
      ja: "焼きモモをピーマン、玉ねぎと共に辛いチリニンニクだれで炒めた一品。癖になる辛さ。",
      ne: "प्यान्मा भुटेको मःमःलाई खुर्सानी-लसुनको पिरो झोलमा तरकारीसँग भुटेको। पिरो मन पराउनेका लागि।"
    }
  },
  {
    id: "dal_bhat", cat: "rice", img: "images/dal_bhat.jpg",
    price: 1180, kcal: 720, time: 20, spice: 1, veg: true,
    rating: 4.9, reviews: 528, tags: ["popular", "refill"], allergens: [],
    name: { en: "Dal Bhat Tarkari Set", ja: "ダルバートタルカリセット", ne: "दालभात तरकारी सेट" },
    desc: {
      en: "Nepal's national meal: steamed rice, lentil soup, seasonal vegetable curry, saag, pickle and papad. Free refills of rice and dal.",
      ja: "ネパールの国民食。ご飯、豆スープ、季節の野菜カレー、サグ、アチャール、パパド。ご飯とダルはおかわり自由。",
      ne: "नेपालको राष्ट्रिय खाना: भात, दाल, मौसमी तरकारी, साग, अचार र पापड। भात र दाल निःशुल्क थप्न मिल्ने।"
    }
  },
  {
    id: "chicken_curry", cat: "rice", img: "images/chicken_curry.jpg",
    price: 1050, kcal: 680, time: 22, spice: 2, veg: false,
    rating: 4.7, reviews: 344, tags: [], allergens: [],
    name: { en: "Chicken Curry Set", ja: "チキンカレーセット", ne: "कुखुराको करी सेट" },
    desc: {
      en: "Bone-in chicken simmered in a gravy of onion, tomato, ginger-garlic and Nepali garam masala, served with steamed rice.",
      ja: "骨付き鶏肉を玉ねぎ・トマト・生姜ニンニクとネパール風ガラムマサラで煮込み、ご飯と一緒にご提供。",
      ne: "हाडसहितको कुखुरा प्याज, टमाटर, अदुवा-लसुन र मसलाको झोलमा पकाएर भातसँग।"
    }
  },
  {
    id: "mutton_curry", cat: "rice", img: "images/mutton_curry.jpg",
    price: 1380, kcal: 760, time: 30, spice: 2, veg: false,
    rating: 4.8, reviews: 276, tags: ["chef"], allergens: [],
    name: { en: "Khasi ko Masu (Mutton Curry)", ja: "カシコマス（マトンカレー）", ne: "खसीको मासु" },
    desc: {
      en: "Slow-cooked goat meat in a rich, fragrant Nepali masala gravy. A celebratory dish served with rice or roti.",
      ja: "山羊の肉を濃厚で香り高いネパール風マサラでじっくり煮込んだ祝いの日の一品。ご飯やロティと。",
      ne: "खसीको मासु मसलाको गाढा झोलमा बिस्तारै पकाइएको विशेष परिकार। भात वा रोटीसँग।"
    }
  },
  {
    id: "veg_thali", cat: "rice", img: "images/veg_thali.jpg",
    price: 1080, kcal: 640, time: 18, spice: 1, veg: true,
    rating: 4.6, reviews: 214, tags: ["veg"], allergens: ["dairy", "gluten"],
    name: { en: "Sabji Thali (Vegetarian)", ja: "サブジターリ（ベジタリアン）", ne: "साब्जी थाली (शाकाहारी)" },
    desc: {
      en: "A colourful vegetarian plate: paneer or seasonal sabji, dal, saag, achaar, papad, rice and roti.",
      ja: "野菜中心のカラフルなプレート：パニールまたは季節のサブジ、ダル、サグ、アチャール、パパド、ご飯、ロティ。",
      ne: "शाकाहारी थाली: पनिर वा मौसमी तरकारी, दाल, साग, अचार, पापड, भात र रोटी।"
    }
  },
  {
    id: "biryani", cat: "rice", img: "images/biryani.jpg",
    price: 1150, kcal: 780, time: 25, spice: 2, veg: false,
    rating: 4.6, reviews: 198, tags: [], allergens: ["dairy"],
    name: { en: "Nepali Chicken Biryani", ja: "ネパール風チキンビリヤニ", ne: "नेपाली चिकेन बिरयानी" },
    desc: {
      en: "Fragrant basmati rice layered with marinated chicken, fried onion, mint and whole spices, cooked Nepali home style.",
      ja: "マリネした鶏肉とバスマティライス、揚げ玉ねぎ、ミント、ホールスパイスを重ねたネパール家庭風のビリヤニ。",
      ne: "मसलामा डुबाएको कुखुरा, बासमती चामल, भुटेको प्याज र पिना हालेर घरै शैलीमा पकाइएको बिरयानी।"
    }
  },
  {
    id: "chowmein", cat: "noodle", img: "images/chowmein.jpg",
    price: 850, kcal: 560, time: 12, spice: 1, veg: false,
    rating: 4.5, reviews: 302, tags: [], allergens: ["gluten", "soy"],
    name: { en: "Nepali Chowmein", ja: "ネパール風チャウミン", ne: "नेपाली चाउमिन" },
    desc: {
      en: "Wok-tossed noodles with chicken or vegetables, spring onion and soy — the most-loved street food of Nepali towns.",
      ja: "麺を鶏肉または野菜、ねぎ、醤油と共に強火で炒めた、ネパールの町で一番愛される屋台料理。",
      ne: "चाउचाउलाई कुखुरा वा तरकारी, सलायुक्त सयासँग भुटेको। नेपाली सहरको सबैभन्दा मन पराइएको खाजा।"
    }
  },
  {
    id: "thukpa", cat: "noodle", img: "images/thukpa.jpg",
    price: 920, kcal: 480, time: 16, spice: 1, veg: false,
    rating: 4.6, reviews: 176, tags: [], allergens: ["gluten"],
    name: { en: "Chicken Thukpa", ja: "チキンツクパ", ne: "कुखुराको थुक्पा" },
    desc: {
      en: "A comforting Himalayan noodle soup with chicken, vegetables and a light, peppery broth from the mountain kitchens.",
      ja: "山の台所から生まれた、鶏肉と野菜入りのやさしいコショウ風味の麺スープ。心温まるヒマラヤの味。",
      ne: "हिमाली भान्साको कुखुरा र तरकारीसहितको हल्का, पिरो झोल भएको न्यानो नुडल सुप।"
    }
  },
  {
    id: "waiwai", cat: "noodle", img: "images/waiwai.jpg",
    price: 600, kcal: 380, time: 8, spice: 2, veg: true,
    rating: 4.7, reviews: 241, tags: ["popular", "veg"], allergens: ["gluten"],
    name: { en: "Sadeko Wai Wai", ja: "サデコ・ワイワイ", ne: "सडेको वाईवाई" },
    desc: {
      en: "Nepal's cult snack: Wai Wai noodles tossed with onion, tomato, lemon, chilli and coriander. No cooking, all flavour.",
      ja: "ネパールの定番スナック。揚げ麺「ワイワイ」を玉ねぎ、トマト、レモン、唐辛子、コリアンダーと和えたサラダ。",
      ne: "नेपालको प्रिय खाजा: वाईवाई नुडललाई प्याज, टमाटर, कागती, खुर्सानी र धनियासँग मिलाएको।"
    }
  },
  {
    id: "sekuwa", cat: "snack", img: "images/sekuwa.jpg",
    price: 980, kcal: 420, time: 20, spice: 2, veg: false,
    rating: 4.8, reviews: 289, tags: ["popular"], allergens: [],
    name: { en: "Chicken Sekuwa (skewers)", ja: "チキンセクワ（串焼き）", ne: "कुखुराको सेकुवा" },
    desc: {
      en: "Char-grilled skewers of marinated chicken, smoky and juicy, finished with timur and lemon. Newar-style barbecue.",
      ja: "マリネした鶏肉を炭火で香ばしく焼いた串焼き。ティムールとレモンをかけたネワール風バーベキュー。",
      ne: "मसलामा डुबाएको कुखुरा काठको कोइलामा पोलेर तिमुर र कागती हालेको नेवारी शैलीको सेकुवा।"
    }
  },
  {
    id: "samosa", cat: "snack", img: "images/samosa.jpg",
    price: 450, kcal: 340, time: 10, spice: 1, veg: true,
    rating: 4.4, reviews: 167, tags: ["veg"], allergens: ["gluten"],
    name: { en: "Samosa (2 pcs)", ja: "サモサ（2個）", ne: "समोसा (२ वटा)" },
    desc: {
      en: "Crispy fried pastry triangles filled with spiced potato and peas, served with tamarind and mint chutney.",
      ja: "スパイスの効いたジャガイモとグリーンピースを包んで揚げたサクサクの三角パイ。チャトニー2種付き。",
      ne: "मसलेदार आलु र केराउ भरेर तारिएको कुरकुरे समोसा। इमली र पुदिनाको चटनीसँग।"
    }
  },
  {
    id: "chhoyela", cat: "snack", img: "images/chhoyela.jpg",
    price: 880, kcal: 360, time: 18, spice: 3, veg: false,
    rating: 4.6, reviews: 143, tags: ["spicy"], allergens: ["mustard"],
    name: { en: "Chicken Chhoyela", ja: "チキンチョエラ", ne: "कुखुराको छोइला" },
    desc: {
      en: "Newari salad of flame-grilled chicken shredded with mustard oil, garlic, chilli and herbs. Smoky, hot and fragrant.",
      ja: "直火焼き鶏肉をマスタードオイル、ニンニク、唐辛子、ハーブで和えたネワール風サラダ。スモーキーで辛い。",
      ne: "पोलेको कुखुराको मासु तोरीको तेल, लसुन, खुर्सानी र हरियो मसलासँग मिलाएको नेवारी खाजा।"
    }
  },
  {
    id: "chatamari", cat: "snack", img: "images/chatamari.jpg",
    price: 780, kcal: 450, time: 15, spice: 1, veg: false,
    rating: 4.5, reviews: 132, tags: ["authentic"], allergens: ["egg", "gluten"],
    name: { en: "Chatamari (rice crepe)", ja: "チャタマリ（米クレープ）", ne: "चतामरी" },
    desc: {
      en: "A thin rice-flour crepe topped with minced chicken, egg and vegetables — the famous “Nepali pizza” of the Kathmandu Valley.",
      ja: "米粉の薄いクレープに鶏ひき肉、卵、野菜をのせたカトマンズ谷の名物「ネパリ・ピザ」。",
      ne: "चामलको पिठोको पातलो रोटीमा कुखुराको किमा, अन्डा र तरकारी राखेको काठमाडौं उपत्यकाको प्रसिद्ध खाजा।"
    }
  },
  {
    id: "lassi", cat: "drink", img: "images/lassi.jpg",
    price: 450, kcal: 260, time: 5, spice: 0, veg: true,
    rating: 4.7, reviews: 205, tags: ["veg"], allergens: ["dairy"],
    name: { en: "Mango Lassi", ja: "マンゴーラッシー", ne: "म्याङ्गो लस्सी" },
    desc: {
      en: "Thick chilled yogurt blended with sweet mango pulp and a hint of cardamom.",
      ja: "濃厚なヨーグルトに甘いマンゴーピューレとカルダモンを混ぜた冷たいドリンク。",
      ne: "बाक्लो दहीमा मिठो आँपको गुदी र अलैंची मिसाएर बनाइएको चिसो पेय।"
    }
  },
  {
    id: "chiya", cat: "drink", img: "images/chiya.jpg",
    price: 380, kcal: 140, time: 6, spice: 0, veg: true,
    rating: 4.8, reviews: 187, tags: ["veg"], allergens: ["dairy"],
    name: { en: "Masala Chiya (milk tea)", ja: "マサラチヤ（ミルクティー）", ne: "मसाला चिया" },
    desc: {
      en: "Nepali milk tea simmered with cardamom, cinnamon, ginger and cloves — sweet, spiced and served hot.",
      ja: "カルダモン、シナモン、生姜、クローブで煮出したネパールの甘いスパイスミルクティー。",
      ne: "अलैंची, दालचिनी, अदुवा र ल्वाङ हालेर पकाइएको मिठो, मसलेदार न्यानो दूध चिया।"
    }
  },
  {
    id: "yomari", cat: "drink", img: "images/yomari.jpg",
    price: 520, kcal: 300, time: 12, spice: 0, veg: true,
    rating: 4.6, reviews: 98, tags: ["authentic", "veg", "seasonal"], allergens: ["sesame"],
    name: { en: "Yomari (sweet dumpling)", ja: "ヨマリ（甘い蒸し団子）", ne: "योमरी" },
    desc: {
      en: "A fig-shaped steamed rice-flour dumpling filled with sweet chaku (molasses) and sesame — a Newar festival treat.",
      ja: "米粉の生地をイチジク形に蒸し、甘いチャク（黒糖蜜）とゴマを詰めたネワール族の祭りのお菓子。",
      ne: "चामलको पिठोलाई अन्जीर आकारमा बाफेर चाकु र भटमास भरेको नेवारी मिठाई।"
    }
  }
];

/* ---- Restaurant business rules used by the checkout (demo values) ---- */
var RESTAURANT = {
  currency: "¥",
  deliveryFee: 300,          // JPY, waived above freeDeliveryFrom
  freeDeliveryFrom: 2500,    // JPY
  taxTakeout: 0.08,          // Japan reduced consumption tax (takeout)
  taxDineIn: 0.10,           // Japan standard consumption tax (dine-in)
  etaMin: 30, etaMax: 45
};

/* ---- UI strings (English / Japanese / Nepali) ---- */
var I18N = {
  en: {
    welcome: "Welcome", language: "Language", logout: "Logout", theme: "Theme",
    menuTitle: "Our Menu", menuSub: "Handmade Nepali dishes, cooked to order.",
    searchPh: "Search dishes…", all: "All", sort: "Sort",
    sortPopular: "Most popular", sortRating: "Top rated", sortPriceAsc: "Price: low → high", sortPriceDesc: "Price: high → low",
    vegOnly: "Vegetarian only", veg: "VEG", kcal: "kcal", min: "min",
    add: "Add", details: "Details", close: "Close", qty: "Qty", remove: "Remove",
    cart: "Your cart", cartEmpty: "Your cart is empty", cartEmptySub: "Add something delicious from the menu.",
    items: "items", subtotal: "Subtotal", tax: "Consumption tax", taxMode: "Tax mode",
    takeout: "Takeout (8%)", dinein: "Dine-in (10%)", delivery: "Delivery fee", free: "FREE",
    freeHint: "Free delivery over ¥2,500", total: "Total", order: "Place order", clear: "Clear cart",
    checkout: "Checkout", orderSummary: "Order summary", fullName: "Full name", phone: "Phone number",
    postal: "Postal code", address: "Delivery address", notes: "Delivery notes (optional)", payment: "Payment method",
    cash: "Cash on delivery (demo)", card: "Card payment (simulation only)",
    demoWarning: "Demo only. No real payment or delivery. Do not enter actual card information.",
    confirm: "Confirm order", cancel: "Cancel", need: "Please add food to your cart first.",
    orders: "Orders", orderHistory: "Order history", noOrders: "No orders yet in this browser.",
    orderId: "Order", date: "Date", payment2: "Payment",
    heroTitle: "Authentic Nepali taste, delivered warm.",
    heroSub: "Momo, dal bhat, sekuwa and more — handmade daily in our Kathmandu-style kitchen.",
    statDelivery: "30–45 min delivery", statRating: "4.7 ★ average rating", statFree: "Free delivery over ¥2,500",
    toastAdded: "added to cart", toastRemoved: "removed from cart", toastCleared: "Cart cleared",
    orderPlaced: "Demo order confirmed!", orderConfirmed: "Thank you! This is a demo receipt — no payment was processed.",
    continueShopping: "Continue browsing",
    spice: "Spice level", allergens: "Allergens", none: "none", prep: "Prep time", rating: "Rating", reviews: "reviews",
    tag_popular: "Popular", tag_new: "New", tag_chef: "Chef's pick", tag_authentic: "Traditional", tag_spicy: "Spicy",
    tag_veg: "Veg", tag_seasonal: "Seasonal", tag_refill: "Free refills",
    resultsNone: "No dishes match your filters.", clearFilters: "Clear filters"
  },
  ja: {
    welcome: "ようこそ", language: "言語", logout: "ログアウト", theme: "テーマ",
    menuTitle: "メニュー", menuSub: "注文後に調理する手作りのネパール料理。",
    searchPh: "料理を検索…", all: "すべて", sort: "並び替え",
    sortPopular: "人気順", sortRating: "評価順", sortPriceAsc: "価格: 安い順", sortPriceDesc: "価格: 高い順",
    vegOnly: "ベジタリアンのみ", veg: "ベジ", kcal: "kcal", min: "分",
    add: "追加", details: "詳細", close: "閉じる", qty: "数量", remove: "削除",
    cart: "カート", cartEmpty: "カートは空です", cartEmptySub: "メニューからおいしそうな一品を追加してください。",
    items: "点", subtotal: "小計", tax: "消費税", taxMode: "税区分",
    takeout: "持ち帰り (8%)", dinein: "店内飲食 (10%)", delivery: "配達料", free: "無料",
    freeHint: "¥2,500 以上で配達無料", total: "合計", order: "注文する", clear: "カートを空にする",
    checkout: "お届け先・お支払い", orderSummary: "注文内容", fullName: "お名前", phone: "電話番号",
    postal: "郵便番号", address: "お届け先住所", notes: "配達メモ（任意）", payment: "お支払い方法",
    cash: "代金引換（デモ）", card: "カード決済（シミュレーションのみ）",
    demoWarning: "デモ版です。実際の決済・配達は行われません。カード情報を入力しないでください。",
    confirm: "注文を確定する", cancel: "キャンセル", need: "先に商品をカートへ追加してください。",
    orders: "注文履歴", orderHistory: "注文履歴", noOrders: "このブラウザにはまだ注文がありません。",
    orderId: "注文番号", date: "日時", payment2: "支払い",
    heroTitle: "本格ネパールの味を、あたたかいまま。",
    heroSub: "モモ、ダルバート、セクワなど——カトマンズ風の厨房で毎日手作りしています。",
    statDelivery: "配達 30〜45分", statRating: "平均 4.7 ★", statFree: "¥2,500 以上で配達無料",
    toastAdded: "をカートに追加しました", toastRemoved: "をカートから削除しました", toastCleared: "カートを空にしました",
    orderPlaced: "デモ注文を受け付けました！", orderConfirmed: "ありがとうございます。これはデモのレシートです（決済は行っていません）。",
    continueShopping: "メニューに戻る",
    spice: "辛さ", allergens: "アレルゲン", none: "なし", prep: "調理時間", rating: "評価", reviews: "件の評価",
    tag_popular: "人気", tag_new: "新着", tag_chef: "シェフのおすすめ", tag_authentic: "伝統", tag_spicy: "辛い",
    tag_veg: "ベジ", tag_seasonal: "季節", tag_refill: "おかわり自由",
    resultsNone: "条件に合う料理がありません。", clearFilters: "フィルター解除"
  },
  ne: {
    welcome: "स्वागत छ", language: "भाषा", logout: "लगआउट", theme: "थिम",
    menuTitle: "हाम्रो मेनु", menuSub: "अर्डरपछि ताजा बनाइने हाते नेपाली परिकार।",
    searchPh: "परिकार खोज्नुहोस्…", all: "सबै", sort: "क्रम",
    sortPopular: "लोकप्रिय", sortRating: "उच्च मूल्याङ्कन", sortPriceAsc: "मूल्य: कमदेखि", sortPriceDesc: "मूल्य: बढीदेखि",
    vegOnly: "शाकाहारी मात्र", veg: "साकाहारी", kcal: "kcal", min: "मिनेट",
    add: "थप्नुहोस्", details: "विवरण", close: "बन्द", qty: "संख्या", remove: "हटाउनुहोस्",
    cart: "तपाईंको कार्ट", cartEmpty: "कार्ट खाली छ", cartEmptySub: "मेनुबाट मनपर्ने परिकार थप्नुहोस्।",
    items: "वस्तु", subtotal: "उप-जम्मा", tax: "खपत कर", taxMode: "कर प्रकार",
    takeout: "टेकअवे (८%)", dinein: "भित्र खाने (१०%)", delivery: "डेलिभरी शुल्क", free: "निःशुल्क",
    freeHint: "¥२,५०० माथि निःशुल्क डेलिभरी", total: "जम्मा", order: "अर्डर गर्नुहोस्", clear: "कार्ट खाली",
    checkout: "ठेगाना र भुक्तानी", orderSummary: "अर्डर विवरण", fullName: "पूरा नाम", phone: "फोन नम्बर",
    postal: "पोस्टल कोड", address: "डेलिभरी ठेगाना", notes: "डेलिभरी नोट (वैकल्पिक)", payment: "भुक्तानी विधि",
    cash: "डेलिभरीमा नगद (डेमो)", card: "कार्ड भुक्तानी (डेमो मात्र)",
    demoWarning: "यो डेमो हो। वास्तविक भुक्तानी वा डेलिभरी हुँदैन। कार्ड विवरण नराख्नुहोस्।",
    confirm: "अर्डर पक्का गर्नुहोस्", cancel: "रद्द गर्नुहोस्", need: "पहिले कार्टमा खाना थप्नुहोस्।",
    orders: "अर्डरहरू", orderHistory: "अर्डर इतिहास", noOrders: "यस ब्राउजरमा अझै अर्डर छैन।",
    orderId: "अर्डर नम्बर", date: "मिति", payment2: "भुक्तानी",
    heroTitle: "नेपाली स्वाद, न्यानो रूपमा डेलिभरी।",
    heroSub: "मःमः, दालभात, सेकुवा आदि — काठमाडौं शैलीको भान्सामा हरेक दिन हाते।",
    statDelivery: "डेलिभरी ३०–४५ मिनेट", statRating: "औसत ४.७ ★", statFree: "¥२,५०० माथि निःशुल्क डेलिभरी",
    toastAdded: "कार्टमा थपियो", toastRemoved: "कार्टबाट हटाइयो", toastCleared: "कार्ट खाली भयो",
    orderPlaced: "डेमो अर्डर स्वीकार भयो!", orderConfirmed: "धन्यवाद! यो डेमो रसिद हो (कुनै भुक्तानी भएको छैन)।",
    continueShopping: "मेनुमा फर्कनुहोस्",
    spice: "पिरोपन", allergens: "एलर्जेन", none: "कुनै छैन", prep: "समय", rating: "मूल्याङ्कन", reviews: "समीक्षा",
    tag_popular: "लोकप्रिय", tag_new: "नयाँ", tag_chef: "सेफको रोजाइ", tag_authentic: "परम्परागत", tag_spicy: "पिरो",
    tag_veg: "शाकाहारी", tag_seasonal: "मौसमी", tag_refill: "निःशुल्क थप",
    resultsNone: "कुनै परिकार भेटिएन।", clearFilters: "फिल्टर हटाउनुहोस्"
  }
};
