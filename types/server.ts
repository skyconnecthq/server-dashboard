export interface ServerStatus {
  "CPU %Idle": string
  DISK: string
  "FREE MEM": string
  NETWORK: string
  "MMSC Components"?: string
  "HSP Components"?: string
  "Billing Component"?: string
  "IMSI Rules DB"?: string
  "LDAP Components"?: string
  [key: string]: string | undefined
}

export interface Server {
  id: string
  "Status Summary": ServerStatus
}

export interface ServerData {
  [key: string]: {
    "Status Summary": ServerStatus
  }
}
