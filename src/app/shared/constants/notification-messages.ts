export const NOTIFICATION_MESSAGES = {
  //TODO: use Entity enum, that is created in the scope of the 3rd task
  message: {
    redirect: (entity: string) =>
      `You were redirected to the first available ${entity === 'dashboard' ? 'dashboard' : 'tab for the dashboard'}`,
    unauthorized: 'You are not logged in or your session has expired. Please log in to continue',
  },
  actionButtonText: 'Ok',
  duration: 5000,
};
