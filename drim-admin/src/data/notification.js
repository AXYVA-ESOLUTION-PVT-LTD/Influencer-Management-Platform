import NOTIFICATION from '../constants/notification';

export const data = [
  {
    createdAt: '2024-09-01 12:00',
    title: 'System Update Scheduled',
    description: 'System update scheduled.',
    status: NOTIFICATION.READ,
  },
  {
    createdAt: '2024-09-02 14:30',
    title: 'Meeting Reminder',
    description: 'Reminder: Meeting at 3 PM.',
    status: NOTIFICATION.PENDING,
  },
  {
    createdAt: '2024-09-06 11:30',
    title: 'Subscription Expiration',
    description: 'Your subscription is about to expire.',
    status: NOTIFICATION.PENDING,
  },
  {
    createdAt: '2024-09-11 17:00',
    title: 'Maintenance Scheduled',
    description: 'Maintenance scheduled for 3 AM.',
    status: NOTIFICATION.READ,
  },
  {
    createdAt: '2024-09-12 18:00',
    title: 'Account Review Reminder',
    description: 'Review your account settings.',
    status: NOTIFICATION.PENDING,
  },
  {
    createdAt: '2024-09-13 19:30',
    title: 'Unusual Activity Alert',
    description: 'Unusual activity detected.',
    status: NOTIFICATION.COMPLETED,
  },
  {
    createdAt: '2024-09-14 20:45',
    title: 'Policy Update',
    description: 'New policy update available.',
    status: NOTIFICATION.PENDING,
  },
  {
    createdAt: '2024-09-15 21:00',
    title: 'Survey Feedback Request',
    description: 'Survey feedback requested.',
    status: NOTIFICATION.READ,
  },
  {
    createdAt: '2024-09-16 22:00',
    title: 'Request Processed',
    description: 'Your request has been processed.',
    status: NOTIFICATION.PENDING,
  },
];
