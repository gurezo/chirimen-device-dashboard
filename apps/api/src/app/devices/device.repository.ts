import { Injectable } from '@nestjs/common';
import { getFirestore } from '../firebase/firebase-admin';
import { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

@Injectable()
export class DeviceRepository {
  private readonly col = getFirestore().collection('devices');

  async list(): Promise<DeviceInfo[]> {
    const snap = await this.col.get();
    return snap.docs.map((d) => d.data() as DeviceInfo);
  }

  async get(id: string): Promise<DeviceInfo | null> {
    const doc = await this.col.doc(id).get();
    return doc.exists ? (doc.data() as DeviceInfo) : null;
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.col.doc(id).get();
    return doc.exists;
  }

  async create(device: DeviceInfo): Promise<void> {
    await this.col.doc(device.id).create(device);
  }

  async update(id: string, patch: Partial<DeviceInfo>): Promise<void> {
    await this.col.doc(id).update(patch);
  }

  async delete(id: string): Promise<void> {
    await this.col.doc(id).delete();
  }
}
