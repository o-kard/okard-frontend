export type PaymentType =
  | "promptpay"
  | "card"
  | "true_money_wallet"
  | "pay_by_bank";

export type Payment = {
  id?: string;
  amount: number;
  post_id: string;
  full_name: string;
  email: string;
  payment_method: PaymentType;
};
