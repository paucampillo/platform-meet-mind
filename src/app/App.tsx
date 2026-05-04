import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <RouterProvider router={router} />
    </>
  );
}
