# NoorApp-Islamic Android App Bundle (AAB) Instructions

আপনার অ্যাপটি সফলভাবে তৈরি করা হয়েছে! নিচে আপনার করণীয় ধাপগুলো দেওয়া হলো:

## ১. ফাইলসমূহ
- **NoorApp-Islamic.aab**: এটি Google Play Store-এ আপলোড করার জন্য মূল ফাইল।
- **NoorApp-Islamic.apk**: এটি আপনি সরাসরি ফোনে ইনস্টল করে টেস্ট করতে পারেন।
- **android.keystore**: এটি আপনার অ্যাপের সাইনিং কী। **এটি খুব সাবধানে সংরক্ষণ করুন।** ভবিষ্যতে অ্যাপ আপডেট করতে এটি লাগবে।
- **assetlinks.json**: এটি আপনার ওয়েবসাইটে আপলোড করতে হবে।

## ২. ডিজিটাল অ্যাসেট লিঙ্ক (Digital Asset Link) সেটআপ
অ্যাপটি থেকে ব্রাউজারের অ্যাড্রেস বার সরাতে এবং এটিকে একটি নেটিভ অ্যাপের মতো দেখাতে নিচের কাজটি করুন:
1. আপনার ওয়েবসাইটের রুট ডিরেক্টরিতে `.well-known` নামে একটি ফোল্ডার তৈরি করুন।
2. তার ভেতর `assetlinks.json` ফাইলটি আপলোড করুন।
3. আপনার ফাইলটির ইউআরএল হবে: `https://noorapp.in/.well-known/assetlinks.json`

## ৩. কীস্টোর তথ্য (Keystore Info)
ভবিষ্যতে ব্যবহারের জন্য এই তথ্যগুলো মনে রাখুন:
- **Keystore Password**: `password123`
- **Key Alias**: `android`
- **Key Password**: `password123`

## ৪. Play Store-এ পাবলিশ করা
1. [Google Play Console](https://play.google.com/console)-এ যান।
2. একটি নতুন অ্যাপ তৈরি করুন।
3. "App Bundle" সেকশনে `NoorApp-Islamic.aab` ফাইলটি আপলোড করুন।

অভিনন্দন! আপনার ইসলামিক অ্যাপটি এখন অ্যান্ড্রয়েড প্ল্যাটফর্মের জন্য প্রস্তুত।
