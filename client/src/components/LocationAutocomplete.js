import React, { useState, useRef } from "react";
import { AutoComplete } from "primereact/autocomplete";
import axios from "axios";

const LocationAutocomplete = ({
  placeholder,
  onSelect,
  onChange,
  className,
  name,
}) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(false);
  const blurTimeout = useRef(null);

  const searchLocations = async (event) => {
    const value = event.query;
    try {
      const autoCompleteApi = `${process.env.REACT_APP_BACKEND_URL}/locations/autocomplete?name=${value}`;
      const response = await axios.get(autoCompleteApi);
      const data = response.data;
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const suggestionTemplate = (suggestion) => {
    return <div>{suggestion.name}</div>;
  };

  const handleSelect = (e) => {
    setValue(e.value.name);
    setSelected(true);
    if (onSelect) {
      onSelect(e.value.id, e.value.name);
    }
    clearTimeout(blurTimeout.current); // Clear timeout if any selection is made
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setSelected(false);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      if (!selected) {
        setValue("");
        if (onChange) {
          onChange("");
        }
      }
      setFocused(false);
    }, 1); // Adding a slight delay
  };

  const handleFocus = () => {
    clearTimeout(blurTimeout.current); // Clear the timeout if the input gains focus again
    setFocused(true);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={searchLocations}
      onChange={handleChange}
      itemTemplate={suggestionTemplate}
      onSelect={handleSelect}
      placeholder={placeholder}
      panelClassName="autocomplete-dropdown"
      maxResults={10}
      inputClassName={className}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
};

export default LocationAutocomplete;
