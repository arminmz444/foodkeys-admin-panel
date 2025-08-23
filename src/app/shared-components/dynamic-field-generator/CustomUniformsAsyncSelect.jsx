// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import CircularProgress from '@mui/material/CircularProgress';
// import React, { useEffect } from 'react';
// import { connectField } from 'uniforms';
//
//
// function CustomUniformsAsyncSelect({ onChange, value, label, placeholder, loadOptions}) {
//   const [open, setOpen] = React.useState(false);
//   const [options, setOptions] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//
//   useEffect(() => {
// 	const fetchOptions = async () => {
// 		let data = []
// 		if (loadOptions && typeof loadOptions === 'function')
// 			data = await loadOptions()
// 		return data
// 	}
// 	fetchOptions()
//   }, [])
//   const handleOpen = () => {
//     setOpen(true);
//     (async () => {
//       setLoading(true);
//       let res = await loadOptions()
//       setLoading(false);
//
//       setOptions([...res]);
//     })();
//   };
//
//   const handleClose = () => {
//     setOpen(false);
//     setOptions([]);
//   };
//
//   return (
//     <Autocomplete
//       sx={{ width: '100%', marginTop: "8px", marginBottom: "4px" }}
//       open={open}
//       onOpen={handleOpen}
//       onClose={handleClose}
//       isOptionEqualToValue={(option, value) => option.value === value.value}
//       getOptionLabel={(option) => option.label}
//       options={options}
//       loading={loading}
// 	  onChange={(e, data) => {
// 		onChange(data.value)
// 	  }}
// 	  loadingText="در حال بارگذاری ..."
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           slotProps={{
//             input: {
//               ...params.InputProps,
//               endAdornment: (
//                 <React.Fragment>
//                   {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </React.Fragment>
//               ),
//             },
//           }}
//         />
//       )}
//     />
//   );
// }
//
// export default connectField(CustomUniformsAsyncSelect);
//
// const topFilms = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   {
//     title: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   {
//     title: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     title: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   {
//     title: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 },
//   { title: 'The Matrix', year: 1999 },
//   { title: 'Seven Samurai', year: 1954 },
//   {
//     title: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { title: 'City of God', year: 2002 },
//   { title: 'Se7en', year: 1995 },
//   { title: 'The Silence of the Lambs', year: 1991 },
//   { title: "It's a Wonderful Life", year: 1946 },
//   { title: 'Life Is Beautiful', year: 1997 },
//   { title: 'The Usual Suspects', year: 1995 },
//   { title: 'Léon: The Professional', year: 1994 },
//   { title: 'Spirited Away', year: 2001 },
//   { title: 'Saving Private Ryan', year: 1998 },
//   { title: 'Once Upon a Time in the West', year: 1968 },
//   { title: 'American History X', year: 1998 },
//   { title: 'Interstellar', year: 2014 },
// ];
//

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { connectField } from 'uniforms';

function CustomUniformsAsyncSelect({
                                     onChange,
                                     value, // Add value prop
                                     label,
                                     placeholder,
                                     loadOptions
                                   }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Load options on component mount (important for edit mode)
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        if (loadOptions && typeof loadOptions === 'function') {
          const data = await loadOptions();
          setOptions(data || []);

          // If there's a value, find and set the corresponding option
          if (value && data?.length > 0) {
            const matchingOption = data.find(option => option.value === value);
            if (matchingOption) {
              setSelectedOption(matchingOption);
            }
          }
        }
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [loadOptions, value]); // Include value in dependencies

  // Update selected option when value prop changes
  useEffect(() => {
    if (value && options.length > 0) {
      const matchingOption = options.find(option => option.value === value);
      setSelectedOption(matchingOption || null);
    } else if (!value) {
      setSelectedOption(null);
    }
  }, [value, options]);

  const handleOpen = async () => {
    setOpen(true);

    // If options are not loaded yet, load them
    if (options.length === 0) {
      setLoading(true);
      try {
        const res = await loadOptions();
        setOptions(res || []);
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setSelectedOption(newValue);
    // Send only the value (number) to the form
    onChange(newValue ? newValue.value : null);
  };

  return (
      <Autocomplete
          sx={{ width: '100%', marginTop: "8px", marginBottom: "4px" }}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          value={selectedOption} // Use selectedOption as value
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          getOptionLabel={(option) => option?.label || ''}
          options={options}
          loading={loading}
          onChange={handleChange}
          loadingText="در حال بارگذاری ..."
          noOptionsText="موردی یافت نشد"
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                      ),
                    },
                  }}
              />
          )}
      />
  );
}

export default connectField(CustomUniformsAsyncSelect);