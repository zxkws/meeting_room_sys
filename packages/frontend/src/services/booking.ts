import http from '@utils/http';

export const getBookingList = (data: { page?: number; pageSize?: number }) => {
  return http.get('/booking/list', { params: data });
};
