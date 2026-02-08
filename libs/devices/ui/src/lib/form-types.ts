import type { DeviceInfo, ExampleInfo, ProductInfo } from '@chirimen-device-dashboard/shared-types';

/**
 * Form value type for DeviceFormComponent submit output.
 * Same shape as DeviceInfo; feature 層で create/update に渡す。
 */
export type DeviceFormValue = DeviceInfo;

/**
 * Form value type for a single item in the product.example FormArray.
 * ExampleArrayComponent が扱う 1 行分の値。
 */
export type ExampleFormItemValue = ExampleInfo;

/**
 * Form value type for product section (product FormGroup).
 * DeviceForm 内の product 部分の値の形。
 */
export type ProductFormValue = ProductInfo;
