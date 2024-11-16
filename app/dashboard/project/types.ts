export interface Project {
  id: string
  name: string
  description: string | null
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED"
  createdAt: Date
  updatedAt: Date
}
