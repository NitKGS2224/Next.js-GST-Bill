import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  { email: { type: String, unique: true, lowercase: true, required: true }, password: String,
    shopName: String, gstin: String, address: String, phone: String, seq: { type: Number, default: 0 } },
  { timestamps: true },
);

const Item = new Schema(
  { product: String, pack: String, qty: Number, mrp: Number, mdis: Number, rate: Number, rdis: Number,
    sgst: Number, cgst: Number, remarks: String },
  { _id: false },
);

export const InvoiceSchema = new Schema(
  { userId: { type: Schema.Types.ObjectId, index: true }, no: String, date: String, payment: String,
    customer: { name: String, phone: String, gstin: String, address: String }, items: [Item],
    totals: { disc: Number, sub: Number, sgst: Number, cgst: Number, round: Number, grand: Number } },
  { timestamps: true },
);
InvoiceSchema.index({ userId: 1, createdAt: -1 });
