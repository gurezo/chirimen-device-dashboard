import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import type {
  DeviceInfo,
  ExampleInfo,
  ProductInfo,
} from '@chirimen-device-dashboard/shared-types';

const PARTSLIST_CSV_URL =
  'https://raw.githubusercontent.com/chirimen-oh/chirimen.org/master/_data/partslist.csv';
const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/chirimen-oh/chirimen.org/master/';
const OUTPUT_PATH = path.join(
  process.cwd(),
  'apps',
  'web',
  'public',
  'devices.json'
);

type DeviceTag =
  | 'GPIO'
  | 'I2C'
  | 'Analog'
  | 'Actuator'
  | 'Other'
  | 'BoardComputer';

const INTERFACE_TO_TAG: Record<string, DeviceTag> = {
  I2C: 'I2C',
  GPIO: 'GPIO',
  アナログ: 'Analog',
  アクチュエータ: 'Actuator',
  その他: 'Other',
  ボードコンピューター: 'BoardComputer',
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',' || char === '\n') {
        current.push(field.trim());
        field = '';
        if (char === '\n') {
          if (current.some((c) => c !== '')) {
            rows.push(current);
          }
          current = [];
        }
      } else {
        field += char;
      }
    }
  }

  if (field !== '' || current.length > 0) {
    current.push(field.trim());
    rows.push(current);
  }

  return rows;
}

function toSlug(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'device'
  );
}

function buildExample(
  chirimen?: string,
  microbit?: string,
  piZero?: string
): ExampleInfo[] {
  const examples: ExampleInfo[] = [];
  if (chirimen?.trim())
    examples.push({ hardware: 'chirimen', code: chirimen.trim() });
  if (microbit?.trim())
    examples.push({ hardware: 'microbit', code: microbit.trim() });
  if (piZero?.trim())
    examples.push({ hardware: 'piZero', code: piZero.trim() });
  return examples;
}

function toImageUrl(imageUrl: string): string {
  const trimmed = imageUrl?.trim() ?? '';
  if (!trimmed) return './no_image.png';
  if (trimmed.startsWith('http')) return trimmed;
  return `${IMAGE_BASE_URL}${trimmed}`;
}

function rowToDeviceInfo(row: string[]): DeviceInfo | null {
  const padded = [...row, ...Array(16).fill('')].slice(0, 16);
  const [
    iface,
    category,
    deviceName,
    productUrl,
    description,
    imageUrl,
    sampleCodeUrl,
    circuitUrl,
    datasheetUrl,
    referenceUrl,
    noteUrl,
    specUrl,
    instructionsUrl,
    guideUrl,
    microbitUrl,
    piZeroUrl,
  ] = padded;

  const tag = INTERFACE_TO_TAG[iface?.trim() ?? ''];
  if (!tag) return null;

  const slug = toSlug(deviceName?.trim() ?? '');
  if (!slug) return null;

  const product: ProductInfo = {
    url: productUrl?.trim() ?? '',
    example: buildExample(
      sampleCodeUrl,
      microbitUrl,
      piZeroUrl
    ),
  };
  if (circuitUrl?.trim()) product.circuit = circuitUrl.trim();
  if (datasheetUrl?.trim()) product.datasheet = datasheetUrl.trim();
  if (referenceUrl?.trim()) product.reference = referenceUrl.trim();
  if (noteUrl?.trim()) product.note = noteUrl.trim();
  if (specUrl?.trim()) product.spec = specUrl.trim();
  if (instructionsUrl?.trim()) product.instructions = instructionsUrl.trim();
  if (guideUrl?.trim()) product.guide = guideUrl.trim();

  return {
    id: `${tag.toLowerCase()}-${slug}`,
    deviceName: deviceName?.trim() ?? '',
    tag,
    category: category?.trim() ?? '',
    description: description?.trim() ?? '',
    image: toImageUrl(imageUrl ?? ''),
    product,
  };
}

function assignUniqueIds(devices: DeviceInfo[]): DeviceInfo[] {
  const idCount = new Map<string, number>();

  return devices.map((d) => {
    const baseId = `${d.tag.toLowerCase()}-${toSlug(d.deviceName)}`;
    const count = idCount.get(baseId) ?? 0;
    idCount.set(baseId, count + 1);

    const id = count === 0 ? baseId : `${baseId}-${count}`;
    return { ...d, id };
  });
}

async function main(): Promise<void> {
  console.log('Fetching partslist.csv...');
  const response = await axios.get<string>(PARTSLIST_CSV_URL, {
    responseType: 'text',
  });
  const csvText = response.data;

  console.log('Parsing CSV...');
  const rows = parseCsv(csvText);
  const dataRows = rows.slice(1);

  console.log(`Processing ${dataRows.length} rows...`);
  const devices: DeviceInfo[] = [];
  dataRows.forEach((row) => {
    const device = rowToDeviceInfo(row);
    if (device) devices.push(device);
  });

  const uniqueDevices = assignUniqueIds(devices);

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(uniqueDevices, null, 2),
    'utf-8'
  );
  console.log(`Wrote ${uniqueDevices.length} devices to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
