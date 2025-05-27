import { useState } from 'react';
import Title from 'src/components/Title';
import Form from 'src/components/Form';
import Availability from 'src/components/Availability';
import CursorStalker from 'src/components/ui/CursorStalker';
import Spinner from 'src/components/ui/Spinner';
import type { Availability as AvailabilityType } from 'src/utils/types';

function App() {
  const [availData, setAvailData] = useState<AvailabilityType | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onFormSubmit = async (url: string, weeks: number) => {
    setIsLoading(true);
    setAvailData(undefined);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendlyUrl: url, weeks }),
      });

      const data = await response.json();

      setIsLoading(false);

      if (data) {
        setAvailData(data);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError('Error fetching availability. Try again.');
    }
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <Title />

      <div className="w-[500px]">
        <CursorStalker />

        <Form onSubmit={onFormSubmit} />

        <div className="h-[40px]" />
        {isLoading && (
          <div className="flex flex-col items-center gap-3 z-10">
            <Spinner />
            <p className="text-stone-300">Fetching availability data...</p>
          </div>
        )}

        {error && (
          <p className="font-mono text-sm text-center text-red-500">{error}</p>
        )}

        <div className="h-[40px]" />
        <Availability availData={availData} />
      </div>
    </div>
  );
}

export default App;
