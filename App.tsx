
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JournalForm } from './components/JournalForm';
import { JournalList } from './components/JournalList';
import { JournalEntry } from './types';

const STORAGE_KEY = 'protrade_journal_entries';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'new'>('dashboard');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal entries", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

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
      setSelectedEntry(null); // Clear selection when Manually clicking 'New'
    }
    setActiveTab(tab);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="animate-in fade-in duration-300">
        {activeTab === 'dashboard' && <Dashboard entries={entries} />}
        
        {activeTab === 'list' && (
          <div className="max-w-3xl mx-auto">
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

export default App;
