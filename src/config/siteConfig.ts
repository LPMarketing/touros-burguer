import { resolveAssetUrl } from '../utils/assetUrl';

export const MENU_URL = 'https://clicae.com.br/tourosburguercardapio';

const WHATSAPP_PRIMARY_NUMBER = '556296780208';
const WHATSAPP_SECONDARY_NUMBER = '556298165295';
const WHATSAPP_MESSAGE =
  'Olá! Vim pelo site do Touros Burguer e gostaria de mais informações.';

export const siteConfig = {
  brand: 'TOUROS BURGUER',
  slogan: 'RESPEITA ESSA FOME.',
  sinceText: 'Desde 2020, alimentando sua vontade de comer bem.',
  menuUrl: MENU_URL,
  whatsappMessage: WHATSAPP_MESSAGE,
  whatsappChannels: [
    {
      id: 'whatsapp-1',
      title: 'WHATSAPP 1',
      displayNumber: '(62) 9678-0208',
      number: WHATSAPP_PRIMARY_NUMBER,
      url: `https://wa.me/${WHATSAPP_PRIMARY_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    },
    {
      id: 'whatsapp-2',
      title: 'WHATSAPP 2',
      displayNumber: '(62) 9816-5295',
      number: WHATSAPP_SECONDARY_NUMBER,
      url: `https://wa.me/${WHATSAPP_SECONDARY_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    },
  ],
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
  clicaeUrl: 'https://www.instagram.com/clicaebio/',
  media: {
    logoSrc: resolveAssetUrl('assets/aistudio/logo_touros_b7e768ce.png'),
    heroBurgerSrc: resolveAssetUrl('assets/aistudio/Touros_Burguer_ao_entardecer_019752f9.png'),
    clicaeLogoSrc: resolveAssetUrl(
      'assets/aistudio/WhatsApp_Image_2026-11-17_at_22.41.29_be5d0219.jpeg'
    ),
    locationPhotoSrc: resolveAssetUrl(''),
    introVideoWebmSrc: resolveAssetUrl(''),
    introVideoMp4Src: resolveAssetUrl(''),
  },
  introStorageKey: 'touros_burguer_intro_seen_v1',
} as const;
