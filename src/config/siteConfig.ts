export const MENU_URL = '';

const WHATSAPP_NUMBER = '556298165295';
const WHATSAPP_MESSAGE =
  'Olá! Vim pelo site do Touros Burguer e gostaria de mais informações.';

export const siteConfig = {
  brand: 'TOUROS BURGUER',
  slogan: 'RESPEITA ESSA FOME.',
  sinceText: 'Desde 2020, alimentando sua vontade de comer bem.',
  menuUrl: MENU_URL,
  ifoodUrl:
    'https://www.ifood.com.br/delivery/goiania-go/touros-burguers-setor-cristina/5860fa02-1466-439e-b510-e425e1f91304',
  food99Url:
    'https://h5.didiglobal.com/silver-bullet-online/8FTSBVvN4wxCUanV-UY0W?ddlCode=msAVvY&area=BR&lang=pt-BR&appKey=dlp9&redirectType=0&params=',
  whatsapp: WHATSAPP_NUMBER,
  whatsappMessage: WHATSAPP_MESSAGE,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  instagramHandle: '@touros_burguer',
  instagramUrl: 'https://www.instagram.com/touros_burguer/',
  locationTitle: 'A FOME TE TROUXE ATÉ AQUI?',
  locationSubtitle: 'Então vem conhecer a Touros Burguer de perto.',
  locationCtaTitle: 'VENHA NOS VISITAR',
  locationAddress: 'Setor Cristina — Goiânia, GO',
  locationCoordinates: '-16.763988, -49.350814',
  mapsUrl:
    'https://www.google.com/maps/place/Touros+Burguer/@-16.7640225,-49.3505396,20z/data=!4m6!3m5!1s0x935ef7cd63f2b469:0xacda37c9cbce9d96!8m2!3d-16.7639882!4d-49.3508144!16s%2Fg%2F11m38vqt5_',
  copyright: 'TOUROS BURGUER © 2026',
  media: {
    logoSrc: '/assets/aistudio/logo_touros_b7e768ce.png',
    heroBurgerSrc: '/assets/aistudio/Touros_Burguer_ao_entardecer_019752f9.png',
    introBullHoldSrc: '/src/assets/images/touro_burguer_cgi_1795050606546.jpg',
    introBullEatSrc: '/src/assets/images/touro_comendo_lanche_1795050865868.jpg',
    introBullOkSrc: '/src/assets/images/touro_aprovacao_ok_1795050865146.jpg',
    locationPhotoSrc: '',
    introVideoWebmSrc: '',
    introVideoMp4Src: '',
  },
  introStorageKey: 'touros_burguer_intro_seen_v1',
} as const;
