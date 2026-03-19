// Queue for offline sync
class SyncQueue {
    constructor() {
        this.queueKey = 'syncQueue';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.queueKey)) {
            localStorage.setItem(this.queueKey, JSON.stringify([]));
        }
    }

    // Add item to queue
    async add(item) {
        const queue = this.getQueue();
        queue.push({
            ...item,
            queuedAt: new Date().toISOString(),
            retryCount: 0
        });
        this.saveQueue(queue);
    }

    // Get all queued items
    getQueue() {
        return JSON.parse(localStorage.getItem(this.queueKey)) || [];
    }

    // Remove item from queue
    remove(itemId) {
        const queue = this.getQueue().filter(item => item.id !== itemId);
        this.saveQueue(queue);
    }

    // Clear queue
    clear() {
        localStorage.setItem(this.queueKey, JSON.stringify([]));
    }

    // Save queue
    saveQueue(queue) {
        localStorage.setItem(this.queueKey, JSON.stringify(queue));
    }

    // Increment retry count
    incrementRetry(itemId) {
        const queue = this.getQueue();
        const item = queue.find(i => i.id === itemId);
        if (item) {
            item.retryCount = (item.retryCount || 0) + 1;
            item.lastRetry = new Date().toISOString();
            this.saveQueue(queue);
        }
    }

    // Get queue size
    size() {
        return this.getQueue().length;
    }
}

export const syncQueue = new SyncQueue();