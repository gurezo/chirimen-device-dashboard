export interface ExampleInfo {
  hardware: string;
  code: string;
}

export interface ProductInfo {
  url: string;
  example: ExampleInfo[];
  circuit?: string;
  datasheet?: string;
  reference?: string;
  note?: string;
  spec?: string;
  instructions?: string;
  guide?: string;
}

export interface DeviceInfo {
  id: string;
  deviceName: string;
  tag: 'GPIO' | 'I2C' | 'Other';
  category: string;
  description: string;
  image: string;
  product: ProductInfo;
}
