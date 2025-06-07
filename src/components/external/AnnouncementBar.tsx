import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-turquoise to-navy text-white text-sm py-2 px-4 text-center">
    <span className="mr-2">Join the waitlist for our all-in-one Dental Hub platform</span>
    <Button 
      size="sm" 
      className="bg-gradient-to-r from-purple-600 to-teal-500 text-white border-0 font-semibold px-4 py-1 rounded-md shadow-md hover:shadow-lg hover:from-purple-700 hover:to-teal-600 transition-all ml-2" 
      asChild
    >
      <Link to="/signup">Join Waitlist</Link>
    </Button>
  </div>
);

export default AnnouncementBar;
