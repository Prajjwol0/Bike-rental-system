
export enum UserRoles{
    ADMIN = 'admin',
    USER = 'user'
}   
// To convert to admin
// UPDATE "user"
// SET roles = 'admin'
// WHERE email = 'admin@example.com';


export enum RequestStatus{
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'    
}

export enum BikeStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  INACTIVE = 'INACTIVE',
}
