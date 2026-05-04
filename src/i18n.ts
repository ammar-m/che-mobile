import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          'app_name': 'CHE Car Parts',
          'search_placeholder': 'Search for car parts...',
          'categories': 'Categories',
          'featured_parts': 'Featured Parts',
          'cart': 'Cart',
          'track_order': 'Track Order',
          'profile': 'Profile',
          'add_to_cart': 'Add to Cart',
          'price': 'Price',
          'stock': 'In Stock',
          'brand': 'Brand',
          'order_status': 'Order Status',
          'tracking_number': 'Tracking Number',
          'logout': 'Log Out',
          'login': 'Log In',
          'order_history': 'Order History',
          'checkout': 'Checkout',
          'language': 'Language',
          'rtl_toggle': 'العربية',
          'ltr_toggle': 'English'
        }
      },
      ar: {
        translation: {
          'app_name': 'CHE لقطع الغيار',
          'search_placeholder': 'ابحث عن قطع غيار...',
          'categories': 'الفئات',
          'featured_parts': 'قطع غيار مميزة',
          'cart': 'السلة',
          'track_order': 'تتبع الطلب',
          'profile': 'الملف الشخصي',
          'add_to_cart': 'أضف إلى السلة',
          'price': 'السعر',
          'stock': 'متوفر',
          'brand': 'العلامة التجارية',
          'order_status': 'حالة الطلب',
          'tracking_number': 'رقم التتبع',
          'logout': 'تسجيل الخروج',
          'login': 'تسجيل الدخول',
          'order_history': 'سجل الطلبات',
          'checkout': 'الدفع',
          'language': 'اللغة',
          'rtl_toggle': 'العربية',
          'ltr_toggle': 'English'
        }
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
