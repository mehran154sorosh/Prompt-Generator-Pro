export const STYLES = [
    'مینیاتور', 'سه‌بعدی', 'رنگ‌وروغن', 'ونگوگ', 'سورئالیسم', 
    'رئالیسم', 'امپرسیونیسم', 'دیجیتال آرت', 'مانگا', 'فوتورئالیسم'
  ];
  
  export const LIGHTING = [
    'دراماتیک', 'سینماتیک', 'اکشن', 'طبیعی', 'ملایم', 
    'نور از پشت', 'نور استودیویی', 'کنتراست بالا'
  ];
  
  export const PALETTE = [
    'رنگ گرم', 'رنگ سرد', 'نئونی', 'تیره', 'روشن', 'پاستلی', 'طبیعی'
  ];
  
  export const MOOD = [
    'حماسی', 'غمگین', 'شاد', 'ترسناک', 'الهام‌بخش', 
    'آرامش‌بخش', 'هیجان‌انگیز', 'تاریک', 'احساسی'
  ];
  
  export const QUALITY = [
    '1080p', '4K', '8K', 'جزئیات بالا', 'جزئیات خیلی بالا', 
    'جزئیات فوق‌العاده بالا', 'Ultra-Realistic'
  ];
  
  export const ACCELERATORS = [
    'فوکوس تیز', 'شاهکار هنری', 'Ultra HD', 'High Detail', 
    'Clean Render', 'Hyper Realistic', 'Noise-Free', 'Highly Polished'
  ];
  
  export const ASPECT_RATIOS = [
    '1:1', '3:4', '4:3', '9:16', '16:9', '2:1', 
    '21:9', '5:4', '4:5', '3:2', '2:3'
  ];
  
  export const CAMERA_ANGLES = [
    'کلوزآپ', 'اکستریم کلوزآپ', 'مدیوم‌شات', 'لانگ‌شات', 'اکستریم لانگ‌شات', 
    'نمای نیم‌تنه', 'نمای از پشت سر', 'نمای از بالا', 'نمای از پایین', 
    'نمای از سطح زمین', 'نمای سه‌رخ', 'نمای نیم‌رخ', 'نمای تمام‌رخ', 
    'نمای پشت‌سر', 'Tilt Shot', 'Dutch Angle', 'POV', 'Worm View'
  ];
  
  export const CAMERA_LENSES = [
    '14mm', '24mm', '35mm', '50mm', '85mm', '105mm', '135mm', 
    '200mm', '300mm', '400mm', '18–55mm', '24–70mm', '70–200mm'
  ];
  
  export const INITIAL_STATE = {
    subject: '',
    timePlace: '',
    actionJob: '',
    styles: [],
    lighting: [],
    environment: '',
    palette: [],
    customColor: '#000000',
    mood: [],
    quality: [],
    accelerators: [],
    negativeWords: '',
    aspectRatio: '16:9',
    cameraAngles: [],
    cameraLenses: []
  };