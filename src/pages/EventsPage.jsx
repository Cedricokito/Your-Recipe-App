import React, { useEffect, useState } from 'react';
import {
  Box, Button, Input, VStack, HStack, Image, Text, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl,
  FormLabel, useDisclosure, Select, Checkbox, Stack, useToast
} from '@chakra-ui/react';
import CustomMultiSelect from '../components/CustomMultiSelect';
import { Link } from 'react-router-dom';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [selectedCategories, setSelectedCategories] = useState([]);

const handleCategoryChange = (selectedOptions) => {
  const selectedIds = selectedOptions.map(option => parseInt(option.id));
  setSelectedCategories(selectedIds);

  const filtered = events.filter(event =>
    (selectedIds.length === 0 || event.categoryIds.some(id => selectedIds.includes(id)))
  );

  setFilteredEvents(filtered);
};
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event =>
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length == 0 || selectedCategories.some(id => event.categoryIds.includes(id)))
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const fetchInitialData = async () => {
    const eventsResponse = await fetch('http://localhost:3000/events');
    const usersResponse = await fetch('http://localhost:3000/users');
    const categoriesResponse = await fetch('http://localhost:3000/categories');
    const eventsData = await eventsResponse.json();
    const usersData = await usersResponse.json();
    const categoriesData = await categoriesResponse.json();
    setEvents(eventsData);
    setUsers(usersData);
    setCategories(categoriesData);
    setFilteredEvents(eventsData);
  };

  const handleAddEvent = async (event) => {
    const maxId = events.reduce((max, obj) => {
      return obj.id > max ? obj.id : max;
    }, 0);
    try {
      await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:`${parseInt(maxId)+1}`, ...event}),
      });
      onClose()
      toast({
        title: 'Event Added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchInitialData();
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  function formatDate(dateString) {
    if(dateString.length==0)
      return ""
    const date = new Date(dateString);
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  return (
    <VStack spacing={4} m={5}>
     <HStack spacing={4} align="center" w="4xl">
      <Input 
        placeholder="Search events" 
        onChange={e => setSearchTerm(e.target.value)}
        flex={2} 
      />
      <Button 
        colorScheme="blue"
        onClick={onOpen}
        px={8} 
      >
        Add Event
      </Button>
      <Box w="250px" minW={{ base: "100px", md: "250px" }}>
        <CustomMultiSelect 
          options={categories.map(cat => ({ id: cat.id, label: cat.name }))}
          onChange={handleCategoryChange} 
        />
      </Box>
    </HStack>
    

      {filteredEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`} style={{ width: '50%' }}>
          <HStack
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            spacing={4}
            align="center"
            _hover={{ shadow: "md" }}
          >
            <Image
              boxSize="100px"
              src={event.image}
              alt={event.title}
              borderRadius="md"
            />
            <VStack align="left" flex="1"> 
              <Text fontSize="xl" isTruncated>{event.title}</Text>
              <Text isTruncated>{event.description}</Text>
              <Text isTruncated>{`${formatDate(event.startTime)} - ${formatDate(event.endTime)}`}</Text>
              <HStack spacing={2} wrap="wrap">
                {event?.categoryIds?.map((id) => (
                  <Text key={id} fontSize="sm" color="gray.500">
                    {categories.find(cat => cat.id === id)?.name}
                  </Text>
                ))}
              </HStack>
            </VStack>
          </HStack>
        </Link>
      ))}
      <AddEventModal isOpen={isOpen} onClose={onClose} onSave={handleAddEvent} categories={categories} users={users} />
    </VStack>
  );
}

function AddEventModal({ isOpen, onClose, onSave, categories, users }) {
  const toast= useToast()
  const initialRef = React.useRef();
  const [event, setEvent] = useState({
    title: '',
    description: '',
    image: '',
    startTime: '',
    endTime: '',
    location: '',
    createdBy: '',
    categoryIds: []
  });

  const handleCategoryChange = (categoryId) => {
    const newCategoryIds = event.categoryIds.includes(categoryId) ?
      event.categoryIds.filter(id => id !== categoryId) : 
      [...event.categoryIds, categoryId]; 
    updateField('categoryIds', newCategoryIds);
  };

  const updateField = (field, value) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!event.title || !event.description || !event.image || !event.startTime || !event.endTime || !event.location || !event.createdBy || !event.categoryIds.length) {
      toast({
        title: 'Please fill out all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return; 
    }
    onSave(event);
  };

  return (
    <Modal
  initialFocusRef={initialRef}
  isOpen={isOpen}
  onClose={onClose}
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Add a new event</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={6}>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input ref={initialRef} placeholder="Title" value={event.title} onChange={e => updateField('title', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Description</FormLabel>
        <Input placeholder="Description" value={event.description} onChange={e => updateField('description', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Image URL</FormLabel>
        <Input placeholder="Image URL" value={event.image} onChange={e => updateField('image', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Start Time</FormLabel>
        <Input type="datetime-local" value={event.startTime} onChange={e => updateField('startTime', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>End Time</FormLabel>
        <Input type="datetime-local" value={event.endTime} onChange={e => updateField('endTime', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Location</FormLabel>
        <Input placeholder="Location" value={event.location} onChange={e => updateField('location', e.target.value)} />
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Creator</FormLabel>
        <Select placeholder="Select creator" onChange={e => updateField('createdBy', e.target.value)}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Categories</FormLabel>
        <Stack pl={6} mt={1} spacing={1}>
          {categories.map(cat => (
            <Checkbox key={cat.id} isChecked={event.categoryIds.includes(cat.id)}
              onChange={() => handleCategoryChange(cat.id)}>
              {cat.name}
            </Checkbox>
          ))}
        </Stack>
      </FormControl>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
        Save
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

  );
}

export default EventsPage;
