import type { FormEvent } from 'react';

type FormProps = {
  onSubmit: (url: string) => void;
};

const Form = ({ onSubmit }: FormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData.get('calendly_url') as string);
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <div>
            <label
              htmlFor="calendly_url"
              className="block font-bold text-stone-50"
            >
              Calendly Link
            </label>
            <input
              className="w-[400px] border-2 border-grey-500 h-[40px] px-1 rounded-md outline-none focus:border-grey-800"
              type="url"
              id="calendly_url"
              name="calendly_url"
              required
              placeholder="https://calendly.com/username/event"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="text-stone-50 px-4 py-2 rounded-md bg-purple-500 hover:cursor-pointer hover:bg-purple-400"
          >
            Extract Availability
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
