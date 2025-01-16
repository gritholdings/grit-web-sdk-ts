export interface User {
    /**
     * Unique identifier for the user
     */
    id: string;
  
    /**
     * User's email address
     */
    email: string;
  
    /**
     * Optional display name for the user
     */
    name?: string;
}