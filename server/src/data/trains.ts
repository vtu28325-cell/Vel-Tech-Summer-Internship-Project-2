export const trains = [
  // North
  {
    trainNumber: '12951', trainName: 'Mumbai - New Delhi Rajdhani Express',
    source: 'Mumbai', destination: 'Delhi',
    schedule: { departureTime: '17:00', arrivalTime: '08:32', date: '2026-07-01' },
    totalSeats: 50, fare: 2500, duration: '15h 32m', trainType: 'Rajdhani'
  },
  {
    trainNumber: '12424', trainName: 'New Delhi - Dibrugarh Rajdhani',
    source: 'Delhi', destination: 'Dibrugarh',
    schedule: { departureTime: '16:20', arrivalTime: '06:00', date: '2026-07-02' },
    totalSeats: 60, fare: 3200, duration: '37h 40m', trainType: 'Rajdhani'
  },
  {
    trainNumber: '12011', trainName: 'New Delhi - Kalka Shatabdi',
    source: 'Delhi', destination: 'Chandigarh',
    schedule: { departureTime: '07:40', arrivalTime: '11:05', date: '2026-07-01' },
    totalSeats: 70, fare: 950, duration: '3h 25m', trainType: 'Shatabdi'
  },
  // South
  {
    trainNumber: '12627', trainName: 'Karnataka Express',
    source: 'Delhi', destination: 'Bangalore',
    schedule: { departureTime: '20:20', arrivalTime: '06:40', date: '2026-07-03' },
    totalSeats: 120, fare: 1950, duration: '34h 20m', trainType: 'Express'
  },
  {
    trainNumber: '12622', trainName: 'Tamil Nadu Express',
    source: 'Delhi', destination: 'Chennai',
    schedule: { departureTime: '22:30', arrivalTime: '07:00', date: '2026-07-03' },
    totalSeats: 110, fare: 2100, duration: '32h 30m', trainType: 'Superfast'
  },
  {
    trainNumber: '12626', trainName: 'Kerala Express',
    source: 'Delhi', destination: 'Trivandrum',
    schedule: { departureTime: '11:25', arrivalTime: '15:15', date: '2026-07-04' },
    totalSeats: 90, fare: 2400, duration: '51h 50m', trainType: 'Express'
  },
  {
    trainNumber: '12724', trainName: 'Telangana Express',
    source: 'Delhi', destination: 'Hyderabad',
    schedule: { departureTime: '16:35', arrivalTime: '16:10', date: '2026-07-05' },
    totalSeats: 100, fare: 1650, duration: '23h 35m', trainType: 'Superfast'
  },
  // East
  {
    trainNumber: '12839', trainName: 'Howrah Mail',
    source: 'Mumbai', destination: 'Kolkata',
    schedule: { departureTime: '19:15', arrivalTime: '05:45', date: '2026-07-03' },
    totalSeats: 95, fare: 1850, duration: '34h 30m', trainType: 'Mail'
  },
  {
    trainNumber: '12273', trainName: 'Howrah - New Delhi Duronto',
    source: 'Kolkata', destination: 'Delhi',
    schedule: { departureTime: '08:35', arrivalTime: '06:40', date: '2026-07-02' },
    totalSeats: 80, fare: 2800, duration: '22h 05m', trainType: 'Superfast'
  },
  {
    trainNumber: '15227', trainName: 'Muzaffarpur - Yesvantpur Express',
    source: 'Patna', destination: 'Bangalore',
    schedule: { departureTime: '07:25', arrivalTime: '11:20', date: '2026-07-06' },
    totalSeats: 150, fare: 1250, duration: '51h 55m', trainType: 'Express'
  },
  {
    trainNumber: '12505', trainName: 'North East Express',
    source: 'Guwahati', destination: 'Delhi',
    schedule: { departureTime: '12:40', arrivalTime: '21:50', date: '2026-07-07' },
    totalSeats: 110, fare: 1450, duration: '33h 10m', trainType: 'Express'
  },
  // West / Central
  {
    trainNumber: '12009', trainName: 'Mumbai - Ahmedabad Shatabdi Express',
    source: 'Mumbai', destination: 'Ahmedabad',
    schedule: { departureTime: '06:20', arrivalTime: '12:45', date: '2026-07-01' },
    totalSeats: 60, fare: 1200, duration: '6h 25m', trainType: 'Shatabdi'
  },
  {
    trainNumber: '12215', trainName: 'Delhi - Bandra Terminus Garibrath',
    source: 'Delhi', destination: 'Mumbai',
    schedule: { departureTime: '08:55', arrivalTime: '07:35', date: '2026-07-02' },
    totalSeats: 100, fare: 1050, duration: '22h 40m', trainType: 'Superfast'
  },
  {
    trainNumber: '12137', trainName: 'Punjab Mail',
    source: 'Mumbai', destination: 'Amritsar',
    schedule: { departureTime: '19:35', arrivalTime: '09:15', date: '2026-07-05' },
    totalSeats: 130, fare: 1550, duration: '37h 40m', trainType: 'Mail'
  },
  {
    trainNumber: '12925', trainName: 'Paschim Express',
    source: 'Mumbai', destination: 'Chandigarh',
    schedule: { departureTime: '11:25', arrivalTime: '15:20', date: '2026-07-04' },
    totalSeats: 110, fare: 1600, duration: '27h 55m', trainType: 'Express'
  },
  // Extra specific routes
  {
    trainNumber: '22416', trainName: 'Vande Bharat Express',
    source: 'Delhi', destination: 'Varanasi',
    schedule: { departureTime: '06:00', arrivalTime: '14:00', date: '2026-07-01' },
    totalSeats: 100, fare: 1750, duration: '8h 00m', trainType: 'Superfast'
  },
  {
    trainNumber: '12801', trainName: 'Purushottam Express',
    source: 'Puri', destination: 'Delhi',
    schedule: { departureTime: '21:45', arrivalTime: '04:00', date: '2026-07-02' },
    totalSeats: 120, fare: 1350, duration: '30h 15m', trainType: 'Express'
  },
  {
    trainNumber: '11019', trainName: 'Konark Express',
    source: 'Mumbai', destination: 'Bhubaneswar',
    schedule: { departureTime: '14:00', arrivalTime: '23:15', date: '2026-07-03' },
    totalSeats: 140, fare: 1400, duration: '33h 15m', trainType: 'Express'
  },
  {
    trainNumber: '12431', trainName: 'Rajdhani Express',
    source: 'Trivandrum', destination: 'Delhi',
    schedule: { departureTime: '19:15', arrivalTime: '12:40', date: '2026-07-04' },
    totalSeats: 75, fare: 3500, duration: '41h 25m', trainType: 'Rajdhani'
  },
  {
    trainNumber: '16315', trainName: 'Kochuveli Express',
    source: 'Bangalore', destination: 'Kochi',
    schedule: { departureTime: '17:15', arrivalTime: '06:05', date: '2026-07-05' },
    totalSeats: 110, fare: 950, duration: '12h 50m', trainType: 'Express'
  }
];
