export interface User {
  id: string
  name: string
  email: string
  role: string | null
  status: string | null
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Course {
  id: string
  course: string
  subject: string
  instructor: string
  cost: number
  status: string
}

export interface Role {
  id: string
  name: string
}

export interface Subject {
  id: string
  subject: string
}

export interface SaleRow {
  course: string
  subject: string
  quantity: number
  price: number
  total: number
}

export interface Sale {
  id: string
  date: string
  saleNumber: string
  clientName: string
  clientIdentity: string
  rows: SaleRow[]
  saleStatus: string
  total: number
  totalCourses: number
  seller: string
  sellerId?: string
}

export interface SaleInput {
  clientName: string
  clientIdentity: string
  rows: SaleRow[]
}
