import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Variables to manage token refresh queue
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already happening, queue this request until it finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8080/auth/refreshToken', { refreshToken })
          const newToken = res.data.accessToken || res.data.token
          
          localStorage.setItem('accessToken', newToken)
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken)
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          processQueue(null, newToken)
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          isRefreshing = false
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          isRefreshing = false
          
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        isRefreshing = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Service modules
export const authService = {
  register: (data) => api.post('/auth/addNewUser', data),
  login: (data) => api.post('/auth/generateToken', data),
  logout: (data) => api.post('/auth/logout', data),
  refreshToken: (data) => api.post('/auth/refreshToken', data),
  verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
  forgotPassword: (data) => api.post('/auth/forgotPassword', data),
  resetPassword: (data) => api.put('/auth/resetPassword', data),
  changePassword: (data) => api.put('/auth/changePassword', data),
  getBasicInfo: () => api.get('/auth/user/basicinfo'),
  createProfile: (data) => api.post('/auth/user/createProfile', data),
  getProfile: () => api.get('/auth/user/getProfile'),
  updateProfile: (data) => api.put('/auth/user/updateProfile', data),
}

export const accommodationService = {
  getAll: () => api.get('/api/accommodations'),
  getById: (id) => api.get(`/api/accommodations/${id}`),
  getMy: () => api.get('/api/accommodations/my'),
  create: (data) => api.post('/api/accommodations', data),
  update: (id, data) => api.put(`/api/accommodations/${id}`, data),
  delete: (id) => api.delete(`/api/accommodations/${id}`),
  getLatest: () => api.get('/api/accommodations/latest'),
  getByCity: (city) => api.get(`/api/accommodations/city/${city}`),
  getByGender: (gender) => api.get(`/api/accommodations/gender/${gender}`),
  getByRoomType: (type) => api.get(`/api/accommodations/roomType/${type}`),
  getByType: (type) => api.get(`/api/accommodations/type/${type}`),
  getByRentRange: (min, max) => api.get(`/api/accommodations/rent?minRent=${min}&maxRent=${max}`),
  searchByArea: (area) => api.get(`/api/accommodations/area/${area}`),
  searchByCityAndArea: (city, area) => api.get(`/api/accommodations/search?city=${city}&area=${area}`),
  getPaged: (page, size, sortBy, direction) =>
    api.get(`/api/accommodations/page?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),
}

export const roommateService = {
  getAll: (page = 0, size = 10) => api.get(`/roommate/all?page=${page}&size=${size}`),
  getById: (id) => api.get(`/roommate/${id}`),
  getMy: () => api.get('/roommate/my'),
  add: (data) => api.post('/roommate/add', data),
  update: (id, data) => api.put(`/roommate/update/${id}`, data),
  delete: (id) => api.delete(`/roommate/delete/${id}`),
  deleteAll: () => api.delete('/roommate/delete/my'),
  getLatest: () => api.get('/roommate/latest'),
  getCount: () => api.get('/roommate/count'),
  searchByCity: (city) => api.get(`/roommate/search/city?city=${city}`),
  searchByArea: (area) => api.get(`/roommate/search/area?area=${area}`),
  searchByGender: (gender) => api.get(`/roommate/search/gender?gender=${gender}`),
  searchByOccupation: (occ) => api.get(`/roommate/search/occupation?occupation=${occ}`),
  searchByFood: (food) => api.get(`/roommate/search/food?foodPreference=${food}`),
  searchByBudget: (min, max) => api.get(`/roommate/search/budget?min=${min}&max=${max}`),
  searchBudgetLess: (budget) => api.get(`/roommate/search/budget/less?budget=${budget}`),
  searchBudgetGreater: (budget) => api.get(`/roommate/search/budget/greater?budget=${budget}`),
}

export const dashboardService = {
  get: () => api.get('/dashboard/home'), 
}

export const tripService = {
  getAll: (page = 0, size = 10) => api.get(`/api/trips?page=${page}&size=${size}`),
  getMy: () => api.get('/api/trips/my-trips'),
  getById: (id) => api.get(`/api/trips/${id}`),
  create: (data) => api.post('/api/trips', data),
  aiGenerate: (data) => api.post('/api/trips/ai-generate', data),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
  search: (dest) => api.get(`/api/trips/search?destination=${dest}`),
  getByCategory: (cat) => api.get(`/api/trips/category/${cat}`),
  getExpenses: (tripId) => api.get(`/api/expenses/trip/${tripId}`),
  getItineraries: (tripId) => api.get(`/api/itineraries/trip/${tripId}`),
  
  // Add these two lines to support itinerary additions and deletions:
  addItineraryItem: (itemData) => api.post('/api/itineraries', itemData),
  deleteItineraryItem: (itemId) => api.delete(`/api/itineraries/${itemId}`),
}

export const cityService = {
  getOverview: (city) => api.get(`/api/city-explorer/overview/${city}`),
  getAttractions: (city) => api.get(`/api/city-explorer/attractions?city=${city}`),
  getAttractionById: (id) => api.get(`/api/city-explorer/attraction/${id}`),
  getByCategory: (city, category) => api.get(`/api/city-explorer/attractions/category?city=${city}&category=${category}`),
  getTopRated: (city) => api.get(`/api/city-explorer/attractions/top?city=${city}`),
  filter: (data, page = 0, size = 10) => api.post(`/api/city-explorer/attractions/filter?page=${page}&size=${size}`, data),
}

export const guideService = {
  getAll: () => api.get('/api/guides'),
  create: (data) => api.post('/api/guides', data),
  update: (id, data) => api.put(`/api/guides/${id}`, data),
  delete: (id) => api.delete(`/api/guides/${id}`),
  getById: (id) => api.get(`/api/guides/${id}`),
  searchByCity: (city) => api.get(`/api/guides/search?city=${city}`),
  getRecommended: (city, lang, budget) => {
    let url = `/api/guides/ai-recommendations?city=${city}`
    if (lang) url += `&preferredLanguage=${lang}`
    if (budget) url += `&maxBudget=${budget}`
    return api.get(url)
  },
  filter: (data, page = 0, size = 10) => api.post(`/api/guides/filter?page=${page}&size=${size}`, data),
  createBooking: (data) => api.post('/api/guide-bookings', data),
  getMyBookings: () => api.get('/api/guide-bookings/my'),
  getBookingById: (id) => api.get(`/api/guide-bookings/${id}`),
  confirmBooking: (id) => api.put(`/api/guide-bookings/${id}/confirm`),
  cancelBooking: (id) => api.put(`/api/guide-bookings/${id}/cancel`),
  completeBooking: (id) => api.put(`/api/guide-bookings/${id}/complete`),
  addReview: (data) => api.post('/api/guide-bookings/reviews', data),
}

export const reviewService = {
  add: (data) => api.post('/api/reviews', data),
  getByTarget: (targetId) => api.get(`/api/reviews/target/${targetId}`),
}

export const savedPlaceService = {
  getAll: () => api.get('/api/saved-places'),
  save: (data) => api.post('/api/saved-places', data),
  remove: (id) => api.delete(`/api/saved-places/${id}`),
}

export const settingsService = {
  get: (userId) => api.get(`/api/settings/${userId}`),
  update: (userId, data) => api.put(`/api/settings/${userId}`, data),
  changePassword: (userId, data) => api.put(`/api/settings/${userId}/password`, data),
}