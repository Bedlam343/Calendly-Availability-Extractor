import { useRef, type FormEvent } from 'react';

type FormProps = {
  onSubmit: (url: string, weeks: number) => void;
};

const Form = ({ onSubmit }: FormProps) => {
  const urlRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const calendlyUrl = formData.get('calendly_url') as string;
    const weeks = formData.get('weeks');
    onSubmit(calendlyUrl, Number(weeks));
    urlRef.current!.value = '';
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
              ref={urlRef}
              className="w-[400px] border-2 border-grey-500 h-[40px] px-1 rounded-md outline-none focus:border-grey-800"
              type="url"
              id="calendly_url"
              name="calendly_url"
              required
              placeholder="https://calendly.com/username/event"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-6">
          <button
            type="submit"
            className="z-10 text-stone-50 px-4 py-2 rounded-md bg-purple-500 hover:cursor-pointer hover:bg-purple-400"
          >
            Extract Availability
          </button>

          <div className="w-[100px] z-0">
            <div className="relative">
              <select
                name="weeks"
                defaultValue={4}
                className=" w-full bg-stone-900 text-stone-200 text-sm border 
                border-stone-400 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none 
                focus:border-stone-500 hover:border-stone-500 shadow-sm 
                focus:shadow-md appearance-none cursor-pointer"
              >
                <option value={1}>1 week</option>
                <option value={2}>2 weeks</option>
                <option value={3}>3 weeks</option>
                <option value={4}>4 weeks</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-purple-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
