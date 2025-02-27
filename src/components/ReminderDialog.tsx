import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Icon } from './ui/icon-strategy';
import { Button } from './ui/button';

interface Reminder {
  message: string;
  reminderDate: string;
}

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reminder: Reminder) => void;
  recipient: {
    name: string;
    appointment: {
      date: string;
      time: string;
      type: string;
    };
  };
}

export const ReminderDialog: React.FC<ReminderDialogProps> = ({ isOpen, onClose, onSend, recipient }) => {
  const [reminder, setReminder] = useState<Reminder>({ message: '', reminderDate: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(reminder);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Send Reminder</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="p-6 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Reminding: {recipient.name} for {recipient.appointment.type} on {recipient.appointment.date} at {recipient.appointment.time}.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Message</label>
            <textarea
              value={reminder.message}
              onChange={(e) => setReminder({ ...reminder, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
            <input
              type="date"
              value={reminder.reminderDate}
              onChange={(e) => setReminder({ ...reminder, reminderDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Send Reminder</Button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};