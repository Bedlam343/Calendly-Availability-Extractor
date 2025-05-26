import { useState } from 'react';
import Form from 'src/components/Form';
import Availability from 'src/components/Availability';
import Spinner from 'src/components/ui/Spinner';
import type { Availability as AvailabilityType } from 'src/utils/types';

function App() {
  const [availData, setAvailData] = useState<AvailabilityType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFormSubmit = async (url: string) => {
    setIsLoading(true);

    const response = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendlyUrl: url }),
    });

    const data = await response.json();

    setIsLoading(false);

    if (data) {
      setAvailData(data);
    }
  };

  return (
    <div className="my-4">
      <Form onSubmit={onFormSubmit} />

      <div className="h-[40px]" />
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-stone-800">Fetching availability data...</p>
        </div>
      )}

      <Availability availData={availData} />
    </div>
  );
}

export default App;
