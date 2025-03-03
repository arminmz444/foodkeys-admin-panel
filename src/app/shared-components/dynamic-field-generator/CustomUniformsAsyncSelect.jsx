import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { connectField } from 'uniforms';


function CustomUniformsAsyncSelect({ onChange, label, placeholder, loadOptions}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
	const fetchOptions = async () => {
		let data = []
		if (loadOptions && typeof loadOptions === 'function')
			data = await loadOptions()
		return data
	}
	fetchOptions()
  }, [])
  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      let res = await loadOptions() // For demo purposes.
      setLoading(false);

      setOptions([...res]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Autocomplete
      sx={{ width: '100%', marginTop: "8px", marginBottom: "4px" }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
	  onChange={(e, data) => {
		onChange(data.value)
	  }}
	  loadingText="در حال بارگذاری ..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
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

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];

