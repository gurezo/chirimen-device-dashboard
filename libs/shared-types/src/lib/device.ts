export interface ExampleInfo {
  hardware: string; // Raspbery Pi 3/4/5, Pi Zero, microbit
  code: string; // サンプルコードURL
}

export interface ProductInfo {
  url: string; // 商品URL
  example: ExampleInfo[]; // サンプルコード情報配列
  circuit?: string; // 回路図URL
  datasheet?: string; // データシートURL
  reference?: string; // 製造元資料URL
  note?: string; // アプリケーションノートURL
  spec?: string; // 仕様書URL
  instructions?: string; // 説明書URL
  guide?: string; // 説明書URL
}

export interface DeviceInfo {
  id: string;
  deviceName: string; // 型番 ADS1015
  tag: 'GPIO' | 'I2C' | 'Analog' | 'Actuator' | 'Other' | 'BoardComputer';
  category: string; // ADC(アナログ電圧測定) / サーモグラフィ / Other
  description: string; // 説明
  image: string; // 画像URL
  product: ProductInfo; // 商品情報
}
