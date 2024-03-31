import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import axios from "axios";

const LocationAutocomplete = ({
  placeholder,
  onSelect,
  onChange,
  className,
}) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={searchLocations}
      onChange={(e) => {
        setValue(e.target.value);
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      itemTemplate={suggestionTemplate}
      onSelect={(e) => {
        setValue(e.value.name);
        onSelect(e.value.id);
      }}
      placeholder={placeholder}
      panelClassName="autocomplete-dropdown"
      maxResults={10}
      inputClassName={className}
    />
  );
};

export default LocationAutocomplete;
