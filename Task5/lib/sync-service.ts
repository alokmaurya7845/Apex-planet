/**
 * Sync Service
 *
 * This service handles offline data synchronization.
 * It stores data locally when offline and syncs with the server when online.
 */

import type { AttendanceRecord, LeaveApplication, Task, PayrollRecord } from "./types"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Queue for storing operations that need to be synced
type SyncOperation = {
  id: string
  type: "attendance" | "leave" | "task" | "payroll"
  operation: "create" | "update"
  data: any
  timestamp: number
}

class SyncService {
  private syncQueue: SyncOperation[] = []
  private isOnline = true
  private storageKey = "pharmacy_sync_queue"

  constructor() {
    if (isBrowser) {
      // Load any existing sync queue from localStorage
      this.loadQueue()

      // Set up online/offline event listeners
      window.addEventListener("online", this.handleOnline)
      window.addEventListener("offline", this.handleOffline)

      // Initialize online status
      this.isOnline = navigator.onLine
    }
  }

  private loadQueue() {
    try {
      const storedQueue = localStorage.getItem(this.storageKey)
      if (storedQueue) {
        this.syncQueue = JSON.parse(storedQueue)
      }
    } catch (error) {
      console.error("Failed to load sync queue:", error)
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error("Failed to save sync queue:", error)
    }
  }

  private handleOnline = () => {
    this.isOnline = true
    console.log("Back online, syncing data...")
    this.syncData()
  }

  private handleOffline = () => {
    this.isOnline = false
    console.log("Offline mode activated, data will be stored locally")
  }

  // Add an operation to the sync queue
  queueOperation(type: SyncOperation["type"], operation: SyncOperation["operation"], data: any) {
    const syncOp: SyncOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      operation,
      data,
      timestamp: Date.now(),
    }

    this.syncQueue.push(syncOp)
    this.saveQueue()

    // If online, try to sync immediately
    if (this.isOnline) {
      this.syncData()
    }

    return syncOp.id
  }

  // Sync data with the server
  async syncData() {
    if (!this.isOnline || this.syncQueue.length === 0) return

    console.log(`Syncing ${this.syncQueue.length} operations with server...`)

    // Process each operation in the queue
    const operationsToProcess = [...this.syncQueue]
    this.syncQueue = []

    for (const op of operationsToProcess) {
      try {
        // In a real app, this would make API calls to the server
        await this.processOperation(op)
        console.log(`Successfully synced operation: ${op.id}`)
      } catch (error) {
        console.error(`Failed to sync operation ${op.id}:`, error)
        // Put the failed operation back in the queue
        this.syncQueue.push(op)
      }
    }

    this.saveQueue()
  }

  // Process a single operation (in a real app, this would call your API)
  private async processOperation(operation: SyncOperation): Promise<void> {
    // This is a mock implementation
    // In a real app, you would make API calls here

    return new Promise((resolve) => {
      // Simulate API call with a delay
      setTimeout(() => {
        // In a real app, you would handle the response and potential errors
        resolve()
      }, 500)
    })
  }

  // Store attendance data locally and queue for sync
  storeAttendance(record: Partial<AttendanceRecord>, operation: "create" | "update" = "create") {
    // Store in IndexedDB or localStorage
    // For simplicity, we're just queuing it here
    return this.queueOperation("attendance", operation, record)
  }

  // Store leave application locally and queue for sync
  storeLeaveApplication(application: Partial<LeaveApplication>, operation: "create" | "update" = "create") {
    return this.queueOperation("leave", operation, application)
  }

  // Store task data locally and queue for sync
  storeTask(task: Partial<Task>, operation: "create" | "update" = "create") {
    return this.queueOperation("task", operation, task)
  }

  // Store payroll data locally and queue for sync
  storePayroll(record: Partial<PayrollRecord>, operation: "create" | "update" = "create") {
    return this.queueOperation("payroll", operation, record)
  }

  // Check if we're currently online
  isNetworkOnline(): boolean {
    return this.isOnline
  }

  // Get pending operations count
  getPendingOperationsCount(): number {
    return this.syncQueue.length
  }
}

// Export a singleton instance
export const syncService = isBrowser ? new SyncService() : null
