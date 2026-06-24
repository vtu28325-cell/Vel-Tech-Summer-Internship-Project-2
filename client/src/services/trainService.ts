import api from './api';

export interface ISchedule {
  departureTime: string;
  arrivalTime: string;
  date: string;
}

export interface ITrain {
  _id: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  schedule: ISchedule;
  totalSeats: number;
  availableSeats: number;
  fare: number;
  duration: string;
  trainType: string;
}

// Fetch all trains or search by params
export const getTrains = async (params?: { source?: string; destination?: string; date?: string }): Promise<ITrain[]> => {
  const response = await api.get<ITrain[]>('/trains', { params });
  return response.data;
};

// Get a single train by ID
export const getTrainById = async (id: string): Promise<ITrain> => {
  const response = await api.get<ITrain>(`/trains/${id}`);
  return response.data;
};

// Create a new train (Admin only)
export const createTrain = async (trainData: Omit<ITrain, '_id' | 'availableSeats'>): Promise<ITrain> => {
  const response = await api.post<ITrain>('/trains', trainData);
  return response.data;
};
