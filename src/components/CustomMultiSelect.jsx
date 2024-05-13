import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControl, FormLabel, Stack } from '@chakra-ui/react';

function CustomMultiSelect({ options, onChange }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    onChange(options.filter(option => selectedOptions.includes(option.id)));
  }, [selectedOptions]);

  const handleOptionChange = (optionId) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(prevOptions => prevOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions(prevOptions => [...prevOptions, optionId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(options.map(option => option.id));
    }
  };

  const handleClearAll = () => {
    setSelectedOptions([]);
  };

  const isChecked = (optionId) => selectedOptions.includes(optionId);

  const isIndeterminate = () => selectedOptions.length > 0 && selectedOptions.length < options.length;

  return (
    <FormControl ml={5}>
      <FormLabel>Filter Categories</FormLabel>
      <Stack spacing={2}>
        <Checkbox
          isChecked={selectedOptions.length === options.length}
          isIndeterminate={isIndeterminate()}
          onChange={handleSelectAll}
          children="Select All"
        />
        {options.map(option => (
          <Checkbox
            key={option.id}
            isChecked={isChecked(option.id)}
            onChange={() => handleOptionChange(option.id)}
            children={option.label}
          />
        ))}
      </Stack>
     
    </FormControl>
  );
}

export default CustomMultiSelect;
