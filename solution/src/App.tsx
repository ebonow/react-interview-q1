import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebounce, cn } from './utils';
import { isNameValid, getLocations } from './mock-api/apis';

import './App.css';

type User = {
  name: string,
  location: string,
}

function App() {
  /// TODO: Encapsulate state logic into hook with useReducer
  const [name, setName] = useState('');
  const [isNameValidating, setIsNameValidating] = useState(false);
  const [isNameInputValid, setIsNameInputValid] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const inputRef = useRef<null | HTMLInputElement>(null);

  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedName = useDebounce(name, 500);
  
  const hasInvalidName = !!name.trim() && !isNameValidating && !isNameInputValid;

  const isAddUserEnabled = useMemo(() => (name.trim() && isNameInputValid && !isNameValidating && selectedCountry), [
    name, isNameInputValid, isNameValidating, selectedCountry
  ]);

  const addUser = () => {
    if (!isAddUserEnabled) return;
    setUsers(prev => ([...prev, { name, location: selectedCountry }]));
    setName('');
    setSelectedCountry('');
  }
  
  const clearUsers = () => setUsers([]);

  useEffect(() => {
    const fetchCountryList = async () => {
      const list = await getLocations();
      setCountries(list);
    }
    // Need to declare and call async function since useEffect cannot be async 
    fetchCountryList();
  }, []);

  useEffect(() => {
    const validateName = async (input: string) => {
      setIsNameInputValid(false);
  
      /// TODO: Add AbortSignal to api featch call to cancel any previous requests to avoid race conditions
      /// For prupose of this exercise, adding reference to inputElement to verify and ignore previous input value
      const result = await isNameValid(input);
      if (input !== inputRef.current?.value) {
        return;
      }
      
      setIsNameInputValid(result);
      setIsNameValidating(false);
    };

    validateName(debouncedName);
  }, [debouncedName])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameValidating(true);
    setName(e.currentTarget.value);
  }

  const classNames = {
    section: 'my-8 p-8 pb-10 max-w-2xl mx-auto bg-slate-100 rounded',
    row: 'flex border-2 gap-4 mb-4 relative bg-slate-200',
    label: 'w-1/4 text-left px-2',
    validationIcon: 'absolute right-0 top-0 bottom-0 my-auto block',
    formFieldWrapper: 'w-3/4',
    formField: 'w-full px-2 bg-blue-200 h-full',
    formError: 'text-left ml-auto pl-4 -mt-4 mb-4 text-red-500 txt-sm italic w-3/4',
    buttonsWrapper: 'flex gap-4 mt-8 mb-4 justify-end',
    button: 'flex-0 px-3 py-2 border-2 rounded cursor-pointer disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-500 disabled:opacity-25 disabled:cursor-not-allowed',
    table: 'w-full mt-12 py-4',
    thead: 'bg-slate-600 text-white',
    tr: 'even:bg-amber-100 odd:bg-blue-100',
  };

  return (
    <div className="App">
      <header className="App-header">
        Add User Locations
      </header>
      <section className={classNames.section}>
        <div className={classNames.row}>
           <label className={classNames.label}>Name</label>
           <div className={classNames.formFieldWrapper}>
              <input type="text" className={classNames.formField} onChange={onChange} value={name} ref={inputRef} />
            </div>
            <ValidationIcon 
              className={classNames.validationIcon} 
              isValid={(!hasInvalidName && !!name.trim())}
              isError={hasInvalidName}
              isFetching={isNameValidating}
            />
        </div>
        {!!hasInvalidName && (
          <div className={classNames.formError}>this name has already been taken</div>
        )}

        <div className={classNames.row}>
          <label className={classNames.label}>Location</label>
          <div className={classNames.formFieldWrapper}>
            <select className={classNames.formField}
              value={selectedCountry} 
              onChange={o => setSelectedCountry(o.currentTarget.value)}
            >
              <option value="">--Please select a location--</option>
              {countries.map(c => (
                <option key={c} value={c} className='w-1/2'>{c}</option>
              ))}
            </select>
          </div>
          <ValidationIcon 
              className={classNames.validationIcon} 
              isValid={(!!selectedCountry)}
              isFetching={!countries.length}
            />
        </div>
        <div className={classNames.buttonsWrapper}>
          {!!users.length && (
            <button className={cn(classNames.button, 'border-red-500 text-red-500 bg-red-100')} onClick={clearUsers}>Clear</button>
          )}
          <button className={cn(classNames.button, 'border-green-500 text-green-500 bg-green-100')} disabled={!isAddUserEnabled} onClick={addUser}>Add</button>
        </div>
        {!!users.length && (
          <table className={classNames.table}>
            <thead className={classNames.thead}>
              <tr><th>Name</th><th>Location</th></tr>
            </thead>
            <tbody>
              {/* /// TODO: Preferably better to use a user id returned from server instead of array index for table row keys */}
              {users.map((u, idx) => (
                <tr key={idx} className={classNames.tr}><td>{u.name}</td><td>{u.location}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}


type ValidationIconProps = {
  className?: string,
  isFetching?: boolean,
  isError?: boolean,
  isValid?: boolean,
}

const ValidationIcon = (props: ValidationIconProps) => {
  const { className, isFetching, isError, isValid } = props;

  return (
    <span className={`
      ${className || ''}
      ${isFetching ? 'loader' : ''}
    `}>
      {isFetching ? ' ' :  isValid ? '✅️' : isError ? '❌' : ' '}
    </span>
  )
}

export default App;