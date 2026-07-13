import React, { useState, useMemo, useEffect } from "react";import { storage as firebaseStorage, compressImage } from "./firebase";

if (typeof window !== "undefined") {
  window.storage = firebaseStorage;
}

import { Plus, Minus, X, Check, ArrowRight, Globe, Leaf, MessageCircle, Bell } from "lucide-react";

const PRODUCT_BASE = [
  { id: "p1", jp: "抹茶 特級", price: 890, tone: "#5C6E36", icon: "powder" },
  { id: "p2", jp: "抹茶 家庭用", price: 450, tone: "#7C8F4A", icon: "powder" },
  { id: "p3", jp: "抹茶ラテキット", price: 690, tone: "#8FA25E", icon: "latte" },
  { id: "p4", jp: "茶筅", price: 590, tone: "#A9B47C", icon: "whisk" },
  { id: "p5", jp: "茶碗", price: 1290, tone: "#4A5A2A", icon: "bowl" },
  { id: "p6", jp: "玄米茶", price: 320, tone: "#6E7F42", icon: "genmai" },
];

const PRODUCT_TEXT = {
  th: {
    p1: { name: "มัทฉะเกรดพิธีการ", desc: "คั่วบดหินจากอุจิ รสละมุน หวานปลายลิ้น" },
    p2: { name: "มัทฉะเกรดคุลินารี", desc: "เหมาะทำลาเต้ ขนม และเบเกอรี่" },
    p3: { name: "ชุดชงมัทฉะลาเต้", desc: "มัทฉะ + นมข้นจืดผง + ช้อนตวง ครบชุด" },
    p4: { name: "ฉะเซ็น หวีไม้ไผ่", desc: "หวีตีมัทฉะมือ 80 เส้น จากไม้ไผ่คาโกชิม่า" },
    p5: { name: "ชะวัน ถ้วยชา", desc: "ถ้วยเซรามิกเคลือบมือ ก้นกว้างสำหรับตีฟอง" },
    p6: { name: "เก็นไมฉะ", desc: "ใบชาเขียวคั่วข้าวกล้องคั่ว หอมกรุ่น" },
  },
  ja: {
    p1: { name: "抹茶 特級", desc: "宇治の石臼挽き。まろやかで後味の甘い一杯。" },
    p2: { name: "抹茶 家庭用", desc: "ラテやお菓子、焼き菓子にぴったり。" },
    p3: { name: "抹茶ラテキット", desc: "抹茶 + 粉ミルク + 計量スプーンのセット。" },
    p4: { name: "茶筅（ちゃせん）", desc: "鹿児島産の竹で作られた80本立ての茶筅。" },
    p5: { name: "茶碗", desc: "手作り陶器、泡立てやすい広口デザイン。" },
    p6: { name: "玄米茶", desc: "香ばしい炒り玄米入りの緑茶。" },
  },
  en: {
    p1: { name: "Ceremonial Grade Matcha", desc: "Stone-ground in Uji. Smooth with a sweet finish." },
    p2: { name: "Culinary Grade Matcha", desc: "Perfect for lattes, desserts, and baking." },
    p3: { name: "Matcha Latte Kit", desc: "Matcha + milk powder + measuring scoop, all included." },
    p4: { name: "Chasen Bamboo Whisk", desc: "80-prong hand-carved whisk from Kagoshima bamboo." },
    p5: { name: "Chawan Tea Bowl", desc: "Hand-glazed ceramic bowl with a wide base for whisking." },
    p6: { name: "Genmaicha", desc: "Green tea blended with roasted brown rice." },
  },
};

const TR = {
  th: {
    langName: "TH",
    cart: "ตะกร้า",
    eyebrow: "抹茶•Sarisa",
    heroTitle: "ชาเขียวแท้ จากไร่สู่ถ้วย",
    heroSub: "คัดสรรมัทฉะและใบชาคุณภาพจากไร่ในเกียวโต ตีฟองละเอียด หอมชื่นใจทุกจิบ",
    heroCta: "เลือกซื้อสินค้า",
    sectionEyebrow: "OUR SELECTION",
    sectionTitle: "สินค้าแนะนำ",
    addAria: "เพิ่มลงตะกร้า",
    note: "เว็บนี้เป็นตัวอย่างหน้าร้าน — ระบบตะกร้าและฟอร์มสั่งซื้อทำงานได้จริงในหน้านี้ แต่ยังไม่ได้เชื่อมต่อระบบชำระเงินจริง เปิดขายเฉพาะหน้าร้าน สั่งแล้วมารอรับของได้เลย",
    contactTitle: "ช่องทางติดต่อ",
    contactSub: "ทักหาเราได้ทุกช่องทาง",
    drawerTitleCart: "ตะกร้าของคุณ",
    drawerTitleForm: "ข้อมูลผู้สั่งซื้อ",
    drawerTitleDone: "สั่งซื้อสำเร็จ",
    empty: "ยังไม่มีสินค้าในตะกร้า",
    total: "รวมทั้งหมด",
    goCheckout: "ดำเนินการสั่งซื้อ",
    labelName: "ชื่อผู้รับ",
    placeholderName: "ชื่อ-นามสกุล",
    labelPhone: "เบอร์โทร",
    placeholderPhone: "08x-xxx-xxxx",
    hoursNote: "เปิดเฉพาะวันอาทิตย์ 09:00 – 18:00 น.",
    labelPickupDate: "วันที่มารับ",
    labelPickupTime: "เวลาที่มารับ",
    backToCart: "‹ กลับไปที่ตะกร้า",
    amountDue: "ยอดชำระหน้าร้าน",
    confirmOrder: "ยืนยันคำสั่งซื้อ",
    thankYou: (name, date, time) => `ขอบคุณสำหรับคำสั่งซื้อ คุณ${name} กรุณามารับสินค้าที่ร้านวันที่ ${date} เวลา ${time} น. พร้อมแจ้งเลขที่คำสั่งซื้อกับพนักงาน`,
    orderNo: "เลขที่คำสั่งซื้อ",
    continueShopping: "กลับไปเลือกซื้อต่อ",
    locationEyebrow: "VISIT US",
    locationTitle: "ที่ตั้งร้าน",
    locationAddress: "45-2 คามิมาจิ 2-โจเมะ เมืองเฮกินัง จังหวัดไอจิ 447-0074 ประเทศญี่ปุ่น",
    getDirections: "นำทางไป Google Maps",
    locationHoursLabel: "เวลาทำการ",
    locationHours: "เปิดเฉพาะวันอาทิตย์ 09:00 – 18:00 น.",
    locationPhoneLabel: "โทร",
    locationPhone: "02-123-4567 (ตัวอย่าง)",
  },
  ja: {
    langName: "JA",
    cart: "カート",
    eyebrow: "抹茶•Sarisa",
    heroTitle: "畑からお椀へ、本物の緑茶",
    heroSub: "京都の茶畑から厳選した抹茶と茶葉。きめ細かく点てて、香り豊かな一杯を。",
    heroCta: "商品を見る",
    sectionEyebrow: "OUR SELECTION",
    sectionTitle: "おすすめ商品",
    addAria: "カートに追加",
    note: "こちらはデモ用のオンラインストアです。カートと注文フォームは実際に動作しますが、決済はまだ連携されていません。店頭受け取り専用の販売です。ご注文後は店舗にてお受け取りください。",
    contactTitle: "お問い合わせ",
    contactSub: "お気軽にご連絡ください",
    drawerTitleCart: "カートの中身",
    drawerTitleForm: "ご注文者情報",
    drawerTitleDone: "注文完了",
    empty: "カートに商品がありません",
    total: "合計",
    goCheckout: "注文手続きへ",
    labelName: "お名前",
    placeholderName: "山田 太郎",
    labelPhone: "電話番号",
    placeholderPhone: "090-1234-5678",
    hoursNote: "営業時間：日曜日のみ 9:00〜18:00",
    labelPickupDate: "受け取り日",
    labelPickupTime: "受け取り時間",
    backToCart: "‹ カートに戻る",
    amountDue: "店頭でのお支払い金額",
    confirmOrder: "注文を確定する",
    thankYou: (name, date, time) => `${name} 様、ご注文ありがとうございます。${date} ${time} に店頭でご注文番号をお伝えください。`,
    orderNo: "注文番号",
    continueShopping: "買い物を続ける",
    locationEyebrow: "VISIT US",
    locationTitle: "店舗情報",
    locationAddress: "〒447-0074 愛知県碧南市上町2丁目45-2",
    getDirections: "Googleマップで経路を見る",
    locationHoursLabel: "営業時間",
    locationHours: "日曜日のみ 9:00〜18:00",
    locationPhoneLabel: "電話",
    locationPhone: "02-123-4567（例）",
  },
  en: {
    langName: "EN",
    cart: "Cart",
    eyebrow: "抹茶•Sarisa",
    heroTitle: "Real Green Tea, From Field to Bowl",
    heroSub: "Matcha and tea leaves selected from Kyoto tea fields, whisked fine for a fragrant cup every time.",
    heroCta: "Shop Products",
    sectionEyebrow: "OUR SELECTION",
    sectionTitle: "Featured Products",
    addAria: "Add to cart",
    note: "This is a demo storefront — the cart and order form work fully on this page, but no real payment gateway is connected yet. In-store pickup only: place your order here, then collect it at the shop.",
    contactTitle: "Get in Touch",
    contactSub: "Reach us on any of these channels",
    drawerTitleCart: "Your Cart",
    drawerTitleForm: "Your Details",
    drawerTitleDone: "Order Confirmed",
    empty: "Your cart is empty",
    total: "Total",
    goCheckout: "Proceed to Order",
    labelName: "Recipient Name",
    placeholderName: "Full name",
    labelPhone: "Phone Number",
    placeholderPhone: "080-000-0000",
    hoursNote: "Open Sundays only, 9:00 AM – 6:00 PM",
    labelPickupDate: "Pickup Date",
    labelPickupTime: "Pickup Time",
    backToCart: "‹ Back to cart",
    amountDue: "Amount Due In-Store",
    confirmOrder: "Confirm Order",
    thankYou: (name, date, time) => `Thank you for your order, ${name}. Please pick up on ${date} at ${time} and show your order number in-store.`,
    orderNo: "Order Number",
    continueShopping: "Continue Shopping",
    locationEyebrow: "VISIT US",
    locationTitle: "Store Location",
    locationAddress: "45-2 Kamimachi 2-chome, Hekinan City, Aichi 447-0074, Japan",
    getDirections: "Get Directions on Google Maps",
    locationHoursLabel: "Hours",
    locationHours: "Sundays only, 9:00 AM – 6:00 PM",
    locationPhoneLabel: "Phone",
    locationPhone: "02-123-4567 (sample)",
  },
};

const OWNER_TR = {
  th: {
    loginTitle: "เข้าสู่ระบบเจ้าของร้าน",
    loginSub: "กรอกรหัส PIN เพื่อดูรายการออเดอร์",
    pinPlaceholder: "PIN",
    pinError: "รหัส PIN ไม่ถูกต้อง",
    loginBtn: "เข้าสู่ระบบ",
    backToShop: "‹ กลับไปหน้าร้าน",
    dashTitle: "แดชบอร์ดร้าน",
    addMenuBtn: "เพิ่มเมนู",
    logoutBtn: "ออกจากระบบ",
    siteOwnerBtn: "เจ้าของเว็บไซต์",
    changePinBtn: "เปลี่ยน PIN",
    changePinTitle: "เปลี่ยนรหัส PIN",
    currentPinLabel: "PIN ปัจจุบัน",
    newPinLabel: "PIN ใหม่",
    confirmPinLabel: "ยืนยัน PIN ใหม่",
    changePinSubmit: "บันทึก PIN ใหม่",
    pinChangeSuccess: "เปลี่ยน PIN สำเร็จแล้ว",
    pinCurrentWrong: "รหัส PIN ปัจจุบันไม่ถูกต้อง",
    pinTooShort: "PIN ใหม่ต้องมีอย่างน้อย 4 หลัก",
    pinMismatch: "PIN ใหม่ที่ยืนยันไม่ตรงกัน",
    qrBtn: "คิวอาร์โค้ด",
    qrTitle: "คิวอาร์โค้ดร้าน",
    qrUrlLabel: "ลิงก์เว็บไซต์",
    qrUrlPlaceholder: "วางลิงก์เว็บไซต์ที่นี่",
    qrDownload: "ดาวน์โหลดรูปคิวอาร์โค้ด",
    qrNote: "ลูกค้าสแกนคิวอาร์โค้ดนี้แล้วจะเข้าหน้าร้านได้ทันที ใส่ลิงก์เว็บไซต์จริงหลังอัปโหลดขึ้นโฮสติ้งแล้ว",
    ordersBtn: "รายการออเดอร์",
    ordersHint: 'กดปุ่ม "รายการออเดอร์" มุมขวาบนเพื่อดูออเดอร์ลูกค้า',
    loading: "กำลังโหลด...",
    errorPrefix: "เกิดข้อผิดพลาด: ",
    noOrders: "ยังไม่มีออเดอร์เข้ามา",
    customerLabel: "ลูกค้า",
    pickupLabel: "มารับ",
    received: "✓ รับของแล้ว",
    markReceived: "ทำเครื่องหมายว่ารับของแล้ว",
    shopName: "ชื่อร้าน",
    hours: "เวลาทำการ",
    address: "ที่อยู่",
    phone: "โทร",
    editProfileBtn: "แก้ไขข้อมูลร้าน",
    saveBtn: "บันทึก",
    cancelBtn: "ยกเลิก",
    saving: "กำลังบันทึก...",
    addProductTitle: "เพิ่มเมนู",
    backToOrders: "‹ กลับไปดูออเดอร์",
    menuNameLabel: "ชื่อเมนู",
    menuNamePlaceholder: "เช่น มัทฉะโฮจิฉะลาเต้",
    menuDescLabel: "คำอธิบายสั้นๆ",
    menuDescPlaceholder: "รายละเอียดสินค้า",
    priceLabel: "ราคา (เยน)",
    pricePlaceholder: "เช่น 450",
    image43Label: "รูปภาพเมนู อัตราส่วน 4:3 (แนวตั้ง)",
    image916Label: "รูปภาพเมนู อัตราส่วน 9:16 (แนวตั้ง)",
    removeImage: "ลบรูป",
    addMenuSubmit: "เพิ่มเมนูนี้",
    langNote: "เมนูที่เพิ่มจะแสดงในภาษาเดียว (ไทย) ทุกภาษาไปก่อน หากต้องการแปลครบ 3 ภาษา บอกได้ครับ",
    allMenuTitle: "เมนูทั้งหมดในร้าน",
    editBtn: "แก้ไข",
    hideBtn: "ลบ",
    showBtn: "กู้คืน",
    deleteBtn: "ลบ",
    hiddenTag: " · ถูกลบ",
    billingTitle: "ค่าเช่าเว็บไซต์",
    backToDash: "‹ กลับไปแดชบอร์ด",
    monthlyPlan: "แพ็กเกจรายเดือน",
    yearlyPlan: "แพ็กเกจรายปี",
    bankLabel: "ธนาคาร",
    accountNoLabel: "เลขบัญชี",
    accountNameLabel: "ชื่อบัญชี",
    billingNote: "ข้อมูลนี้เป็นตัวอย่างทั้งหมด บอกเลขบัญชีจริง ราคาแพ็กเกจจริง มาได้เลยครับ จะแก้ให้ตรง",
  },
  ja: {
    loginTitle: "オーナーログイン",
    loginSub: "注文一覧を見るにはPINを入力してください",
    pinPlaceholder: "PIN",
    pinError: "PINが間違っています",
    loginBtn: "ログイン",
    backToShop: "‹ ショップに戻る",
    dashTitle: "店舗ダッシュボード",
    addMenuBtn: "メニュー追加",
    logoutBtn: "ログアウト",
    siteOwnerBtn: "サイト運営者",
    changePinBtn: "PIN変更",
    changePinTitle: "PINを変更",
    currentPinLabel: "現在のPIN",
    newPinLabel: "新しいPIN",
    confirmPinLabel: "新しいPIN（確認）",
    changePinSubmit: "新しいPINを保存",
    pinChangeSuccess: "PINを変更しました",
    pinCurrentWrong: "現在のPINが正しくありません",
    pinTooShort: "新しいPINは4桁以上にしてください",
    pinMismatch: "確認用PINが一致しません",
    qrBtn: "QRコード",
    qrTitle: "店舗のQRコード",
    qrUrlLabel: "ウェブサイトのリンク",
    qrUrlPlaceholder: "ウェブサイトのリンクを入力",
    qrDownload: "QRコード画像をダウンロード",
    qrNote: "お客様がこのQRコードをスキャンすると店舗ページに直接アクセスできます。ホスティング後の実際のURLを入力してください。",
    ordersBtn: "注文一覧",
    ordersHint: "右上の「注文一覧」ボタンを押すとお客様の注文が表示されます",
    loading: "読み込み中...",
    errorPrefix: "エラー: ",
    noOrders: "まだ注文がありません",
    customerLabel: "お客様",
    pickupLabel: "受け取り",
    received: "✓ 受け渡し済み",
    markReceived: "受け渡し済みにする",
    shopName: "店名",
    hours: "営業時間",
    address: "住所",
    phone: "電話",
    editProfileBtn: "店舗情報を編集",
    saveBtn: "保存",
    cancelBtn: "キャンセル",
    saving: "保存中...",
    addProductTitle: "メニュー追加",
    backToOrders: "‹ 注文一覧に戻る",
    menuNameLabel: "メニュー名",
    menuNamePlaceholder: "例: 抹茶ほうじ茶ラテ",
    menuDescLabel: "簡単な説明",
    menuDescPlaceholder: "商品の詳細",
    priceLabel: "価格（円）",
    pricePlaceholder: "例: 450",
    image43Label: "メニュー画像 縦長4:3",
    image916Label: "メニュー画像 縦長9:16",
    removeImage: "画像を削除",
    addMenuSubmit: "このメニューを追加",
    langNote: "追加したメニューは当面タイ語のみで全言語に表示されます。3言語対応が必要な場合はお知らせください。",
    allMenuTitle: "店舗の全メニュー",
    editBtn: "編集",
    hideBtn: "削除",
    showBtn: "復元",
    deleteBtn: "削除",
    hiddenTag: " · 削除済み",
    billingTitle: "サイト利用料",
    backToDash: "‹ ダッシュボードに戻る",
    monthlyPlan: "月額プラン",
    yearlyPlan: "年額プラン",
    bankLabel: "銀行",
    accountNoLabel: "口座番号",
    accountNameLabel: "口座名義",
    billingNote: "この情報はすべて例です。実際の口座番号やプラン料金を教えていただければ反映します。",
  },
  en: {
    loginTitle: "Owner Login",
    loginSub: "Enter your PIN to view orders",
    pinPlaceholder: "PIN",
    pinError: "Incorrect PIN",
    loginBtn: "Log In",
    backToShop: "‹ Back to shop",
    dashTitle: "Shop Dashboard",
    addMenuBtn: "Add Item",
    logoutBtn: "Log Out",
    siteOwnerBtn: "Site Owner",
    changePinBtn: "Change PIN",
    changePinTitle: "Change PIN",
    currentPinLabel: "Current PIN",
    newPinLabel: "New PIN",
    confirmPinLabel: "Confirm new PIN",
    changePinSubmit: "Save new PIN",
    pinChangeSuccess: "PIN changed successfully",
    pinCurrentWrong: "Current PIN is incorrect",
    pinTooShort: "New PIN must be at least 4 digits",
    pinMismatch: "New PIN confirmation doesn't match",
    qrBtn: "QR Code",
    qrTitle: "Shop QR Code",
    qrUrlLabel: "Website link",
    qrUrlPlaceholder: "Paste your website link here",
    qrDownload: "Download QR code image",
    qrNote: "Customers who scan this QR code will go straight to your shop page. Enter your real URL once it's hosted live.",
    ordersBtn: "Orders",
    ordersHint: 'Tap the "Orders" button top-right to view customer orders',
    loading: "Loading...",
    errorPrefix: "Error: ",
    noOrders: "No orders yet",
    customerLabel: "Customer",
    pickupLabel: "Pickup",
    received: "✓ Picked up",
    markReceived: "Mark as picked up",
    shopName: "Shop name",
    hours: "Hours",
    address: "Address",
    phone: "Phone",
    editProfileBtn: "Edit shop details",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    saving: "Saving...",
    addProductTitle: "Add Menu Item",
    backToOrders: "‹ Back to orders",
    menuNameLabel: "Item name",
    menuNamePlaceholder: "e.g. Matcha Hojicha Latte",
    menuDescLabel: "Short description",
    menuDescPlaceholder: "Product details",
    priceLabel: "Price (yen)",
    pricePlaceholder: "e.g. 450",
    image43Label: "Item photo, 4:3 portrait",
    image916Label: "Item photo, 9:16 portrait",
    removeImage: "Remove photo",
    addMenuSubmit: "Add this item",
    langNote: "New items currently show in Thai only across all languages. Let me know if you'd like full 3-language translation.",
    allMenuTitle: "All items in the shop",
    editBtn: "Edit",
    hideBtn: "Delete",
    showBtn: "Restore",
    deleteBtn: "Delete",
    hiddenTag: " · deleted",
    billingTitle: "Website Rental",
    backToDash: "‹ Back to dashboard",
    monthlyPlan: "Monthly plan",
    yearlyPlan: "Yearly plan",
    bankLabel: "Bank",
    accountNoLabel: "Account number",
    accountNameLabel: "Account name",
    billingNote: "This is all placeholder info. Share the real account number and plan pricing and I'll update it.",
  },
};

const fmt = (n) => n.toLocaleString("en-US");

function Steam() {
  return (
    <svg className="steam" width="60" height="90" viewBox="0 0 60 90" fill="none">
      <path d="M15 85C15 85 5 65 15 50C25 35 15 20 15 5" stroke="#EEE8D8" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" className="wisp wisp-a"/>
      <path d="M35 85C35 85 25 62 35 45C45 28 35 15 35 2" stroke="#EEE8D8" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" className="wisp wisp-b"/>
      <path d="M50 85C50 85 42 68 50 55C58 42 50 25 50 8" stroke="#EEE8D8" strokeOpacity="0.2" strokeWidth="3" strokeLinecap="round" className="wisp wisp-c"/>
    </svg>
  );
}

function BowlIcon({ fillRatio }) {
  const clampedFill = Math.max(0, Math.min(1, fillRatio));
  return (
    <div className="bowl-wrap">
      <svg width="30" height="26" viewBox="0 0 30 26">
        <defs>
          <clipPath id="bowlClip">
            <path d="M2 10 Q15 24 28 10 L26 8 Q15 20 4 8 Z" />
          </clipPath>
        </defs>
        <path d="M2 10 Q15 24 28 10" stroke="#26231C" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="0" y={10 - clampedFill * 10} width="30" height="14" fill="#7C8F4A" clipPath="url(#bowlClip)" />
      </svg>
    </div>
  );
}

function ProductIcon({ type }) {
  const common = { width: 64, height: 64, viewBox: "0 0 64 64", fill: "none" };
  if (type === "powder") {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="46" rx="20" ry="6" fill="#EEE8D8" fillOpacity="0.25" />
        <path d="M14 46V26a4 4 0 014-4h28a4 4 0 014 4v20" stroke="#EEE8D8" strokeWidth="2" strokeOpacity="0.8" fill="none" />
        <path d="M14 26c6 4 30 4 36 0" stroke="#EEE8D8" strokeWidth="2" strokeOpacity="0.5" fill="none" />
        <ellipse cx="32" cy="24" rx="14" ry="5" fill="#EEE8D8" fillOpacity="0.9" />
        <circle cx="26" cy="23" r="1.4" fill="#3E4A26" />
        <circle cx="32" cy="25" r="1.4" fill="#3E4A26" />
        <circle cx="38" cy="22" r="1.4" fill="#3E4A26" />
      </svg>
    );
  }
  if (type === "latte") {
    return (
      <svg {...common}>
        <path d="M18 26h28l-3 26a4 4 0 01-4 4H25a4 4 0 01-4-4l-3-26z" stroke="#EEE8D8" strokeWidth="2" fill="none" />
        <path d="M46 30h4a6 6 0 010 12h-3" stroke="#EEE8D8" strokeWidth="2" fill="none" />
        <ellipse cx="32" cy="26" rx="14" ry="4" fill="#EEE8D8" fillOpacity="0.85" />
        <path d="M24 16c1 2-2 3-1 6M32 14c1 2-2 3-1 6M40 16c1 2-2 3-1 6" stroke="#EEE8D8" strokeWidth="1.6" strokeOpacity="0.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "whisk") {
    return (
      <svg {...common}>
        <path d="M32 10v18" stroke="#EEE8D8" strokeWidth="3" strokeLinecap="round" />
        {[-16,-11,-6,-1,4,9,14].map((dx,i) => (
          <path key={i} d={`M32 28 C ${32+dx} 34, ${32+dx*1.3} 46, ${32+dx*0.6} 54`} stroke="#EEE8D8" strokeOpacity="0.7" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        ))}
        <rect x="27" y="6" width="10" height="8" rx="3" fill="#EEE8D8" fillOpacity="0.9" />
      </svg>
    );
  }
  if (type === "bowl") {
    return (
      <svg {...common}>
        <path d="M12 28c0 14 9 24 20 24s20-10 20-24" stroke="#EEE8D8" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="28" rx="20" ry="5" fill="#EEE8D8" fillOpacity="0.85" />
        <ellipse cx="32" cy="27" rx="12" ry="3" fill="#3E4A26" fillOpacity="0.4" />
      </svg>
    );
  }
  // genmai — tea leaves + rice grains
  return (
    <svg {...common}>
      <path d="M20 40c-6-8-4-18 6-24 2 8-2 12-6 24z" fill="#EEE8D8" fillOpacity="0.85" />
      <path d="M44 40c6-8 4-18-6-24-2 8 2 12 6 24z" fill="#EEE8D8" fillOpacity="0.7" />
      {[[26,44],[30,47],[34,44],[38,47],[24,50],[40,50]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx="3" ry="1.6" fill="#EEE8D8" fillOpacity="0.9" transform={`rotate(20 ${x} ${y})`} />
      ))}
    </svg>
  );
}

const LOCALE_MAP = { th: "th-TH", ja: "ja-JP", en: "en-US" };

function buildDateOptions(lang) {
  const opts = [];
  const now = new Date();
  for (let i = 0, found = 0; found < 4 && i < 60; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0) continue; // Sunday only
    const value = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(LOCALE_MAP[lang], { weekday: "short", month: "short", day: "numeric" });
    opts.push({ value, label });
    found++;
  }
  return opts;
}

function buildTimeOptions(lang) {
  const opts = [];
  for (let h = 9; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) continue;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const d = new Date();
      d.setHours(h, m, 0, 0);
      const label = d.toLocaleTimeString(LOCALE_MAP[lang], { hour: "2-digit", minute: "2-digit" });
      opts.push({ value, label });
    }
  }
  return opts;
}

const DEFAULT_OWNER_PIN = "1234";

async function loadOwnerPin() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("owner-pin", true);
    return res ? res.value : DEFAULT_OWNER_PIN;
  } catch (e) {
    return DEFAULT_OWNER_PIN;
  }
}

async function saveOwnerPin(pin) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("owner-pin", pin, true);
  return !!result;
}


function readFileAsDataURL(file) {
  return compressImage(file);
}


async function loadOrders() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("orders-list", true);
    return res ? JSON.parse(res.value) : [];
  } catch (e) {
    if (String(e).toLowerCase().includes("not found") || String(e).toLowerCase().includes("no such")) {
      return [];
    }
    return [];
  }
}

async function saveOrders(orders) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("orders-list", JSON.stringify(orders), true);
  return !!result;
}

async function loadCustomProducts() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("custom-products", true);
    return res ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}

async function saveCustomProducts(list) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("custom-products", JSON.stringify(list), true);
  return !!result;
}

async function loadHiddenIds() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("hidden-products", true);
    return res ? JSON.parse(res.value) : [];
  } catch (e) {
    return [];
  }
}

async function saveHiddenIds(ids) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("hidden-products", JSON.stringify(ids), true);
  return !!result;
}

async function loadOverrides() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("product-overrides", true);
    return res ? JSON.parse(res.value) : {};
  } catch (e) {
    return {};
  }
}

async function saveOverrides(map) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("product-overrides", JSON.stringify(map), true);
  return !!result;
}

const DEFAULT_SHOP_PROFILE = {
  name: "抹茶 Sarisa",
  hours: "เปิดเฉพาะวันอาทิตย์ 09:00 – 18:00 น.",
  address: "45-2 คามิมาจิ 2-โจเมะ เมืองเฮกินัง จังหวัดไอจิ 447-0074 ประเทศญี่ปุ่น",
  phone: "02-123-4567 (ตัวอย่าง)",
  line: "@sarisamatcha",
};

async function loadShopProfile() {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  try {
    const res = await window.storage.get("shop-profile", true);
    return res ? { ...DEFAULT_SHOP_PROFILE, ...JSON.parse(res.value) } : DEFAULT_SHOP_PROFILE;
  } catch (e) {
    return DEFAULT_SHOP_PROFILE;
  }
}

async function saveShopProfile(profile) {
  if (typeof window === "undefined" || !window.storage) {
    throw new Error("window.storage is not available in this environment");
  }
  const result = await window.storage.set("shop-profile", JSON.stringify(profile), true);
  return !!result;
}

export default function MatchaShop() {
  const [lang, setLang] = useState("th");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const logoTapRef = React.useRef({ count: 0, timer: null });
  const handleLogoTap = () => {
    const ref = logoTapRef.current;
    ref.count += 1;
    if (ref.timer) clearTimeout(ref.timer);
    ref.timer = setTimeout(() => { ref.count = 0; }, 1200);
    if (ref.count >= 5) {
      ref.count = 0;
      setMode("owner-login");
    }
  };
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [form, setForm] = useState({ name: "", phone: "", pickupDate: "", pickupTime: "" });
  const [orderNo, setOrderNo] = useState(null);
  const [mode, setMode] = useState("shop"); // shop | owner-login | owner-dashboard
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [customProducts, setCustomProducts] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", desc: "", price: "", icon: "powder", image43: "", image916: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [menuActionError, setMenuActionError] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", desc: "", price: "", icon: "powder", image43: "", image916: "" });
  const [productError, setProductError] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [shopProfile, setShopProfile] = useState(DEFAULT_SHOP_PROFILE);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(DEFAULT_SHOP_PROFILE);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [ownerPin, setOwnerPin] = useState(DEFAULT_OWNER_PIN);
  const [pinChangeForm, setPinChangeForm] = useState({ current: "", next: "", confirm: "" });
  const [pinChangeError, setPinChangeError] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeSaving, setPinChangeSaving] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));

  useEffect(() => {
    loadCustomProducts().then(setCustomProducts).catch(() => {});
    loadHiddenIds().then(setHiddenIds).catch(() => {});
    loadOverrides().then(setOverrides).catch(() => {});
    loadShopProfile().then(setShopProfile).catch(() => {});
    loadOwnerPin().then(setOwnerPin).catch(() => {});
  }, []);

  const changePin = async (e) => {
    e.preventDefault();
    setPinChangeError("");
    setPinChangeSuccess(false);
    if (pinChangeForm.current !== ownerPin) {
      setPinChangeError(OWNER_TR[lang].pinCurrentWrong);
      return;
    }
    if (!pinChangeForm.next || pinChangeForm.next.length < 4) {
      setPinChangeError(OWNER_TR[lang].pinTooShort);
      return;
    }
    if (pinChangeForm.next !== pinChangeForm.confirm) {
      setPinChangeError(OWNER_TR[lang].pinMismatch);
      return;
    }
    setPinChangeSaving(true);
    try {
      const ok = await saveOwnerPin(pinChangeForm.next);
      if (!ok) throw new Error("save failed");
      setOwnerPin(pinChangeForm.next);
      setPinChangeForm({ current: "", next: "", confirm: "" });
      setPinChangeSuccess(true);
    } catch (err) {
      setPinChangeError(err && err.message ? err.message : String(err));
    } finally {
      setPinChangeSaving(false);
    }
  };


  const startEditProfile = () => {
    setProfileDraft(shopProfile);
    setEditingProfile(true);
    setProfileError("");
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileError("");
    try {
      const ok = await saveShopProfile(profileDraft);
      if (!ok) throw new Error("save failed");
      setShopProfile(profileDraft);
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err && err.message ? err.message : String(err));
    } finally {
      setProfileSaving(false);
    }
  };


  const t = TR[lang];
  const ot = OWNER_TR[lang];
  const allProducts = [
    ...PRODUCT_BASE.map((p) => ({ ...p, ...PRODUCT_TEXT[lang][p.id], ...(overrides[p.id] || {}) })),
    ...customProducts.map((p) => ({ ...p, jp: p.jp || "", ...(overrides[p.id] || {}) })),
  ];
  const products = allProducts.filter((p) => !hiddenIds.includes(p.id));
  const dateOptions = useMemo(() => buildDateOptions(lang), [lang]);
  const timeOptions = useMemo(() => buildTimeOptions(lang), [lang]);

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ ...products.find((p) => p.id === id), qty }))
        .filter((i) => i.qty > 0),
    [cart, lang]
  );
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

  const addItem = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const changeQty = (id, delta) =>
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      return { ...c, [id]: next };
    });

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    const newOrderNo = "MT-" + Math.floor(100000 + Math.random() * 900000);
    const orderRecord = {
      orderNo: newOrderNo,
      name: form.name,
      phone: form.phone,
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      items: items.map((i) => ({ name: PRODUCT_TEXT.th[i.id]?.name || i.name, qty: i.qty, price: i.price })),
      total: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = await loadOrders();
      const ok = await saveOrders([...existing, orderRecord]);
      if (!ok) throw new Error("save failed");
      setOrderNo(newOrderNo);
      setCheckoutStep("done");
    } catch (err) {
      console.error("Order submit error:", err);
      setSubmitError(err && err.message ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const refreshOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const list = await loadOrders();
      setOrders(list.slice().reverse());
    } catch (err) {
      setOrdersError(err && err.message ? err.message : String(err));
    } finally {
      setOrdersLoading(false);
    }
  };

  const markReceived = async (orderNo) => {
    try {
      const list = await loadOrders();
      const updated = list.map((o) => (o.orderNo === orderNo ? { ...o, status: "received" } : o));
      const ok = await saveOrders(updated);
      if (ok) setOrders(updated.slice().reverse());
      else setOrdersError("save failed");
    } catch (err) {
      setOrdersError(err && err.message ? err.message : String(err));
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const priceNum = Number(newProduct.price);
    if (!newProduct.name.trim() || !priceNum || priceNum <= 0) {
      setProductError("กรุณากรอกชื่อเมนูและราคาให้ถูกต้อง");
      return;
    }
    setProductSaving(true);
    setProductError("");
    const record = {
      id: "c" + Date.now(),
      name: newProduct.name.trim(),
      desc: newProduct.desc.trim(),
      price: priceNum,
      icon: newProduct.icon,
      tone: "#7C8F4A",
      jp: "",
      image43: newProduct.image43,
      image916: newProduct.image916,
    };
    try {
      const existing = await loadCustomProducts();
      const updated = [...existing, record];
      const ok = await saveCustomProducts(updated);
      if (!ok) throw new Error("save failed");
      setCustomProducts(updated);
      setNewProduct({ name: "", desc: "", price: "", icon: "powder", image43: "", image916: "" });
    } catch (err) {
      setProductError(err && err.message ? err.message : String(err));
    } finally {
      setProductSaving(false);
    }
  };

  const toggleHidden = async (id) => {
    setMenuActionError("");
    const isHidden = hiddenIds.includes(id);
    const updated = isHidden ? hiddenIds.filter((h) => h !== id) : [...hiddenIds, id];
    try {
      const ok = await saveHiddenIds(updated);
      if (!ok) throw new Error("save failed");
      setHiddenIds(updated);
    } catch (err) {
      setMenuActionError(err && err.message ? err.message : String(err));
    }
  };

  const deleteCustomProduct = async (id) => {
    setMenuActionError("");
    try {
      const existing = await loadCustomProducts();
      const updated = existing.filter((p) => p.id !== id);
      const ok = await saveCustomProducts(updated);
      if (!ok) throw new Error("save failed");
      setCustomProducts(updated);
    } catch (err) {
      setMenuActionError(err && err.message ? err.message : String(err));
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditDraft({
      name: product.name,
      desc: product.desc || "",
      price: String(product.price),
      icon: product.icon,
      image43: product.image43 || "",
      image916: product.image916 || "",
    });
    setMenuActionError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id, isCustom) => {
    const priceNum = Number(editDraft.price);
    if (!editDraft.name.trim() || !priceNum || priceNum <= 0) {
      setMenuActionError("กรุณากรอกชื่อเมนูและราคาให้ถูกต้อง");
      return;
    }
    setEditSaving(true);
    setMenuActionError("");
    const patch = {
      name: editDraft.name.trim(),
      desc: editDraft.desc.trim(),
      price: priceNum,
      icon: editDraft.icon,
      image43: editDraft.image43,
      image916: editDraft.image916,
    };
    try {
      if (isCustom) {
        const existing = await loadCustomProducts();
        const updated = existing.map((p) => (p.id === id ? { ...p, ...patch } : p));
        const ok = await saveCustomProducts(updated);
        if (!ok) throw new Error("save failed");
        setCustomProducts(updated);
      } else {
        const existingOverrides = await loadOverrides();
        const updatedOverrides = { ...existingOverrides, [id]: patch };
        const ok = await saveOverrides(updatedOverrides);
        if (!ok) throw new Error("save failed");
        setOverrides(updatedOverrides);
      }
      setEditingId(null);
    } catch (err) {
      setMenuActionError(err && err.message ? err.message : String(err));
    } finally {
      setEditSaving(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ownerPin) {
      setPinError(false);
      setPinInput("");
      setMode("owner-dashboard");
    } else {
      setPinError(true);
    }
  };

  useEffect(() => {
    if (mode === "owner-dashboard") refreshOrders();
  }, [mode]);

  const resetOrder = () => {
    setCart({});
    setForm({ name: "", phone: "", pickupDate: "", pickupTime: "" });
    setCheckoutStep("cart");
    setDrawerOpen(false);
    setOrderNo(null);
  };

  return (
    <div className="shop">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Noto+Sans+Thai:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .shop {
          font-family: 'Noto Sans Thai', 'Noto Sans JP', sans-serif;
          background: #EEE8D8;
          color: #26231C;
          min-height: 100vh;
        }
        .display { font-family: 'Shippori Mincho', serif; }
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 28px; position: sticky; top: 0; z-index: 20;
          background: rgba(238,232,216,0.92); backdrop-filter: blur(6px);
          border-bottom: 1px solid rgba(38,35,28,0.1);
        }
        .header-right { display:flex; align-items:center; gap:10px; }
        .logo { display:flex; align-items:baseline; gap:8px; }
        .logo .jp { font-family:'Shippori Mincho',serif; font-size:22px; color:#3E4A26; }
        .logo .en { font-size:11px; letter-spacing:3px; color:#26231C; opacity:0.6; }
        .logo-leaf { color:#7C8F4A; transform: rotate(-15deg); flex-shrink:0; }
        .cart-btn {
          display:flex; align-items:center; gap:8px; background:#3E4A26; color:#EEE8D8;
          border:none; border-radius:999px; padding:8px 16px; cursor:pointer; font-family:inherit;
          font-size:14px;
        }
        .lang-wrap { position:relative; }
        .lang-btn {
          display:flex; align-items:center; gap:6px; background:none; border:1px solid rgba(38,35,28,0.25);
          border-radius:999px; padding:8px 12px; cursor:pointer; font-family:inherit; font-size:13px; color:#26231C;
        }
        .lang-menu {
          position:absolute; top:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#F5F1E4; border-radius:12px;
          box-shadow:0 10px 24px rgba(38,35,28,0.15); overflow:hidden; min-width:120px; z-index:60; white-space:nowrap;
        }
        .lang-menu button {
          display:block; width:100%; text-align:left; padding:10px 14px; border:none; background:none;
          cursor:pointer; font-family:inherit; font-size:13px; color:#26231C;
        }
        .lang-menu button:hover, .lang-menu button.active { background:#3E4A26; color:#EEE8D8; }
        .hero {
          background: linear-gradient(180deg,#3E4A26 0%, #2E3A1C 100%);
          color:#EEE8D8; padding: 80px 28px 70px; position:relative; overflow:hidden;
          display:flex; flex-direction:column; align-items:center; text-align:center;
        }
        .steam { position:absolute; top:0; opacity:0.8; }
        .wisp { transform-origin:center; animation: rise 6s ease-in-out infinite; }
        .wisp-b { animation-delay:1.2s; }
        .wisp-c { animation-delay:2.4s; }
        @keyframes rise { 0%{ transform:translateY(6px); opacity:0.1;} 50%{ transform:translateY(-6px); opacity:0.5;} 100%{ transform:translateY(6px); opacity:0.1;} }
        .hero h1 { font-size: clamp(32px,5vw,56px); margin:18px 0 10px; font-weight:700; }
        .hero p { max-width:480px; opacity:0.85; line-height:1.7; margin-bottom:28px; }
        .cta {
          background:#C1440E; color:#EEE8D8; border:none; border-radius:999px;
          padding:14px 30px; font-size:15px; font-family:inherit; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition: transform .15s ease;
        }
        .cta:hover { transform: translateY(-2px); }
        .section-title { padding: 56px 28px 20px; text-align:center; }
        .section-title .eyebrow { font-size:12px; letter-spacing:3px; opacity:0.55; text-transform:uppercase; }
        .section-title h2 { font-size:30px; margin:6px 0 0; }
        .grid {
          display:grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
          gap:22px; padding: 10px 28px 70px; max-width:1100px; margin:0 auto;
        }
        .card {
          background:#F5F1E4; border-radius:18px; padding:18px; display:flex; flex-direction:column;
          border:1px solid rgba(38,35,28,0.08); transition: box-shadow .2s ease, transform .2s ease;
        }
        .card:hover { box-shadow:0 12px 24px rgba(38,35,28,0.1); transform:translateY(-3px); }
        .swatch { height:130px; border-radius:12px; margin-bottom:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:10px; overflow:hidden; position:relative; }
        .swatch.has-photo { height:auto; padding:0; }
        .swatch.ratio-43 { aspect-ratio: 3 / 4; }
        .swatch.ratio-916 { aspect-ratio: 9 / 16; }
        .swatch-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .swatch .jp { font-family:'Shippori Mincho',serif; color:#EEE8D8; opacity:0.9; font-size:14px; }
        .card h3 { font-size:17px; margin:0 0 4px; }
        .card .desc { font-size:13px; opacity:0.7; line-height:1.5; flex-grow:1; margin-bottom:14px; }
        .card-footer { display:flex; align-items:center; justify-content:space-between; }
        .price { font-family:'Shippori Mincho',serif; font-size:18px; }
        .add-btn {
          background:#3E4A26; color:#EEE8D8; border:none; border-radius:999px;
          width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;
        }
        .drawer-overlay {
          position:fixed; inset:0; background:rgba(38,35,28,0.4); z-index:30;
        }
        .drawer {
          position:fixed; top:0; right:0; height:100%; width:min(380px,100%);
          background:#EEE8D8; z-index:31; display:flex; flex-direction:column;
          box-shadow:-10px 0 30px rgba(0,0,0,0.15);
        }
        .drawer-head { padding:20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(38,35,28,0.1); }
        .drawer-body { flex:1; overflow-y:auto; padding:16px 20px; }
        .line-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid rgba(38,35,28,0.08); align-items:center; }
        .line-item .sw { width:44px; height:44px; border-radius:8px; flex-shrink:0; }
        .qty-ctrl { display:flex; align-items:center; gap:8px; margin-top:6px; }
        .qty-ctrl button { border:1px solid rgba(38,35,28,0.2); background:none; border-radius:6px; width:22px; height:22px; cursor:pointer; }
        .drawer-foot { padding:20px; border-top:1px solid rgba(38,35,28,0.12); }
        .total-row { display:flex; justify-content:space-between; margin-bottom:14px; font-family:'Shippori Mincho',serif; font-size:18px; }
        .checkout-btn, .submit-btn {
          width:100%; background:#C1440E; color:#EEE8D8; border:none; border-radius:12px;
          padding:14px; font-size:15px; font-family:inherit; cursor:pointer; display:flex;
          align-items:center; justify-content:center; gap:8px;
        }
        .empty { text-align:center; opacity:0.55; padding:40px 0; font-size:14px; }
        input, textarea, select {
          width:100%; padding:10px 12px; border-radius:8px; border:1px solid rgba(38,35,28,0.2);
          font-family:inherit; font-size:14px; margin-bottom:12px; background:#F5F1E4; color:#26231C;
        }
        label { font-size:12px; opacity:0.65; display:block; margin-bottom:4px; }
        .hours-note {
          background:#F5F1E4; border:1px dashed rgba(62,74,38,0.4); border-radius:10px;
          padding:12px 14px; font-size:13px; line-height:1.6; color:#3E4A26; margin-bottom:14px;
        }
        .back-link { font-size:13px; opacity:0.6; cursor:pointer; margin-top:10px; display:inline-block; }
        .done-wrap { text-align:center; padding:30px 10px; }
        .done-icon { width:56px; height:56px; border-radius:50%; background:#3E4A26; color:#EEE8D8;
          display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
        .order-no { font-family:'Shippori Mincho',serif; font-size:20px; margin:8px 0 18px; }
        .note { font-size:12px; opacity:0.55; text-align:center; padding:16px 28px 40px; }
        .contact-wrap { text-align:center; padding: 10px 28px 60px; }
        .contact-wrap.on-hero { padding: 32px 0 0; }
        .contact-wrap h3 { font-size:26px; margin:0 0 6px; }
        .contact-wrap.on-hero .contact-sub { color:#EEE8D8; opacity:0.65; }
        .hero-hours { font-size:12px; color:#EEE8D8; opacity:0.55; margin:14px 0 0; }
        .contact-sub { font-size:13px; opacity:0.6; margin:0 0 22px; }
        .contact-icons { display:flex; justify-content:center; gap:10px; flex-wrap:nowrap; }
        .contact-btn {
          display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:999px;
          text-decoration:none; font-size:12px; color:#EEE8D8; transition: transform .15s ease, opacity .15s ease;
          white-space:nowrap;
        }
        .contact-btn:hover { transform:translateY(-2px); opacity:0.9; }
        .contact-btn.line { background:#06C755; }
        .contact-btn.facebook { background:#1877F2; }
        .contact-btn.instagram { background: linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4); }
        .location-wrap {
          max-width:1000px; margin:0 auto 60px; padding:0 28px;
          display:grid; grid-template-columns: 1.2fr 1fr; gap:24px; align-items:stretch;
        }
        .location-map {
          border-radius:16px; overflow:hidden; min-height:260px; border:1px solid rgba(38,35,28,0.1);
          display:flex; text-decoration:none;
          background: repeating-linear-gradient(45deg, #E4DEC9, #E4DEC9 10px, #DED7BF 10px, #DED7BF 20px);
        }
        .map-pin-scene {
          margin:auto; display:flex; flex-direction:column; align-items:center; gap:10px;
          background:#3E4A26; color:#EEE8D8; padding:20px 28px; border-radius:14px; font-size:14px;
          transition: transform .15s ease;
        }
        .location-map:hover .map-pin-scene { transform: translateY(-3px); }
        .location-address { color:#26231C; text-decoration:underline; text-underline-offset:3px; }
        .location-info {
          background:#F5F1E4; border-radius:16px; padding:24px; display:flex; flex-direction:column;
          justify-content:center; gap:14px; border:1px solid rgba(38,35,28,0.08);
        }
        .location-address { font-size:14px; line-height:1.6; margin:0 0 4px; }
        .location-row { display:flex; justify-content:space-between; font-size:13px; opacity:0.8; border-top:1px solid rgba(38,35,28,0.1); padding-top:10px; }
        @media (max-width: 720px) { .location-wrap { grid-template-columns: 1fr; } .location-map { min-height:200px; } }
        .owner-footer { text-align:center; padding: 0 28px 50px; }
        .owner-link { background:none; border:none; font-size:11px; opacity:0.4; cursor:pointer; font-family:inherit; text-decoration:underline; }
        .owner-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:28px; }
        .owner-card {
          background:#F5F1E4; border-radius:18px; padding:32px 28px; width:100%; max-width:360px;
          text-align:center; border:1px solid rgba(38,35,28,0.08);
        }
        .owner-card h2 { font-size:22px; margin:0 0 6px; }
        .owner-lang-row { display:flex; justify-content:center; gap:6px; margin-bottom:14px; }
        .owner-lang-btn {
          background:none; border:1px solid rgba(38,35,28,0.2); border-radius:999px; padding:4px 12px;
          font-size:12px; cursor:pointer; font-family:inherit; color:#26231C;
        }
        .owner-lang-btn.active { background:#3E4A26; color:#EEE8D8; border-color:#3E4A26; }
        .owner-sub { font-size:13px; opacity:0.6; margin:0 0 18px; }
        .owner-card input { text-align:center; font-size:20px; letter-spacing:6px; }
        .owner-error { color:#C1440E; font-size:13px; margin:-6px 0 12px; }
        .owner-dashboard { display:block; max-width:640px; margin:0 auto; padding:40px 20px 80px; align-items:stretch; }
        .dash-columns { display:grid; grid-template-columns: 220px 1fr; gap:24px; align-items:start; }
        .dash-sidebar { position:sticky; top:20px; }
        .logout-btn { width:100%; margin-top:14px; text-align:center; }
        .site-owner-btn { margin-top:8px; opacity:0.6; font-size:12px; }
        .pin-success { color:#3E4A26; font-size:13px; margin:-6px 0 12px; }
        .copy-row { display:flex; align-items:center; gap:8px; }
        .copy-btn {
          background:#3E4A26; color:#EEE8D8; border:none; border-radius:999px;
          padding:4px 10px; font-size:11px; cursor:pointer; font-family:inherit;
        }
        .qr-card { padding:20px 18px; }
        .qr-preview { text-align:center; margin-top:14px; }
        .qr-preview img { border-radius:12px; border:1px solid rgba(38,35,28,0.1); background:#fff; padding:10px; }
        .dash-main { min-width:0; }
        @media (max-width: 640px) { .dash-columns { grid-template-columns: 1fr; } .dash-sidebar { position:static; } }
        .owner-dash-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px; }
        .owner-dash-head h2 { font-size:26px; margin:0; }
        .owner-dash-actions { display:flex; gap:8px; }
        .owner-btn {
          background:#3E4A26; color:#EEE8D8; border:none; border-radius:999px; padding:8px 16px;
          font-size:13px; cursor:pointer; font-family:inherit;
        }
        .owner-btn-quiet { background:none; color:#26231C; border:1px solid rgba(38,35,28,0.25); }
        .orders-toggle-btn {
          position:relative; display:flex; align-items:center; gap:6px; background:#3E4A26; color:#EEE8D8;
          border:none; border-radius:999px; padding:8px 16px; font-size:13px; cursor:pointer; font-family:inherit;
        }
        .orders-toggle-btn .badge {
          background:#C1440E; color:#EEE8D8; border-radius:999px; min-width:18px; height:18px; padding:0 5px;
          display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;
        }
        .order-list { display:flex; flex-direction:column; gap:14px; }
        .order-card {
          background:#F5F1E4; border-radius:14px; padding:16px 18px; border:1px solid rgba(38,35,28,0.08);
        }
        .order-card.received { opacity:0.5; }
        .order-card-head { display:flex; justify-content:space-between; font-family:'Shippori Mincho',serif; font-size:16px; margin-bottom:8px; }
        .order-card-row { display:flex; justify-content:space-between; font-size:13px; opacity:0.75; margin-bottom:4px; }
        .order-card-items { font-size:13px; opacity:0.85; margin:8px 0 12px; padding-top:8px; border-top:1px dashed rgba(38,35,28,0.15); }
        .dash-subtitle { font-size:20px; margin:28px 0 14px; }
        .received-btn {
          width:100%; background:#C1440E; color:#EEE8D8; border:none; border-radius:10px;
          padding:10px; font-size:13px; cursor:pointer; font-family:inherit;
        }
        .received-btn.done { background:#3E4A26; cursor:default; }
        .profile-card {
          background:#F5F1E4; border-radius:14px; padding:6px 18px; border:1px solid rgba(38,35,28,0.08);
        }
        .profile-row {
          display:flex; justify-content:space-between; gap:16px; padding:14px 0;
          border-bottom:1px dashed rgba(38,35,28,0.12); font-size:14px;
        }
        .profile-row:last-child { border-bottom:none; }
        .profile-row span:first-child { opacity:0.55; flex-shrink:0; }
        .profile-row span:last-child { text-align:right; }
        .profile-note { font-size:12px; opacity:0.5; text-align:center; margin-top:16px; }
        .add-product-form { padding:20px 18px; display:flex; flex-direction:column; }
        .add-product-form label { margin-top:4px; }
        .menu-manage-list { display:flex; flex-direction:column; gap:10px; }
        .menu-manage-row {
          display:flex; align-items:center; justify-content:space-between; gap:12px;
          background:#F5F1E4; border-radius:12px; padding:12px 16px; border:1px solid rgba(38,35,28,0.08);
        }
        .menu-manage-row.hidden-item { opacity:0.5; }
        .menu-manage-info { display:flex; flex-direction:column; gap:2px; font-size:13px; }
        .menu-manage-info span { opacity:0.6; font-size:12px; }
        .menu-manage-row.editing { flex-direction:column; align-items:stretch; }
        .menu-edit-form { display:flex; flex-direction:column; width:100%; }
        .menu-edit-form label { font-size:11px; opacity:0.6; margin-top:8px; margin-bottom:2px; }
        .menu-edit-form input, .menu-edit-form textarea, .menu-edit-form select { margin-bottom:0; }
        .image-preview { display:flex; flex-direction:column; align-items:flex-start; gap:6px; margin:6px 0 10px; }
        .image-preview img { border-radius:10px; object-fit:cover; border:1px solid rgba(38,35,28,0.15); }
        .image-preview.ratio-43 img { width:160px; aspect-ratio:3/4; }
        .image-preview.ratio-916 img { width:110px; aspect-ratio:9/16; }
        .brand-mark {
          font-family:'Shippori Mincho',serif; font-size: clamp(36px,7vw,64px);
          letter-spacing:2px; font-weight:700; color:#EEE8D8; line-height:1.1;
          display:inline-flex; align-items:center; gap:10px;
        }
        .brand-leaf { color:#A9B47C; transform: rotate(-15deg); }
        @media (prefers-reduced-motion: reduce) { .wisp { animation:none; } }
      `}</style>

      {mode === "shop" && (
      <>
      <header className="header">
        <div className="logo" onClick={handleLogoTap}>
          <span className="jp">抹茶</span>
          <span className="en">SARISA</span>
          <Leaf size={18} className="logo-leaf" />
        </div>
        <div className="header-right">
          <div className="lang-wrap">
            <button className="lang-btn" onClick={() => setLangMenuOpen((o) => !o)}>
              <Globe size={14} /> {t.langName}
            </button>
            {langMenuOpen && (
              <div className="lang-menu">
                {Object.keys(TR).map((key) => (
                  <button
                    key={key}
                    className={lang === key ? "active" : ""}
                    onClick={() => { setLang(key); setLangMenuOpen(false); }}
                  >
                    {TR[key].langName === "TH" ? "ไทย" : TR[key].langName === "JA" ? "日本語" : "English"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="cart-btn" onClick={() => setDrawerOpen(true)}>
            <BowlIcon fillRatio={Math.min(1, totalQty / 6)} />
            <span>{t.cart} {totalQty > 0 ? `(${totalQty})` : ""}</span>
          </button>
        </div>
      </header>

      <section className="hero">
        <Steam />
        <span className="brand-mark">{t.eyebrow} <Leaf size={28} className="brand-leaf" /></span>
        <h1 className="display">{t.heroTitle}</h1>
        <p>{t.heroSub}</p>
        <button className="cta" onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>
          {t.heroCta} <ArrowRight size={16} />
        </button>
        <div className="contact-wrap on-hero">
          <p className="contact-sub">{t.contactSub}</p>
          <div className="contact-icons">
            <a className="contact-btn line" href={`https://line.me/R/ti/p/${shopProfile.line}`} target="_blank" rel="noopener noreferrer" aria-label="LINE">
              <MessageCircle size={16} />
              <span>LINE</span>
            </a>
          </div>
          <p className="hero-hours">{shopProfile.hours}</p>
        </div>
      </section>

      <div className="section-title" id="products">
        <div className="eyebrow">{t.sectionEyebrow}</div>
        <h2 className="display">{t.sectionTitle}</h2>
      </div>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <div
              className={`swatch ${p.image43 ? "has-photo ratio-43" : p.image916 ? "has-photo ratio-916" : ""}`}
              style={{ background: p.tone }}
            >
              {p.image43 ? (
                <img className="swatch-photo" src={p.image43} alt={p.name} />
              ) : p.image916 ? (
                <img className="swatch-photo" src={p.image916} alt={p.name} />
              ) : (
                <>
                  <ProductIcon type={p.icon} />
                  <span className="jp">{p.jp}</span>
                </>
              )}
            </div>
            <h3>{p.name}</h3>
            <div className="desc">{p.desc}</div>
            <div className="card-footer">
              <span className="price">{fmt(p.price)}円</span>
              <button className="add-btn" onClick={() => addItem(p.id)} aria-label={`${t.addAria}: ${p.name}`}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="note">{t.note}</p>


      <div className="section-title" id="location">
        <div className="eyebrow">{t.locationEyebrow}</div>
        <h2 className="display">{t.locationTitle}</h2>
      </div>
      <div className="location-wrap">
        <a
          className="location-map"
          href="https://www.google.com/maps/search/?api=1&query=34.91644893202107,137.01357759150264"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="map-pin-scene">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z" fill="#C1440E" />
              <circle cx="12" cy="10" r="3" fill="#EEE8D8" />
            </svg>
            <span>{t.getDirections}</span>
          </div>
        </a>
        <div className="location-info">
          <a
            className="location-address"
            href="https://www.google.com/maps/search/?api=1&query=34.91644893202107,137.01357759150264"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shopProfile.address}
          </a>
          <div className="location-row"><span>{t.locationHoursLabel}</span><span>{shopProfile.hours}</span></div>
          <div className="location-row"><span>{t.locationPhoneLabel}</span><span>{shopProfile.phone}</span></div>
        </div>
      </div>

      {drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer">
            <div className="drawer-head">
              <strong>{checkoutStep === "form" ? t.drawerTitleForm : checkoutStep === "done" ? t.drawerTitleDone : t.drawerTitleCart}</strong>
              <X size={20} style={{ cursor: "pointer" }} onClick={() => setDrawerOpen(false)} />
            </div>

            {checkoutStep === "cart" && (
              <>
                <div className="drawer-body">
                  {items.length === 0 && <div className="empty">{t.empty}</div>}
                  {items.map((i) => (
                    <div className="line-item" key={i.id}>
                      <div className="sw" style={{ background: i.tone }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14 }}>{i.name}</div>
                        <div className="qty-ctrl">
                          <button onClick={() => changeQty(i.id, -1)}><Minus size={12} /></button>
                          <span style={{ fontSize: 13 }}>{i.qty}</span>
                          <button onClick={() => changeQty(i.id, 1)}><Plus size={12} /></button>
                        </div>
                      </div>
                      <span style={{ fontSize: 14 }}>{fmt(i.price * i.qty)}円</span>
                    </div>
                  ))}
                </div>
                <div className="drawer-foot">
                  <div className="total-row"><span>{t.total}</span><span>{fmt(totalPrice)}円</span></div>
                  <button className="checkout-btn" disabled={items.length === 0} style={{ opacity: items.length === 0 ? 0.5 : 1 }} onClick={() => setCheckoutStep("form")}>
                    {t.goCheckout} <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

            {checkoutStep === "form" && (
              <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="drawer-body">
                  <label>{t.labelName}</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.placeholderName} />
                  <label>{t.labelPhone}</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.placeholderPhone} />
                  <div className="hours-note">{shopProfile.hours}</div>
                  <label>{t.labelPickupDate}</label>
                  <select required value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}>
                    <option value="" disabled>—</option>
                    {dateOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <label>{t.labelPickupTime}</label>
                  <select required value={form.pickupTime} onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}>
                    <option value="" disabled>—</option>
                    {timeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <span className="back-link" onClick={() => setCheckoutStep("cart")}>{t.backToCart}</span>
                  {submitError && <div className="owner-error">บันทึกคำสั่งซื้อไม่สำเร็จ: {submitError}</div>}
                </div>
                <div className="drawer-foot">
                  <div className="total-row"><span>{t.amountDue}</span><span>{fmt(totalPrice)}円</span></div>
                  <button type="submit" className="submit-btn" disabled={submitting} style={{ opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? "กำลังบันทึก..." : t.confirmOrder}
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === "done" && (
              <div className="drawer-body">
                <div className="done-wrap">
                  <div className="done-icon"><Check size={26} /></div>
                  <div>{t.thankYou(form.name, form.pickupDate, form.pickupTime)}</div>
                  <div className="order-no display">{t.orderNo} {orderNo}</div>
                  <button className="cta" style={{ background: "#3E4A26" }} onClick={resetOrder}>
                    {t.continueShopping}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      </>
      )}

      {mode === "owner-login" && (
        <div className="owner-screen">
          <form className="owner-card" onSubmit={handlePinSubmit}>
            <div className="owner-lang-row">
              {Object.keys(TR).map((key) => (
                <button
                  type="button"
                  key={key}
                  className={`owner-lang-btn ${lang === key ? "active" : ""}`}
                  onClick={() => setLang(key)}
                >
                  {TR[key].langName}
                </button>
              ))}
            </div>
            <h2 className="display">{ot.loginTitle}</h2>
            <p className="owner-sub">{ot.loginSub}</p>
            <input
              type="password"
              inputMode="numeric"
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              placeholder={ot.pinPlaceholder}
              autoFocus
            />
            {pinError && <div className="owner-error">{ot.pinError}</div>}
            <button type="submit" className="submit-btn">{ot.loginBtn}</button>
            <span className="back-link" onClick={() => setMode("shop")}>{ot.backToShop}</span>
          </form>
        </div>
      )}

      {mode === "owner-dashboard" && (
        <div className="owner-screen owner-dashboard">
          <div className="owner-dash-head">
            <h2 className="display">{ot.dashTitle}</h2>
            <div className="owner-dash-actions">
              <div className="lang-wrap">
                <button className="lang-btn" onClick={() => setLangMenuOpen((o) => !o)}>
                  <Globe size={14} /> {t.langName}
                </button>
                {langMenuOpen && (
                  <div className="lang-menu">
                    {Object.keys(TR).map((key) => (
                      <button
                        key={key}
                        className={lang === key ? "active" : ""}
                        onClick={() => { setLang(key); setLangMenuOpen(false); }}
                      >
                        {TR[key].langName === "TH" ? "ไทย" : TR[key].langName === "JA" ? "日本語" : "English"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="owner-btn owner-btn-quiet" onClick={() => setMode("owner-add-product")}>{ot.addMenuBtn}</button>
              <button className="orders-toggle-btn" onClick={() => { setShowOrderPanel((v) => !v); refreshOrders(); }}>
                <Bell size={16} />
                <span>{ot.ordersBtn}</span>
                {orders.filter((o) => o.status !== "received").length > 0 && (
                  <span className="badge">{orders.filter((o) => o.status !== "received").length}</span>
                )}
              </button>
            </div>
          </div>

          <div className="dash-columns">
            <div className="profile-card dash-sidebar">
              {!editingProfile ? (
                <>
                  <div className="profile-row"><span>{ot.shopName}</span><span>{shopProfile.name}</span></div>
                  <div className="profile-row"><span>{ot.hours}</span><span>{shopProfile.hours}</span></div>
                  <div className="profile-row"><span>{ot.address}</span><span>{shopProfile.address}</span></div>
                  <div className="profile-row"><span>{ot.phone}</span><span>{shopProfile.phone}</span></div>
                  <div className="profile-row"><span>LINE</span><span>{shopProfile.line}</span></div>
                  <button className="owner-btn owner-btn-quiet" style={{ width: "100%", marginTop: 14 }} onClick={startEditProfile}>{ot.editProfileBtn}</button>
                  <button className="owner-btn owner-btn-quiet logout-btn" onClick={() => setMode("shop")}>{ot.logoutBtn}</button>
                  <button className="owner-btn owner-btn-quiet logout-btn" onClick={() => { setPinChangeForm({ current: "", next: "", confirm: "" }); setPinChangeError(""); setPinChangeSuccess(false); setMode("owner-change-pin"); }}>{ot.changePinBtn}</button>
                  <button className="owner-btn owner-btn-quiet logout-btn" onClick={() => setMode("owner-qr")}>{ot.qrBtn}</button>
                  <button className="owner-btn owner-btn-quiet logout-btn site-owner-btn" onClick={() => setMode("site-billing")}>{ot.siteOwnerBtn}</button>
                </>
              ) : (
                <div className="menu-edit-form">
                  <label>{ot.shopName}</label>
                  <input value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} />
                  <label>{ot.hours}</label>
                  <input value={profileDraft.hours} onChange={(e) => setProfileDraft({ ...profileDraft, hours: e.target.value })} />
                  <label>{ot.address}</label>
                  <textarea rows={3} value={profileDraft.address} onChange={(e) => setProfileDraft({ ...profileDraft, address: e.target.value })} />
                  <label>{ot.phone}</label>
                  <input value={profileDraft.phone} onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })} />
                  <label>LINE (เช่น @sarisamatcha)</label>
                  <input value={profileDraft.line} onChange={(e) => setProfileDraft({ ...profileDraft, line: e.target.value })} />
                  {profileError && <div className="owner-error">{profileError}</div>}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="submit-btn" disabled={profileSaving} style={{ opacity: profileSaving ? 0.6 : 1 }} onClick={saveProfile}>
                      {profileSaving ? ot.saving : ot.saveBtn}
                    </button>
                    <button className="owner-btn owner-btn-quiet" onClick={() => setEditingProfile(false)}>{ot.cancelBtn}</button>
                  </div>
                </div>
              )}
            </div>

            <div className="dash-main">
              {!showOrderPanel && (
                <p className="empty">{ot.ordersHint}</p>
              )}
              {showOrderPanel && (
                <>
                  <h3 className="display dash-subtitle">{ot.ordersBtn}</h3>

                  {ordersLoading && <div className="empty">{ot.loading}</div>}
                  {ordersError && <div className="empty">{ot.errorPrefix}{ordersError}</div>}
                  {!ordersLoading && orders.length === 0 && <div className="empty">{ot.noOrders}</div>}

                  <div className="order-list">
                    {orders.map((o) => (
                      <div className={`order-card ${o.status === "received" ? "received" : ""}`} key={o.orderNo}>
                        <div className="order-card-head">
                          <strong>{o.orderNo}</strong>
                          <span>{o.total.toLocaleString("en-US")}円</span>
                        </div>
                        <div className="order-card-row"><span>{ot.customerLabel}</span><span>{o.name} · {o.phone}</span></div>
                        <div className="order-card-row"><span>{ot.pickupLabel}</span><span>{o.pickupDate} {o.pickupTime}</span></div>
                        <div className="order-card-items">
                          {o.items.map((it, idx) => (
                            <div key={idx}>{it.name} × {it.qty}</div>
                          ))}
                        </div>
                        <button
                          className={`received-btn ${o.status === "received" ? "done" : ""}`}
                          onClick={() => markReceived(o.orderNo)}
                          disabled={o.status === "received"}
                        >
                          {o.status === "received" ? ot.received : ot.markReceived}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "owner-add-product" && (
        <div className="owner-screen owner-dashboard">
          <div className="owner-dash-head">
            <h2 className="display">{ot.addProductTitle}</h2>
            <div className="owner-dash-actions">
              <button className="owner-btn owner-btn-quiet" onClick={() => setMode("owner-dashboard")}>{ot.backToOrders}</button>
            </div>
          </div>

          <form className="profile-card add-product-form" onSubmit={addProduct}>
            <label>{ot.menuNameLabel}</label>
            <input
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder={ot.menuNamePlaceholder}
            />
            <label>{ot.menuDescLabel}</label>
            <textarea
              rows={2}
              value={newProduct.desc}
              onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
              placeholder={ot.menuDescPlaceholder}
            />
            <label>{ot.priceLabel}</label>
            <input
              type="number"
              min="1"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder={ot.pricePlaceholder}
            />

            <label>{ot.image43Label}</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const dataUrl = await readFileAsDataURL(file);
                setNewProduct((np) => ({ ...np, image43: dataUrl }));
              }}
            />
            {newProduct.image43 && (
              <div className="image-preview ratio-43">
                <img src={newProduct.image43} alt="preview 4:3" />
                <button type="button" className="owner-btn owner-btn-quiet" onClick={() => setNewProduct((np) => ({ ...np, image43: "" }))}>{ot.removeImage}</button>
              </div>
            )}

            <label>{ot.image916Label}</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const dataUrl = await readFileAsDataURL(file);
                setNewProduct((np) => ({ ...np, image916: dataUrl }));
              }}
            />
            {newProduct.image916 && (
              <div className="image-preview ratio-916">
                <img src={newProduct.image916} alt="preview 9:16" />
                <button type="button" className="owner-btn owner-btn-quiet" onClick={() => setNewProduct((np) => ({ ...np, image916: "" }))}>{ot.removeImage}</button>
              </div>
            )}
            {productError && <div className="owner-error">{productError}</div>}
            <button type="submit" className="submit-btn" disabled={productSaving} style={{ opacity: productSaving ? 0.6 : 1, marginTop: 8 }}>
              {productSaving ? ot.saving : ot.addMenuSubmit}
            </button>
          </form>
          <p className="profile-note">{ot.langNote}</p>

          <h3 className="display dash-subtitle">{ot.allMenuTitle}</h3>
          {menuActionError && <div className="owner-error">{menuActionError}</div>}
          <div className="menu-manage-list">
            {[
              ...PRODUCT_BASE.map((p) => ({
                id: p.id,
                isCustom: false,
                name: overrides[p.id]?.name ?? PRODUCT_TEXT.th[p.id].name,
                desc: overrides[p.id]?.desc ?? PRODUCT_TEXT.th[p.id].desc,
                price: overrides[p.id]?.price ?? p.price,
                icon: overrides[p.id]?.icon ?? p.icon,
                image43: overrides[p.id]?.image43 || "",
                image916: overrides[p.id]?.image916 || "",
              })),
              ...customProducts.map((p) => ({ ...p, isCustom: true })),
            ].map((p) => {
              const hidden = hiddenIds.includes(p.id);
              const isEditing = editingId === p.id;
              return (
                <div className={`menu-manage-row ${hidden ? "hidden-item" : ""} ${isEditing ? "editing" : ""}`} key={p.id}>
                  {!isEditing && (
                    <>
                      <div className="menu-manage-info">
                        <strong>{p.name}</strong>
                        <span>{p.price.toLocaleString("en-US")}円{hidden ? ot.hiddenTag : ""}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="owner-btn owner-btn-quiet" onClick={() => startEdit(p)}>{ot.editBtn}</button>
                        <button className="owner-btn owner-btn-quiet" onClick={() => toggleHidden(p.id)}>
                          {hidden ? ot.showBtn : ot.hideBtn}
                        </button>
                        {p.isCustom && (
                          <button className="owner-btn owner-btn-quiet" onClick={() => deleteCustomProduct(p.id)}>{ot.deleteBtn}</button>
                        )}
                      </div>
                    </>
                  )}
                  {isEditing && (
                    <div className="menu-edit-form">
                      <label>{ot.menuNameLabel}</label>
                      <input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
                      <label>{ot.menuDescLabel}</label>
                      <textarea rows={2} value={editDraft.desc} onChange={(e) => setEditDraft({ ...editDraft, desc: e.target.value })} />
                      <label>{ot.priceLabel}</label>
                      <input type="number" min="1" value={editDraft.price} onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })} />

                      <label>{ot.image43Label}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await readFileAsDataURL(file);
                          setEditDraft((d) => ({ ...d, image43: dataUrl }));
                        }}
                      />
                      {editDraft.image43 && (
                        <div className="image-preview ratio-43">
                          <img src={editDraft.image43} alt="preview 4:3" />
                          <button type="button" className="owner-btn owner-btn-quiet" onClick={() => setEditDraft((d) => ({ ...d, image43: "" }))}>{ot.removeImage}</button>
                        </div>
                      )}

                      <label>{ot.image916Label}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await readFileAsDataURL(file);
                          setEditDraft((d) => ({ ...d, image916: dataUrl }));
                        }}
                      />
                      {editDraft.image916 && (
                        <div className="image-preview ratio-916">
                          <img src={editDraft.image916} alt="preview 9:16" />
                          <button type="button" className="owner-btn owner-btn-quiet" onClick={() => setEditDraft((d) => ({ ...d, image916: "" }))}>{ot.removeImage}</button>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button
                          className="submit-btn"
                          disabled={editSaving}
                          style={{ opacity: editSaving ? 0.6 : 1 }}
                          onClick={() => saveEdit(p.id, p.isCustom)}
                        >
                          {editSaving ? ot.saving : ot.saveBtn}
                        </button>
                        <button className="owner-btn owner-btn-quiet" onClick={cancelEdit}>{ot.cancelBtn}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === "site-billing" && (
        <div className="owner-screen owner-dashboard">
          <div className="owner-dash-head">
            <h2 className="display">{ot.billingTitle}</h2>
            <div className="owner-dash-actions">
              <button className="owner-btn owner-btn-quiet" onClick={() => setMode("owner-dashboard")}>{ot.backToDash}</button>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-row"><span>{ot.monthlyPlan}</span><span>1,000円 / เดือน</span></div>
            <div className="profile-row"><span>{ot.yearlyPlan}</span><span>10,000円 / ปี</span></div>
            <div className="profile-row"><span>{ot.bankLabel}</span><span>三菱UFJ銀行 สาขา 416 (碧南市店)</span></div>
            <div className="profile-row">
              <span>{ot.accountNoLabel}</span>
              <span className="copy-row">
                <span>3156937</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText("3156937");
                    setAccountCopied(true);
                    setTimeout(() => setAccountCopied(false), 1500);
                  }}
                >
                  {accountCopied ? "✓" : "คัดลอก"}
                </button>
              </span>
            </div>
            <div className="profile-row"><span>{ot.accountNameLabel}</span><span>WATCHARA จำกัด</span></div>
          </div>
          <p className="profile-note">{ot.billingNote}</p>
        </div>
      )}

      {mode === "owner-change-pin" && (
        <div className="owner-screen owner-dashboard">
          <div className="owner-dash-head">
            <h2 className="display">{ot.changePinTitle}</h2>
            <div className="owner-dash-actions">
              <button className="owner-btn owner-btn-quiet" onClick={() => setMode("owner-dashboard")}>{ot.backToDash}</button>
            </div>
          </div>

          <form className="profile-card add-product-form" onSubmit={changePin}>
            <label>{ot.currentPinLabel}</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinChangeForm.current}
              onChange={(e) => setPinChangeForm({ ...pinChangeForm, current: e.target.value })}
            />
            <label>{ot.newPinLabel}</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinChangeForm.next}
              onChange={(e) => setPinChangeForm({ ...pinChangeForm, next: e.target.value })}
            />
            <label>{ot.confirmPinLabel}</label>
            <input
              type="password"
              inputMode="numeric"
              value={pinChangeForm.confirm}
              onChange={(e) => setPinChangeForm({ ...pinChangeForm, confirm: e.target.value })}
            />
            {pinChangeError && <div className="owner-error">{pinChangeError}</div>}
            {pinChangeSuccess && <div className="pin-success">{ot.pinChangeSuccess}</div>}
            <button type="submit" className="submit-btn" disabled={pinChangeSaving} style={{ opacity: pinChangeSaving ? 0.6 : 1, marginTop: 8 }}>
              {pinChangeSaving ? ot.saving : ot.changePinSubmit}
            </button>
          </form>
        </div>
      )}

      {mode === "owner-qr" && (
        <div className="owner-screen owner-dashboard">
          <div className="owner-dash-head">
            <h2 className="display">{ot.qrTitle}</h2>
            <div className="owner-dash-actions">
              <button className="owner-btn owner-btn-quiet" onClick={() => setMode("owner-dashboard")}>{ot.backToDash}</button>
            </div>
          </div>

          <div className="profile-card qr-card">
            <label>{ot.qrUrlLabel}</label>
            <input
              value={qrUrl}
              onChange={(e) => setQrUrl(e.target.value)}
              placeholder={ot.qrUrlPlaceholder}
            />
            {qrUrl && (
              <div className="qr-preview">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(qrUrl)}`}
                  alt="QR code"
                  width={220}
                  height={220}
                />
                <a
                  className="owner-btn"
                  style={{ textDecoration: "none", display: "inline-block", marginTop: 12 }}
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(qrUrl)}`}
                  download="matcha-shop-qr.png"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ot.qrDownload}
                </a>
              </div>
            )}
          </div>
          <p className="profile-note">{ot.qrNote}</p>
        </div>
      )}
    </div>
  );
}
