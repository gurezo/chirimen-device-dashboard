import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/gurezo/chirimen.org/master/';

function imageUrl(path: string): string {
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
}

function buildExample(
  chirimen?: string,
  microbit?: string,
  piZero?: string
): { hardware: string; code: string }[] {
  const examples: { hardware: string; code: string }[] = [];
  if (chirimen) examples.push({ hardware: 'chirimen', code: chirimen });
  if (microbit) examples.push({ hardware: 'microbit', code: microbit });
  if (piZero) examples.push({ hardware: 'piZero', code: piZero });
  return examples;
}

/**
 * モックデバイス一覧データ
 * chirimen.org partslist.csv の L2-L11 (I2C)、L56-L65 (GPIO) より作成
 * @see https://github.com/gurezo/chirimen.org/blob/master/_data/partslist.csv
 */
export const MOCK_DEVICES: DeviceInfo[] = [
  // I2C L2-L11
  {
    id: 'i2c-ads1015',
    deviceName: 'ADS1015',
    tag: 'I2C',
    category: 'ADC(アナログ電圧測定)',
    description:
      'アナログ電圧を 12bit 精度のデジタル信号に変換する部品で、アナログセンサ等を利用する際に必要です',
    image: imageUrl('partsImgs/ADS1015.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/1136/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-ADS1015',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1015'
      ),
      circuit: 'https://github.com/adafruit/ADS1X15-Breakout-Board-PCBs',
      datasheet: 'https://cdn-shop.adafruit.com/datasheets/ads1015.pdf',
    },
  },
  {
    id: 'i2c-ads1115',
    deviceName: 'ADS1115',
    tag: 'I2C',
    category: 'ADC(アナログ電圧測定)',
    description:
      'アナログ電圧を 16bit 精度のデジタル信号に変換する部品で、アナログセンサ等を利用する際に必要です',
    image: imageUrl('partsImgs/ADS1115.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/1138/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-ADS1115',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_ADS1115',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1x15'
      ),
    },
  },
  {
    id: 'i2c-pcf8591',
    deviceName: 'PCF8591',
    tag: 'I2C',
    category: 'ADC, DAC(アナログ電圧出力) 複合',
    description:
      'ADC と DAC が一つになった部品です(デジタル側は 8bit)',
    image: imageUrl('partsImgs/PCF8591.jpg'),
    product: {
      url: 'http://www.aitendo.com/product/10938',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCF8591',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pcf8591'
      ),
    },
  },
  {
    id: 'i2c-adt7410',
    deviceName: 'ADT7410',
    tag: 'I2C',
    category: '温度センサ',
    description: '-55℃ から +150℃ まで測定できる温度センサです',
    image: imageUrl('partsImgs/ADT7410.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g106675/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-ADT7410',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C1_ADT7410',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adt7410'
      ),
      circuit: 'https://github.com/adafruit/ADS1X15-Breakout-Board-PCBs',
      datasheet: 'https://cdn-shop.adafruit.com/datasheets/ads1115.pdf',
    },
  },
  {
    id: 'i2c-amg8833',
    deviceName: 'AMG8833',
    tag: 'I2C',
    category: 'サーモグラフィ',
    description:
      'センサから見て上下左右のおよそ 60 度の範囲を 8x8 ピクセルに分割し、それぞれのエリアについて 0℃ ～ 80℃ の範囲で測定可能なサーモグラフィです',
    image: imageUrl('partsImgs/AMG8833.JPG'),
    product: {
      url: 'https://www.switch-science.com/catalog/3395/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-AMG8833',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_AMG8833',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_amg8833'
      ),
      circuit:
        'https://docid81hrs3j1.cloudfront.net/medialibrary/2017/11/AMG8833_breakout.pdf',
      datasheet:
        'https://docid81hrs3j1.cloudfront.net/medialibrary/2017/11/PANA-S-A0002141979-1.pdf',
    },
  },
  {
    id: 'i2c-bme280',
    deviceName: 'BME280',
    tag: 'I2C',
    category: '温度, 圧力, 湿度 複合センサ',
    description: '温度、湿度、気圧の測定ができる複合センサです',
    image: imageUrl('partsImgs/BME280.jpg'),
    product: {
      url: 'http://www.aitendo.com/product/15535',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-BME280',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C6_BME280',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_bme280'
      ),
      datasheet:
        'https://ae-bst.resource.bosch.com/media/_tech/media/datasheets/BST-BME280-DS002.pdf',
    },
  },
  {
    id: 'i2c-bmp180',
    deviceName: 'BMP180',
    tag: 'I2C',
    category: '温度, 圧力 複合センサ',
    description: '温度と気圧の測定ができる複合センサです',
    image: imageUrl('partsImgs/BMP180.jpg'),
    product: {
      url: 'http://www.aitendo.com/product/10760',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-BMP180',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_BMP180',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_bmp180'
      ),
      datasheet:
        'http://aitendo3.sakura.ne.jp/aitendo_data/product_img/sensor/BMP180/BMP180.pdf',
    },
  },
  {
    id: 'i2c-bmp280',
    deviceName: 'BMP280',
    tag: 'I2C',
    category: '温度, 圧力 複合センサ',
    description:
      '温度と気圧の測定ができる複合センサです(BMP180の後継品で精度が向上しています)',
    image: imageUrl('partsImgs/BMP280.jpeg'),
    product: {
      url: 'http://www.aitendo.com/product/10760',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-BMP280',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C2_BMP280',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_bmp280'
      ),
      datasheet:
        'http://aitendo3.sakura.ne.jp/aitendo_data/product_img/sensor/BMP280/BST-BMP280-DS001-11.pdf',
    },
  },
  {
    id: 'i2c-gp2y0e03',
    deviceName: 'GP2Y0E03',
    tag: 'I2C',
    category: '距離センサ',
    description:
      'センサから対象物までの距離を測定できるセンサです( 50cm 程度まで)',
    image: imageUrl('partsImgs/gp2y0e03.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g107547/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-GP2Y0E03',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_gp2y0e03'
      ),
      datasheet:
        'https://akizukidenshi.com/download/ds/sharp/gp2y0e03_e.pdf',
      note: 'https://akizukidenshi.com/download/ds/sharp/GP2Y0E02_an_20180829.pdf',
    },
  },
  {
    id: 'i2c-vl53l0x',
    deviceName: 'VL53L0X',
    tag: 'I2C',
    category: '距離センサ',
    description:
      'センサから対象物までの距離を測定できるセンサです( 2m 程度まで)',
    image: imageUrl('partsImgs/VL53L0X.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/2869/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-VL53L0X',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C3_VL53L0X',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_vl53l0x'
      ),
      circuit:
        'https://www.pololu.com/file/0J1188/vl53l0x-time-of-flight-distance-sensor-carrier-schematic.pdf',
      datasheet: 'https://www.pololu.com/file/0J1187/VL53L0X.pdf',
    },
  },
  // GPIO L56-L65
  {
    id: 'gpio-led-red',
    deviceName: '赤色LED',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/LED.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g100624/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-led-yellow',
    deviceName: '黄色LED',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/LED.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g100626/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-led-green',
    deviceName: '黄緑色LED',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/LED.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g100625/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-resistor-150',
    deviceName: '150Ω',
    tag: 'GPIO',
    category: 'カーボン抵抗',
    description:
      '必要な場所に電気抵抗を入れる部品です(ここでは通常のものよりサイズが大きく、抵抗値が読みやすい商品を紹介しています)',
    image: imageUrl('partsImgs/register-2.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g107969/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-resistor-10k',
    deviceName: '10kΩ',
    tag: 'GPIO',
    category: 'カーボン抵抗',
    description:
      '必要な場所に電気抵抗を入れる部品です(ここでは通常のものよりサイズが大きく、抵抗値が読みやすい商品を紹介しています)',
    image: imageUrl('partsImgs/register-2.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g107990/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-resistor-1k',
    deviceName: '1kΩ',
    tag: 'GPIO',
    category: 'カーボン抵抗',
    description:
      '必要な場所に電気抵抗を入れる部品です(ここでは通常のものよりサイズが大きく、抵抗値が読みやすい商品を紹介しています)',
    image: imageUrl('partsImgs/register-2.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g107980/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-tact-2pin',
    deviceName: '2pin',
    tag: 'GPIO',
    category: 'タクトスイッチ',
    description:
      'ボタンを押している間だけ電気を流す部品です(chirimen チュートリアルでは 2pin のものを採用しています)',
    image: imageUrl('partsImgs/tactSwitch.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108078/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Button',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO0',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
    },
  },
  {
    id: 'gpio-tact-4pin',
    deviceName: '4pin',
    tag: 'GPIO',
    category: 'タクトスイッチ',
    description:
      'ボタンを押している間だけ電気を流す部品です(chirimen チュートリアルでは 2pin のものを採用しています)',
    image: imageUrl('partsImgs/tactSwitch.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g103647/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Button',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO0',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
    },
  },
  {
    id: 'gpio-ss-10gl13',
    deviceName: 'SS-10GL13',
    tag: 'GPIO',
    category: 'マイクロスイッチ',
    description: '小型のスイッチです',
    image: imageUrl('partsImgs/microSw.jpeg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g114659/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Button',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO0',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
    },
  },
  {
    id: 'gpio-tp223',
    deviceName: 'TP223',
    tag: 'GPIO',
    category: 'タッチセンサ/スイッチ',
    description:
      'タッチセンサ(スイッチ)です。金属の近接(1-2mm程度の接近)も感知でき応用が利きます。',
    image: imageUrl('partsImgs/TP223.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B0829VBS5L/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
      circuit:
        'https://tutorial.chirimen.org/pizero/esm-examples/gpio-onchange/index.html#gpio',
      datasheet:
        'https://files.seeedstudio.com/wiki/Grove-Touch_Sensor/res/TTP223.pdf',
    },
  },
];
