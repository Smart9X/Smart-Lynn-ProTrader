import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JournalForm } from './components/JournalForm';
import { JournalList } from './components/JournalList';
import { JournalEntry } from './types';

const STORAGE_KEY = 'protrade_journal_entries';

// export default ต้องมี เพราะ index.tsx เรียกหา
export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'new'>('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage (แบบกันจอขาว)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // ตรวจสอบว่าเป็น Array จริงไหม ถ้าไม่ใช่ให้เริ่มใหม่
        if (Array.isArray(parsedData)) {
          setEntries(parsedData);
        }
      }
    } catch (e) {
      console.error("Error loading data, resetting...", e);
      // ถ้าข้อมูลเสีย ให้ล้างทิ้งเลย เพื่อกันจอขาว
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    if (selectedEntry) {
      // Edit existing
      setEntries(prev => prev.map(e => 
        e.id === selectedEntry.id 
          ? { ...entryData, id: selectedEntry.id, timestamp: selectedEntry.timestamp } 
          : e
      ));
      setSelectedEntry(null);
    } else {
      // Create new
      const newEntry: JournalEntry = {
        ...entryData,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setActiveTab('list');
  };

  const handleDeleteEntry = (id: string) => {
    if(window.confirm('ยืนยันการลบบันทึกนี้?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      setSelectedEntry(null);
      setActiveTab('list');
    }
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setActiveTab('new');
  };

  const handleTabChange = (tab: 'dashboard' | 'list' | 'new') => {
    if (tab === 'new') {
      setSelectedEntry(null);
    }
    setActiveTab(tab);
  };

  // ถ้ายังโหลดไม่เสร็จ ให้แสดงหน้าโหลดก่อน
  if (!isLoaded) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="animate-in fade-in duration-300">
        {activeTab === 'dashboard' && <Dashboard entries={entries} />}
        
        {activeTab === 'list' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">ประวัติการเทรดล่าสุด</h2>
            <JournalList entries={entries} onSelect={handleEntrySelect} />
          </div>
        )}
        
        {activeTab === 'new' && (
          <JournalForm 
            initialData={selectedEntry || undefined}
            onSave={handleSaveEntry} 
            onDelete={selectedEntry ? () => handleDeleteEntry(selectedEntry.id) : undefined}
            onCancel={() => {
              setSelectedEntry(null);
              setActiveTab(selectedEntry ? 'list' : 'dashboard');
            }} 
          />
        )}
      </div>
    </Layout>
  );
}
