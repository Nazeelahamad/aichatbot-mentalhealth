// src/utils/notifications.js
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const scheduleReminder = (title, body, delay = 3600000) => { // 1 hour default
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    }
  }, delay);
};

export const sendDailyReminder = () => {
  scheduleReminder(
    'MindCare Check-in',
    'How are you feeling today? Take a moment to check in with yourself.',
    86400000 // 24 hours
  );
};
