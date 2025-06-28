const axios = require('axios');
const sequelize = require('../config/database');
const { Currency } = require('../models/sequelize');
const logger = require('../config/logger');

const currencyCodes = [
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AUD',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BRL',
  'BSD',
  'BTC',
  'BTN',
  'BWP',
  'BYN',
  'BZD',
  'CAD',
  'CDF',
  'CHF',
  'CLF',
  'CLP',
  'CNH',
  'CNY',
  'COP',
  'CRC',
  'CUC',
  'CUP',
  'CVE',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EGP',
  'ERN',
  'ETB',
  'EUR',
  'FJD',
  'FKP',
  'GBP',
  'GEL',
  'GGP',
  'GHS',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HRK',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'IMP',
  'INR',
  'IQD',
  'IRR',
  'ISK',
  'JEP',
  'JMD',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KMF',
  'KPW',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LRD',
  'LSL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MRU',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SDG',
  'SEK',
  'SGD',
  'SHP',
  'SLL',
  'SOS',
  'SRD',
  'SSP',
  'STD',
  'STN',
  'SVC',
  'SYP',
  'SZL',
  'THB',
  'TJS',
  'TMT',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'UYU',
  'UZS',
  'VES',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XAU',
  'XCD',
  'XDR',
  'XOF',
  'XPD',
  'XPF',
  'XPT',
  'YER',
  'ZAR',
  'ZMW',
  'ZWL',
];

// Mapping currency codes to country codes for flag URLs
const currencyToCountryMap = {
  USD: 'us',
  VND: 'vn',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  CNY: 'cn',
  KRW: 'kr',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  SGD: 'sg',
  THB: 'th',
  MYR: 'my',
  IDR: 'id',
  PHP: 'ph',
  INR: 'in',
  BRL: 'br',
  RUB: 'ru',
  ZAR: 'za',
  TRY: 'tr',
  AED: 'ae',
  AFN: 'af',
  ALL: 'al',
  AMD: 'am',
  ANG: 'cw',
  AOA: 'ao',
  ARS: 'ar',
  AWG: 'aw',
  AZN: 'az',
  BAM: 'ba',
  BBD: 'bb',
  BDT: 'bd',
  BGN: 'bg',
  BHD: 'bh',
  BIF: 'bi',
  BMD: 'bm',
  BND: 'bn',
  BOB: 'bo',
  BSD: 'bs',
  BTC: 'btc',
  BTN: 'bt',
  BWP: 'bw',
  BYN: 'by',
  BZD: 'bz',
  CDF: 'cd',
  CLF: 'cl',
  CLP: 'cl',
  CNH: 'cn',
  COP: 'co',
  CRC: 'cr',
  CUC: 'cu',
  CUP: 'cu',
  CVE: 'cv',
  CZK: 'cz',
  DJF: 'dj',
  DKK: 'dk',
  DOP: 'do',
  DZD: 'dz',
  EGP: 'eg',
  ERN: 'er',
  ETB: 'et',
  FJD: 'fj',
  FKP: 'fk',
  GEL: 'ge',
  GGP: 'gg',
  GHS: 'gh',
  GIP: 'gi',
  GMD: 'gm',
  GNF: 'gn',
  GTQ: 'gt',
  GYD: 'gy',
  HKD: 'hk',
  HNL: 'hn',
  HRK: 'hr',
  HTG: 'ht',
  HUF: 'hu',
  ILS: 'il',
  IMP: 'im',
  IQD: 'iq',
  IRR: 'ir',
  ISK: 'is',
  JEP: 'je',
  JMD: 'jm',
  JOD: 'jo',
  KES: 'ke',
  KGS: 'kg',
  KHR: 'kh',
  KMF: 'km',
  KPW: 'kp',
  KWD: 'kw',
  KYD: 'ky',
  KZT: 'kz',
  LAK: 'la',
  LBP: 'lb',
  LKR: 'lk',
  LRD: 'lr',
  LSL: 'ls',
  LYD: 'ly',
  MAD: 'ma',
  MDL: 'md',
  MGA: 'mg',
  MKD: 'mk',
  MMK: 'mm',
  MNT: 'mn',
  MOP: 'mo',
  MRU: 'mr',
  MUR: 'mu',
  MVR: 'mv',
  MWK: 'mw',
  MXN: 'mx',
  MZN: 'mz',
  NAD: 'na',
  NGN: 'ng',
  NIO: 'ni',
  NOK: 'no',
  NPR: 'np',
  NZD: 'nz',
  OMR: 'om',
  PAB: 'pa',
  PEN: 'pe',
  PGK: 'pg',
  PKR: 'pk',
  PLN: 'pl',
  PYG: 'py',
  QAR: 'qa',
  RON: 'ro',
  RSD: 'rs',
  RWF: 'rw',
  SAR: 'sa',
  SBD: 'sb',
  SCR: 'sc',
  SDG: 'sd',
  SEK: 'se',
  SHP: 'sh',
  SLL: 'sl',
  SOS: 'so',
  SRD: 'sr',
  SSP: 'ss',
  STD: 'st',
  STN: 'st',
  SVC: 'sv',
  SYP: 'sy',
  SZL: 'sz',
  TJS: 'tj',
  TMT: 'tm',
  TND: 'tn',
  TOP: 'to',
  TTD: 'tt',
  TWD: 'tw',
  TZS: 'tz',
  UAH: 'ua',
  UGX: 'ug',
  UYU: 'uy',
  UZS: 'uz',
  VES: 've',
  VUV: 'vu',
  WST: 'ws',
  XAF: 'cm',
  XAU: 'gold',
  XCD: 'ag',
  XDR: 'imf',
  XOF: 'sn',
  XPD: 'palladium',
  XPF: 'pf',
  XPT: 'platinum',
  YER: 'ye',
  ZMW: 'zm',
  ZWL: 'zw',
};

// Base64 encoded SVG icons for special currencies
const specialCurrencyIcons = {
  XAU: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0ZGRDcwMCIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMjBIMTJWMTRaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xNiAxNkgxNFYxOEgxNlYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE4IDE2SDE2VjE4SDE4VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjAgMTZIMThWMThIMjBWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yMiAxNkgyMFYxOEgyMlYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI0IDE2SDIyVjE4SDI0VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjYgMTZIMjRWMThIMjZWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yOCAxNkgyNlYxOEgyOFYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE2IDE4SDE0VjIwSDE2VjIwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjggMThIMjZWMjBIMjhWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xNiAyMEgxNFYyMkgxNlYyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI4IDIwSDI2VjIySDI4VjIwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTggMjJIMTZWMjRIMThWMjJaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yMCAyMkgxOFYyNEgyMFYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTIyIDIySDIwVjI0SDIyVjIyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjQgMjJIMjJWMjRIMjRWMjJaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yNiAyMkgyNFYyNEgyNlYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
  XPT: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0U1RTdFQSIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMjBIMTJWMTRaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xNiAxNkgxNFYxOEgxNlYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE4IDE2SDE2VjE4SDE4VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjAgMTZIMThWMThIMjBWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yMiAxNkgyMFYxOEgyMlYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI0IDE2SDIyVjE4SDI0VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjYgMTZIMjRWMThIMjZWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yOCAxNkgyNlYxOEgyOFYxNloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE2IDE4SDE0VjIwSDE2VjIwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjggMThIMjZWMjBIMjhWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xNiAyMEgxNFYyMkgxNlYyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI4IDIwSDI2VjIySDI4VjIwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTggMjJIMTZWMjRIMThWMjJaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yMCAyMkgxOFYyNEgyMFYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTIyIDIySDIwVjI0SDIyVjIyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjQgMjJIMjJWMjRIMjRWMjJaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yNiAyMkgyNFYyNEgyNlYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
  XPD: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMiAxMkgyOFYyMEgxMlYxNFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE2IDE2SDE0VjE4SDE2VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTggMTZIMTZWMThIMThWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yMCAxNkgxOFYxOEgyMFYxOFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTIyIDE2SDIwVjE4SDIyVjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjQgMTZIMjJWMThIMjRWMThaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yNiAxNkgyNFYxOEgyNlYxOFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI4IDE2SDI2VjE4SDI4VjE2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTYgMThIMTRWMjBIMTZWMjBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yOCAxOEgyNlYyMEgyOFYxOFoiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE2IDIwSDE0VjIySDE2VjIwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjggMjBIMjZWMjJIMjhWMjBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xOCAyMkgxNlYyNEgxOFYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTIwIDIySDE4VjI0SDIwVjIyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjIgMjJIMjBWMjRIMjJWMjJaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yNCAyMkgyMlYyNEgyNFYyMloiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTI2IDIySDI0VjI0SDI2VjIyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=',
  XDR: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iIzAwNzJDNyIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMjAgMTJMMjQgMjBMMjAgMjhMMTYgMjBMMjAgMTJaIiBmaWxsPSIjMDA3MkM3Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjQiIGZpbGw9IiMwMDcyQzciLz4KPC9zdmc+',
};

// Function to download flag image and convert to base64
async function downloadFlagAsBase64(currencyCode) {
  try {
    // Check if it's a special currency with predefined icon
    if (specialCurrencyIcons[currencyCode]) {
      logger.info(`Using predefined icon for ${currencyCode}`);
      return specialCurrencyIcons[currencyCode];
    }

    const countryCode = currencyToCountryMap[currencyCode];
    if (!countryCode) {
      logger.warn(`No country mapping found for currency: ${currencyCode}`);
      return null;
    }

    // Skip special cases that we now handle with predefined icons
    if (['btc', 'gold', 'imf', 'palladium', 'platinum'].includes(countryCode)) {
      return null;
    }

    const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;
    logger.info(`Downloading flag for ${currencyCode} from: ${flagUrl}`);

    const response = await axios.get(flagUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return base64;
  } catch (error) {
    logger.error(`Failed to download flag for ${currencyCode}:`, error.message);
    return null;
  }
}

// Chuẩn bị dữ liệu để insert với flag
async function prepareCurrencyData() {
  const currenciesToSeedPromises = currencyCodes.map(async (code) => {
    const flagData = await downloadFlagAsBase64(code);
    return {
      code,
      name: `Placeholder for ${code}`,
      symbol: code,
      flag: flagData,
      isActive: true,
    };
  });
  return Promise.all(currenciesToSeedPromises);
}

async function seedCurrencies() {
  try {
    logger.info('Starting to seed currencies into the database...');
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    logger.info('Preparing currency data with flags...');
    const currenciesToSeed = await prepareCurrencyData();

    // Xoá toàn bộ dữ liệu cũ trong bảng
    logger.info('Deleting all existing currencies...');
    await Currency.destroy({
      where: {},
    });
    logger.info('All existing currencies have been deleted.');

    // Dùng bulkCreate để insert hàng loạt cho hiệu năng tốt hơn
    const result = await Currency.bulkCreate(currenciesToSeed);

    logger.info(`Successfully seeded ${result.length} new currencies.`);

    logger.info('Currency seeding finished.');
  } catch (error) {
    logger.error('Failed to seed currencies:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    logger.info('Database connection closed.');
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  seedCurrencies();
}

module.exports = seedCurrencies;
