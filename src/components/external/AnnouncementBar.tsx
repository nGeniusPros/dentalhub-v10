import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const AnnouncementBar = () => (
  <div className="bg-gradient-to-r from-turquoise to-navy text-white text-sm py-2 px-4 text-center">
    <span className="mr-2">Join the waitlist for our all-in-one Dental Hub platform</span>
    <Button variant="outline" size="sm" className="bg-gradient-to-r from-turquoise to-navy text-white" asChild>
      <Link to="/signup">Join Waitlist</Link>
    </Button>
  </div>
);

export default AnnouncementBar;
