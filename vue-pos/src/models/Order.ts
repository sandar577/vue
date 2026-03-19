export interface Order {
  order_id: number
  total_amount: number
  tax_amount: number
  discount_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  items: OrderItem[]
}
