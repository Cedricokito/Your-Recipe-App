import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Link as ChakraLink } from '@chakra-ui/react';

export const Navigation = () => {
  return (
    <Box as="nav" bg="blue.500" p="4">
      <Flex align="center" justify="space-between">
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Event App</Link>
        <Flex as="ul" listStyleType="none" p={0} m={0}>
          <Box as="li" display="inline" mr="4">
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          </Box>
          {/* Add more list items for additional navigation links */}
        </Flex>
      </Flex>
    </Box>
  );
};
