import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class Cache {
  private r = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: 1 });
  constructor() { this.r.on('error', () => {}); }
  async get(k: string) { try { const v = await this.r.get(k); return v ? JSON.parse(v) : null; } catch { return null; } }
  async set(k: string, v: any, ttl = 300) { try { await this.r.set(k, JSON.stringify(v), 'EX', ttl); } catch {} }
  async del(...k: string[]) { try { await this.r.del(...k); } catch {} }
}
