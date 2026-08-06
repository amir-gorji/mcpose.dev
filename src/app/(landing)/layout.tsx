import type { ReactNode } from 'react';
import AnnouncementBar from '@/components/announcement-bar';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

const LandingLayout = ({ children }: { children: ReactNode }) => (
  <>
    <AnnouncementBar />
    <Nav maxWidth={1160} />
    <div style={{ minHeight: '100vh' }}>{children}</div>
    <Footer />
  </>
);

export default LandingLayout;
