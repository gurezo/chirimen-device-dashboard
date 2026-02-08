import type { DeviceInfo, ExampleInfo, ProductInfo } from '@chirimen-device-dashboard/shared-types';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

/** FormGroup の product.example 1 行分を生成 */
function createExampleFormGroup(item: Partial<ExampleInfo> = {}): FormGroup {
  return new FormGroup({
    hardware: new FormControl(item.hardware ?? '', { nonNullable: true }),
    code: new FormControl(item.code ?? '', { nonNullable: true }),
  });
}

/** Product 用 FormGroup を生成 */
function createProductFormGroup(product: Partial<ProductInfo> = {}): FormGroup {
  const examples = (product.example ?? []).map((e) => createExampleFormGroup(e));
  return new FormGroup({
    url: new FormControl(product.url ?? '', { nonNullable: true }),
    example: new FormArray(examples),
    circuit: new FormControl(product.circuit ?? ''),
    datasheet: new FormControl(product.datasheet ?? ''),
    reference: new FormControl(product.reference ?? ''),
    note: new FormControl(product.note ?? ''),
    spec: new FormControl(product.spec ?? ''),
    instructions: new FormControl(product.instructions ?? ''),
    guide: new FormControl(product.guide ?? ''),
  });
}

/**
 * Device 用 FormGroup を生成する。
 * feature-create / feature-edit で同一のフォーム構造を使うために利用する。
 * @param value 初期値（編集時は get で取得した DeviceInfo を渡す）
 */
export function createDeviceFormGroup(
  value?: Partial<DeviceInfo>
): FormGroup {
  const product = value?.product;
  return new FormGroup({
    id: new FormControl(value?.id ?? '', { nonNullable: true }),
    deviceName: new FormControl(value?.deviceName ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tag: new FormControl<'GPIO' | 'I2C' | 'Other'>(value?.tag ?? 'Other', {
      nonNullable: true,
    }),
    category: new FormControl(value?.category ?? '', { nonNullable: true }),
    description: new FormControl(value?.description ?? '', {
      nonNullable: true,
    }),
    image: new FormControl(value?.image ?? '', { nonNullable: true }),
    product: createProductFormGroup(product),
  });
}

/** product.example に 1 行追加するヘルパー */
export function addExampleRow(formArray: FormArray): void {
  formArray.push(createExampleFormGroup());
}
