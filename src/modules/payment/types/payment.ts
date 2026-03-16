export type UUID = string;

export type PaymentType =
  | "promptpay"
  | "card"
  | "true_money_wallet"
  | "pay_by_bank";

export type Payment = {
  id?: UUID;
  amount: number;
  campaign_id: UUID;
  full_name: string;
  email: string;
  payment_method: PaymentType;
};
