import React, { useState, useEffect } from 'react';
import { syncWithCloud, getLastSyncTime } from '../utils/storage';
import { syncQueue } from '../utils/syncQueue';
import '../styles/SyncStatus.css';

const SyncStatus = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(getLastSyncTime());
    const [queueSize, setQueueSize] = useState(syncQueue.size());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncResult, setSyncResult] = useState(null);

    useEffect(() => {
        // Check online status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Update queue size periodically
        const interval = setInterval(() => {
            setQueueSize(syncQueue.size());
        }, 5000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    const handleSync = async() => {
        if (!isOnline) {
            alert('You are offline. Please connect to the internet to sync.');
            return;
        }

        setIsSyncing(true);
        setSyncResult(null);

        try {
            const result = await syncWithCloud();
            setSyncResult(result);
            setLastSync(getLastSyncTime());
            setQueueSize(syncQueue.size());

            if (result.failed.length > 0) {
                alert(`Synced ${result.success.length} items. ${result.failed.length} items failed.`);
            } else if (result.success.length > 0) {
                alert(`Successfully synced ${result.success.length} items!`);
            }
        } catch (error) {
            alert('Sync failed. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    };

    const formatLastSync = (timestamp) => {
        if (!timestamp) return 'Never';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return ( <
        div className = "sync-status" >
        <
        div className = "sync-info" >
        <
        div className = { `status-indicator ${isOnline ? 'online' : 'offline'}` } > { isOnline ? '● Online' : '○ Offline' } <
        /div>

        {
            queueSize > 0 && ( <
                div className = "queue-info" >
                <
                span className = "queue-badge" > { queueSize } < /span> <
                span className = "queue-text" > pending sync < /span> <
                /div>
            )
        }

        <
        div className = "last-sync" >
        Last sync: { formatLastSync(lastSync) } <
        /div> <
        /div>

        <
        button className = { `sync-btn ${isSyncing ? 'syncing' : ''}` }
        onClick = { handleSync }
        disabled = { isSyncing || !isOnline } >
        { isSyncing ? 'Syncing...' : 'Sync Now' } <
        /button>

        {
            syncResult && syncResult.success.length > 0 && ( <
                div className = "sync-result success" > ✓Synced { syncResult.success.length }
                items <
                /div>
            )
        }

        {
            syncResult && syncResult.failed.length > 0 && ( <
                div className = "sync-result error" > ✗Failed to sync { syncResult.failed.length }
                items <
                /div>
            )
        } <
        /div>
    );
};

export default SyncStatus;