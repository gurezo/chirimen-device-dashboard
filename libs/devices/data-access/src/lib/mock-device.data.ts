import type { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

export type { DeviceInfo };

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
 * chirimen.org partslist.csv の L2-L55 (I2C)、L56-L75 (GPIO)、L76-L108 (Analog, Actuator, Other, BoardComputer, GPIO) より作成
 * @see https://github.com/gurezo/chirimen.org/blob/master/_data/partslist.csv
 */
export const MOCK_DEVICES: DeviceInfo[] = [
  // I2C L2-L55
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
  // I2C L12-L55
  {
    id: 'i2c-vl53l1x',
    deviceName: 'VL53L1X',
    tag: 'I2C',
    category: '距離センサ',
    description: 'VL53L0Xより高出力長距離タイプ',
    image: imageUrl('partsImgs/VL53L1X.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/3938/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-VL53L1X',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_VL53L1X',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_vl53l1x'
      ),
    },
  },
  {
    id: 'i2c-vl6180x',
    deviceName: 'VL6180X',
    tag: 'I2C',
    category: '距離センサ',
    description:
      '短距離(0mm-255mm)をレーザを使って精密に測定するセンサです',
    image: imageUrl('partsImgs/VL6180X.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B093WQHFK5/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_vl6180x'
      ),
      datasheet: 'https://www.st.com/resource/en/datasheet/vl6180x.pdf',
    },
  },
  {
    id: 'i2c-grove-gesture-paj7620u2',
    deviceName: 'Grove-Gesture (PAJ7620U2)',
    tag: 'I2C',
    category: 'ジェスチャーセンサ',
    description:
      '手を「上、下、左、右、遠ざかる、近づく、時計回り、反時計回り、手を振る」と動かしたときにそれらを検出するセンサです',
    image: imageUrl('partsImgs/Grove-Gesture.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/2645/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-Gesture',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_paj7620'
      ),
      circuit:
        'https://github.com/SeeedDocument/Grove_Gesture_V_1.0/raw/master/res/Grove_-_Gesture_v1.0_sch_pcb.zip',
      datasheet:
        'https://github.com/SeeedDocument/Grove_Gesture_V_1.0/raw/master/res/PAJ7620U2_Datasheet_V0.8_20140611.pdf',
      reference: 'http://wiki.seeedstudio.com/Grove-Gesture_v1.0/',
    },
  },
  {
    id: 'i2c-grove-light-tsl2561',
    deviceName: 'Grove-Light (TSL2561)',
    tag: 'I2C',
    category: '光センサ',
    description: '0.1lx から 40000lx まで測定可能な照度センサです',
    image: imageUrl('partsImgs/Grove-Light.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/1174/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-Light',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_tsl2561'
      ),
      circuit:
        'https://github.com/SeeedDocument/Grove-Digital_Light_Sensor/raw/master/res/Digital%20light%20sensor%20v1.0%20Sch.pdf',
      datasheet:
        'https://raw.githubusercontent.com/SeeedDocument/Grove-Digital_Light_Sensor/master/res/TSL2561T.pdf',
      reference: 'https://wiki.seeedstudio.com/Grove-Digital_Light_Sensor/',
    },
  },
  {
    id: 'i2c-tsl2591',
    deviceName: 'TSL2591',
    tag: 'I2C',
    category: '環境光センサ',
    description: '環境光センサです',
    image: imageUrl('partsImgs/TSL2591.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/s?k=TSL2591',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_tsl2591'
      ),
      datasheet:
        'https://cdn-shop.adafruit.com/datasheets/TSL25911_Datasheet_EN_v1.pdf',
      reference: 'https://ams.com/ja/tsl25911',
    },
  },
  {
    id: 'i2c-grove-oleddisplay-ssd1308',
    deviceName: 'Grove-OledDisplay (SSD1308)',
    tag: 'I2C',
    category: '小型ディスプレイ',
    description: '0.96inch、128x64dot の小型 OLED (有機 EL) ディスプレイです',
    image: imageUrl('partsImgs/SSD1306.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/829/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-OledDisplay',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ssd1308'
      ),
      reference: 'http://wiki.seeedstudio.com/Grove-OLED_Display_0.96inch/',
    },
  },
  {
    id: 'i2c-ssd1306',
    deviceName: 'SSD1306',
    tag: 'I2C',
    category: '小型ディスプレイ',
    description: '0.96inch、128x64dot の小型 OLED (有機 EL) ディスプレイです',
    image: imageUrl('partsImgs/SSD1306.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g112031/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-OledDisplay',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ssd1306'
      ),
      datasheet: 'https://akizukidenshi.com/catalog/g/g112031/',
    },
  },
  {
    id: 'i2c-grove-touch-mpr121',
    deviceName: 'Grove-Touch (MPR121)',
    tag: 'I2C',
    category: 'タッチセンサ',
    description: '指などの接触を検出するセンサです',
    image: imageUrl('partsImgs/LED.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/825/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-Touch',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_mpr121'
      ),
      datasheet: 'https://www.sparkfun.com/datasheets/Components/MPR121.pdf',
      reference: 'http://wiki.seeedstudio.com/Grove-I2C_Touch_Sensor/',
    },
  },
  {
    id: 'i2c-m5-qr-scanner',
    deviceName: 'm5 QRコードスキャナーユニット (STM32F030)',
    tag: 'I2C',
    category: 'QRコードリーダ',
    description: 'QRコードのリーダです',
    image: imageUrl('partsImgs/m5QRscanner.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/9508',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_qrcodescanner'
      ),
      reference: 'https://shop.m5stack.com/products/qr-code-scanner-unit-stm32f030',
    },
  },
  {
    id: 'i2c-m5-rfid2-ws1850s',
    deviceName: 'm5 RFID 2 (WS1850S)',
    tag: 'I2C',
    category: 'RFIDリーダ',
    description: '13.56MHzのRFIDのリーダ/ライターです',
    image: imageUrl('partsImgs/RFID2_WS1850S.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/8301',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ws1850s'
      ),
      reference: 'https://docs.m5stack.com/en/unit/rfid2',
    },
  },
  {
    id: 'i2c-s11059',
    deviceName: 'S11059',
    tag: 'I2C',
    category: 'カラーセンサ',
    description: 'RGB 各色と赤外線の強度を測定するセンサです',
    image: imageUrl('partsImgs/S11059.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108316/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-S11059',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C4_S11059',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_s11059'
      ),
      datasheet:
        'http://akizukidenshi.com/download/ds/hamamatsu/s11059-02dt.pdf',
    },
  },
  {
    id: 'i2c-veml6070',
    deviceName: 'VEML6070',
    tag: 'I2C',
    category: '紫外線(UV)センサ',
    description: '紫外線の強度を測定できるセンサです',
    image: imageUrl('partsImgs/VEML6070.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/2748/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-VEML6070',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_VEML6070',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_veml6070'
      ),
      datasheet:
        'https://cdn-shop.adafruit.com/product-files/2899/C4170_veml6070.pdf',
    },
  },
  {
    id: 'i2c-ltr390',
    deviceName: 'LTR390',
    tag: 'I2C',
    category: '紫外線(UV)センサ',
    description: '紫外線の強度を測定できるセンサです',
    image: imageUrl('partsImgs/LTR390.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g116365/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ltr390'
      ),
      datasheet:
        'https://cdn-learn.adafruit.com/downloads/pdf/adafruit-ltr390-uv-sensor.pdf',
      note: 'https://www.adafruit.com/product/4831',
    },
  },
  {
    id: 'i2c-as3935',
    deviceName: 'AS3935',
    tag: 'I2C',
    category: '雷センサ',
    description: '雷を検出しその距離を推定できるセンサです',
    image: imageUrl('partsImgs/AS3935.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108685/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_as3935'
      ),
      datasheet:
        'https://www.sciosense.com/wp-content/uploads/documents/AS3935-Data-Sheet.pdf',
      reference:
        'https://www.sciosense.com/products/wireless-sensor-nodes/as3935-franklin-lightning-sensor-ic/',
      note: 'https://akizukidenshi.com/download/ds/akizuki/AE-AS3935_20230208.pdf',
    },
  },
  {
    id: 'i2c-grove-accelerometer-adxl345',
    deviceName: 'Grove-Accelerometer (ADXL345)',
    tag: 'I2C',
    category: '3軸加速度センサ',
    description: '3軸の加速度を検出できるセンサです',
    image: imageUrl('partsImgs/LED.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/972/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-Grove-Accelerometer',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_adxl345'
      ),
      reference:
        'http://wiki.seeedstudio.com/Grove-3-Axis_Digital_Accelerometer-16g/',
    },
  },
  {
    id: 'i2c-mpu6050',
    deviceName: 'MPU6050',
    tag: 'I2C',
    category: '3軸加速度+ジャイロ 複合センサ',
    description:
      '3軸の加速度に加え、ジャイロの測定も可能な複合センサです',
    image: imageUrl('partsImgs/MPU6050.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/5025/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-MPU6050',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_MPU6050',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_mpu6050'
      ),
      circuit:
        'http://aitendo3.sakura.ne.jp/aitendo_data/product_img/sensor/accelerometer/MPU6050/MPU6050-sch.jpg',
      datasheet:
        'http://aitendo3.sakura.ne.jp/aitendo_data/product_img/sensor/accelerometer/MPU6050/PS-MPU-6000A-00_v1.0.pdf',
    },
  },
  {
    id: 'i2c-mpu9250',
    deviceName: 'MPU9250',
    tag: 'I2C',
    category: '3軸加速度+ジャイロ+磁気 複合センサ',
    description:
      '3軸の加速度、ジャイロのほか、磁気も測定可能な複合センサです',
    image: imageUrl('partsImgs/MPU9250_.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/HiLetgo%C2%AE-MPU9250-9%E8%87%AA%E7%94%B1%E5%BA%A61-%E3%82%B8%E3%83%A3%E3%82%A4%E3%83%AD%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97-%E7%A3%81%E6%B0%97%E3%82%BB%E3%83%B3%E3%82%B5/dp/B0154PM102/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-MPU9250',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_MPU9250',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_mpu9250'
      ),
      spec: 'https://strawberry-linux.com/pub/PS-MPU-9250A-01.pdf',
      instructions: 'https://strawberry-linux.com/pub/RM-MPU-9250A-00.pdf',
    },
  },
  {
    id: 'i2c-icm20948',
    deviceName: 'ICM20948',
    tag: 'I2C',
    category: '3軸加速度+ジャイロ+磁気 複合センサ',
    description:
      '3軸の加速度、ジャイロのほか、磁気も測定可能な複合センサです',
    image: imageUrl('partsImgs/ICM20948.jpg'),
    product: {
      url: 'https://strawberry-linux.com/catalog/items?code=20948',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_icm20948'
      ),
      datasheet:
        'https://invensense.tdk.com/download-pdf/icm-20948-datasheet/',
      reference: 'https://www.switch-science.com/products/5854',
      spec: 'https://strawberry-linux.com/pub/PS-MPU-9250A-01.pdf',
      instructions: 'https://strawberry-linux.com/pub/icm-20948-manual.pdf',
    },
  },
  {
    id: 'i2c-as5600',
    deviceName: 'AS5600',
    tag: 'I2C',
    category: '磁気式エンコーダ(回転角センサ)',
    description: '非接触で高分解能の角度を検出できるエンコーダです',
    image: imageUrl('partsImgs/AS5600.jpg'),
    product: {
      url: 'https://electronicwork.shop/items/64205dc6cd92fe0096fb7d5c',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_as5600'
      ),
      reference:
        'https://ams-osram.com/ja/products/sensors/position-sensors/ams-as5600-position-sensor',
    },
  },
  {
    id: 'i2c-neopixel-led-controller',
    deviceName: 'Neopixel LEDコントローラ',
    tag: 'I2C',
    category: 'フルカラーLED アレイ',
    description:
      '多数のフルカラー LED を個々に制御可能なコントローラです(詳細はExamplesをご覧ください)',
    image: imageUrl('partsImgs/neopixelI2c.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-NEOPIXEL_I2C',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C5_NEOPIXEL',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_neopixel-i2c'
      ),
    },
  },
  {
    id: 'i2c-neopixel-led-8x8',
    deviceName: 'Neopixel LED 8x8',
    tag: 'I2C',
    category: 'フルカラーLED アレイ',
    description: 'NEOPIXEL対応の 8x8 LED パネルです',
    image: imageUrl('partsImgs/neopixel64.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B07KG3Y2BG/',
      example: buildExample(
        undefined,
        undefined,
        undefined
      ),
      reference: 'https://learn.adafruit.com/adafruit-neopixel-uberguide',
    },
  },
  {
    id: 'i2c-neopixel-led-12x12',
    deviceName: 'Neopixel LED 12x12',
    tag: 'I2C',
    category: 'フルカラーLED アレイ',
    description: '円形のパネルです',
    image: imageUrl('partsImgs/neopixel12.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(undefined, undefined, undefined),
    },
  },
  {
    id: 'i2c-neopixel-led-60x60',
    deviceName: 'Neopixel LED 60x60',
    tag: 'I2C',
    category: 'フルカラーLED アレイ',
    description:
      '20個のパネルを3つ組み合わせることで60個のパネルとなります',
    image: imageUrl('partsImgs/neopixel60.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(undefined, undefined, undefined),
    },
  },
  {
    id: 'i2c-ht16k33-8x8-1',
    deviceName: 'HT16K33搭載 8x8LEDモジュール（その１）',
    tag: 'I2C',
    category: 'LED マトリックス',
    description:
      'マトリクス LED 制御可能なコントローラが搭載されたLEDモジュールです(詳細はExamplesをご覧ください)。 Adafruitの8x8LED搭載品と　Keyestudio KS0336 8*8 Matrix Module I2Cはピン配置を除き同等品です',
    image: imageUrl('partsImgs/HT16K33.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/1493',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-HT16K33',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ht16k33'
      ),
      circuit: 'https://cdn-shop.adafruit.com/datasheets/ht16K33v110.pdf',
      datasheet: 'https://www.adafruit.com/product/870',
      reference: 'https://learn.adafruit.com/adafruit-led-backpack',
      guide: 'https://ja.aliexpress.com/item/32886174149.html',
    },
  },
  {
    id: 'i2c-ht16k33-8x8-2',
    deviceName: 'HT16K33搭載 8x8LEDモジュール（その２）',
    tag: 'I2C',
    category: 'LED マトリックス',
    description:
      '上記と同等のコントローラですが、LEDの論理配列が異なるaitendo製8x8LEDモジュールです。ドライバの設定が若干個なります。',
    image: imageUrl('partsImgs/HT16K33_8x8ait.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/12822',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-HT16K33',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ht16k33'
      ),
      circuit: 'https://cdn-shop.adafruit.com/datasheets/ht16K33v110.pdf',
    },
  },
  {
    id: 'i2c-ht16k33-16x8',
    deviceName: 'HT16K33搭載 16x8LEDモジュール',
    tag: 'I2C',
    category: 'LED マトリックス',
    description: '上記と同等のコントローラが載った、16x8マトリクスLEDのモジュールです。',
    image: imageUrl('partsImgs/HT16K33_16x8.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/16658',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-HT16K33',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ht16k33'
      ),
      circuit: 'https://cdn-shop.adafruit.com/datasheets/ht16K33v110.pdf',
    },
  },
  {
    id: 'i2c-ht16k33-7seg',
    deviceName: 'HT16K33搭載 7セグメントLEDモジュール',
    tag: 'I2C',
    category: 'LED マトリックス',
    description: '上記と同等のコントローラが載った、7セグメントLEDのモジュールです。',
    image: imageUrl('partsImgs/HT16K33_7seg.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/14540',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-HT16K33',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ht16k33'
      ),
      circuit: 'https://cdn-shop.adafruit.com/datasheets/ht16K33v110.pdf',
    },
  },
  {
    id: 'i2c-ht16k33-14seg',
    deviceName: 'HT16K33搭載 14セグメントLEDモジュール',
    tag: 'I2C',
    category: 'LED マトリックス',
    description: '上記と同等のコントローラが載った、14セグメントLEDのモジュールです。',
    image: imageUrl('partsImgs/HT16K33_14seg.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/20812',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-HT16K33',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ht16k33'
      ),
      circuit: 'https://cdn-shop.adafruit.com/datasheets/ht16K33v110.pdf',
    },
  },
  {
    id: 'i2c-pca9685',
    deviceName: 'PCA9685',
    tag: 'I2C',
    category: 'サーボモータ・DCモータ コントローラ',
    description:
      'サーボモータ(アームを指定した角度に動かすことのできるアクチュエータ)を PWMで制御できる部品で、サーボモータを利用する際に必要です(モータ本体はアクチュエータの項を参照)',
    image: imageUrl('partsImgs/PCA9685.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/961/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCA9685',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C8_PCA9685',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pca9685'
      ),
      datasheet: 'https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf',
      guide: 'https://learn.adafruit.com/16-channel-pwm-servo-driver',
    },
  },
  {
    id: 'i2c-pca9685-pwm',
    deviceName: 'PCA9685 PWM',
    tag: 'I2C',
    category: 'サーボモータ・DCモータ コントローラ',
    description: '詳細はExamplesをご覧ください',
    image: imageUrl('partsImgs/PCA9685.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/961/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-I2C-PWMHBridge-1',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_hbridge2-pca9685pwm'
      ),
    },
  },
  {
    id: 'i2c-sht30-31',
    deviceName: 'SHT30/31',
    tag: 'I2C',
    category: '温湿度複合センサ',
    description: '温度と湿度の両方が測定可能なセンサ',
    image: imageUrl('partsImgs/SHT30.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/6559/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-SHT30',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C7_SHT30',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_sht30'
      ),
      datasheet:
        'https://sensirion.com/media/documents/213E6A3B/63A5A569/Datasheet_SHT3x_DIS.pdf',
    },
  },
  {
    id: 'i2c-sht40-41',
    deviceName: 'SHT40/41',
    tag: 'I2C',
    category: '温湿度複合センサ',
    description: '温度と湿度の両方が測定可能なセンサ',
    image: imageUrl('partsImgs/SHT40.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g116366/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_sht40'
      ),
      reference: 'https://sensirion.com/jp/products/product-catalog/SHT40',
    },
  },
  {
    id: 'i2c-aht10',
    deviceName: 'AHT10',
    tag: 'I2C',
    category: '温湿度複合センサ',
    description: '温度と湿度の両方が測定可能なセンサ',
    image: imageUrl('partsImgs/AHT10.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/gp/product/B09PR278XN',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_aht10'
      ),
    },
  },
  {
    id: 'i2c-aht20',
    deviceName: 'AHT20',
    tag: 'I2C',
    category: '温湿度複合センサ',
    description: '温度と湿度の両方が測定可能なセンサ',
    image: imageUrl('partsImgs/ENS160_AHT20.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B0D2WVHPDN?th=1',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_aht20'
      ),
      datasheet:
        'https://files.seeedstudio.com/wiki/Grove-AHT20_I2C_Industrial_Grade_Temperature_and_Humidity_Sensor/AHT20-datasheet-2020-4-16.pdf',
    },
  },
  {
    id: 'i2c-htu21d',
    deviceName: 'HTU21D',
    tag: 'I2C',
    category: '温湿度複合センサ',
    description: '温度と湿度の両方が測定可能なセンサ',
    image: imageUrl('partsImgs/HTU21D.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B08R5Z5DQM/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-HTU21D',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_htu21d'
      ),
      datasheet: 'https://cdn-shop.adafruit.com/datasheets/1899_HTU21D.pdf',
    },
  },
  {
    id: 'i2c-tcs34725',
    deviceName: 'TCS34725',
    tag: 'I2C',
    category: '色センサ',
    description: 'I2C接続の色センサー',
    image: imageUrl('partsImgs/TCS34725.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108220/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-TCS34725',
        undefined,
        undefined
      ),
    },
  },
  {
    id: 'i2c-ina219',
    deviceName: 'INA219',
    tag: 'I2C',
    category: '電流センサ',
    description: '比較的大きなDC電流を測定するセンサ',
    image: imageUrl('partsImgs/INA219.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108221/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-INA219',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_INA219',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ina219'
      ),
    },
  },
  {
    id: 'i2c-mlx90614',
    deviceName: 'MLX90614',
    tag: 'I2C',
    category: '非接触温度センサ',
    description: '赤外線を利用した非接触型温度センサー',
    image: imageUrl('partsImgs/MLX90614.jpg'),
    product: {
      url: 'https://www.sengoku.co.jp/mod/sgk_cart/detail.php?code=EEHD-4EZP',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-MLX90614',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_MLX90614',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_mlx90614'
      ),
    },
  },
  {
    id: 'i2c-apds9960',
    deviceName: 'APDS9960',
    tag: 'I2C',
    category: '近接・環境光・ジェスチャーセンサー',
    description: '近接・環境光・ジェスチャーを読み取るセンサー',
    image: imageUrl('partsImgs/APDS9960.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/3531/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-APDS9960',
        undefined,
        undefined
      ),
    },
  },
  {
    id: 'i2c-seesaw',
    deviceName: 'seesaw',
    tag: 'I2C',
    category: '多目的インターフェイス',
    description:
      'デジタル・アナログ入力・PWM出力・NeopixelLEDドライブ等の機能を持つ多目的ボード',
    image: imageUrl('partsImgs/seesaw.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/3551/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-seesaw',
        undefined,
        undefined
      ),
    },
  },
  {
    id: 'i2c-bh1750',
    deviceName: 'BH1750',
    tag: 'I2C',
    category: '照度センサー',
    description: '照度センサー',
    image: imageUrl('partsImgs/BH1750.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B011IGZD7E',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-BH1750',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_BH1750',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_bh1750'
      ),
    },
  },
  {
    id: 'i2c-scd40',
    deviceName: 'SCD40',
    tag: 'I2C',
    category: 'CO2センサ',
    description:
      'CO2センサ(CO2濃度がPPM値で高精度に計測できるセンサーです)',
    image: imageUrl('partsImgs/SCD40.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/7169',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-SCD40',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_scd40'
      ),
      datasheet:
        'https://cdn.sparkfun.com/assets/d/4/9/a/d/Sensirion_CO2_Sensors_SCD4x_Datasheet.pdf',
      reference:
        'https://www.macnica.co.jp/business/semiconductor/articles/sensirion/140173/',
    },
  },
  {
    id: 'i2c-ccs811',
    deviceName: 'CCS811',
    tag: 'I2C',
    category: 'CO2+TVOCセンサ',
    description: 'CO2+TVOCセンサ',
    image: imageUrl('partsImgs/CCS811.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B086HCSM6N/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-CCS811',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_CCS811',
        undefined
      ),
    },
  },
  {
    id: 'i2c-ens160',
    deviceName: 'ENS160',
    tag: 'I2C',
    category: 'CO2+TVOCセンサ',
    description: 'CO2+TVOCセンサ',
    image: imageUrl('partsImgs/ENS160_AHT20.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B0D41R4V3Z',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ens160'
      ),
      datasheet:
        'https://www.mouser.com/datasheet/2/1081/SC_001224_DS_1_ENS160_Datasheet_Rev_0_95-2258311.pdf',
      reference:
        'https://www.sciosense.com/ens16x-digital-metal-oxide-multi-gas-sensor-family/',
    },
  },
  {
    id: 'i2c-sgp40',
    deviceName: 'SGP40',
    tag: 'I2C',
    category: 'VOC(ガス)センサ',
    description: '揮発性有機化合物（VOC）センサ',
    image: imageUrl('partsImgs/SGP40.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/7287',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_sgp40'
      ),
      datasheet:
        'https://docs.rs-online.com/1956/A700000007055193.pdf',
      reference: 'https://sensirion.com/products/catalog/SGP40',
    },
  },
  {
    id: 'i2c-bme680',
    deviceName: 'BME680',
    tag: 'I2C',
    category: '温度, 湿度, 気圧, ガス 複合センサ',
    description: '温度、湿度、気圧さらにガスが測れる複合センサです',
    image: imageUrl('partsImgs/BME680.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/gK-14469/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-BME680',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_BME680',
        undefined
      ),
    },
  },
  {
    id: 'i2c-waveshare-20471',
    deviceName: 'WAVESHARE-20471',
    tag: 'I2C',
    category: '複合センサブレークアウト',
    description:
      '照度(TSL25911FN)+UV(LTR390)+温度/湿度/気圧(BME280)+VOC(ガス SGP40)+9軸モーション(ICM20948)センサを搭載',
    image: imageUrl('partsImgs/WAVESHARE-20471.jpg'),
    product: {
      url: 'https://www.switch-science.com/products/7540',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_waveshare20471'
      ),
      reference: 'https://www.waveshare.com/environment-sensor-hat.htm',
      guide: 'https://www.waveshare.com/wiki/Environment_Sensor_HAT',
    },
  },
  // GPIO L56-L75
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
  // GPIO L66-L75
  {
    id: 'gpio-2sk4017',
    deviceName: '2SK4017',
    tag: 'GPIO',
    category: 'Nch パワーMOSFET',
    description: '直流電流の On/Off 制御を行う部品です',
    image: imageUrl('partsImgs/FET.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g107597/',
      example: buildExample(
        'https://tutorial.chirimen.org/raspi/section1#section-9',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO3',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
      circuit: 'https://tutorial.chirimen.org/raspi/section1#section-9',
    },
  },
  {
    id: 'gpio-irf520',
    deviceName: 'IRF520 (ドライバモジュール)',
    tag: 'GPIO',
    category: 'Nch パワーMOSFETモジュール',
    description:
      '上のFETを利用したモーター制御と同等の回路が組まれたモジュールです IRF520 パワーMOSFETが用られています',
    image: imageUrl('partsImgs/FET2.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/18055',
      example: buildExample(
        'https://tutorial.chirimen.org/raspi/section1#section-9',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO3',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
      circuit: 'https://tutorial.chirimen.org/raspi/section1#section-9',
      datasheet:
        'http://aitendo3.sakura.ne.jp/aitendo_data/product_img/motor/M520S3/M520S3.pdf',
    },
  },
  {
    id: 'gpio-d4184',
    deviceName: 'D4184 (ドライバモジュール)',
    tag: 'GPIO',
    category: 'Nch パワーMOSFETモジュール',
    description:
      '上のFETを利用したモーター制御と同等の回路が組まれたモジュールです D4184 パワーMOSFETが用られています',
    image: imageUrl('partsImgs/D4184.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B084VNKLFL',
      example: buildExample(
        'https://tutorial.chirimen.org/raspi/section1#section-9',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO3',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
      circuit: 'https://tutorial.chirimen.org/raspi/section1#section-9',
      reference:
        'https://forum.fritzing.org/t/xy-mos-d4184-dual-mosfet/12920/14',
    },
  },
  {
    id: 'gpio-l298n',
    deviceName: 'L298N (ドライバモジュール)',
    tag: 'GPIO',
    category: 'DCモーター 正逆転コントローラ',
    description:
      'STマイクロ社のフルブリッジドライバである L298N を使用したDCモーターコントローラです',
    image: imageUrl('partsImgs/L298N.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g106680/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-HBridge',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_HBridge',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hbridge1'
      ),
    },
  },
  {
    id: 'gpio-l9110s',
    deviceName: 'L9110S',
    tag: 'GPIO',
    category: 'DCモータ 正逆転コントローラ',
    description: 'L9110を使用したDCモータコントローラです',
    image: imageUrl('partsImgs/L9110S.jpeg'),
    product: {
      url: 'https://www.amazon.co.jp/HiLetgo-L9110S-H%E3%83%96%E3%83%AA%E3%83%83%E3%82%B8-%E3%83%A2%E3%83%BC%E3%82%BF%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96-%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9%E3%83%9C%E3%83%BC%E3%83%89/dp/B011DT3OAY',
      example: buildExample(
        undefined,
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_HBridge',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hbridge1'
      ),
      datasheet: 'https://www.elecrow.com/download/datasheet-l9110.pdf',
    },
  },
  {
    id: 'gpio-mx1508',
    deviceName: 'MX1508',
    tag: 'GPIO',
    category: 'DCモータ 正逆転コントローラ',
    description: 'L298N を使用したDCモータコントローラです',
    image: imageUrl('partsImgs/MX1508.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/MX1508-%E3%83%A2%E3%83%BC%E3%82%BF%E3%83%89%E3%83%A9%E3%82%A4%E3%83%90%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB-%E9%80%9F%E5%BA%A6%E3%83%87%E3%83%A5%E3%82%A2%E3%83%AB-%E3%83%96%E3%83%AA%E3%83%83%E3%82%B8%E3%82%B9%E3%83%86%E3%83%83%E3%83%94%E3%83%B3%E3%82%B0%E3%83%A2%E3%83%BC%E3%82%BF%E3%83%89%E3%83%A9%E3%82%A4%E3%83%90%E3%83%9C%E3%83%BC%E3%83%89%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB-L298N/dp/B07P2TL2SF',
      example: buildExample(
        undefined,
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_HBridge',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hbridge1'
      ),
      datasheet: 'https://akizukidenshi.com/download/ds/st/l298n.pdf',
    },
  },
  {
    id: 'gpio-tb6612fng',
    deviceName: 'TB6612FNG',
    tag: 'GPIO',
    category: 'DCモータ 正逆転コントローラ',
    description: 'TOSHIBA製 TB6612FNG を利用したモータドライバです',
    image: imageUrl('partsImgs/TB6612FNG.jpg'),
    product: {
      url: 'https://www.switch-science.com/catalog/385/',
      example: buildExample(undefined, undefined, undefined),
      datasheet:
        'http://doc.switch-science.com/datasheets/TB6612FNG_datasheet_ja_20141001.pdf',
    },
  },
  {
    id: 'gpio-kp-ir412',
    deviceName: 'KP-IR412',
    tag: 'GPIO',
    category: '赤外線人感センサ',
    description: '人体に反応するセンサです',
    image: imageUrl('partsImgs/pyro1.jpg'),
    product: {
      url: 'https://eleshop.jp/shop/g/gE3336G/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-pirSensor',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_PYR',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
      datasheet:
        'http://www.kyohritsu.sakura.ne.jp/prowiki/index.php?%BF%CD%C2%CE%C0%D6%B3%B0%C0%FE%B4%B6%C3%CE%C1%C7%BB%D2%2FKP-IR412',
    },
  },
  {
    id: 'gpio-hc-sr501',
    deviceName: 'HC-SR501',
    tag: 'GPIO',
    category: '赤外線人感センサ',
    description: '人体に反応するセンサです',
    image: imageUrl('partsImgs/pyro2.jpg'),
    product: {
      url: 'https://chirimen.org/chirimen-micro-bit/examples/GPIO_PYR/GPIO0b.html',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-pirSensor',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_PYR',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
      datasheet: 'https://www.mpja.com/download/31227sc.pdf',
    },
  },
  {
    id: 'gpio-a4988',
    deviceName: 'A4988',
    tag: 'GPIO',
    category: 'ステッピングモータコントローラ',
    description: 'バイポーラステッピングモータを制御するドライバです',
    image: imageUrl('partsImgs/A4988.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/s?k=A4988&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-A4988',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_a4988'
      ),
      circuit: 'https://r.chirimen.org/examples/#GPIO-A4988',
      datasheet:
        'http://www.pololu.com/file/download/a4988_DMOS_microstepping_driver_with_translator.pdf?file_id=0J450',
    },
  },
  // Analog L76-L80
  {
    id: 'analog-rd-4p',
    deviceName: 'RD-4P',
    tag: 'Analog',
    category: '雨センサ',
    description: '雨(水)を検出するセンサです(GPIO)',
    image: imageUrl('partsImgs/rain.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/10280',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
    },
  },
  {
    id: 'analog-m-wl-j3y',
    deviceName: 'M-WL-J3Y',
    tag: 'Analog',
    category: '水センサ',
    description: '水を検出するセンサです',
    image: imageUrl('partsImgs/water.jpg'),
    product: {
      url: 'https://www.aitendo.com/product/7434',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-onchange'
      ),
    },
  },
  {
    id: 'analog-fsr-400',
    deviceName: 'FSR 400',
    tag: 'Analog',
    category: '圧力センサ(小)',
    description: '圧力が検知できるセンサです',
    image: imageUrl('partsImgs/pressureS.jpg'),
    product: {
      url: 'https://www.interlinkelectronics.com/fsr-400',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1x15'
      ),
    },
  },
  {
    id: 'analog-tsr-3386',
    deviceName: 'TSR-3386',
    tag: 'Analog',
    category: '可変抵抗',
    description: '抵抗値を変化させられる抵抗です',
    image: imageUrl('partsImgs/VR.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1x15'
      ),
      datasheet: 'http://akizukidenshi.com/download/ds/suntan/tsr-3386.pdf',
    },
  },
  {
    id: 'analog-loadcell',
    deviceName: 'ジェネリック品多種',
    tag: 'Analog',
    category: 'ロードセル',
    description:
      '加重により抵抗値が微少に変化する素子。差動入力にしたADS1115で利用可能です',
    image: imageUrl('partsImgs/LoadCell.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(
        'http://chirimen.org/chirimen/gc/top/examples/#I2C-ADS1115-LoadCell',
        'https://chirimen.org/chirimen-micro-bit/examples/#I2C_ADS1115_LoadCell',
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_ads1115-loadcell'
      ),
      reference: 'https://akizukidenshi.com/catalog/c/cloadcell/',
    },
  },
  // Actuator L81-L88
  {
    id: 'actuator-sg90',
    deviceName: 'SG90',
    tag: 'Actuator',
    category: 'サーボモータ',
    description:
      'Tower Pro 製の小型サーボモータです　同一型番の互換品も多数流通しています',
    image: imageUrl(''),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g108761/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCA9685',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pca9685'
      ),
      circuit: 'http://akizukidenshi.com/download/ds/towerpro/SG90_a.pdf',
    },
  },
  {
    id: 'actuator-mg90s',
    deviceName: 'MG90S',
    tag: 'Actuator',
    category: 'サーボモータ',
    description:
      'Tower Pro 製の小型サーボモータ　SG90と同サイズですがメタルギヤが使われています　同一型番の互換品も多数流通（写真はその一例）',
    image: imageUrl('partsImgs/MG90S.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g113227/',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCA9685',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pca9685'
      ),
      circuit: 'https://www.towerpro.com.tw/product/mg90s-3/',
    },
  },
  {
    id: 'actuator-es08maii',
    deviceName: 'ES08MAII',
    tag: 'Actuator',
    category: 'サーボモータ',
    description: 'E-MAXの小型サーボモータです　メタルギヤが使われています',
    image: imageUrl('partsImgs/ES08MAII.jpg'),
    product: {
      url: 'https://www.kkhobby.com/SHOP/SV070.html',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCA9685',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pca9685'
      ),
      circuit:
        'https://emax-usa.com/products/emx-sv-0275-es08ma-ii-metal-analog-servo',
    },
  },
  {
    id: 'actuator-mg995',
    deviceName: 'MG995',
    tag: 'Actuator',
    category: 'サーボモータ',
    description:
      'Tower Pro 製のサーボモータです　メタルギヤが使われています　同一型番の互換品も多数流通（写真はその一例）',
    image: imageUrl('partsImgs/MG995.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/s?k=MG995&i=hobby',
      example: buildExample(
        'https://r.chirimen.org/examples/#I2C-PCA9685',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#I2C_pca9685'
      ),
      circuit: 'https://www.towerpro.com.tw/product/mg995/',
    },
  },
  {
    id: 'actuator-dc-motor',
    deviceName: 'DCモータ',
    tag: 'Actuator',
    category: 'DCモータ',
    description: '各 Examples をご確認ください',
    image: imageUrl(''),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-HBridge',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO_HBridge',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hbridge1'
      ),
    },
  },
  {
    id: 'actuator-stepper-motor',
    deviceName: '多種(例はTS3692N65)',
    tag: 'Actuator',
    category: '2相バイポーラステッピングモータ',
    description: 'A4988をご確認ください',
    image: imageUrl('partsImgs/StepperMotor.jpg'),
    product: {
      url: 'https://wakamatsu.co.jp/biz/products/detail.php?product_id=62020023',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-A4988',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_HBridge',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_a4988'
      ),
      circuit: 'https://r.chirimen.org/examples/#GPIO-A4988',
    },
  },
  {
    id: 'actuator-chibi-gear-motor',
    deviceName: 'ちびギヤモータ',
    tag: 'Actuator',
    category: 'ギヤードモータ',
    description: '小型のギヤードモータです',
    image: imageUrl('partsImgs/chibiGear.jpg'),
    product: {
      url: 'https://tiisaishop.dip.jp/product/sg/',
      example: buildExample(
        undefined,
        'https://tutorial.chirimen.org/microbit/iot_actuate',
        'https://tutorial.chirimen.org/pizero/#gpio-2'
      ),
      reference: 'https://tiisai.dip.jp/?p=2676',
      guide: 'https://tutorial.chirimen.org/raspi/section1#section-9',
    },
  },
  {
    id: 'actuator-n20-gear-motor',
    deviceName: 'N20マイクロギヤモータ',
    tag: 'Actuator',
    category: 'ギヤードモータ',
    description: '小型のギヤードモータです',
    image: imageUrl('partsImgs/N20_GearMotor.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/gM-15143/',
      example: buildExample(
        undefined,
        'https://tutorial.chirimen.org/microbit/iot_actuate',
        'https://tutorial.chirimen.org/pizero/#gpio-2'
      ),
      datasheet:
        'https://akizukidenshi.com/download/ds/mercurymotor/MG1012-0669-150L.pdf',
      guide: 'https://tutorial.chirimen.org/raspi/section1#section-9',
    },
  },
  // Other L89-L93
  {
    id: 'other-breadboard',
    deviceName: 'ブレッドボード',
    tag: 'Other',
    category: 'その他',
    description: '',
    image: imageUrl('partsImgs/breadBoardS.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(),
    },
  },
  {
    id: 'other-jumper-wire',
    deviceName: 'ジャンパー線',
    tag: 'Other',
    category: 'その他',
    description: '',
    image: imageUrl('partsImgs/jumperFM.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(),
    },
  },
  {
    id: 'other-camera',
    deviceName: 'カメラ',
    tag: 'Other',
    category: 'その他',
    description: '',
    image: imageUrl('partsImgs/camera.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B073RCXGQS/',
      example: buildExample(
        'https://r.chirimen.org/examples/#OTHERS-CAMERA',
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_gpio-camera'
      ),
    },
  },
  {
    id: 'other-fan',
    deviceName: 'ファン',
    tag: 'Other',
    category: 'その他',
    description: '',
    image: imageUrl('partsImgs/fan.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(),
    },
  },
  {
    id: 'other-resistor',
    deviceName: '抵抗',
    tag: 'Other',
    category: 'その他',
    description: '',
    image: imageUrl('partsImgs/register.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(),
    },
  },
  // BoardComputer L94-L95
  {
    id: 'boardcomputer-microbit',
    deviceName: 'マイクロビット',
    tag: 'BoardComputer',
    category: 'ボードコンピューター',
    description: '',
    image: imageUrl('partsImgs/microbit.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/dp/B074N6D55L',
      example: buildExample(undefined, 'https://microbit.org/ja/guide/', undefined),
    },
  },
  {
    id: 'boardcomputer-breakout',
    deviceName: 'ブレークアウト',
    tag: 'BoardComputer',
    category: 'ボードコンピューター',
    description: '',
    image: imageUrl('partsImgs/microbitBreakout.jpg'),
    product: {
      url: 'https://chirimen.org/',
      example: buildExample(),
    },
  },
  // GPIO L97-L102
  {
    id: 'gpio-led-flexible-green',
    deviceName: 'フレキシブルＬＥＤ　緑色',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/M-18007.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g118007/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-led-flexible-red',
    deviceName: 'フレキシブルＬＥＤ　赤色',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/M-18006.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g118006/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-led-flexible-yellow',
    deviceName: 'フレキシブルＬＥＤ　黄色',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/M-18010.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g118010/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-led-flexible-pink',
    deviceName: 'フレキシブルＬＥＤ　ピンク色',
    tag: 'GPIO',
    category: 'LED',
    description:
      '通電すると光る部品です(必ず抵抗を挟んで利用してください)',
    image: imageUrl('partsImgs/M-18009.jpg'),
    product: {
      url: 'https://akizukidenshi.com/catalog/g/g118009/',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_hello-real-world'
      ),
    },
  },
  {
    id: 'gpio-isd1820',
    deviceName: 'ISD1820',
    tag: 'GPIO',
    category: 'ボイスレコーダ',
    description:
      '内蔵マイクで録音した音声(最大10秒)を再生する基板です。GPIOで再生や録音のコントロールができます',
    image: imageUrl('partsImgs/ISD1820.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/s?k=ISD1820',
      example: buildExample(
        'https://r.chirimen.org/examples/#GPIO-Blink',
        'https://chirimen.org/chirimen-micro-bit/examples/#GPIO1',
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_isd1820'
      ),
      circuit: 'https://tutorial.chirimen.org/pizero/esm-examples/gpio-onchange/index.html#gpio',
      instructions: 'https://www.kyohritsu.jp/eclib/PROD/MANUAL/kpisd1820.pdf',
    },
  },
  {
    id: 'gpio-dfplayer-mini',
    deviceName: 'DFPlayer Mini',
    tag: 'GPIO',
    category: 'MP3プレーヤー基板',
    description:
      'DFPlayer Miniおよびその互換品。microSDに保存したMP3ファイルの再生をコントロールできます',
    image: imageUrl('partsImgs/DFPlayerMini.jpg'),
    product: {
      url: 'https://www.amazon.co.jp/s?k=DFPlayer',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_dfplayer'
      ),
      reference: 'https://wiki.dfrobot.com/DFPlayer_Mini_SKU_DFR0299',
    },
  },
  // Other L103
  {
    id: 'other-gy-gps6mv2',
    deviceName: 'GY-GPS6MV2',
    tag: 'Other',
    category: 'GPSレシーバ',
    description:
      'NEO6Mモジュールを使用した、シリアル接続のGPSレシーバです。',
    image: imageUrl('partsImgs/GY-GPS6MV2.jpg'),
    product: {
      url: 'https://electronicwork.shop/items/625c1ca99fe3d707d725cbe1',
      example: buildExample(
        undefined,
        undefined,
        'https://tutorial.chirimen.org/pizero/esm-examples/#GPIO_serial_gps'
      ),
      datasheet:
        'https://content.u-blox.com/sites/default/files/products/documents/NEO-6_DataSheet_%28GPS.G6-HW-09005%29.pdf',
    },
  },
];
