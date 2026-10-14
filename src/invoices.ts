import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { JwtGuard } from './auth';
import { Cache } from './cache';
import { cleanItem, totals } from './calc';

@UseGuards(JwtGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(@InjectModel('Invoice') private inv: Model<any>, @InjectModel('User') private users: Model<any>, private cache: Cache) {}

  @Get()
  async list(@Req() r: any) {
    const k = `inv:${r.uid}`;
    const hit = await this.cache.get(k);
    if (hit) return hit;
    const d = await this.inv.find({ userId: r.uid }).sort({ createdAt: -1 }).limit(300)
      .select('no date payment customer.name totals.grand').lean();
    await this.cache.set(k, d);
    return d;
  }

  @Post()
  async create(@Req() r: any, @Body() b: any) {
    const items = (Array.isArray(b.items) ? b.items : []).slice(0, 200).map(cleanItem).filter((i) => i.qty > 0 && i.rate > 0);
    if (!items.length) throw new BadRequestException('Add at least one item with quantity and rate');
    const u = await this.users.findByIdAndUpdate(r.uid, { $inc: { seq: 1 } }, { new: true });
    const c = b.customer || {};
    const doc = await this.inv.create({
      userId: r.uid, no: 'INV-' + String(u.seq).padStart(5, '0'),
      date: String(b.date || new Date().toISOString().slice(0, 10)), payment: String(b.payment || 'CASH'),
      customer: { name: c.name, phone: c.phone, gstin: c.gstin, address: c.address }, items, totals: totals(items),
    });
    await this.cache.del(`inv:${r.uid}`);
    return doc;
  }

  @Get(':id')
  async one(@Req() r: any, @Param('id') id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException();
    const k = `inv:${r.uid}:${id}`;
    const hit = await this.cache.get(k);
    if (hit) return hit;
    const d = await this.inv.findOne({ _id: id, userId: r.uid }).lean();
    if (!d) throw new NotFoundException();
    await this.cache.set(k, d, 3600);
    return d;
  }

  @Delete(':id')
  async remove(@Req() r: any, @Param('id') id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException();
    await this.inv.deleteOne({ _id: id, userId: r.uid });
    await this.cache.del(`inv:${r.uid}`, `inv:${r.uid}:${id}`);
    return { ok: true };
  }
}
