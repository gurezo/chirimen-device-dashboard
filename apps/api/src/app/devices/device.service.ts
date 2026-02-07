import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeviceRepository } from './device.repository';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/device.dto';
import { DeviceInfo } from '@chirimen-device-dashboard/shared-types';

@Injectable()
export class DeviceService {
  constructor(private readonly repo: DeviceRepository) {}

  list(): Promise<DeviceInfo[]> {
    return this.repo.list();
  }

  async get(id: string): Promise<DeviceInfo> {
    const device = await this.repo.get(id);
    if (!device) throw new NotFoundException('device not found');
    return device;
  }

  async create(dto: CreateDeviceDto): Promise<DeviceInfo> {
    const exists = await this.repo.exists(dto.id);
    if (exists) throw new ConflictException('device id already exists');

    const device: DeviceInfo = dto;
    await this.repo.create(device);
    return device;
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<DeviceInfo> {
    await this.get(id);
    await this.repo.update(id, dto as Partial<DeviceInfo>);
    return this.get(id);
  }

  async delete(id: string): Promise<void> {
    await this.get(id);
    await this.repo.delete(id);
  }
}
